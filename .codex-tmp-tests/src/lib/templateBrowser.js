export function filterTemplates(templates, filters) {
    const activeDimensions = Object.keys(filters).filter((dimension) => { var _a, _b; return ((_b = (_a = filters[dimension]) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) > 0; });
    if (activeDimensions.length === 0) {
        return templates;
    }
    return templates.filter((template) => activeDimensions.every((dimension) => {
        const values = filters[dimension];
        if (!values || values.length === 0) {
            return true;
        }
        return values.some((value) => template.categories[dimension].includes(value));
    }));
}
export function getAvailableFilters(templates) {
    const availableFilters = {
        games: new Set(),
        colors: new Set(),
        styles: new Set(),
        themes: new Set(),
    };
    for (const template of templates) {
        for (const value of template.categories.games) {
            availableFilters.games.add(value);
        }
        for (const value of template.categories.colors) {
            availableFilters.colors.add(value);
        }
        for (const value of template.categories.styles) {
            availableFilters.styles.add(value);
        }
        for (const value of template.categories.themes) {
            availableFilters.themes.add(value);
        }
    }
    return availableFilters;
}
export function getTemplateById(templates, id) {
    return templates.find((template) => template.id === id);
}
