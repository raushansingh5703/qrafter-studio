export interface Bundle {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  previewVideo?: string;
  dashboardScreenshots?: string[];
  earningProofScreenshots?: string[];
  customerProofScreenshots?: string[];
  price: number;
  originalPrice: number;
  category: string;
  clipCount: string;
  resolution: string;
  fileSize: string;
  active: boolean;
  createdAt?: string;
}

export interface OrderInitResponse {
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
  isDemoMode?: boolean;
  bundleTitle: string;
}

export interface PaymentVerifyResponse {
  success: boolean;
  message?: string;
  sessionId: string;
  expiresAt: string;
  orderId: string;
}

export interface DownloadSessionData {
  valid: boolean;
  message?: string;
  error?: string;
  expired?: boolean;
  status: 'active' | 'in_progress' | 'completed' | 'expired';
  remainingSeconds: number;
  expiresAt: string;
  orderId: string;
  downloadCount: number;
  bundle: {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    previewVideo?: string;
    dashboardScreenshots?: string[];
    earningProofScreenshots?: string[];
    customerProofScreenshots?: string[];
    category: string;
    clipCount: string;
    resolution: string;
    fileSize: string;
  };
}
