import { Metadata } from 'next';
import MainGenerator from '@/components/MainGenerator';

export const metadata: Metadata = {
  title: 'Free UPI Payment QR Code Generator with Logo | Qrafter',
  description: 'Create customizable UPI payment QR codes for Google Pay, PhonePe, Paytm, and BHIM. Set payee VPA, name, and billing amount. Export print-ready high-resolution bundles.',
  keywords: ['upi qr code generator', 'payment qr code creator', 'gpay qr generator', 'phonepe qr maker', 'bhim upi qr code'],
  alternates: {
    canonical: '/upi-qr-code-generator',
  },
};

export default function UpiLanding() {
  return <MainGenerator initialType="upi" />;
}
