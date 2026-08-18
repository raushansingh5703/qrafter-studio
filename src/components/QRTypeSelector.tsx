"use client";

import {
  Link2,
  Star,
  CreditCard,
  MessageCircle,
  MapPin,
  Utensils,
  User,
  Phone,
  Mail,
  Share2,
  ThumbsUp,
  Ticket,
  Download
} from 'lucide-react';
import { QRType } from '../types/qr';

interface QRTypeOption {
  id: QRType;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const qrTypesList: QRTypeOption[] = [
  { id: 'website', title: 'Website Link', description: 'Redirect users to your URL', icon: Link2, color: 'from-blue-500 to-cyan-500' },
  { id: 'google-review', title: 'Google Review', description: 'Collect 5-star customer reviews', icon: Star, color: 'from-amber-400 to-orange-500' },
  { id: 'upi', title: 'UPI / Payment', description: 'Receive instant direct bank transfer', icon: CreditCard, color: 'from-emerald-500 to-teal-600' },
  { id: 'whatsapp', title: 'WhatsApp', description: 'Start a pre-filled chat conversation', icon: MessageCircle, color: 'from-green-500 to-emerald-600' },
  { id: 'maps', title: 'Google Maps', description: 'Show business location coordinates', icon: MapPin, color: 'from-red-500 to-pink-500' },
  { id: 'menu', title: 'Digital Menu', description: 'Display restaurant menu or PDF', icon: Utensils, color: 'from-amber-500 to-yellow-600' },
  { id: 'vcard', title: 'Contact / vCard', description: 'Save contact card to phone book', icon: User, color: 'from-violet-500 to-purple-600' },
  { id: 'phone', title: 'Phone Call', description: 'Initiate a cell phone call dialer', icon: Phone, color: 'from-indigo-500 to-blue-600' },
  { id: 'email', title: 'Email Sender', description: 'Send pre-written email inquiries', icon: Mail, color: 'from-sky-500 to-blue-500' },
  { id: 'social', title: 'Social Media', description: 'Share Instagram, YouTube, Linktree', icon: Share2, color: 'from-pink-500 to-rose-600' },
  { id: 'feedback', title: 'Feedback Form', description: 'Gather dynamic ratings & feedback', icon: ThumbsUp, color: 'from-indigo-500 to-violet-600' },
  { id: 'coupon', title: 'Coupon / Offer', description: 'Promote promo code & discounts', icon: Ticket, color: 'from-rose-500 to-red-600' },
  { id: 'app', title: 'App Download', description: 'Direct links to App & Play Store', icon: Download, color: 'from-cyan-500 to-blue-600' }
];

interface QRTypeSelectorProps {
  selectedType: QRType;
  onSelect: (type: QRType) => void;
}

export default function QRTypeSelector({ selectedType, onSelect }: QRTypeSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center lg:text-left">
        <h3 className="text-2xl font-bold font-outfit text-slate-800 dark:text-white">
          1. Select QR Code Type
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Choose the starting layout. You can switch types at any time without losing style presets.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {qrTypesList.map((qr) => {
          const Icon = qr.icon;
          const isSelected = selectedType === qr.id;
          return (
            <button
              key={qr.id}
              onClick={() => onSelect(qr.id)}
              className={`text-left p-4 rounded-2xl border transition-all duration-300 relative group cursor-pointer flex flex-col justify-between h-[155px] ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-500 shadow-md shadow-blue-500/5'
                  : 'border-slate-200/70 dark:border-slate-800/80 bg-white hover:bg-slate-50/80 dark:bg-slate-900 dark:hover:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
              }`}
            >
              {/* Highlight indicator */}
              {isSelected && (
                <span className="absolute top-3 right-3 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 dark:bg-blue-450"></span>
                </span>
              )}

              {/* Icon */}
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${qr.color} text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300`}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Details */}
              <div className="mt-4">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 font-outfit">
                  {qr.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug line-clamp-2">
                  {qr.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
