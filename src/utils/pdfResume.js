export const normalizePdfSectionOrder = (sections = []) =>
  sections.map((section) => ({
    ...section,
    id: section.id === "experiences" ? "experience" : section.id,
  }));

export const parsePdfFontSize = (value, fallback = 11) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const getPdfFontScale = (value, baseline = 10) =>
  parsePdfFontSize(value, baseline) / baseline;

export const scalePdfStyles = (styleMap, fontScale = 1) =>
  Object.fromEntries(
    Object.entries(styleMap).map(([styleName, styleValue]) => [
      styleName,
      Object.fromEntries(
        Object.entries(styleValue).map(([propName, propValue]) => [
          propName,
          propName === "fontSize" && typeof propValue === "number"
            ? Math.round(propValue * fontScale * 100) / 100
            : propValue,
        ]),
      ),
    ]),
  );
