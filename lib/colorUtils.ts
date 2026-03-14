export function hexToHsv(hex: string): { h: number; s: number; v: number } {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, v: v * 100 };
}

export function hsvToHex(h: number, s: number, v: number): string {
  h /= 360;
  s /= 100;
  v /= 100;

  let r = 0, g = 0, b = 0;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function shiftColor(hex: string, hStep: number, sStep: number, vStep: number): string {
  const { h, s, v } = hexToHsv(hex);
  
  // Modulo 360 for hue to wrap around the color wheel
  let newH = (h + hStep) % 360;
  if (newH < 0) newH += 360;
  
  // Clamp saturation and value between 0 and 100
  const newS = Math.max(0, Math.min(100, s + sStep));
  const newV = Math.max(0, Math.min(100, v + vStep));

  return hsvToHex(newH, newS, newV);
}

export function generatePalette(baseHex: string, steps: number, hStep: number, sStep: number, vStep: number): string[] {
  const palette = [];
  // Generate shadows (negative steps)
  for (let i = steps; i > 0; i--) {
    palette.push(shiftColor(baseHex, -hStep * i, sStep * i, -vStep * i));
  }
  
  // Base color
  palette.push(baseHex);
  
  // Generate highlights (positive steps)
  for (let i = 1; i <= steps; i++) {
    palette.push(shiftColor(baseHex, hStep * i, -sStep * i, vStep * i));
  }
  
  return palette;
}
