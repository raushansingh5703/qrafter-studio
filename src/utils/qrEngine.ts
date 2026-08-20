import { QRDesign } from '../types/qr';

// Get Font Stack definition
export const getFontStack = (font: string) => {
  switch (font) {
    case 'inter':
      return "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    case 'outfit':
      return "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    case 'playfair':
      return "'Playfair Display', Georgia, serif";
    case 'mono':
      return "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    default:
      return "'Outfit', sans-serif";
  }
};

function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Assembles the raw QR matrix SVG and wraps it inside a premium frame layout
 */
export function assembleUnifiedSVG(qrSvgRaw: string, design: QRDesign): string {
  // Extract the inner content of the raw QR code SVG
  const svgContentStart = qrSvgRaw.indexOf('>');
  const svgContentEnd = qrSvgRaw.lastIndexOf('</svg>');
  if (svgContentStart === -1 || svgContentEnd === -1) {
    return qrSvgRaw; // fallback
  }
  let qrInnerContent = qrSvgRaw.slice(svgContentStart + 1, svgContentEnd);

  // Inject logo background backing shape if logo is enabled
  if (design.logo.source && design.logo.backgroundShape !== 'none') {
    const logoSize = 1000 * design.logo.size;
    const padding = design.logo.padding;
    const cx = 500;
    const cy = 500;
    let backingSvg = '';

    if (design.logo.backgroundShape === 'circle') {
      backingSvg = `<circle cx="${cx}" cy="${cy}" r="${logoSize / 2 + padding}" fill="${design.logo.backgroundColor}" opacity="${design.logo.opacity}" />`;
    } else if (design.logo.backgroundShape === 'square') {
      const size = logoSize + padding * 2;
      backingSvg = `<rect x="${cx - size / 2}" y="${cy - size / 2}" width="${size}" height="${size}" rx="20" fill="${design.logo.backgroundColor}" opacity="${design.logo.opacity}" />`;
    }

    const imageIndex = qrInnerContent.indexOf('<image');
    if (imageIndex !== -1) {
      qrInnerContent = qrInnerContent.slice(0, imageIndex) + backingSvg + qrInnerContent.slice(imageIndex);
    }
  }

  // Default canvas dimensions
  let width = 1000;
  let height = 1000;
  let qrX = 0;
  let qrY = 0;
  let qrSize = 1000;

  // Frame structure
  let frameBackground = '';
  let borderPaths = '';
  let bannerShapes = '';
  let frameTextSVG = '';
  let headerTextSVG = '';

  const frameColor = design.frame.color;
  const frameTextColor = design.frame.textColor;
  const frameTextVal = escapeXML(design.frame.text.toUpperCase());
  const fontStack = getFontStack(design.text.font);

  // Apply frame styles
  if (design.frame.style === 'border') {
    width = 1100;
    height = 1100;
    qrX = 50;
    qrY = 50;
    qrSize = 1000;
    borderPaths = `
      <rect x="25" y="25" width="1050" height="1050" fill="none" stroke="${frameColor}" stroke-width="16" rx="24" />
    `;
  } else if (design.frame.style === 'rounded') {
    width = 1120;
    height = 1120;
    qrX = 60;
    qrY = 60;
    qrSize = 1000;
    frameBackground = `
      <rect x="0" y="0" width="1120" height="1120" fill="${design.backgroundColor}" rx="48" />
    `;
    borderPaths = `
      <rect x="30" y="30" width="1060" height="1060" fill="none" stroke="${frameColor}" stroke-width="12" rx="36" />
    `;
  } else if (design.frame.style === 'bottom-label') {
    width = 1100;
    height = 1350;
    qrX = 50;
    qrY = 50;
    qrSize = 1000;
    frameBackground = `
      <rect x="0" y="0" width="1100" height="1350" fill="${design.backgroundColor}" rx="32" />
    `;
    borderPaths = `
      <rect x="25" y="25" width="1050" height="1300" fill="none" stroke="${frameColor}" stroke-width="12" rx="24" />
    `;
    bannerShapes = `
      <rect x="50" y="1100" width="1000" height="180" rx="16" fill="${frameColor}" />
    `;
    frameTextSVG = `
      <text x="550" y="1215" fill="${frameTextColor}" font-family="${fontStack}" font-size="72" font-weight="bold" text-anchor="middle" letter-spacing="4">${frameTextVal}</text>
    `;
  } else if (design.frame.style === 'scan-me') {
    // Beautiful chat bubble / callout style frame at bottom
    width = 1100;
    height = 1380;
    qrX = 50;
    qrY = 50;
    qrSize = 1000;
    frameBackground = `
      <rect x="0" y="0" width="1100" height="1380" fill="${design.backgroundColor}" rx="40" />
    `;
    // Draw an elegant callout box with a small triangle pointing up slightly
    bannerShapes = `
      <!-- Speech bubble main body -->
      <rect x="80" y="1120" width="940" height="180" rx="24" fill="${frameColor}" />
      <!-- Speech bubble tip pointing up -->
      <polygon points="550,1095 520,1120 580,1120" fill="${frameColor}" />
    `;
    frameTextSVG = `
      <text x="550" y="1230" fill="${frameTextColor}" font-family="${fontStack}" font-size="70" font-weight="bold" text-anchor="middle" letter-spacing="4">${frameTextVal}</text>
    `;
  } else if (design.frame.style === 'badge') {
    // Full Canva-style card with top header and bottom cta banner
    width = 1100;
    height = 1500;
    qrX = 100;
    qrY = 280;
    qrSize = 900;

    frameBackground = `
      <rect x="0" y="0" width="1100" height="1500" fill="${design.backgroundColor}" rx="48" />
    `;
    borderPaths = `
      <rect x="25" y="25" width="1050" height="1450" fill="none" stroke="${frameColor}" stroke-dasharray="16 10" stroke-width="8" rx="36" />
    `;
    let textAnchor = 'middle';
    let textX = 550;
    if (design.text.alignment === 'left') {
      textAnchor = 'start';
      textX = 100;
    } else if (design.text.alignment === 'right') {
      textAnchor = 'end';
      textX = 1000;
    }

    headerTextSVG = `
      <text x="${textX}" y="120" fill="${design.text.color}" font-family="${fontStack}" font-size="${design.text.size}" font-weight="${design.text.weight}" text-anchor="${textAnchor}" letter-spacing="${design.text.spacing}">${escapeXML(design.text.title.toUpperCase())}</text>
      <text x="${textX}" y="190" fill="${design.text.subtitleColor}" font-family="${fontStack}" font-size="${design.text.subtitleSize}" font-weight="${design.text.subtitleWeight}" text-anchor="${textAnchor}" letter-spacing="0.5">${escapeXML(design.text.subtitle)}</text>
    `;
    bannerShapes = `
      <rect x="100" y="1240" width="900" height="180" rx="20" fill="${frameColor}" />
    `;
    frameTextSVG = `
      <text x="550" y="1350" fill="${frameTextColor}" font-family="${fontStack}" font-size="64" font-weight="bold" text-anchor="middle" letter-spacing="4">${frameTextVal}</text>
    `;
  } else if (design.frame.style === 'modern') {
    // Elegant frame with split border, header texts at top and solid footer
    width = 1100;
    height = 1450;
    qrX = 100;
    qrY = 100;
    qrSize = 900;
    frameBackground = `
      <rect x="0" y="0" width="1100" height="1450" fill="${design.backgroundColor}" rx="32" />
    `;
    bannerShapes = `
      <rect x="0" y="1280" width="1100" height="170" fill="${frameColor}" rx="0" />
      <!-- Smooth overlap correction at the bottom corners -->
      <path d="M 0,1280 L 1100,1280 L 1100,1418 Q 1100,1450 1068,1450 L 32,1450 Q 0,1450 0,1418 Z" fill="${frameColor}" />
    `;
    frameTextSVG = `
      <text x="550" y="1385" fill="${frameTextColor}" font-family="${fontStack}" font-size="68" font-weight="bold" text-anchor="middle" letter-spacing="5">${frameTextVal}</text>
    `;
  } else if (design.frame.style === 'clay-3d') {
    // Premium 3D puffy clay squircle frame container
    width = 1160;
    height = 1160;
    qrX = 130;
    qrY = 130;
    qrSize = 900;
    
    // We create a card filled with frameColor, overlayed with highlight & shadow gradients to construct the 3D look
    frameBackground = `
      <!-- 3D Puffy Card Background -->
      <rect x="30" y="30" width="1100" height="1100" fill="${frameColor}" rx="160" filter="url(#clay-shadow)" />
      <!-- High-gloss overlay lighting to simulate 3D volume -->
      <rect x="30" y="30" width="1100" height="1100" rx="160" fill="none" stroke="url(#clay-light-bevel)" stroke-width="26" />
      <rect x="43" y="43" width="1074" height="1074" rx="147" fill="none" stroke="url(#clay-dark-bevel)" stroke-width="12" />
      <!-- Inner card containing the QR matrix -->
      <rect x="110" y="110" width="940" height="940" fill="${design.backgroundColor === 'transparent' ? '#ffffff' : design.backgroundColor}" rx="100" />
    `;
  } else {
    // 'none' style
    width = 1000;
    height = 1000;
    qrX = 0;
    qrY = 0;
    qrSize = 1000;
  }

  // Build Fonts Stylesheet to embed inside the SVG
  const fontImports = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&amp;family=Outfit:wght@400;500;600;700&amp;family=Playfair+Display:wght@600;700&amp;family=Fira+Code:wght@500;700&amp;display=swap');
  `;

  const clayDefs = `
    <filter id="clay-shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="24" stdDeviation="20" flood-color="#000000" flood-opacity="0.22" />
      <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#000000" flood-opacity="0.12" />
    </filter>
    <linearGradient id="clay-light-bevel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8" />
      <stop offset="25%" stop-color="#ffffff" stop-opacity="0.2" />
      <stop offset="75%" stop-color="#000000" stop-opacity="0.05" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.35" />
    </linearGradient>
    <linearGradient id="clay-dark-bevel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.4" />
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.25" />
    </linearGradient>
  `;

  let bgImageSVG = '';
  if (design.backgroundImage) {
    bgImageSVG = `
      <!-- Custom Background Image -->
      <image href="${design.backgroundImage}" x="0" y="0" width="1000" height="1000" preserveAspectRatio="xMidYMid slice" opacity="${design.backgroundOpacity ?? 1}" />
    `;
  }

  // Construct overall unified SVG
  const unifiedSVG = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <style type="text/css">
      ${fontImports}
    </style>
    ${clayDefs}
  </defs>
  ${frameBackground}
  <g transform="translate(${qrX}, ${qrY}) scale(${qrSize / 1000})">
    ${bgImageSVG}
    ${qrInnerContent}
  </g>
  ${borderPaths}
  ${bannerShapes}
  ${headerTextSVG}
  ${frameTextSVG}
</svg>
  `.trim();

  return unifiedSVG;
}

