"use client";

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LandingHero from '@/components/LandingHero';
import LiveActivity from '@/components/LiveActivity';
import QRTypeSelector from '@/components/QRTypeSelector';
import QRCustomizer from '@/components/QRCustomizer';
import QRPreview from '@/components/QRPreview';
import QRScannerModal from '@/components/QRScannerModal';
import PaymentModal from '@/components/PaymentModal';
import SuccessView from '@/components/SuccessView';
import { QRType, QRDesign, QRDetails, defaultDesign, defaultDetails } from '@/types/qr';

// Helper to escape special characters for WIFI SSID and Password
function escapeWifiString(str: string): string {
  return str.replace(/\\/g, '\\\\')
            .replace(/;/g, '\\;')
            .replace(/:/g, '\\:')
            .replace(/,/g, '\\,')
            .replace(/"/g, '\\"');
}

// Helper function to dynamically compile inputs into standard QR payload formats
function formatQRData(type: QRType, details: QRDetails): string {
  switch (type) {
    case 'website':
      return details.website.url || 'https://example.com';
    case 'text':
      return details.text.text || '';
    case 'wifi':
      const wifi = details.wifi;
      const ssid = escapeWifiString(wifi.ssid || '');
      const password = wifi.password ? escapeWifiString(wifi.password) : '';
      const encryption = wifi.encryption || 'nopass';
      const hidden = wifi.hidden ? 'true' : '';
      return `WIFI:S:${ssid};T:${encryption};P:${password};H:${hidden};;`;
    case 'google-review':
      return details['google-review'].reviewUrl || 'https://g.page/r/example/review';
    case 'upi':
      const upi = details.upi;
      const params = new URLSearchParams();
      if (upi.payeeVpa) params.set('pa', upi.payeeVpa);
      if (upi.payeeName) params.set('pn', upi.payeeName);
      if (upi.amount) params.set('am', upi.amount);
      if (upi.transactionNote) params.set('tn', upi.transactionNote);
      return `upi://pay?${params.toString()}`;
    case 'whatsapp':
      const wa = details.whatsapp;
      const phone = wa.phoneNumber.replace(/[^\d+]/g, '');
      return `https://wa.me/${phone}?text=${encodeURIComponent(wa.prefilledText)}`;
    case 'maps':
      const maps = details.maps;
      if (maps.latitude && maps.longitude) {
        return `https://www.google.com/maps/search/?api=1&query=${maps.latitude},${maps.longitude}`;
      }
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(maps.searchPlace)}`;
    case 'menu':
      return details.menu.menuUrl || 'https://example.com/menu';
    case 'vcard':
      const vc = details.vcard;
      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${vc.lastName};${vc.firstName};;;`,
        `FN:${vc.firstName} ${vc.lastName}`,
        `ORG:${vc.organization}`,
        `TITLE:${vc.title}`,
        `TEL;TYPE=CELL:${vc.phoneMobile}`,
        `TEL;TYPE=WORK:${vc.phoneWork}`,
        `EMAIL;TYPE=PREF,INTERNET:${vc.email}`,
        `URL:${vc.url}`,
        `ADR;TYPE=WORK:;;${vc.address};;;`,
        'END:VCARD'
      ].join('\n');
    case 'phone':
      return `tel:${details.phone.phoneNumber}`;
    case 'email':
      const em = details.email;
      const mailParams = new URLSearchParams();
      if (em.subject) mailParams.set('subject', em.subject);
      if (em.body) mailParams.set('body', em.body);
      return `mailto:${em.emailAddress}?${mailParams.toString().replace(/\+/g, '%20')}`;
    case 'social':
      return details.social.url || 'https://instagram.com/mybusiness';
    case 'feedback':
      return details.feedback.feedbackUrl || 'https://example.com/feedback';
    case 'coupon':
      const cp = details.coupon;
      return `Code: ${cp.couponCode} | Offer: ${cp.offerDetails} | Expiry: ${cp.expiryDate || 'N/A'}`;
    case 'app':
      return details.app.playStoreUrl || details.app.appStoreUrl || 'https://play.google.com';
    default:
      return 'https://example.com';
  }
}

