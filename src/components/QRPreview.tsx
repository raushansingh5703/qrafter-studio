"use client";

import { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { Camera, Download, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { QRDesign, QRDetails } from '../types/qr';
import { checkScannability } from '../utils/safetyChecker';
import { assembleUnifiedSVG, getFontStack } from '../utils/qrEngine';

interface QRPreviewProps {
  design: QRDesign;
  details: QRDetails;
  dataString: string;
  onDownloadClick: (svgContent: string) => void;
  onScannerOpen: () => void;
}

export default function QRPreview({
  design,
  details,
  dataString,
  onDownloadClick,
  onScannerOpen
}: QRPreviewProps) {
  const qrContainerRef = useRef<HTMLDivElement | null>(null);
  const qrCodeInstance = useRef<QRCodeStyling | null>(null);

  // Callback Ref: executes whenever the DOM container mounts or remounts (due to frame changes)
  const qrRefCallback = (el: HTMLDivElement | null) => {
    qrContainerRef.current = el;
    if (!el) return;

    if (!qrCodeInstance.current) {
      const qrCode = new QRCodeStyling({
        width: 260,
        height: 260,
        type: 'svg',
        data: dataString,
        dotsOptions: {
          type: design.pattern,
          color: design.foregroundColor,
        },
        backgroundOptions: {
          color: design.backgroundColor,
        },
        cornersSquareOptions: {
          type: design.eyeStyle,
        },
        cornersDotOptions: {
          type: design.eyeStyle === 'extra-rounded' ? 'dot' : design.eyeStyle,
        },
        imageOptions: {
          crossOrigin: 'anonymous',
          hideBackgroundDots: true,
        }
      });
      qrCode.append(el);
      qrCodeInstance.current = qrCode;
    } else {
      // Re-append to the new container node when frame style switches
      el.innerHTML = '';
      qrCodeInstance.current.append(el);
    }
    
    // Force a visual sync immediately upon mount
    syncLogoBackingShape();
  };

  // Helper to dynamically inject the logo background shape directly into the SVG DOM
  const syncLogoBackingShape = () => {
    if (!qrContainerRef.current) return;

    const svgEl = qrContainerRef.current.querySelector('svg');
    if (svgEl) {
      // Clean up previous backing shape elements
      const oldBacking = svgEl.querySelector('.qr-logo-backing');
      if (oldBacking) {
        oldBacking.remove();
      }

      // Find the logo image tag
      const imageEl = svgEl.querySelector('image');
      if (imageEl && design.logo.source && design.logo.backgroundShape !== 'none') {
        const x = parseFloat(imageEl.getAttribute('x') || '0');
        const y = parseFloat(imageEl.getAttribute('y') || '0');
        const width = parseFloat(imageEl.getAttribute('width') || '0');
        const height = parseFloat(imageEl.getAttribute('height') || '0');

        const cx = x + width / 2;
        const cy = y + height / 2;
        // Map padding parameter relative to the preview width (260px vs 1000px export size)
        const scaleFactor = width / 1000;
        const padding = design.logo.padding * scaleFactor * 4; // scale padding for preview density
        const radius = width / 2 + padding;

        let backingEl: SVGElement;

        if (design.logo.backgroundShape === 'circle') {
          backingEl = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          backingEl.setAttribute('cx', cx.toString());
          backingEl.setAttribute('cy', cy.toString());
          backingEl.setAttribute('r', radius.toString());
        } else {
          // 'square'
          backingEl = document.createElementNS("http://www.w3.org/2000/svg", "rect");
          const size = width + padding * 2;
          backingEl.setAttribute('x', (cx - size / 2).toString());
          backingEl.setAttribute('y', (cy - size / 2).toString());
          backingEl.setAttribute('width', size.toString());
          backingEl.setAttribute('height', size.toString());
          backingEl.setAttribute('rx', (16 * scaleFactor).toString()); // scaled corner radius
        }

        backingEl.setAttribute('fill', design.logo.backgroundColor);
        backingEl.setAttribute('opacity', design.logo.opacity.toString());
        backingEl.setAttribute('class', 'qr-logo-backing');

        // Insert backingEl right before imageEl so the image renders on top
        imageEl.parentNode?.insertBefore(backingEl, imageEl);
      }
    }
  };

  // 2. Perform live updates and inject backing shape in-place in the DOM
  useEffect(() => {
    if (!qrCodeInstance.current) return;

    const qrOptions = {
      data: dataString,
      dotsOptions: {
        type: design.pattern,
        color: design.gradient.enabled ? undefined : design.foregroundColor,
        gradient: design.gradient.enabled
          ? {
              type: design.gradient.type,
              rotation: (design.gradient.direction * Math.PI) / 180,
              colorStops: [
                { offset: 0, color: design.gradient.startColor },
                { offset: 1, color: design.gradient.endColor },
              ],
            }
          : undefined,
      },
      backgroundOptions: {
        color: design.backgroundColor,
      },
      cornersSquareOptions: {
        type: design.eyeStyle,
        color: design.eyeColor.individual ? design.eyeColor.outer : undefined,
      },
      cornersDotOptions: {
        type: design.eyeStyle === 'extra-rounded' ? 'dot' : design.eyeStyle,
        color: design.eyeColor.individual ? design.eyeColor.inner : undefined,
      },
      image: design.logo.source || undefined,
      imageOptions: {
        crossOrigin: 'anonymous',
        hideBackgroundDots: true,
        imageSize: design.logo.size,
        margin: design.logo.padding,
      },
    };

    qrCodeInstance.current.update(qrOptions);

    // Sync backing shape in the live DOM
    // Introduce a short timeout to let the library append the updated image tag first
    const timer = setTimeout(() => {
      syncLogoBackingShape();
    }, 50);

    return () => clearTimeout(timer);
  }, [design, dataString]);

  // Assess safety scannability
  const scanResult = checkScannability(design);

  const getScannabilityStyles = () => {
    switch (scanResult.status) {
      case 'highly-scannable':
        return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30';
      case 'low-contrast':
      case 'logo-too-large':
        return 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30';
    }
  };

  // Compile full SVG string for download trigger
  const handleDownloadTrigger = () => {
    if (!qrCodeInstance.current) return;

    // Build the high-quality 1000x1000 equivalent raw SVG for export
    const exportEngine = new QRCodeStyling({
      width: 1000,
      height: 1000,
      type: 'svg',
      data: dataString,
      dotsOptions: {
        type: design.pattern,
        color: design.gradient.enabled ? undefined : design.foregroundColor,
        gradient: design.gradient.enabled
          ? {
              type: design.gradient.type,
              rotation: (design.gradient.direction * Math.PI) / 180,
              colorStops: [
                { offset: 0, color: design.gradient.startColor },
                { offset: 1, color: design.gradient.endColor },
              ],
            }
          : undefined,
      },
      backgroundOptions: {
        color: design.backgroundColor,
      },
      cornersSquareOptions: {
        type: design.eyeStyle,
        color: design.eyeColor.individual ? design.eyeColor.outer : undefined,
      },
      cornersDotOptions: {
        type: design.eyeStyle === 'extra-rounded' ? 'dot' : design.eyeStyle,
        color: design.eyeColor.individual ? design.eyeColor.inner : undefined,
      },
      image: design.logo.source || undefined,
      imageOptions: {
        crossOrigin: 'anonymous',
        hideBackgroundDots: true,
        imageSize: design.logo.size,
        margin: design.logo.padding,
      },
    });

    // Render to a temporary container to extract raw 1000x1000 SVG
    const tempDiv = document.createElement('div');
    exportEngine.append(tempDiv);

    // Wait a tiny cycle for append to compile nodes
    setTimeout(() => {
      const rawExportSvg = tempDiv.querySelector('svg')?.outerHTML;
      if (rawExportSvg) {
        const fullCompiledSvg = assembleUnifiedSVG(rawExportSvg, design);
        onDownloadClick(fullCompiledSvg);
      }
    }, 50);
  };

  // Render HTML preview frame mocks matching the SVG template outputs
  const renderFramedQR = () => {
    const frameColor = design.frame.color;
    const frameTextColor = design.frame.textColor;
    const frameTextVal = design.frame.text.toUpperCase();
    const fontStack = getFontStack(design.text.font);

    const baseQRStyle = {
      backgroundColor: design.backgroundColor,
    };

    switch (design.frame.style) {
      case 'border':
        return (
          <div
            className="p-3.5 border-8 rounded-3xl"
            style={{ borderColor: frameColor, ...baseQRStyle }}
          >
            <div ref={qrRefCallback} className="w-[260px] h-[260px]" />
          </div>
        );

      case 'rounded':
        return (
          <div
            className="p-4 border-[6px] rounded-[2.5rem]"
            style={{ borderColor: frameColor, ...baseQRStyle }}
          >
            <div ref={qrRefCallback} className="w-[260px] h-[260px]" />
          </div>
        );

      case 'bottom-label':
        return (
          <div
            className="p-3 pb-4 border-[6px] rounded-3xl flex flex-col items-center space-y-3"
            style={{ borderColor: frameColor, ...baseQRStyle }}
          >
            <div ref={qrRefCallback} className="w-[260px] h-[260px]" />
            <div
              className="w-full py-3.5 rounded-xl text-center font-bold text-sm tracking-wider animate-[fadeIn_0.3s_ease]"
              style={{ backgroundColor: frameColor, color: frameTextColor, fontFamily: fontStack }}
            >
              {frameTextVal}
            </div>
          </div>
        );

      case 'scan-me':
        return (
          <div
            className="p-4 pb-5 rounded-[2.5rem] flex flex-col items-center space-y-4"
            style={{ ...baseQRStyle }}
          >
            <div ref={qrRefCallback} className="w-[260px] h-[260px]" />
            <div className="relative w-full animate-[fadeIn_0.3s_ease]">
              {/* Triangular tip pointing up */}
              <div
                className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[12px]"
                style={{ borderBottomColor: frameColor }}
              />
              <div
                className="w-full py-3 rounded-2xl text-center font-bold text-sm tracking-wider"
                style={{ backgroundColor: frameColor, color: frameTextColor, fontFamily: fontStack }}
              >
                {frameTextVal}
              </div>
            </div>
          </div>
        );

      case 'badge':
        return (
          <div
            className="p-5 border-4 rounded-[2.5rem] flex flex-col items-center space-y-5"
            style={{ borderColor: frameColor, ...baseQRStyle }}
          >
            {/* Header section */}
            <div className={`w-full flex flex-col space-y-1 animate-[fadeIn_0.3s_ease] ${
              design.text.alignment === 'left' ? 'text-left items-start' :
              design.text.alignment === 'right' ? 'text-right items-end' :
              'text-center items-center'
            }`}>
              <h4
                className="leading-snug"
                style={{
                  color: design.text.color,
                  fontFamily: fontStack,
                  fontSize: `${design.text.size * 0.26}px`,
                  letterSpacing: `${design.text.spacing * 2}px`,
                  fontWeight: design.text.weight
                }}
              >
                {design.text.title.toUpperCase()}
              </h4>
              <p
                className="leading-normal"
                style={{
                  color: design.text.subtitleColor,
                  fontFamily: fontStack,
                  fontSize: `${design.text.subtitleSize * 0.26}px`,
                  fontWeight: design.text.subtitleWeight
                }}
              >
                {design.text.subtitle}
              </p>
            </div>

            {/* QR Wrapper scaled to look smaller */}
            <div className="scale-90 origin-center">
              <div ref={qrRefCallback} className="w-[260px] h-[260px]" />
            </div>

            {/* CTA footer banner */}
            <div
              className="w-full py-3 rounded-2xl text-center font-bold text-xs tracking-wider animate-[fadeIn_0.3s_ease]"
              style={{ backgroundColor: frameColor, color: frameTextColor, fontFamily: fontStack }}
            >
              {frameTextVal}
            </div>
          </div>
        );

      case 'modern':
        return (
          <div
            className="rounded-3xl overflow-hidden flex flex-col items-center border"
            style={{ borderColor: `${frameColor}20`, ...baseQRStyle }}
          >
            <div className="p-5">
              <div ref={qrRefCallback} className="w-[260px] h-[260px]" />
            </div>
            <div
              className="w-full py-4 text-center font-bold text-sm tracking-widest uppercase rounded-t-none animate-[fadeIn_0.3s_ease]"
              style={{ backgroundColor: frameColor, color: frameTextColor, fontFamily: fontStack }}
            >
              {frameTextVal}
            </div>
          </div>
        );

      default:
        // 'none' style
        return (
          <div ref={qrRefCallback} className="w-[260px] h-[260px]" style={{ ...baseQRStyle }} />
        );
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Main Preview Container */}
      <div className="flex flex-col items-center">
        {/* Aspect Ratio Box to keep layout clean */}
        <div className="w-full max-w-[340px] bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 shadow-xl relative flex flex-col items-center justify-center overflow-hidden transition-all duration-300">
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] -z-10" />

          {/* Render the framed QR in native React style */}
          <div className="w-full flex items-center justify-center select-none transition-all duration-300">
            {renderFramedQR()}
          </div>
        </div>
      </div>

      {/* Live Scannability Report Card */}
      <div className={`rounded-xl p-3.5 flex items-start space-x-3 text-xs font-semibold ${getScannabilityStyles()} transition-colors duration-300`}>
        {scanResult.status === 'highly-scannable' ? (
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" />
        ) : (
          <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
        )}
        <p className="leading-snug text-slate-700 dark:text-slate-350">{scanResult.message}</p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleDownloadTrigger}
          className="w-full bg-slate-900 dark:bg-white hover:bg-slate-850 dark:hover:bg-slate-100 text-white dark:text-slate-950 py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide shadow-md flex items-center justify-center space-x-2 transition-all active:scale-[0.99] cursor-pointer"
        >
          <Download className="w-4.5 h-4.5" />
          <span>Download HD QR — ₹1</span>
        </button>

        <button
          onClick={onScannerOpen}
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-350 py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 transition-colors cursor-pointer"
        >
          <Camera className="w-4.5 h-4.5 text-blue-500" />
          <span>Camera Test Scan</span>
        </button>

        <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center font-medium">
          Free unlimited preview &amp; custom scanning. Pay once to unlock high-res print vectors.
        </p>
      </div>
    </div>
  );
}
