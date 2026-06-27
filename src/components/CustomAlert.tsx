import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export type AlertType = 'success' | 'error' | 'info' | 'confirm';

export interface AlertState {
  isOpen: boolean;
  type: AlertType;
  title: string;
  message: string;
  onConfirm?: () => void;
}

interface CustomAlertProps extends AlertState {
  onClose: () => void;
}

export default function CustomAlert({ isOpen, type, title, message, onConfirm, onClose }: CustomAlertProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="text-emerald-400 w-8 h-8" />;
      case 'error': return <AlertCircle className="text-red-400 w-8 h-8" />;
      case 'confirm': return <Info className="text-blue-400 w-8 h-8" />;
      default: return <Info className="text-cyan-400 w-8 h-8" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success': return 'border-emerald-500/30';
      case 'error': return 'border-red-500/30';
      case 'confirm': return 'border-blue-500/30';
      default: return 'border-cyan-500/30';
    }
  };

  const getBgGlow = () => {
    switch (type) {
      case 'success': return 'shadow-[0_0_30px_rgba(16,185,129,0.15)]';
      case 'error': return 'shadow-[0_0_30px_rgba(239,68,68,0.15)]';
      case 'confirm': return 'shadow-[0_0_30px_rgba(59,130,246,0.15)]';
      default: return 'shadow-[0_0_30px_rgba(6,182,212,0.15)]';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`bg-[#0a0a0a] border ${getBorderColor()} rounded-2xl p-6 max-w-sm w-full relative flex flex-col items-center text-center ${getBgGlow()} animate-in zoom-in-95 duration-200`}
      >
        {type !== 'confirm' && (
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        )}
        
        <div className="mb-4">
          {getIcon()}
        </div>
        
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-400 mb-6">{message}</p>
        
        <div className="flex gap-3 w-full">
          {type === 'confirm' ? (
            <>
              <button 
                onClick={onClose}
                className="flex-1 py-2 rounded-xl text-sm font-bold border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (onConfirm) onConfirm();
                  onClose();
                }}
                className="flex-1 py-2 rounded-xl text-sm font-bold bg-blue-500/20 border border-blue-500/50 text-blue-300 hover:bg-blue-500/30 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]"
              >
                Confirm
              </button>
            </>
          ) : (
            <button 
              onClick={onClose}
              className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all border ${
                type === 'error' 
                  ? 'bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                  : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
              }`}
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
