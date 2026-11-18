export function selectBestOffer(offers, country, device, os) {
    var _a;
    const eligible = offers.filter((o) => {
        if (!o.active)
            return false;
        if (o.device !== device)
            return false;
        if (o.os !== "any" && o.os !== os)
            return false;
        if (o.countries.length > 0 && !o.countries.includes(country))
            return false;
        return true;
    });
    if (eligible.length === 0)
        return null;
    const sorted = eligible.sort((a, b) => a.priority - b.priority);
    return (_a = sorted[0]) !== null && _a !== void 0 ? _a : null;
}
