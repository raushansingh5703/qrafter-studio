import { Metadata } from 'next';
import MainGenerator from '@/components/MainGenerator';

export const metadata: Metadata = {
  title: 'Custom QR Code Generator with Logo & 3D Frames | Qrafter Studio',
  description: 'Create custom branded QR codes with logo, eye shapes, custom patterns, color gradients, and 3D claymorphic card frames. Download print-ready high-resolution SVG, PNG, and WEBP.',
  alternates: {
    canonical: '/',
  },
};

export default function HomeRoute() {
  return <MainGenerator initialType="website" />;
}
