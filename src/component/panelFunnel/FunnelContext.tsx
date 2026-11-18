import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { type PanelPlatformId, type PanelShapeId } from "~/data/panelPlatforms";

export type FunnelStep = "step0" | "step1" | "step2" | "step3";

export interface PanelDraft {
  id: string;
  title: string;
  includeIcon: boolean;
  content: string;
}

export interface GeneratedPanel {
  draftId: string;
  iconId: string;
  url: string;
  title: string;
  includeIcon: boolean;
  content: string;
}

interface StoredFunnelState {
  currentStep: FunnelStep;
  selectedPlatform: PanelPlatformId | null;
  selectedTemplateId: string | null;
  shapeId: PanelShapeId;
  panelItems: PanelDraft[];
  generatedPanels: GeneratedPanel[];
  isGenerating: boolean;
  sessionCreditsSpent: number;
}

interface FunnelContextValue extends StoredFunnelState {
  hasHydrated: boolean;
  setCurrentStep: (step: FunnelStep) => void;
  setSelectedPlatform: (platform: PanelPlatformId | null) => void;
  setSelectedTemplateId: (templateId: string | null) => void;
  setShapeId: (shapeId: PanelShapeId) => void;
  setPanelItems: (value: PanelDraft[]) => void;
  setGeneratedPanels: (value: GeneratedPanel[]) => void;
  setIsGenerating: (value: boolean) => void;
  setSessionCreditsSpent: (value: number) => void;
  resetResultState: () => void;
  selectTemplate: (templateId: string) => void;
  startOver: () => void;
  clearPersistedState: () => void;
}

const STORAGE_KEY = "panel-maker-state";

export function createEmptyPanelDraft(): PanelDraft {
  return {
    id: `panel-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: "",
    includeIcon: true,
    content: "",
  };
}

const defaultState: StoredFunnelState = {
  currentStep: "step0",
  selectedPlatform: null,
  selectedTemplateId: null,
  shapeId: "wide-3-1",
  panelItems: [createEmptyPanelDraft()],
  generatedPanels: [],
  isGenerating: false,
  sessionCreditsSpent: 0,
};

const FunnelContext = createContext<FunnelContextValue | undefined>(undefined);

function normalizeShapeId(value: unknown): PanelShapeId {
  switch (value) {
    case "landscape-4-3":
    case "square-1-1":
    case "portrait-3-4":
    case "wide-3-1":
      return value;
    default:
      return "wide-3-1";
  }
}

function normalizePanelDrafts(value: unknown): PanelDraft[] {
  if (!Array.isArray(value)) {
    return [createEmptyPanelDraft()];
  }

  const drafts = value
    .filter((item): item is Partial<PanelDraft> => Boolean(item && typeof item === "object"))
    .map((item) => {
      const legacyItem = item as Partial<PanelDraft> & { iconHint?: string };

      return {
        id:
          typeof item.id === "string" && item.id.trim()
            ? item.id
            : createEmptyPanelDraft().id,
        title: typeof item.title === "string" ? item.title : "",
        includeIcon:
          typeof item.includeIcon === "boolean"
            ? item.includeIcon
            : typeof legacyItem.iconHint === "string"
              ? legacyItem.iconHint.trim().length > 0
              : true,
        content: typeof item.content === "string" ? item.content : "",
      };
    });

  return drafts.length > 0 ? drafts : [createEmptyPanelDraft()];
}

function normalizeGeneratedPanels(value: unknown): GeneratedPanel[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is GeneratedPanel =>
      Boolean(item && typeof item === "object") &&
      typeof item.draftId === "string" &&
      typeof item.iconId === "string" &&
      typeof item.url === "string" &&
      typeof item.title === "string" &&
      typeof item.includeIcon === "boolean" &&
      typeof item.content === "string"
  );
}

function normalizeStoredState(rawValue: unknown): StoredFunnelState {
  if (!rawValue || typeof rawValue !== "object") {
    return defaultState;
  }

  const value = rawValue as Partial<StoredFunnelState>;
  const selectedPlatform = value.selectedPlatform === "twitch" ? "twitch" : null;
  const selectedTemplateId =
    typeof value.selectedTemplateId === "string" ? value.selectedTemplateId : null;

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
    shapeId: normalizeShapeId(value.shapeId),
    panelItems: normalizePanelDrafts(value.panelItems),
    generatedPanels: normalizeGeneratedPanels(value.generatedPanels),
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
      console.error("Failed to restore panel funnel state:", error);
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
      generatedPanels: [],
      isGenerating: false,
    }));
  }, []);

  const startOver = useCallback(() => {
    setState({
      ...defaultState,
      panelItems: [createEmptyPanelDraft()],
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
          shapeId: "wide-3-1",
          panelItems: [createEmptyPanelDraft()],
          generatedPanels: [],
          isGenerating: false,
        }),
      setSelectedTemplateId: (selectedTemplateId) =>
        patchState({
          selectedTemplateId,
          currentStep: selectedTemplateId ? state.currentStep : "step1",
        }),
      setShapeId: (shapeId) => patchState({ shapeId }),
      setPanelItems: (panelItems) =>
        patchState({ panelItems: panelItems.length > 0 ? panelItems : [createEmptyPanelDraft()] }),
      setGeneratedPanels: (generatedPanels) => patchState({ generatedPanels }),
      setIsGenerating: (isGenerating) => patchState({ isGenerating }),
      setSessionCreditsSpent: (sessionCreditsSpent) =>
        patchState({ sessionCreditsSpent }),
      resetResultState,
      selectTemplate: (selectedTemplateId) =>
        patchState({
          selectedTemplateId,
          currentStep: "step2",
          generatedPanels: [],
          isGenerating: false,
        }),
      startOver,
      clearPersistedState,
    }),
    [
      clearPersistedState,
      hasHydrated,
      patchState,
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
