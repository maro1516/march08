
import React from 'react';
import { ReservationItem } from '../types';
import { X, Calendar, Trash2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReservationBasketProps {
  isOpen: boolean;
  onClose: () => void;
  reservations: ReservationItem[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export const ReservationBasket: React.FC<ReservationBasketProps> = ({
  isOpen,
  onClose,
  reservations,
  onRemove,
  onClear
}) => {
  const total = reservations.reduce((sum, item) => sum + item.price, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
          >
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-marrakech rounded-xl flex items-center justify-center text-white">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-slate-900">Your Basket</h3>
                  <p className="text-xs text-slate-500">{reservations.length} items reserved</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {reservations.length > 0 ? (
                reservations.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                        <span className="font-bold text-slate-900 text-sm">${item.price}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-2">
                        <span className="uppercase tracking-wider font-bold text-marrakech">{item.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {item.date}
                        </span>
                      </div>
                      <button 
                        onClick={() => onRemove(item.id)}
                        className="text-[10px] font-bold text-slate-400 hover:text-marrakech flex items-center gap-1 transition-all"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Your basket is empty</p>
                    <p className="text-sm text-slate-500 mt-1">Start exploring destinations to add places to your roadmap.</p>
                  </div>
                </div>
              )}
            </div>

            {reservations.length > 0 && (
              <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Total Amount</span>
                  <span className="text-2xl font-serif font-bold text-slate-900">${total}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={onClear}
                    className="py-4 rounded-2xl font-bold text-sm text-slate-500 hover:bg-slate-200 transition-all"
                  >
                    Clear All
                  </button>
                  <button className="py-4 bg-gold text-white rounded-2xl font-bold text-sm shadow-lg shadow-gold/20 hover:bg-cedar transition-all">
                    Checkout Now
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