/**
 * Converts unified SVG code into a high-quality PNG or WEBP Data URI
 * scale = 1 gives standard HD (e.g. 1000px wide)
 * scale = 2 or 3 gives super-HD, 300 DPI equivalent print quality (e.g. 3000px wide)
 */
export function convertSVGToFormat(
  svgString: string,
  width: number,
  height: number,
  format: 'png' | 'webp',
  scale: number = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobUrl = URL.createObjectURL(svgBlob);

      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width * scale;
        canvas.height = height * scale;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(blobUrl);
          reject(new Error('Failed to get canvas 2d context'));
          return;
        }

        // Enable high-quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw image onto scaled canvas
        ctx.drawImage(image, 0, 0, width * scale, height * scale);

        // Export data URL
        const dataUrl = canvas.toDataURL(`image/${format}`);
        URL.revokeObjectURL(blobUrl);
        resolve(dataUrl);
      };

      image.onerror = (err) => {
        URL.revokeObjectURL(blobUrl);
        reject(err);
      };

      image.src = blobUrl;
    } catch (error) {
      reject(error);
    }
  });
}

export function convertSVGToPNG(
  svgString: string,
  width: number,
  height: number,
  scale: number = 2
): Promise<string> {
  return convertSVGToFormat(svgString, width, height, 'png', scale);
}
