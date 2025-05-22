// ~/server/api/routers/mautic-utils.ts
// OR common/utils/mautic-utils.ts if you structure for sharing
import { env } from "~/env.mjs"; // ENSURE THIS PATH IS CORRECT FOR BOTH PROJECTS
                                // If projects are separate, copy env.mjs or ensure paths resolve.
                                // If monorepo, this might be a shared package.

export interface MauticApiResponse {
  contact?: { id?: number; [key: string]: any };
  errors?: Array<{ message: string; code: number; type: string }>;
  [key: string]: unknown;
}

interface MauticContactPayload {
  email: string;
  firstname?: string;
  lastname?: string;
  // NameDesignAI specific custom field aliases (as defined in Mautic)
  credits?: string | number;
  plan?: string;
  // GamingLogoAI specific custom field aliases (as defined in Mautic)
  gla_credits?: string | number;
  gla_plan?: string;
  // Brand tracking custom field aliases (as defined in Mautic)
  brand_origin?: string[]; // For multi-select
  last_interaction_brand?: string;
}
interface MauticFoundContactDetail {
  id: number; // We expect 'id' to be a number
  fields: {
    all: Record<string, any>; // Custom fields
  };
  // Add other known top-level Mautic contact fields if you use them
}

// Helper to make API calls to Mautic
export async function updateMauticContact(
  endpoint: string,
  method: 'GET' | 'POST' | 'PATCH',
  payload?: any
): Promise<any> {
  const mauticBaseUrl = env.MAUTIC_BASE_URL;
  const mauticUsername = env.MAUTIC_USERNAME;
  const mauticPassword = env.MAUTIC_PASSWORD;

  if (!mauticBaseUrl || !mauticUsername || !mauticPassword) {
    console.error("MAUTIC_API: Mautic credentials or base URL are not configured.");
    throw new Error("Mautic configuration missing.");
  }

  const authHeader = "Basic " + Buffer.from(`${mauticUsername}:${mauticPassword}`).toString("base64");
  const headers: HeadersInit = { Authorization: authHeader };
  if (payload && (method === 'POST' || method === 'PATCH')) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${mauticBaseUrl}/api/${endpoint}`, {
    method: method,
    headers: headers,
    body: payload ? JSON.stringify(payload) : undefined,
  });

  if (!response.ok) {
    let errorData;
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      errorData = await response.json();
    } catch (e) {
      errorData = { message: `HTTP error! Status: ${response.status} ${response.statusText}` };
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const errorMessage = errorData?.errors?.[0]?.message || errorData?.message || `Mautic API Error: ${response.status}`;
    console.error(`MAUTIC_API_ERROR on ${method} ${endpoint}:`, response.status, errorMessage, errorData);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    throw new Error(errorMessage);
  }

  // Handle 204 No Content for certain successful operations like delete
  if (response.status === 204) return { success: true };
  
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await response.json();
  } catch (e) {
      console.error(`MAUTIC_API_JSON_ERROR on ${method} ${endpoint}: Not a JSON response.`, e);
      throw new Error("Failed to parse Mautic API JSON response for an OK status.");
  }
}

// Helper to find a Mautic contact by email
async function findMauticContactByEmail(email: string): Promise<MauticFoundContactDetail | null> {
  console.log(`MAUTIC_UTIL: Searching for contact with email: ${email}`);
  try {
    type MauticSearchResponse = {
      total?: string | number;
      contacts?: Record<string, MauticFoundContactDetail>; // Use the more specific type here
    };

    const searchResult = await makeMauticApiCall(
      `contacts?search=email:${encodeURIComponent(email)}&limit=1`,
      'GET'
    ) as MauticSearchResponse;

    // Check if contacts object exists, is an object, and is not empty
    if (searchResult.contacts && typeof searchResult.contacts === 'object' && Object.keys(searchResult.contacts).length > 0) {
      const contactKey = Object.keys(searchResult.contacts)[0]; // Get the first key (which is the Mautic contact ID as a string)

      // Ensure contactKey is a valid string and that the contact object exists for that key
      if (contactKey && searchResult.contacts[contactKey]) {
        const contactData = searchResult.contacts[contactKey];

        // Now, explicitly check if contactData.id exists and is a number before using it
        if (contactData && typeof contactData.id === 'number') {
          console.log(`MAUTIC_UTIL: Found contact for ${email}. Key: ${contactKey}, ID: ${contactData.id}`);
          return contactData; // Return the full contactData object
        } else {
          console.warn(`MAUTIC_UTIL: Contact data found for key ${contactKey} but 'id' is missing or not a number. Data:`, contactData);
        }
      } else {
        console.warn(`MAUTIC_UTIL: contactKey invalid or no data for contactKey from searchResult.contacts for email ${email}.`);
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      console.log(`MAUTIC_UTIL: No contact found for email ${email} or contacts object malformed/empty. Total: ${searchResult.total}`);
    }
    return null; // Return null if not found or if data is malformed
  } catch (error) {
    // makeMauticApiCall should ideally throw a typed error or an error with a message
    // console.error already happens in makeMauticApiCall for API errors
    console.error(`MAUTIC_UTIL: Broader error in findMauticContactByEmail for ${email}.`);
    return null;
  }
}

// Main sync function
export async function syncUserToMautic(
  contactInput: {
    email: string;
    name?: string | null;
    brand_specific_credits?: number | null; // Credits for the current brand
    brand_specific_plan?: string | null;    // Plan for the current brand
  },
  currentBrand: 'namedesignai' | 'gaminglogoai'
): Promise<MauticApiResponse> { // Always return MauticApiResponse
  if (!contactInput.email) {
    console.error("MAUTIC_SYNC: Email is required for Mautic sync.");
    return { errors: [{ message: "Email is required", code: 400, type: "validation_error" }] };
  }
  console.log(`MAUTIC_SYNC: Initiating sync for ${contactInput.email}, brand: ${currentBrand}`);

  const mauticPayloadForApi: Partial<MauticContactPayload> = {
    email: contactInput.email,
    firstname: contactInput.name?.split(' ')[0] || undefined,
    lastname: contactInput.name?.split(' ').slice(1).join(' ') || undefined,
    last_interaction_brand: currentBrand,
    // Initialize all brand-specific data fields to undefined
    credits: undefined,
    plan: undefined,
    gla_credits: undefined,
    gla_plan: undefined,
    brand_origin: undefined, // This will be populated based on existing + current
  };

  if (currentBrand === 'namedesignai') {
    if (contactInput.brand_specific_credits !== undefined && contactInput.brand_specific_credits !== null) {
      mauticPayloadForApi.credits = contactInput.brand_specific_credits === 0 ? "No credits" : String(contactInput.brand_specific_credits);
    }
    if (contactInput.brand_specific_plan) {
      mauticPayloadForApi.plan = contactInput.brand_specific_plan;
    }
  } else if (currentBrand === 'gaminglogoai') {
    if (contactInput.brand_specific_credits !== undefined && contactInput.brand_specific_credits !== null) {
      mauticPayloadForApi.gla_credits = contactInput.brand_specific_credits === 0 ? "No credits" : String(contactInput.brand_specific_credits);
    }
    if (contactInput.brand_specific_plan) {
      mauticPayloadForApi.gla_plan = contactInput.brand_specific_plan;
    }
  }

  try {
    const existingMauticContact = await findMauticContactByEmail(contactInput.email);
    let httpMethod: 'POST' | 'PATCH';
    let mauticApiUrl: string;
    const mauticBaseUrl = env.MAUTIC_BASE_URL; // Get it once

    if (existingMauticContact && typeof existingMauticContact.id === 'number') {
      console.log(`MAUTIC_SYNC: Found existing contact ID: ${existingMauticContact.id} for ${contactInput.email}`);
      httpMethod = "PATCH";
      mauticApiUrl = `${mauticBaseUrl}/api/contacts/${existingMauticContact.id}/edit`;

      const rawBrandOrigins: unknown = existingMauticContact.fields?.all?.brand_origin;
      let currentBrandOrigins: string[] = [];
      if (typeof rawBrandOrigins === 'string' && rawBrandOrigins.trim() !== '') {
        currentBrandOrigins = rawBrandOrigins.includes('|') ? rawBrandOrigins.split('|') : [rawBrandOrigins];
      } else if (Array.isArray(rawBrandOrigins)) {
        currentBrandOrigins = rawBrandOrigins.filter((item): item is string => typeof item === 'string' && item.trim() !== '');
      }
      currentBrandOrigins = currentBrandOrigins.map(s => s.trim()).filter(Boolean);

      if (!currentBrandOrigins.includes(currentBrand)) {
        currentBrandOrigins.push(currentBrand);
      }
      if (currentBrandOrigins.length > 0) {
        mauticPayloadForApi.brand_origin = currentBrandOrigins;
      } else {
        // If after logic it's empty, Mautic might interpret empty array as clearing,
        // or you might send undefined. Sending an empty array is usually for "set to no selection".
        // To be safe, if it's empty, don't send the key or send undefined.
        // Let's not send the key if the array is empty after logic.
        // This is handled by cleanPayload.
      }
    } else {
      console.log(`MAUTIC_SYNC: No Mautic contact found for ${contactInput.email}. Creating new.`);
      httpMethod = "POST";
      mauticApiUrl = `${mauticBaseUrl}/api/contacts/new`;
      mauticPayloadForApi.brand_origin = [currentBrand]; // Initialize for new contact
    }

    // Remove undefined fields from payload before sending
    const cleanPayload: { [key: string]: any } = {};
    for (const key in mauticPayloadForApi) {
      if (mauticPayloadForApi[key as keyof MauticContactPayload] !== undefined) {
        cleanPayload[key] = mauticPayloadForApi[key as keyof MauticContactPayload];
      }
    }
    // Ensure email is always present for new contact creation
    if (httpMethod === 'POST' && !cleanPayload.email) {
        cleanPayload.email = contactInput.email;
    }


    console.log(`MAUTIC_SYNC: FINAL CLEAN PAYLOAD for ${httpMethod} to ${mauticApiUrl}:`, JSON.stringify(cleanPayload, null, 2));

    const responseData = await updateMauticContact(
        mauticApiUrl.substring(mauticBaseUrl.length + 5), // Pass endpoint part, e.g., 'contacts/new'
        httpMethod,
        cleanPayload
    ) as MauticApiResponse;

    console.log(`MAUTIC_SYNC: Successfully ${httpMethod === 'POST' ? 'created' : 'updated'} Mautic for ${contactInput.email}. Response contact ID:`, responseData.contact?.id);
    return responseData;

  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Mautic processing error";
    console.error(`MAUTIC_SYNC: Overall error for ${contactInput.email}, brand ${currentBrand}:`, message, error);
    return { errors: [{ message, code: 500, type: "internal_error" }] };
  }
}

function makeMauticApiCall(arg0: string, arg1: string): {
  total?: string | number; contacts?: Record<string, MauticFoundContactDetail>; // Use the more specific type here
} | PromiseLike<{
  total?: string | number; contacts?: Record<string, MauticFoundContactDetail>; // Use the more specific type here
}> {
  throw new Error("Function not implemented.");
}
