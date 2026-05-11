export const PLATFORMS = {
    twitch: {
        id: "twitch",
        displayName: "Twitch",
        enabled: true,
        surfaces: {
            banner: {
                canvas: { width: 1200, height: 480 },
                safeArea: { width: 900, height: 480, offsetX: 150, offsetY: 0 },
                storagePrefix: "twitch/banners",
                allowedFormats: ["png", "jpg"],
            },
            // TODO: add Twitch panel, stream-screen, and emote surface configs.
        },
    },
    youtube: {
        id: "youtube",
        displayName: "YouTube",
        enabled: false,
        surfaces: {
            banner: {
                canvas: { width: 2560, height: 1440 },
                safeArea: { width: 1546, height: 423, offsetX: 507, offsetY: 508 },
                storagePrefix: "youtube/banners",
                allowedFormats: ["png", "jpg"],
            },
            // TODO: add YouTube thumbnail, avatar, and other surface configs if needed.
        },
    },
    kick: {
        id: "kick",
        displayName: "Kick",
        enabled: false,
        surfaces: {
            banner: {
                canvas: { width: 1280, height: 700 },
                storagePrefix: "kick/banners",
                allowedFormats: ["png", "jpg"],
            },
            // TODO: add Kick panel, stream-screen, and emote surface configs.
        },
    },
    discord: {
        id: "discord",
        displayName: "Discord",
        enabled: false,
        surfaces: {
            banner: {
                canvas: { width: 960, height: 540 },
                storagePrefix: "discord/banners",
                allowedFormats: ["png", "jpg"],
            },
            // TODO: add Discord panel, stream-screen, and emote surface configs.
        },
    },
    tiktok: {
        id: "tiktok",
        displayName: "TikTok",
        enabled: false,
        surfaces: {
            banner: {
                canvas: { width: 1080, height: 1920 },
                storagePrefix: "tiktok/banners",
                allowedFormats: ["png", "jpg"],
            },
            // TODO: add TikTok panel, stream-screen, and emote surface configs.
        },
    },
};
