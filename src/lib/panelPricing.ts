export function getPanelBatchCredits(panelCount: number): number {
  if (panelCount <= 0) {
    return 0;
  }

  if (panelCount === 1) {
    return 2;
  }

  if (panelCount === 2) {
    return 5;
  }

  if (panelCount === 3) {
    return 8;
  }

  return 8 + (panelCount - 3) * 3;
}
