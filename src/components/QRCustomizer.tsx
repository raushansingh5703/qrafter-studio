"use client";

import React, { useState } from 'react';
import {
  Type,
  Layout,
  Palette,
  Image as ImageIcon,
  Square,
  ChevronDown,
  Trash2,
  Upload,
  Sliders,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';
import { QRType, QRDesign, QRDetails, UPIFields, VCardFields, EmailFields, WifiFields, TextFields } from '../types/qr';

interface QRCustomizerProps {
  selectedType: QRType;
  details: QRDetails;
  design: QRDesign;
  onDetailsChange: (details: Partial<QRDetails[QRType]>) => void;
  onDesignChange: (design: Partial<QRDesign>) => void;
}

const presetLogos = [
  {
    name: 'Google',
    svg: 'data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="%234285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="%2334A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="%23FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="%23EA4335"/></svg>',
    defaultShape: 'circle' as const,
    defaultBg: '#ffffff'
  },
  {
    name: 'WhatsApp',
    svg: 'data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.454L0 24zm6.59-4.846c1.6.95 3.178 1.451 4.795 1.453 5.485.002 9.948-4.461 9.95-9.95.002-2.66-1.033-5.159-2.91-7.04C16.545 1.777 14.047.747 11.39.747c-5.49 0-9.953 4.463-9.955 9.952-.001 1.722.456 3.4 1.324 4.887l-.999 3.648 3.73-.978zm11.537-8.082c-.3-.15-1.774-.875-2.049-.976-.275-.1-.475-.15-.675.15-.2.3-.775.976-.95 1.176-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.414-1.49-1.04-.928-1.554-2.078-1.754-2.428-.2-.35-.022-.539.128-.689.135-.135.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.589-.491-.51-.675-.52-.175-.01-.375-.01-.575-.01-.2 0-.525.075-.8 1.05-.275.975-1.05 2.175-1.05 2.225s.175.35.375.525c.15.15 2.475 3.779 5.997 5.3 3.522 1.521 3.522 1.014 4.15.939.628-.075 1.774-.725 2.024-1.425.25-.7.25-1.3 1.75-1.425-.075-.125-.275-.275-.575-.425z" fill="%2325D366"/></svg>',
    defaultShape: 'circle' as const,
    defaultBg: '#ffffff'
  },
  {
    name: 'Instagram',
    svg: 'data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" fill="%23E1306C"/></svg>',
    defaultShape: 'circle' as const,
    defaultBg: '#ffffff'
  },
  {
    name: 'Facebook',
    svg: 'data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="%231877F2"/></svg>',
    defaultShape: 'circle' as const,
    defaultBg: '#ffffff'
  },
  {
    name: 'UPI Pay',
    svg: 'data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="6" fill="%230f172a"/><path d="M4.5 11L12 3.5 19.5 11M12 3.5v13.5M4.5 17.5h15" stroke="%23ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
    defaultShape: 'circle' as const,
    defaultBg: '#ffffff'
  },
  {
    name: 'Web / Link',
    svg: 'data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="%230f172a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    defaultShape: 'circle' as const,
    defaultBg: '#ffffff'
  },
  {
    name: 'Location',
    svg: 'data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="%23ea4335" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    defaultShape: 'circle' as const,
    defaultBg: '#ffffff'
  },
  {
    name: 'Phone',
    svg: 'data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="%232563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    defaultShape: 'circle' as const,
    defaultBg: '#ffffff'
  },
  {
    name: 'Mail',
    svg: 'data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="%237c3aed" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    defaultShape: 'circle' as const,
    defaultBg: '#ffffff'
  },
  {
    name: 'LinkedIn',
    svg: 'data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="%230A66C2"/></svg>',
    defaultShape: 'circle' as const,
    defaultBg: '#ffffff'
  }
];

export default function QRCustomizer({
  selectedType,
  details,
  design,
  onDetailsChange,
  onDesignChange
}: QRCustomizerProps) {
  const [activePanel, setActivePanel] = useState<'content' | 'pattern' | 'colors' | 'logo' | 'frame'>('content');

  const togglePanel = (panel: typeof activePanel) => {
    setActivePanel(activePanel === panel ? 'content' : panel);
  };

  // Helper to load logo as compressed Base64
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 200;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, w, h);
        const compressedBase64 = canvas.toDataURL('image/png');
        onDesignChange({ logo: { ...design.logo, source: compressedBase64 } });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    onDesignChange({ logo: { ...design.logo, source: '' } });
  };

  // Helper to load background image as compressed Base64
  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 800; // higher resolution for background image
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, w, h);
        const compressedBase64 = canvas.toDataURL('image/png');
        onDesignChange({ backgroundImage: compressedBase64 });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const removeBgImage = () => {
    onDesignChange({ backgroundImage: '' });
  };

  // Render input fields depending on the active type
  const renderContentInputs = () => {
    switch (selectedType) {
      case 'website':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Website URL</label>
              <input
                type="url"
                value={details.website?.url || ''}
                onChange={(e) => onDetailsChange({ url: e.target.value })}
                placeholder="https://example.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
              />
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Plain Text Content</label>
              <textarea
                value={details.text?.text || ''}
                onChange={(e) => onDetailsChange({ text: e.target.value })}
                placeholder="Enter any text, code, or message to encode in the QR..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm resize-none"
              />
            </div>
          </div>
        );

      case 'wifi':
        const wifi = (details.wifi || {}) as WifiFields;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Network SSID (Name)</label>
              <input
                type="text"
                value={wifi.ssid || ''}
                onChange={(e) => onDetailsChange({ ssid: e.target.value })}
                placeholder="e.g. MyHomeNetwork"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Security/Encryption</label>
                <select
                  value={wifi.encryption || 'WPA'}
                  onChange={(e) => onDetailsChange({ encryption: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
                >
                  <option value="WPA">WPA / WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None (Open Network)</option>
                </select>
              </div>
              {wifi.encryption !== 'nopass' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Password</label>
                  <input
                    type="text"
                    value={wifi.password || ''}
                    onChange={(e) => onDetailsChange({ password: e.target.value })}
                    placeholder="WPA Password"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
                  />
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="wifi-hidden"
                checked={wifi.hidden || false}
                onChange={(e) => onDetailsChange({ hidden: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-350"
              />
              <label htmlFor="wifi-hidden" className="text-xs font-semibold text-slate-650 dark:text-slate-350 cursor-pointer">
                This is a hidden network SSID
              </label>
            </div>
          </div>
        );

      case 'google-review':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Business Name</label>
              <input
                type="text"
                value={details['google-review'].businessName}
                onChange={(e) => onDetailsChange({ businessName: e.target.value })}
                placeholder="e.g. Star Coffee Shop"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Google Review Link</label>
              <input
                type="url"
                value={details['google-review'].reviewUrl}
                onChange={(e) => onDetailsChange({ reviewUrl: e.target.value })}
                placeholder="https://g.page/r/xxx/review"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
              />
              <p className="text-[10px] text-slate-400 mt-1">Get this link from your Google Business Profile &gt; Ask for Reviews.</p>
            </div>
          </div>
        );

      case 'upi':
        const upi = details.upi as UPIFields;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">UPI ID / VPA</label>
                <input
                  type="text"
                  value={upi.payeeVpa}
                  onChange={(e) => onDetailsChange({ payeeVpa: e.target.value })}
                  placeholder="name@upi"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Payee Name</label>
                <input
                  type="text"
                  value={upi.payeeName}
                  onChange={(e) => onDetailsChange({ payeeName: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Amount (Optional)</label>
                <input
                  type="number"
                  value={upi.amount}
                  onChange={(e) => onDetailsChange({ amount: e.target.value })}
                  placeholder="e.g. 500"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Remarks / Memo</label>
                <input
                  type="text"
                  value={upi.transactionNote}
                  onChange={(e) => onDetailsChange({ transactionNote: e.target.value })}
                  placeholder="Invoice payment"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
                />
              </div>
            </div>
          </div>
        );

      case 'whatsapp':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Phone Number</label>
              <input
                type="tel"
                value={details.whatsapp.phoneNumber}
                onChange={(e) => onDetailsChange({ phoneNumber: e.target.value })}
                placeholder="+919876543210 (include country code)"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Pre-filled Chat Message</label>
              <textarea
                value={details.whatsapp.prefilledText}
                onChange={(e) => onDetailsChange({ prefilledText: e.target.value })}
                placeholder="Hi, I am interested in booking..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm resize-none"
              />
            </div>
          </div>
        );

      case 'maps':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Place Name / Search Query</label>
              <input
                type="text"
                value={details.maps.searchPlace}
                onChange={(e) => onDetailsChange({ searchPlace: e.target.value })}
                placeholder="e.g. Empire State Building, NYC"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Latitude (Optional)</label>
                <input
                  type="text"
                  value={details.maps.latitude}
                  onChange={(e) => onDetailsChange({ latitude: e.target.value })}
                  placeholder="e.g. 12.9716"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Longitude (Optional)</label>
                <input
                  type="text"
                  value={details.maps.longitude}
                  onChange={(e) => onDetailsChange({ longitude: e.target.value })}
                  placeholder="e.g. 77.5946"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
                />
              </div>
            </div>
          </div>
        );

      case 'menu':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Digital Menu URL</label>
              <input
                type="url"
                value={details.menu.menuUrl}
                onChange={(e) => onDetailsChange({ menuUrl: e.target.value })}
                placeholder="https://myrestaurant.com/menu.pdf"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
              />
            </div>
          </div>
        );

      case 'vcard':
        const vcard = details.vcard as VCardFields;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">First Name</label>
                <input
                  type="text"
                  value={vcard.firstName}
                  onChange={(e) => onDetailsChange({ firstName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Last Name</label>
                <input
                  type="text"
                  value={vcard.lastName}
                  onChange={(e) => onDetailsChange({ lastName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Company</label>
                <input
                  type="text"
                  value={vcard.organization}
                  onChange={(e) => onDetailsChange({ organization: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Job Title</label>
                <input
                  type="text"
                  value={vcard.title}
                  onChange={(e) => onDetailsChange({ title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Mobile Phone</label>
                <input
                  type="text"
                  value={vcard.phoneMobile}
                  onChange={(e) => onDetailsChange({ phoneMobile: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Email</label>
                <input
                  type="email"
                  value={vcard.email}
                  onChange={(e) => onDetailsChange({ email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
                />
              </div>
            </div>
          </div>
        );

      case 'phone':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Phone Number</label>
              <input
                type="tel"
                value={details.phone.phoneNumber}
                onChange={(e) => onDetailsChange({ phoneNumber: e.target.value })}
                placeholder="e.g. +919876543210"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
              />
            </div>
          </div>
        );

      case 'email':
        const email = details.email as EmailFields;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Recipient Email Address</label>
              <input
                type="email"
                value={email.emailAddress}
                onChange={(e) => onDetailsChange({ emailAddress: e.target.value })}
                placeholder="support@example.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Subject Line</label>
              <input
                type="text"
                value={email.subject}
                onChange={(e) => onDetailsChange({ subject: e.target.value })}
                placeholder="Service Request"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Message Body</label>
              <textarea
                value={email.body}
                onChange={(e) => onDetailsChange({ body: e.target.value })}
                placeholder="Describe your issue..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm resize-none"
              />
            </div>
          </div>
        );

      case 'social':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Social Platform</label>
              <select
                value={details.social.platform}
                onChange={(e) => onDetailsChange({ platform: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
                <option value="linkedin">LinkedIn</option>
                <option value="facebook">Facebook</option>
                <option value="twitter">X / Twitter</option>
                <option value="linktree">Linktree</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Profile URL</label>
              <input
                type="url"
                value={details.social.url}
                onChange={(e) => onDetailsChange({ url: e.target.value })}
                placeholder="https://instagram.com/myusername"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
              />
            </div>
          </div>
        );

      case 'feedback':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Form or Rating URL</label>
              <input
                type="url"
                value={details.feedback.feedbackUrl}
                onChange={(e) => onDetailsChange({ feedbackUrl: e.target.value })}
                placeholder="https://myfeedback.typeform.com/to/xyz"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
              />
            </div>
          </div>
        );

      case 'coupon':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Promo Code</label>
                <input
                  type="text"
                  value={details.coupon.couponCode}
                  onChange={(e) => onDetailsChange({ couponCode: e.target.value })}
                  placeholder="SAVE30"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Expiry Date (Optional)</label>
                <input
                  type="date"
                  value={details.coupon.expiryDate}
                  onChange={(e) => onDetailsChange({ expiryDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Offer Description</label>
              <input
                type="text"
                value={details.coupon.offerDetails}
                onChange={(e) => onDetailsChange({ offerDetails: e.target.value })}
                placeholder="Get 30% off on all products above Rs. 1000"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
              />
            </div>
          </div>
        );

      case 'app':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Google Play Store Link</label>
              <input
                type="url"
                value={details.app.playStoreUrl}
                onChange={(e) => onDetailsChange({ playStoreUrl: e.target.value })}
                placeholder="https://play.google.com/store/apps/details?id=xxx"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Apple App Store Link</label>
              <input
                type="url"
                value={details.app.appStoreUrl}
                onChange={(e) => onDetailsChange({ appStoreUrl: e.target.value })}
                placeholder="https://apps.apple.com/app/idxxx"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. CONTENT PANEL */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => togglePanel('content')}
          className="w-full flex items-center justify-between px-6 py-5 bg-white/40 dark:bg-slate-900/40 text-slate-800 dark:text-white hover:bg-white/60 dark:hover:bg-slate-900/60 transition-colors font-semibold text-base font-outfit"
        >
          <div className="flex items-center space-x-3">
            <Type className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>QR Content Details</span>
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${activePanel === 'content' ? 'rotate-180' : ''}`} />
        </button>

        {activePanel === 'content' && (
          <div className="px-6 py-5 bg-white/20 dark:bg-slate-900/20 border-t border-slate-200/40 dark:border-slate-850">
            {renderContentInputs()}
          </div>
        )}
      </div>

      {/* 2. PATTERNS & SHAPES PANEL */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => togglePanel('pattern')}
          className="w-full flex items-center justify-between px-6 py-5 bg-white/40 dark:bg-slate-900/40 text-slate-800 dark:text-white hover:bg-white/60 dark:hover:bg-slate-900/60 transition-colors font-semibold text-base font-outfit"
        >
          <div className="flex items-center space-x-3">
            <Layout className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            <span>Pattern &amp; Shape Options</span>
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${activePanel === 'pattern' ? 'rotate-180' : ''}`} />
        </button>

        {activePanel === 'pattern' && (
          <div className="px-6 py-5 bg-white/20 dark:bg-slate-900/20 border-t border-slate-200/40 dark:border-slate-850 space-y-6">
            {/* Body Patterns */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">QR Body Pattern</label>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { id: 'square', label: 'Square' },
                  { id: 'rounded', label: 'Rounded' },
                  { id: 'dots', label: 'Dots' },
                  { id: 'classy', label: 'Classy Lines' },
                  { id: 'classy-rounded', label: 'Classy Curved' },
                  { id: 'extra-rounded', label: 'Pill Blocks' }
                ] as const).map((pat) => (
                  <button
                    key={pat.id}
                    onClick={() => onDesignChange({ pattern: pat.id })}
                    className={`py-3 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                      design.pattern === pat.id
                        ? 'border-blue-600 bg-blue-50/40 text-blue-600 dark:border-blue-500 dark:bg-blue-950/20 dark:text-blue-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-650 hover:bg-slate-50 dark:hover:bg-slate-850 dark:text-slate-400'
                    }`}
                  >
                    {pat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Eye Style */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Corner Eyes Shape</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {([
                  { id: 'square', label: 'Square' },
                  { id: 'rounded', label: 'Rounded' },
                  { id: 'dot', label: 'Circle' },
                  { id: 'extra-rounded', label: 'Modern' }
                ] as const).map((eye) => (
                  <button
                    key={eye.id}
                    onClick={() => onDesignChange({ eyeStyle: eye.id })}
                    className={`py-3 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                      design.eyeStyle === eye.id
                        ? 'border-blue-600 bg-blue-50/40 text-blue-600 dark:border-blue-500 dark:bg-blue-950/20 dark:text-blue-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-650 hover:bg-slate-50 dark:hover:bg-slate-850 dark:text-slate-400'
                    }`}
                  >
                    {eye.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. COLORS & GRADIENTS */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => togglePanel('colors')}
          className="w-full flex items-center justify-between px-6 py-5 bg-white/40 dark:bg-slate-900/40 text-slate-800 dark:text-white hover:bg-white/60 dark:hover:bg-slate-900/60 transition-colors font-semibold text-base font-outfit"
        >
          <div className="flex items-center space-x-3">
            <Palette className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Colors &amp; Gradients</span>
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${activePanel === 'colors' ? 'rotate-180' : ''}`} />
        </button>

        {activePanel === 'colors' && (
          <div className="px-6 py-5 bg-white/20 dark:bg-slate-900/20 border-t border-slate-200/40 dark:border-slate-850 space-y-6">
            {/* Background Color */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">QR Background</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={design.backgroundColor}
                    onChange={(e) => onDesignChange({ backgroundColor: e.target.value })}
                    className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer overflow-hidden"
                  />
                  <input
                    type="text"
                    value={design.backgroundColor.toUpperCase()}
                    onChange={(e) => onDesignChange({ backgroundColor: e.target.value })}
                    placeholder="#FFFFFF"
                    className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Solid QR Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={design.foregroundColor}
                    disabled={design.gradient.enabled}
                    onChange={(e) => onDesignChange({ foregroundColor: e.target.value })}
                    className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer disabled:opacity-40"
                  />
                  <input
                    type="text"
                    value={design.foregroundColor.toUpperCase()}
                    disabled={design.gradient.enabled}
                    onChange={(e) => onDesignChange({ foregroundColor: e.target.value })}
                    placeholder="#0F172A"
                    className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono text-center disabled:opacity-40"
                  />
                </div>
              </div>
            </div>

            {/* Custom Background Image Uploader */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-850 space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 font-outfit">QR Background Image</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Overlay QR dots on top of a custom image (e.g. tiger, patterns)</p>
              </div>

              {!design.backgroundImage ? (
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center hover:border-slate-350 dark:hover:border-slate-700 transition-colors relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBgUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-6 h-6 text-slate-400 mx-auto group-hover:scale-105 transition-transform duration-350" />
                  <p className="text-xs font-bold text-slate-650 dark:text-slate-300 mt-1 font-outfit">Upload Background Image</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">PNG, JPG (QR background will automatically set to transparent)</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 p-1 rounded flex items-center justify-center">
                        <img src={design.backgroundImage} alt="Background preview" className="max-w-full max-h-full object-contain rounded" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 font-outfit">Background Active</p>
                        <p className="text-[9px] text-slate-400">QR container transparent</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeBgImage}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Opacity slider */}
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-1">
                      <span>Image Opacity</span>
                      <span>{Math.round((design.backgroundOpacity ?? 1) * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.10"
                      max="1.0"
                      step="0.05"
                      value={design.backgroundOpacity ?? 1}
                      onChange={(e) => onDesignChange({ backgroundOpacity: parseFloat(e.target.value) })}
                      className="w-full accent-blue-600"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Gradient Options */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-850 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-350">Gradient Foreground</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Blend color patterns beautifully</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={design.gradient.enabled}
                    onChange={(e) => onDesignChange({ gradient: { ...design.gradient, enabled: e.target.checked } })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                </label>
              </div>

              {design.gradient.enabled && (
                <div className="space-y-4 pt-2 border-t border-slate-200/30 dark:border-slate-850">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Start Color</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={design.gradient.startColor}
                          onChange={(e) => onDesignChange({ gradient: { ...design.gradient, startColor: e.target.value } })}
                          className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={design.gradient.startColor.toUpperCase()}
                          onChange={(e) => onDesignChange({ gradient: { ...design.gradient, startColor: e.target.value } })}
                          className="w-20 px-2 py-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-center rounded"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">End Color</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={design.gradient.endColor}
                          onChange={(e) => onDesignChange({ gradient: { ...design.gradient, endColor: e.target.value } })}
                          className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={design.gradient.endColor.toUpperCase()}
                          onChange={(e) => onDesignChange({ gradient: { ...design.gradient, endColor: e.target.value } })}
                          className="w-20 px-2 py-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-center rounded"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Gradient Type</label>
                      <select
                        value={design.gradient.type}
                        onChange={(e) => onDesignChange({ gradient: { ...design.gradient, type: e.target.value as 'linear' | 'radial' } })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
                      >
                        <option value="linear">Linear</option>
                        <option value="radial">Radial</option>
                      </select>
                    </div>
                    {design.gradient.type === 'linear' && (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                          Angle: {design.gradient.direction}°
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={design.gradient.direction}
                          onChange={(e) => onDesignChange({ gradient: { ...design.gradient, direction: parseInt(e.target.value) } })}
                          className="w-full accent-blue-600"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Individual Eye Colors */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-850 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-350">Individual Eye Colors</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Style outer and inner eyes separately</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={design.eyeColor.individual}
                    onChange={(e) => onDesignChange({ eyeColor: { ...design.eyeColor, individual: e.target.checked } })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                </label>
              </div>

              {design.eyeColor.individual ? (
                <div className="space-y-4 pt-2 border-t border-slate-200/30 dark:border-slate-850">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Outer Eye Color</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={design.eyeColor.outer}
                          onChange={(e) => onDesignChange({ eyeColor: { ...design.eyeColor, outer: e.target.value } })}
                          className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={design.eyeColor.outer.toUpperCase()}
                          onChange={(e) => onDesignChange({ eyeColor: { ...design.eyeColor, outer: e.target.value } })}
                          className="w-20 px-2 py-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-center rounded"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Inner Eye Color</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={design.eyeColor.inner}
                          onChange={(e) => onDesignChange({ eyeColor: { ...design.eyeColor, inner: e.target.value } })}
                          className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={design.eyeColor.inner.toUpperCase()}
                          onChange={(e) => onDesignChange({ eyeColor: { ...design.eyeColor, inner: e.target.value } })}
                          className="w-20 px-2 py-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-center rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-[10px] text-slate-400">
                  When disabled, eyes will inherit the main QR foreground colors.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4. LOGO UPLOADER */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => togglePanel('logo')}
          className="w-full flex items-center justify-between px-6 py-5 bg-white/40 dark:bg-slate-900/40 text-slate-800 dark:text-white hover:bg-white/60 dark:hover:bg-slate-900/60 transition-colors font-semibold text-base font-outfit"
        >
          <div className="flex items-center space-x-3">
            <ImageIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Logo Overlay</span>
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${activePanel === 'logo' ? 'rotate-180' : ''}`} />
        </button>

        {activePanel === 'logo' && (
          <div className="px-6 py-5 bg-white/20 dark:bg-slate-900/20 border-t border-slate-200/40 dark:border-slate-850 space-y-6">
            {/* Brand Logo Presets */}
            {!design.logo.source && (
              <div className="space-y-3">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Select Brand Preset</label>
                <div className="grid grid-cols-5 gap-2.5">
                  {presetLogos.map((preset) => (
                    <button
                      type="button"
                      key={preset.name}
                      onClick={() => {
                        onDesignChange({
                          logo: {
                            ...design.logo,
                            source: preset.svg,
                            backgroundShape: preset.defaultShape,
                            backgroundColor: preset.defaultBg,
                            opacity: 1,
                            padding: 6
                          }
                        });
                      }}
                      className="flex flex-col items-center justify-center p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-white dark:bg-slate-950 transition-all hover:scale-105 active:scale-[0.98] cursor-pointer"
                      title={preset.name}
                    >
                      <img src={preset.svg} alt={preset.name} className="w-6 h-6 object-contain" />
                      <span className="text-[8px] font-semibold text-slate-400 mt-1 truncate max-w-full">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Image Source Selection */}
            {!design.logo.source ? (
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center hover:border-slate-350 dark:hover:border-slate-700 transition-colors relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="w-8 h-8 text-slate-400 mx-auto group-hover:scale-105 transition-transform duration-350" />
                <p className="text-xs font-bold text-slate-650 dark:text-slate-300 mt-2 font-outfit">Or Upload Custom Logo</p>
                <p className="text-[10px] text-slate-400 mt-1">Supports PNG, JPG, SVG (Max 2MB)</p>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-250/20">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-lg flex items-center justify-center">
                    <img src={design.logo.source} alt="Logo preview" className="max-w-full max-h-full object-contain rounded" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Logo Uploaded</p>
                    <p className="text-[10px] text-slate-400 font-mono shrink-0">Compressed Client-side</p>
                  </div>
                </div>
                <button
                  onClick={removeLogo}
                  className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {design.logo.source && (
              <div className="space-y-4">
                {/* Logo Size */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-1">
                    <span>Logo Size</span>
                    <span>{Math.round(design.logo.size * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.10"
                    max="0.26"
                    step="0.01"
                    value={design.logo.size}
                    onChange={(e) => onDesignChange({ logo: { ...design.logo, size: parseFloat(e.target.value) } })}
                    className="w-full accent-blue-600"
                  />
                  <p className="text-[9px] text-slate-400 mt-0.5">Maximum size restricted to 26% of grid to ensure error-correction integrity.</p>
                </div>

                {/* Hide Background Dots Toggle */}
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="logo-hide-dots"
                    checked={design.logo.hideBackgroundDots ?? true}
                    onChange={(e) => onDesignChange({ logo: { ...design.logo, hideBackgroundDots: e.target.checked } })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-200 dark:border-slate-800"
                  />
                  <label htmlFor="logo-hide-dots" className="text-xs font-semibold text-slate-650 dark:text-slate-350 cursor-pointer">
                    Hide QR dots behind logo
                  </label>
                </div>

                {/* Logo Padding & Shape */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Backing Shape</label>
                    <select
                      value={design.logo.backgroundShape}
                      onChange={(e) => onDesignChange({ logo: { ...design.logo, backgroundShape: e.target.value as 'circle' | 'square' | 'none' } })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
                    >
                      <option value="circle">Circle Padding</option>
                      <option value="square">Square Padding</option>
                      <option value="none">No Padding</option>
                    </select>
                  </div>

                  {design.logo.backgroundShape !== 'none' && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Backing Color</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={design.logo.backgroundColor}
                          onChange={(e) => onDesignChange({ logo: { ...design.logo, backgroundColor: e.target.value } })}
                          className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={design.logo.backgroundColor.toUpperCase()}
                          onChange={(e) => onDesignChange({ logo: { ...design.logo, backgroundColor: e.target.value } })}
                          className="w-16 px-1 py-1 text-center rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[10px]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. FRAMES & LABELS */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => togglePanel('frame')}
          className="w-full flex items-center justify-between px-6 py-5 bg-white/40 dark:bg-slate-900/40 text-slate-800 dark:text-white hover:bg-white/60 dark:hover:bg-slate-900/60 transition-colors font-semibold text-base font-outfit"
        >
          <div className="flex items-center space-x-3">
            <Sliders className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Frame &amp; Brand Text</span>
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${activePanel === 'frame' ? 'rotate-180' : ''}`} />
        </button>

        {activePanel === 'frame' && (
          <div className="px-6 py-5 bg-white/20 dark:bg-slate-900/20 border-t border-slate-200/40 dark:border-slate-850 space-y-6">
            {/* Frame Styles */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Frame Layout</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {([
                  { id: 'none', label: 'No Frame' },
                  { id: 'clay-3d', label: '3D Pillow Card' },
                  { id: 'border', label: 'Simple Border' },
                  { id: 'rounded', label: 'Rounded Border' },
                  { id: 'bottom-label', label: 'Bottom Label' },
                  { id: 'scan-me', label: 'Bubble Label' },
                  { id: 'badge', label: 'Full Card' }
                ] as const).map((frm) => (
                  <button
                    key={frm.id}
                    onClick={() => onDesignChange({ frame: { ...design.frame, style: frm.id } })}
                    className={`py-3 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                      design.frame.style === frm.id
                        ? 'border-blue-600 bg-blue-50/40 text-blue-600 dark:border-blue-500 dark:bg-blue-950/20 dark:text-blue-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-650 hover:bg-slate-50 dark:hover:bg-slate-850 dark:text-slate-400'
                    }`}
                  >
                    {frm.label}
                  </button>
                ))}
              </div>
            </div>

            {design.frame.style !== 'none' && (
              <div className="space-y-4 pt-4 border-t border-slate-200/30 dark:border-slate-850">
                {/* Frame Colors */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Frame Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={design.frame.color}
                        onChange={(e) => onDesignChange({ frame: { ...design.frame, color: e.target.value } })}
                        className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={design.frame.color.toUpperCase()}
                        onChange={(e) => onDesignChange({ frame: { ...design.frame, color: e.target.value } })}
                        className="w-20 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-center font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Label Text Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={design.frame.textColor}
                        onChange={(e) => onDesignChange({ frame: { ...design.frame, textColor: e.target.value } })}
                        className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={design.frame.textColor.toUpperCase()}
                        onChange={(e) => onDesignChange({ frame: { ...design.frame, textColor: e.target.value } })}
                        className="w-20 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-center font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Frame CTA Text */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Frame CTA Label</label>
                  <input
                    type="text"
                    maxLength={18}
                    value={design.frame.text}
                    onChange={(e) => onDesignChange({ frame: { ...design.frame, text: e.target.value } })}
                    placeholder="SCAN ME"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Custom Brand Header Text (For Full Badge style) */}
                {design.frame.style === 'badge' && (
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/50 dark:border-slate-850 space-y-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-650 dark:text-slate-300">Card Header Branding</h5>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Main Title</label>
                      <input
                        type="text"
                        maxLength={22}
                        value={design.text.title}
                        onChange={(e) => onDesignChange({ text: { ...design.text, title: e.target.value } })}
                        placeholder="SCAN TO CONNECT"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Subtitle / CTA Help</label>
                      <input
                        type="text"
                        maxLength={40}
                        value={design.text.subtitle}
                        onChange={(e) => onDesignChange({ text: { ...design.text, subtitle: e.target.value } })}
                        placeholder="Scan with camera app"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Font Style</label>
                        <select
                          value={design.text.font}
                          onChange={(e) => onDesignChange({ text: { ...design.text, font: e.target.value } })}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
                        >
                          <option value="outfit">Outfit (Modern)</option>
                          <option value="inter">Inter (Clean)</option>
                          <option value="playfair">Playfair (Premium)</option>
                          <option value="mono">Fira Code (Code)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Title Color</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={design.text.color}
                            onChange={(e) => onDesignChange({ text: { ...design.text, color: e.target.value } })}
                            className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={design.text.color.toUpperCase()}
                            onChange={(e) => onDesignChange({ text: { ...design.text, color: e.target.value } })}
                            className="w-16 px-1.5 py-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[10px]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Main Title Styling */}
                    <div className="grid grid-cols-2 gap-4 border-t border-slate-200/40 dark:border-slate-800/40 pt-4">
                      <div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-1">
                          <span>Title Size</span>
                          <span>{design.text.size}px</span>
                        </div>
                        <input
                          type="range"
                          min="40"
                          max="80"
                          value={design.text.size}
                          onChange={(e) => onDesignChange({ text: { ...design.text, size: parseInt(e.target.value) } })}
                          className="w-full accent-blue-600"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-1">
                          <span>Title Spacing</span>
                          <span>{design.text.spacing}px</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="8"
                          step="0.5"
                          value={design.text.spacing}
                          onChange={(e) => onDesignChange({ text: { ...design.text, spacing: parseFloat(e.target.value) } })}
                          className="w-full accent-blue-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Title Weight</label>
                        <select
                          value={design.text.weight}
                          onChange={(e) => onDesignChange({ text: { ...design.text, weight: e.target.value as any } })}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
                        >
                          <option value="bold">Bold</option>
                          <option value="medium">Medium</option>
                          <option value="normal">Regular</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Text Alignment</label>
                        <div className="flex bg-slate-105 dark:bg-slate-950 p-1 rounded-lg border border-slate-250/20 w-fit">
                          {([
                            { id: 'left', icon: AlignLeft },
                            { id: 'center', icon: AlignCenter },
                            { id: 'right', icon: AlignRight }
                          ] as const).map((align) => {
                            const Icon = align.icon;
                            const isSel = design.text.alignment === align.id;
                            return (
                              <button
                                type="button"
                                key={align.id}
                                onClick={() => onDesignChange({ text: { ...design.text, alignment: align.id } })}
                                className={`p-1.5 rounded-md transition-colors ${
                                  isSel
                                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-350'
                                }`}
                              >
                                <Icon className="w-3.5 h-3.5" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Subtitle Styling */}
                    <div className="grid grid-cols-2 gap-4 border-t border-slate-200/40 dark:border-slate-800/40 pt-4">
                      <div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-1">
                          <span>Subtitle Size</span>
                          <span>{design.text.subtitleSize}px</span>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="50"
                          value={design.text.subtitleSize}
                          onChange={(e) => onDesignChange({ text: { ...design.text, subtitleSize: parseInt(e.target.value) } })}
                          className="w-full accent-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Subtitle Weight</label>
                        <select
                          value={design.text.subtitleWeight}
                          onChange={(e) => onDesignChange({ text: { ...design.text, subtitleWeight: e.target.value as any } })}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
                        >
                          <option value="bold">Bold</option>
                          <option value="medium">Medium</option>
                          <option value="normal">Regular</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Subtitle Color</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={design.text.subtitleColor}
                            onChange={(e) => onDesignChange({ text: { ...design.text, subtitleColor: e.target.value } })}
                            className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={design.text.subtitleColor.toUpperCase()}
                            onChange={(e) => onDesignChange({ text: { ...design.text, subtitleColor: e.target.value } })}
                            className="w-16 px-1.5 py-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[10px]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
