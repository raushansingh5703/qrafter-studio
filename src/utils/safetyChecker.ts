import { QRDesign } from '../types/qr';

// Convert a hex color string (e.g. "#ffffff" or "#fff") to RGB object
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Calculate the relative luminance of a color
function getLuminance(rgb: { r: number; g: number; b: number }): number {
  const a = [rgb.r, rgb.g, rgb.b].map((v) => {
    let c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Calculate the contrast ratio between two hex colors
export function calculateContrast(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  if (!rgb1 || !rgb2) return 1;

  const l1 = getLuminance(rgb1);
  const l2 = getLuminance(rgb2);

  const brightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);

  return (brightest + 0.05) / (darkest + 0.05);
}

export interface ScannabilityResult {
  status: 'highly-scannable' | 'low-contrast' | 'logo-too-large';
  ratio: number;
  message: string;
}

export function checkScannability(design: QRDesign): ScannabilityResult {
  // 1. Logo check
  if (design.logo.source && design.logo.size > 0.28) {
    return {
      status: 'logo-too-large',
      ratio: 4.0, // placeholder ratio
      message: '⚠ Logo size is too large (greater than 28% width). Keep it smaller for safe scanning.',
    };
  }

  // 2. Contrast check
  let contrast1 = calculateContrast(design.foregroundColor, design.backgroundColor);
  let contrast2 = contrast1;

  if (design.gradient.enabled) {
    contrast1 = calculateContrast(design.gradient.startColor, design.backgroundColor);
    contrast2 = calculateContrast(design.gradient.endColor, design.backgroundColor);
  }

  // If both eyes have individual colors, we should check them too, but foreground vs background is the most critical.
  const minContrast = Math.min(contrast1, contrast2);

  if (minContrast < 2.5) {
    return {
      status: 'low-contrast',
      ratio: minContrast,
      message: '⚠ Low contrast detected. Boost contrast between foreground and background for scannability.',
    };
  }

  return {
    status: 'highly-scannable',
    ratio: minContrast,
    message: '✓ QR is highly scannable and ready to scan.',
  };
}
