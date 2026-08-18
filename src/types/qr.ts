export type QRType =
  | 'website'
  | 'google-review'
  | 'upi'
  | 'whatsapp'
  | 'maps'
  | 'menu'
  | 'vcard'
  | 'phone'
  | 'email'
  | 'social'
  | 'feedback'
  | 'coupon'
  | 'app';

export interface UPIFields {
  payeeVpa: string;
  payeeName: string;
  amount: string;
  transactionNote: string;
}

export interface VCardFields {
  firstName: string;
  lastName: string;
  organization: string;
  title: string;
  phoneMobile: string;
  phoneWork: string;
  email: string;
  url: string;
  address: string;
}

export interface EmailFields {
  emailAddress: string;
  subject: string;
  body: string;
}

export interface WhatsAppFields {
  phoneNumber: string;
  prefilledText: string;
}

export interface MapsFields {
  latitude: string;
  longitude: string;
  searchPlace: string;
}

export interface CouponFields {
  couponCode: string;
  offerDetails: string;
  expiryDate: string;
}

export interface AppFields {
  playStoreUrl: string;
  appStoreUrl: string;
}

export interface QRDetails {
  website: { url: string };
  'google-review': { reviewUrl: string; businessName: string };
  upi: UPIFields;
  whatsapp: WhatsAppFields;
  maps: MapsFields;
  menu: { menuUrl: string };
  vcard: VCardFields;
  phone: { phoneNumber: string };
  email: EmailFields;
  social: { url: string; platform: string };
  feedback: { feedbackUrl: string; title: string };
  coupon: CouponFields;
  app: AppFields;
}

export interface QRDesign {
  type: QRType;
  pattern: 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
  eyeStyle: 'square' | 'rounded' | 'dot' | 'extra-rounded';
  foregroundColor: string;
  backgroundColor: string;
  gradient: {
    enabled: boolean;
    startColor: string;
    endColor: string;
    direction: number; // in degrees
    type: 'linear' | 'radial';
  };
  eyeColor: {
    individual: boolean;
    outer: string;
    inner: string;
    topLeftOuter?: string;
    topLeftInner?: string;
    topRightOuter?: string;
    topRightInner?: string;
    bottomLeftOuter?: string;
    bottomLeftInner?: string;
  };
  logo: {
    source: string; // Base64 data URI or public url
    size: number; // 0.1 to 0.35 (to prevent covering too much)
    padding: number; // in pixels
    backgroundShape: 'circle' | 'square' | 'none';
    backgroundColor: string;
    opacity: number; // 0 to 1
  };
  frame: {
    style: 'none' | 'border' | 'rounded' | 'modern' | 'badge' | 'scan-me' | 'bottom-label';
    text: string;
    color: string;
    textColor: string;
  };
  text: {
    title: string;
    subtitle: string;
    font: string; // 'inter' | 'outfit' | 'playfair' | 'mono'
    size: number; // title font size
    color: string; // title color
    spacing: number; // title letter spacing
    weight: 'normal' | 'medium' | 'bold'; // title font weight
    alignment: 'center' | 'left' | 'right';
    subtitleSize: number; // subtitle font size
    subtitleColor: string; // subtitle color
    subtitleWeight: 'normal' | 'medium' | 'bold'; // subtitle font weight
  };
}

export const defaultDetails: QRDetails = {
  website: { url: 'https://example.com' },
  'google-review': { reviewUrl: 'https://g.page/r/example/review', businessName: 'Our Business' },
  upi: { payeeVpa: 'payee@upi', payeeName: 'John Doe', amount: '', transactionNote: 'Payment for services' },
  whatsapp: { phoneNumber: '+919876543210', prefilledText: 'Hello, I want to inquire about...' },
  maps: { latitude: '12.9716', longitude: '77.5946', searchPlace: 'Bengaluru, India' },
  menu: { menuUrl: 'https://example.com/menu.pdf' },
  vcard: {
    firstName: 'John',
    lastName: 'Doe',
    organization: 'Acme Corp',
    title: 'Founder',
    phoneMobile: '+919876543210',
    phoneWork: '+91234567890',
    email: 'john.doe@example.com',
    url: 'https://acme.com',
    address: '123 Tech Park, Silicon Valley, CA'
  },
  phone: { phoneNumber: '+919876543210' },
  email: { emailAddress: 'info@example.com', subject: 'Inquiry', body: 'Hello, I have a question regarding...' },
  social: { url: 'https://instagram.com/mybusiness', platform: 'instagram' },
  feedback: { feedbackUrl: 'https://example.com/feedback', title: 'Share Feedback' },
  coupon: { couponCode: 'SAVE20', offerDetails: 'Get 20% off on your first purchase!', expiryDate: '' },
  app: { playStoreUrl: 'https://play.google.com/store', appStoreUrl: 'https://apps.apple.com' }
};

export const defaultDesign: QRDesign = {
  type: 'website',
  pattern: 'square',
  eyeStyle: 'square',
  foregroundColor: '#0f172a', // Slate 900
  backgroundColor: '#ffffff',
  gradient: {
    enabled: false,
    startColor: '#2563eb', // Blue 600
    endColor: '#7c3aed', // Violet 600
    direction: 45,
    type: 'linear'
  },
  eyeColor: {
    individual: false,
    outer: '#0f172a',
    inner: '#0f172a'
  },
  logo: {
    source: '',
    size: 0.22,
    padding: 6,
    backgroundShape: 'circle',
    backgroundColor: '#ffffff',
    opacity: 1
  },
  frame: {
    style: 'none',
    text: 'SCAN ME',
    color: '#0f172a',
    textColor: '#ffffff'
  },
  text: {
    title: 'SCAN TO CONNECT',
    subtitle: 'Scan with your smartphone camera',
    font: 'outfit',
    size: 64,
    color: '#0f172a',
    spacing: 1,
    weight: 'bold',
    alignment: 'center',
    subtitleSize: 34,
    subtitleColor: '#475569',
    subtitleWeight: 'medium'
  }
};
