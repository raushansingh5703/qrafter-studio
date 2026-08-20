import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Custom QR Code Generator with Logo & 3D Frames | Qrafter Studio",
  description: "Create custom branded QR codes with logo, eye shapes, custom patterns, color gradients, and 3D claymorphic card frames. Download print-ready high-resolution SVG, PNG, and WEBP.",
  keywords: [
    "custom qr code generator",
    "qr code generator with logo",
    "make qr code with logo",
    "3d qr code",
    "gradient qr code",
    "custom shape qr code",
    "high resolution qr code creator",
    "print quality qr code vector",
    "upi qr code generator",
    "wifi qr code generator",
    "vcard qr code creator"
  ],
  authors: [{ name: "Qrafter Studio" }],
  creator: "Qrafter Studio",
  publisher: "Qrafter Studio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Custom QR Code Generator with Logo & 3D Frames | Qrafter Studio",
    description: "Create custom branded QR codes with logo, eye shapes, custom patterns, color gradients, and 3D claymorphic card frames. Download print-ready high-resolution SVG, PNG, and WEBP.",
    url: "https://qrafter-studio.vercel.app",
    siteName: "Qrafter Studio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom QR Code Generator with Logo & 3D Frames | Qrafter Studio",
    description: "Create custom branded QR codes with logo, eye shapes, custom patterns, color gradients, and 3D claymorphic card frames. Download print-ready high-resolution SVG, PNG, and WEBP.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const schemaData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://qrafter-studio.vercel.app/#website",
      "name": "Qrafter Studio",
      "url": "https://qrafter-studio.vercel.app",
      "description": "Create custom branded QR codes with logo, eye shapes, custom patterns, color gradients, and 3D frames. Download print-ready high-resolution SVG, PNG, and WEBP.",
      "applicationCategory": "DesignApplication, BusinessApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "19.00",
        "priceCurrency": "INR"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://qrafter-studio.vercel.app/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How to make a custom QR code with a logo?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Choose your QR code data type (Website, Wi-Fi, UPI, etc.), insert your details, click the Logo section, and upload your PNG/JPG logo. You can adjust the size and toggle 'Hide background dots' to blend it perfectly."
          }
        },
        {
          "@type": "Question",
          "name": "What is the best format to print a QR code?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Vector SVG is the best format for high-quality printing. It can be scaled to any size without losing sharpness. High-resolution PNG and WEBP (300 DPI) are also available."
          }
        },
        {
          "@type": "Question",
          "name": "How do I make a 3D claymorphic QR code?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Under the Frame Layout settings, select the '3D Pillow Card' style. Customize your frame color to add a beautiful volumetric clay card look with glossy highlights and shadows."
          }
        }
      ]
    }
  ]
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased font-sans`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                } else {
                  document.documentElement.classList.add('light');
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950">{children}</body>
    </html>
  );
}
