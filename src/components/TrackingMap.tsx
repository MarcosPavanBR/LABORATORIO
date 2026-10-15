import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Store } from 'lucide-react';

interface TrackingMapProps {
  status: string;
  estimatedTime?: number;
}

export const TrackingMap: React.FC<TrackingMapProps> = ({ status, estimatedTime }) => {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-green-50 to-blue-50 rounded-2xl h-56 overflow-hidden border border-blue-100">
      {/* Animated background pattern */}
      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-20" viewBox="0 0 400 250">
          {/* Roads */}
          <path d="M0 125 Q100 100 200 125 T400 125" stroke="#3498DB" strokeWidth="3" fill="none" strokeDasharray="5,5" />
          <path d="M50 0 Q100 80 150 160 T250 250" stroke="#3498DB" strokeWidth="2" fill="none" strokeDasharray="3,3" />
          <path d="M350 0 Q300 80 250 160 T150 250" stroke="#3498DB" strokeWidth="2" fill="none" strokeDasharray="3,3" />
          {/* Buildings */}
          <rect x="80" y="60" width="20" height="20" fill="#E2E2EA" rx="2" />
          <rect x="120" y="150" width="15" height="15" fill="#E2E2EA" rx="2" />
          <rect x="280" y="80" width="18" height="18" fill="#E2E2EA" rx="2" />
          <rect x="320" y="160" width="16" height="16" fill="#E2E2EA" rx="2" />
          <rect x="200" y="40" width="22" height="22" fill="#E2E2EA" rx="2" />
          {/* Parks */}
          <circle cx="180" cy="200" r="12" fill="#58D68D" opacity="0.3" />
          <circle cx="300" cy="50" r="10" fill="#58D68D" opacity="0.3" />
        </svg>
      </div>

      {/* Route line */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 250">
        <motion.path
          d="M80 180 Q150 140 200 125 T320 70"
          stroke="#FF6B35"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: status === 'delivering' ? 0.6 : status === 'ready' ? 0.3 : 0.9 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </svg>

      {/* Restaurant marker */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute"
        style={{ left: '15%', top: '65%' }}
      >
        <div className="relative">
          <div className="w-10 h-10 bg-flash-orange rounded-full flex items-center justify-center shadow-lg">
            <Store size={16} className="text-white" />
          </div>
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded text-[9px] font-semibold whitespace-nowrap shadow-sm">
            Restaurante
          </div>
        </div>
      </motion.div>

      {/* Delivery person marker */}
      <motion.div
        animate={{
          left: status === 'delivering' ? '55%' : status === 'ready' ? '25%' : '75%',
          top: status === 'delivering' ? '40%' : status === 'ready' ? '55%' : '30%',
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute"
      >
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12 bg-flash-orange/20 rounded-full absolute -inset-1"
          />
          <div className="w-10 h-10 bg-flash-orange rounded-full flex items-center justify-center shadow-lg relative z-10">
            <Navigation size={16} className="text-white" />
          </div>
        </div>
      </motion.div>

      {/* Customer marker */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute"
        style={{ right: '15%', top: '20%' }}
      >
        <div className="relative">
          <div className="w-10 h-10 bg-flash-green rounded-full flex items-center justify-center shadow-lg">
            <MapPin size={16} className="text-white" />
          </div>
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded text-[9px] font-semibold whitespace-nowrap shadow-sm">
            Você
          </div>
        </div>
      </motion.div>

      {/* Time badge */}
      {estimatedTime && (
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm">
          <p className="text-xs font-bold text-flash-gray-900">{estimatedTime} min</p>
        </div>
      )}
    </div>
  );
};
