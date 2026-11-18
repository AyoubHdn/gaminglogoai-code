import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  STREAM_SCREEN_PLATFORMS,
  type StreamScreenKind,
  type StreamScreenPlatformId,
} from "~/data/streamScreenPlatforms";

export type FunnelStep = "step0" | "step1" | "step2" | "step3";

export interface StreamScreenDraft {
  id: string;
  kind: StreamScreenKind;
  title: string;
  subtitle: string;
}

export interface GeneratedStreamScreen {
  draftId: string;
  iconId: string;
  url: string;
  kind: StreamScreenKind;
  title: string;
  subtitle: string;
}

interface StoredFunnelState {
  currentStep: FunnelStep;
  selectedPlatform: StreamScreenPlatformId | null;
  selectedTemplateId: string | null;
  screenItems: StreamScreenDraft[];
  generatedScreens: GeneratedStreamScreen[];
  isGenerating: boolean;
  sessionCreditsSpent: number;
}

interface FunnelContextValue extends StoredFunnelState {
  hasHydrated: boolean;
  setCurrentStep: (step: FunnelStep) => void;
  setSelectedPlatform: (platform: StreamScreenPlatformId | null) => void;
  setSelectedTemplateId: (templateId: string | null) => void;
  setScreenItems: (value: StreamScreenDraft[]) => void;
  setGeneratedScreens: (value: GeneratedStreamScreen[]) => void;
  setIsGenerating: (value: boolean) => void;
  setSessionCreditsSpent: (value: number) => void;
  resetResultState: () => void;
  selectTemplate: (templateId: string) => void;
  resetDraftsToDefaults: () => void;
  startOver: () => void;
  clearPersistedState: () => void;
}

const STORAGE_KEY = "stream-screen-funnel-state";

