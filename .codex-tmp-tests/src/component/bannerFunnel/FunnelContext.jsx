import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, } from "react";
const STORAGE_KEY = "banner-maker-state";
const defaultState = {
    currentStep: "step0",
    selectedPlatform: null,
    selectedTemplateId: null,
    logoSource: null,
    logoUrl: null,
    channelName: "",
    tagline: "",
    socialHandles: "",
    originalImageUrl: null,
    originalIconId: null,
    currentImageUrl: null,
    currentIconId: null,
    isGenerating: false,
    sessionCreditsSpent: 0,
    refinementHistory: [],
    templateFilters: {},
};
const FunnelContext = createContext(undefined);
function normalizeStoredState(rawValue) {
    if (!rawValue || typeof rawValue !== "object") {
        return defaultState;
    }
    const value = rawValue;
    const selectedPlatform = value.selectedPlatform === "twitch" ||
        value.selectedPlatform === "youtube" ||
        value.selectedPlatform === "kick" ||
        value.selectedPlatform === "discord" ||
        value.selectedPlatform === "tiktok"
        ? value.selectedPlatform
        : null;
    const selectedTemplateId = typeof value.selectedTemplateId === "string" ? value.selectedTemplateId : null;
    const normalizedStep = (() => {
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
        logoSource: value.logoSource === "upload" ||
            value.logoSource === "designs" ||
            value.logoSource === "none"
            ? value.logoSource
            : null,
        logoUrl: typeof value.logoUrl === "string" ? value.logoUrl : null,
        channelName: typeof value.channelName === "string" ? value.channelName : "",
        tagline: typeof value.tagline === "string" ? value.tagline : "",
        socialHandles: typeof value.socialHandles === "string" ? value.socialHandles : "",
        originalImageUrl: typeof value.originalImageUrl === "string" ? value.originalImageUrl : null,
        originalIconId: typeof value.originalIconId === "string" ? value.originalIconId : null,
        currentImageUrl: typeof value.currentImageUrl === "string" ? value.currentImageUrl : null,
        currentIconId: typeof value.currentIconId === "string" ? value.currentIconId : null,
        isGenerating: false,
        sessionCreditsSpent: typeof value.sessionCreditsSpent === "number" &&
            Number.isFinite(value.sessionCreditsSpent)
            ? value.sessionCreditsSpent
            : 0,
        refinementHistory: Array.isArray(value.refinementHistory)
            ? value.refinementHistory
                .filter((item) => Boolean(item &&
                typeof item === "object" &&
                typeof item.url === "string" &&
                typeof item.prompt === "string" &&
                typeof item.timestamp === "string"))
                .slice(0, 5)
            : [],
        templateFilters: value.templateFilters && typeof value.templateFilters === "object"
            ? value.templateFilters
            : {},
    };
}
export function FunnelProvider({ children, }) {
    const [state, setState] = useState(defaultState);
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
        }
        catch (error) {
            console.error("Failed to restore banner funnel state:", error);
        }
        finally {
            setHasHydrated(true);
        }
    }, []);
    useEffect(() => {
        if (!hasHydrated || typeof window === "undefined") {
            return;
        }
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [hasHydrated, state]);
    const patchState = useCallback((patch) => {
        setState((currentState) => (Object.assign(Object.assign({}, currentState), patch)));
    }, []);
    const clearPersistedState = useCallback(() => {
        if (typeof window !== "undefined") {
            window.sessionStorage.removeItem(STORAGE_KEY);
        }
    }, []);
    const resetResultState = useCallback(() => {
        setState((currentState) => (Object.assign(Object.assign({}, currentState), { originalImageUrl: null, originalIconId: null, currentImageUrl: null, currentIconId: null, isGenerating: false, refinementHistory: [] })));
    }, []);
    const startOver = useCallback(() => {
        setState(defaultState);
        clearPersistedState();
    }, [clearPersistedState]);
    const value = useMemo(() => (Object.assign(Object.assign({}, state), { hasHydrated, setCurrentStep: (step) => patchState({ currentStep: step }), setSelectedPlatform: (selectedPlatform) => patchState({
            selectedPlatform,
            currentStep: selectedPlatform ? "step1" : "step0",
            selectedTemplateId: null,
            templateFilters: {},
            logoSource: null,
            logoUrl: null,
            originalImageUrl: null,
            originalIconId: null,
            currentImageUrl: null,
            currentIconId: null,
            isGenerating: false,
            refinementHistory: [],
        }), setSelectedTemplateId: (templateId) => patchState({
            selectedTemplateId: templateId,
            currentStep: templateId ? state.currentStep : "step1",
        }), setLogoSource: (logoSource) => patchState({ logoSource }), setLogoUrl: (logoUrl) => patchState({ logoUrl }), setChannelName: (channelName) => patchState({ channelName }), setTagline: (tagline) => patchState({ tagline }), setSocialHandles: (socialHandles) => patchState({ socialHandles }), setOriginalImageUrl: (originalImageUrl) => patchState({ originalImageUrl }), setOriginalIconId: (originalIconId) => patchState({ originalIconId }), setCurrentImageUrl: (currentImageUrl) => patchState({ currentImageUrl }), setCurrentIconId: (currentIconId) => patchState({ currentIconId }), setIsGenerating: (isGenerating) => patchState({ isGenerating }), setSessionCreditsSpent: (sessionCreditsSpent) => patchState({ sessionCreditsSpent }), setRefinementHistory: (refinementHistory) => patchState({ refinementHistory: refinementHistory.slice(0, 5) }), setTemplateFilters: (templateFilters) => patchState({ templateFilters }), resetResultState, selectTemplate: (templateId) => patchState({
            selectedTemplateId: templateId,
            currentStep: "step2",
            originalImageUrl: null,
            originalIconId: null,
            currentImageUrl: null,
            currentIconId: null,
            isGenerating: false,
            refinementHistory: [],
        }), startOver,
        clearPersistedState })), [
        clearPersistedState,
        hasHydrated,
        patchState,
        resetResultState,
        startOver,
        state,
    ]);
    return (<FunnelContext.Provider value={value}>{children}</FunnelContext.Provider>);
}
export function useFunnel() {
    const context = useContext(FunnelContext);
    if (!context) {
        throw new Error("useFunnel must be used within a FunnelProvider");
    }
    return context;
}
