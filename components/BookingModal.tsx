
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, CreditCard, CheckCircle, Loader2 } from 'lucide-react';
import { storageService } from '../services/storageService';
import { User as UserType } from '../types';

interface BookingModalProps {
  item: any;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ item, onClose }) => {
  const [step, setStep] = useState(1);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [formData, setFormData] = useState({ name: '', date: '', quantity: 1 });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const user = storageService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setFormData(prev => ({ ...prev, name: user.name }));
    }
  }, []);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1500));
    
    storageService.saveBooking({
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser?.id,
      type: 'bazaar',
      itemName: item.name,
      date: formData.date || new Date().toISOString(),
      amount: item.price * formData.quantity,
      status: 'confirmed',
      customerName: formData.name
    });
    
    setIsLoading(false);
    setStep(4);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 z-10">
          <X className="w-6 h-6" />
        </button>

        <div className="p-10">
          {/* Progress Bar */}
          <div className="flex gap-2 mb-10">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${step >= i ? 'bg-red-600' : 'bg-slate-100'}`} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-3xl font-serif font-bold mb-6">Reservation Details</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input 
                        type="date" 
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-red-500 outline-none" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Quantity</label>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setFormData({...formData, quantity: Math.max(1, formData.quantity - 1)})} className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-xl hover:bg-slate-200">-</button>
                      <span className="text-xl font-bold w-12 text-center">{formData.quantity}</span>
                      <button onClick={() => setFormData({...formData, quantity: formData.quantity + 1})} className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-xl hover:bg-slate-200">+</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-3xl font-serif font-bold mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input 
                        placeholder="Ahmed Al-Maghribi"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-red-500 outline-none" 
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex gap-4 text-orange-800 text-sm">
                    <span className="text-2xl">🍯</span>
                    <p>Your guide will contact you within 2 hours to confirm specific delivery or meeting arrangements.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-3xl font-serif font-bold mb-6">Payment</h3>
                <div className="space-y-6">
                  <div className="bg-slate-900 rounded-2xl p-6 text-white mb-6">
                    <div className="flex justify-between items-start mb-10">
                      <div className="text-xl font-serif">MOROCCO TRAVEL CARD</div>
                      <CreditCard className="w-8 h-8 opacity-50" />
                    </div>
                    <div className="text-lg tracking-widest mb-4">**** **** **** 4829</div>
                    <div className="flex justify-between text-xs opacity-60">
                      <span>CARD HOLDER</span>
                      <span>EXPIRES</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>{formData.name.toUpperCase() || 'YOUR NAME'}</span>
                      <span>12/28</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total Amount</span>
                    <span className="text-red-600">${item.price * formData.quantity}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <h3 className="text-4xl font-serif font-bold mb-4 text-slate-900">Mabrouk!</h3>
                <p className="text-slate-600 mb-10 max-w-sm mx-auto">Your booking for <b>{item.name}</b> has been successfully processed. Check your email for the official itinerary.</p>
                <button 
                  onClick={onClose}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors"
                >
                  Return to Dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {step < 4 && (
            <div className="flex gap-4 mt-12">
              {step > 1 && (
                <button onClick={handleBack} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold">Back</button>
              )}
              <button 
                onClick={step === 3 ? handleSubmit : handleNext}
                disabled={isLoading}
                className="flex-[2] py-4 bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-200 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (step === 3 ? 'Pay & Confirm' : 'Next Step')}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
