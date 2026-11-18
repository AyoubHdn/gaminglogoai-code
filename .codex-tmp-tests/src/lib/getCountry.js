export function getCountry(req) {
    return (req.headers["x-vercel-ip-country"] ||
        "US");
}
