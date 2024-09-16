export function getSurfaceDescription(
  minSurface?: number,
  maxSurface?: number,
  location?: string
): string {
  if (!minSurface && !maxSurface) return "";

  const locationStr = location ? ` a ${location}` : "";

  if (minSurface && maxSurface) {
    if (maxSurface <= 50) {
      return `Appartamenti fino a 50 m²${locationStr}`;
    } else if (minSurface >= 51 && maxSurface <= 100) {
      return `Case tra 51 e 100 m²${locationStr}`;
    } else if (minSurface >= 101 && maxSurface <= 200) {
      return `Immobili da 101 a 200 m²${locationStr}`;
    } else if (minSurface >= 201) {
      return `Ville oltre 201 m²${locationStr}`;
    } else {
      return `Proprietà da ${minSurface} a ${maxSurface} m²${locationStr}`;
    }
  }

  if (minSurface) {
    if (minSurface <= 50) {
      return `Monolocali e bilocali${locationStr}`;
    } else if (minSurface >= 51 && minSurface <= 100) {
      return `Appartamenti più grandi di 50 m²${locationStr}`;
    } else if (minSurface >= 101 && minSurface <= 200) {
      return `Case spaziose oltre 100 m²${locationStr}`;
    } else if (minSurface >= 201) {
      return `Grandi ville e attici sopra 200 m²${locationStr}`;
    } else {
      return `Immobili da ${minSurface} m² in su${locationStr}`;
    }
  }

  if (maxSurface) {
    if (maxSurface <= 50) {
      return `Piccoli appartamenti sotto 50 m²${locationStr}`;
    } else if (maxSurface >= 51 && maxSurface <= 100) {
      return `Case non più grandi di 100 m²${locationStr}`;
    } else if (maxSurface >= 101 && maxSurface <= 200) {
      return `Abitazioni fino a 200 m²${locationStr}`;
    } else if (maxSurface >= 201) {
      return `Ampie proprietà oltre 200 m²${locationStr}`;
    } else {
      return `Immobili non oltre ${maxSurface} m²${locationStr}`;
    }
  }

  return "";
}
