"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Eye, Download, Check } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: string;
  action: 'created' | 'customized' | 'downloaded';
  time: string;
  location: string;
}

const mockActivities: Omit<ActivityItem, 'id' | 'time'>[] = [
  { type: "Google Review QR", action: "created", location: "Mumbai, IN" },
  { type: "Digital Menu QR", action: "downloaded", location: "London, UK" },
  { type: "WhatsApp QR", action: "created", location: "Delhi, IN" },
  { type: "Payment QR", action: "downloaded", location: "Bengaluru, IN" },
  { type: "vCard Contact QR", action: "customized", location: "New York, US" },
  { type: "Maps Location QR", action: "created", location: "Berlin, DE" },
  { type: "Feedback QR", action: "customized", location: "Sydney, AU" },
  { type: "Website Link QR", action: "downloaded", location: "Paris, FR" },
  { type: "App Download QR", action: "downloaded", location: "Tokyo, JP" }
];

export default function LiveActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Generate initial set
    const initial = Array.from({ length: 4 }).map((_, i) => ({
      id: `init-${i}`,
      ...mockActivities[Math.floor(Math.random() * mockActivities.length)],
      time: `${i + 1}m ago`
    }));
    setActivities(initial);

    // Periodically add new item and remove oldest
    const interval = setInterval(() => {
      const baseItem = mockActivities[Math.floor(Math.random() * mockActivities.length)];
      const newItem: ActivityItem = {
        id: `act-${Date.now()}`,
        ...baseItem,
        time: "Just now"
      };

      setActivities((prev) => {
        // Update previous "just now" to "1m ago"
        const updated = prev.map((act) => ({
          ...act,
          time: act.time === "Just now" ? "1m ago" : act.time.includes("m") ? `${parseInt(act.time) + 1}m ago` : act.time
        }));
        return [newItem, ...updated.slice(0, 3)];
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const getActionIcon = (action: ActivityItem['action']) => {
    switch (action) {
      case 'created':
        return <Sparkles className="w-3.5 h-3.5 text-blue-500" />;
      case 'customized':
        return <Eye className="w-3.5 h-3.5 text-violet-500" />;
      case 'downloaded':
        return <Download className="w-3.5 h-3.5 text-emerald-500" />;
    }
  };

  const getActionText = (action: ActivityItem['action']) => {
    switch (action) {
      case 'created':
        return 'created a';
      case 'customized':
        return 'customized a';
      case 'downloaded':
        return 'downloaded an HD';
    }
  };

  return (
    <div className="border border-slate-200/50 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-sm max-w-sm w-full mx-auto lg:mx-0">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Live Activity Feed</h4>
        </div>
        <span className="text-[9px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-medium">SIMULATED</span>
      </div>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {activities.map((act) => (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, y: -15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex items-start space-x-3 text-xs bg-slate-50/70 dark:bg-slate-950/30 p-2.5 rounded-xl border border-slate-150/40 dark:border-slate-800/40"
            >
              <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-1.5 rounded-lg shrink-0 shadow-sm">
                {getActionIcon(act.action)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-600 dark:text-slate-350 truncate">
                  Someone in <span className="font-semibold text-slate-800 dark:text-white">{act.location}</span> {getActionText(act.action)} <span className="font-semibold text-blue-600 dark:text-blue-400">{act.type}</span>
                </p>
                <span className="text-[10px] text-slate-400">{act.time}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