function createDraftId(kind: StreamScreenKind): string {
  return `${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createStreamScreenDraft(
  platformId: StreamScreenPlatformId,
  kind: StreamScreenKind,
  useDefaults = true
): StreamScreenDraft {
  const preset = STREAM_SCREEN_PLATFORMS[platformId].screenPresets.find(
    (item) => item.id === kind
  );

  return {
    id: createDraftId(kind),
    kind,
    title: useDefaults ? (preset?.defaultTitle ?? "") : "",
    subtitle: useDefaults ? (preset?.defaultSubtitle ?? "") : "",
  };
}

export function buildDefaultStreamScreenDrafts(
  platformId: StreamScreenPlatformId = "twitch"
): StreamScreenDraft[] {
  return STREAM_SCREEN_PLATFORMS[platformId].screenPresets.map((preset) =>
    createStreamScreenDraft(platformId, preset.id)
  );
}

const defaultState: StoredFunnelState = {
  currentStep: "step0",
  selectedPlatform: null,
  selectedTemplateId: null,
  screenItems: buildDefaultStreamScreenDrafts(),
  generatedScreens: [],
  isGenerating: false,
  sessionCreditsSpent: 0,
};

const FunnelContext = createContext<FunnelContextValue | undefined>(undefined);

function normalizePlatformId(value: unknown): StreamScreenPlatformId | null {
  return value === "twitch" ? "twitch" : null;
}

function normalizeScreenKind(value: unknown): StreamScreenKind | null {
  switch (value) {
    case "starting":
    case "brb":
    case "offline":
    case "ending":
      return value;
    default:
      return null;
  }
}

function normalizeScreenDrafts(
  value: unknown,
  platformId: StreamScreenPlatformId = "twitch"
): StreamScreenDraft[] {
  if (!Array.isArray(value)) {
    return buildDefaultStreamScreenDrafts(platformId);
  }

  const defaults = STREAM_SCREEN_PLATFORMS[platformId].screenPresets;
  const normalizedDrafts: StreamScreenDraft[] = [];

  for (const item of value) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const partialItem = item as Partial<StreamScreenDraft>;
    const kind = normalizeScreenKind(partialItem.kind);

    if (!kind) {
      continue;
    }

    const fallbackPreset = defaults.find((preset) => preset.id === kind);

    normalizedDrafts.push({
      id:
        typeof partialItem.id === "string" && partialItem.id.trim()
          ? partialItem.id
          : createDraftId(kind),
      kind,
      title:
        typeof partialItem.title === "string"
          ? partialItem.title
          : fallbackPreset?.defaultTitle ?? "",
      subtitle:
        typeof partialItem.subtitle === "string"
          ? partialItem.subtitle
          : fallbackPreset?.defaultSubtitle ?? "",
    });
  }

  return normalizedDrafts;
}

function normalizeGeneratedScreens(value: unknown): GeneratedStreamScreen[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is GeneratedStreamScreen =>
      Boolean(item && typeof item === "object") &&
      typeof item.draftId === "string" &&
      typeof item.iconId === "string" &&
      typeof item.url === "string" &&
      normalizeScreenKind(item.kind) !== null &&
      typeof item.title === "string" &&
      typeof item.subtitle === "string"
  );
}

function normalizeStoredState(rawValue: unknown): StoredFunnelState {
  if (!rawValue || typeof rawValue !== "object") {
    return defaultState;
  }

  const value = rawValue as Partial<StoredFunnelState>;
  const selectedPlatform = normalizePlatformId(value.selectedPlatform);
  const selectedTemplateId =
    typeof value.selectedTemplateId === "string" ? value.selectedTemplateId : null;
  const platformId = selectedPlatform ?? "twitch";

  const normalizedStep: FunnelStep = (() => {
    if (!selectedPlatform) {
      return "step0";
    }

    if (!selectedTemplateId) {
      return "step1";
    }

    if (value.currentStep === "step2" || value.currentStep === "step3") {
      return value.currentStep;
    }

    return "step1";
  })();

  return {
    currentStep: normalizedStep,
    selectedPlatform,
    selectedTemplateId,
    screenItems: normalizeScreenDrafts(value.screenItems, platformId),
    generatedScreens: normalizeGeneratedScreens(value.generatedScreens),
    isGenerating: false,
    sessionCreditsSpent:
      typeof value.sessionCreditsSpent === "number" &&
      Number.isFinite(value.sessionCreditsSpent)
        ? value.sessionCreditsSpent
        : 0,
  };
}

export function FunnelProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<StoredFunnelState>(defaultState);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const stored = window.sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        setState(normalizeStoredState(JSON.parse(stored)));
      }
    } catch (error) {
      console.error("Failed to restore stream screen funnel state:", error);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated || typeof window === "undefined") {
      return;
    }

    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hasHydrated, state]);

  const patchState = useCallback((patch: Partial<StoredFunnelState>) => {
    setState((currentState) => ({
      ...currentState,
      ...patch,
    }));
  }, []);

  const clearPersistedState = useCallback(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const resetResultState = useCallback(() => {
    setState((currentState) => ({
      ...currentState,
      generatedScreens: [],
      isGenerating: false,
    }));
  }, []);

  const resetDraftsToDefaults = useCallback(() => {
    setState((currentState) => ({
      ...currentState,
      screenItems: buildDefaultStreamScreenDrafts(
        currentState.selectedPlatform ?? "twitch"
      ),
      generatedScreens: [],
      isGenerating: false,
    }));
  }, []);

  const startOver = useCallback(() => {
    setState({
      ...defaultState,
      screenItems: buildDefaultStreamScreenDrafts(),
    });
    clearPersistedState();
  }, [clearPersistedState]);

  const value = useMemo<FunnelContextValue>(
    () => ({
      ...state,
      hasHydrated,
      setCurrentStep: (currentStep) => patchState({ currentStep }),
      setSelectedPlatform: (selectedPlatform) =>
        patchState({
          selectedPlatform,
          currentStep: selectedPlatform ? "step1" : "step0",
          selectedTemplateId: null,
          screenItems: buildDefaultStreamScreenDrafts(selectedPlatform ?? "twitch"),
          generatedScreens: [],
          isGenerating: false,
        }),
      setSelectedTemplateId: (selectedTemplateId) =>
        patchState({
          selectedTemplateId,
          currentStep: selectedTemplateId ? state.currentStep : "step1",
        }),
      setScreenItems: (screenItems) => patchState({ screenItems }),
      setGeneratedScreens: (generatedScreens) => patchState({ generatedScreens }),
      setIsGenerating: (isGenerating) => patchState({ isGenerating }),
      setSessionCreditsSpent: (sessionCreditsSpent) =>
        patchState({ sessionCreditsSpent }),
      resetResultState,
      selectTemplate: (selectedTemplateId) =>
        patchState({
          selectedTemplateId,
          currentStep: "step2",
          generatedScreens: [],
          isGenerating: false,
        }),
      resetDraftsToDefaults,
      startOver,
      clearPersistedState,
    }),
    [
      clearPersistedState,
      hasHydrated,
      patchState,
      resetDraftsToDefaults,
      resetResultState,
      startOver,
      state,
    ]
  );

  return (
    <FunnelContext.Provider value={value}>{children}</FunnelContext.Provider>
  );
}

export function useFunnel() {
  const context = useContext(FunnelContext);

  if (!context) {
    throw new Error("useFunnel must be used within a FunnelProvider");
  }

  return context;
}