export default function Home() {
  const [pageState, setPageState] = useState<'landing' | 'editor' | 'success'>('landing');
  const [selectedType, setSelectedType] = useState<QRType>('website');
  const [details, setDetails] = useState<QRDetails>(defaultDetails);
  const [design, setDesign] = useState<QRDesign>(defaultDesign);
  const [activeSvg, setActiveSvg] = useState<string>('');

  const [modalOpen, setModalOpen] = useState<'none' | 'scanner' | 'payment'>('none');

  // Trigger scroll to the editor layout
  const handleStartDesigning = () => {
    setPageState('editor');
    setTimeout(() => {
      document.getElementById('editor-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const handleDetailsChange = (updatedFields: Partial<QRDetails[QRType]>) => {
    setDetails((prev) => ({
      ...prev,
      [selectedType]: {
        ...prev[selectedType],
        ...updatedFields,
      },
    }));
  };

  const handleDesignChange = (updatedDesign: Partial<QRDesign>) => {
    setDesign((prev) => ({
      ...prev,
      ...updatedDesign,
    }));
  };

  const handleSelectType = (type: QRType) => {
    setSelectedType(type);
    setDesign((prev) => ({
      ...prev,
      type,
    }));
  };

  const handleDownloadTrigger = (svgContent: string) => {
    setActiveSvg(svgContent);
    setModalOpen('payment');
  };

  const handlePaymentSuccess = () => {
    setModalOpen('none');
    setPageState('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateAnother = () => {
    setDetails(defaultDetails);
    setDesign(defaultDesign);
    setSelectedType('website');
    setPageState('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Compile data payload to write into QR code
  const dataString = formatQRData(selectedType, details);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      <Header onCreateClick={handleStartDesigning} />

      <main className="flex-1">
        {pageState === 'landing' && (
          <div className="space-y-16">
            <LandingHero onStartClick={handleStartDesigning} />
            
            {/* Live activity and trust banners */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-8 space-y-6">
                  <h3 className="text-3xl font-extrabold font-outfit text-slate-800 dark:text-white leading-tight">
                    How it works
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-2xl">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-sm mb-3">1</div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Select QR Type</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">Choose from 13 custom presets tailored for Google reviews, UPI payments, maps, and contacts.</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-2xl">
                      <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-500 flex items-center justify-center font-bold text-sm mb-3">2</div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Personalize Graphics</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">Customize eye shapes, patterns, gradients, and upload your high-res logo seamlessly.</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-2xl">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-sm mb-3">3</div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Secure Download</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">Verify scan readability, pay ₹19 one-time securely to unlock lossless vector SVG, PNG & WEBP.</p>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-4 flex justify-center">
                  <LiveActivity />
                </div>
              </div>
            </div>
          </div>
        )}

        {pageState === 'editor' && (
          <div id="editor-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
            <QRTypeSelector selectedType={selectedType} onSelect={handleSelectType} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6 border-t border-slate-200/50 dark:border-slate-800/80">
              {/* Left Panel: Customizer Accordion */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold font-outfit text-slate-800 dark:text-white">
                      2. Design &amp; Customization
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Tailor pattern elements, background color, overlays, and visual labels in real time.
                    </p>
                  </div>
                </div>
                <QRCustomizer
                  selectedType={selectedType}
                  details={details}
                  design={design}
                  onDetailsChange={handleDetailsChange}
                  onDesignChange={handleDesignChange}
                />
              </div>

              {/* Right Panel: Sticky Live Preview */}
              <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold font-outfit text-slate-800 dark:text-white">
                    3. Live Preview
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Updates instantly. Scan preview to test with your phone.
                  </p>
                </div>
                <QRPreview
                  design={design}
                  details={details}
                  dataString={dataString}
                  onDownloadClick={handleDownloadTrigger}
                  onScannerOpen={() => setModalOpen('scanner')}
                />
              </div>
            </div>
          </div>
        )}

        {pageState === 'success' && (
          <SuccessView
            unifiedSvg={activeSvg}
            design={design}
            onCreateAnother={handleCreateAnother}
          />
        )}
      </main>

      <Footer />

      {/* MODALS */}
      {modalOpen === 'scanner' && (
        <QRScannerModal onClose={() => setModalOpen('none')} />
      )}

      {modalOpen === 'payment' && (
        <PaymentModal
          onClose={() => setModalOpen('none')}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
