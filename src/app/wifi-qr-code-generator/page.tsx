import { Metadata } from 'next';
import MainGenerator from '@/components/MainGenerator';

export const metadata: Metadata = {
  title: 'Free Wi-Fi QR Code Generator with Logo & Colors | Qrafter',
  description: 'Generate customized Wi-Fi QR codes with SSID, password, and security type. Add center logos, custom shapes, and gradients. Download high-resolution print vectors.',
  keywords: ['wifi qr code generator', 'share wifi qr code', 'wifi password qr maker', 'wifi qr print vector'],
  alternates: {
    canonical: '/wifi-qr-code-generator',
  },
};

export default function WifiLanding() {
  return <MainGenerator initialType="wifi" />;
}
