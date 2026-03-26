import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, message, type = 'info', confirmText = 'OK', onConfirm }) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle2 className="text-emerald-500" size={48} />,
          button: 'bg-emerald-500 hover:bg-emerald-600',
          bg: 'bg-emerald-50'
        };
      case 'error':
        return {
          icon: <AlertCircle className="text-red-500" size={48} />,
          button: 'bg-red-500 hover:bg-red-600',
          bg: 'bg-red-50'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="text-amber-500" size={48} />,
          button: 'bg-amber-500 hover:bg-amber-600',
          bg: 'bg-amber-50'
        };
      default:
        return {
          icon: <Info className="text-blue-500" size={48} />,
          button: 'bg-ink hover:bg-ink/80',
          bg: 'bg-blue-50'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm bg-white shadow-2xl overflow-hidden"
          >
            <div className={`h-2 ${styles.button}`} />
            
            <div className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
                >
                  {styles.icon}
                </motion.div>
              </div>
              
              <h3 className="text-2xl font-light mb-2">{title}</h3>
              <p className="text-sm text-ink/60 font-sans mb-8 leading-relaxed">
                {message}
              </p>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    if (onConfirm) onConfirm();
                    onClose();
                  }}
                  className={`w-full py-4 text-white text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 ${styles.button}`}
                >
                  {confirmText}
                </button>
                
                {onConfirm && (
                  <button
                    onClick={onClose}
                    className="w-full py-4 text-ink/40 text-[10px] uppercase tracking-[0.2em] font-bold hover:text-ink transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-ink/20 hover:text-ink transition-colors"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
