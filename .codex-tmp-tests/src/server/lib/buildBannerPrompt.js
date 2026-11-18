function escapeQuotedText(value) {
    return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
export function buildBannerPrompt(input) {
    var _a, _b;
    const safeChannelName = escapeQuotedText(input.channelName.trim());
    const safeTagline = ((_a = input.tagline) === null || _a === void 0 ? void 0 : _a.trim())
        ? escapeQuotedText(input.tagline.trim())
        : null;
    const safeSocialHandles = ((_b = input.socialHandles) === null || _b === void 0 ? void 0 : _b.trim())
        ? escapeQuotedText(input.socialHandles.trim())
        : null;
    return `${input.template.promptPreset.basePrompt}, ${input.template.promptPreset.styleDescriptors}, with the channel name "${safeChannelName}" prominently displayed in bold legible sans-serif typography${safeTagline
        ? `, with tagline "${safeTagline}" in smaller secondary text`
        : ""}${safeSocialHandles
        ? `, with social handles "${safeSocialHandles}" displayed in small text near the bottom-right corner`
        : ""}${input.hasLogo
        ? ", with empty space reserved in the upper-left corner for a logo overlay"
        : ""}, ${input.template.promptPreset.compositionHints}, professional Twitch banner, sharp text rendering, high-quality typography`;
}
