import { createContext, useContext, useState, ReactNode } from 'react';

export type DialogType = 'danger' | 'success' | 'info';

interface DialogOptions {
  open: boolean;
  title?: string;
  description?: string;
  type?: DialogType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface DialogContextType {
  showDialog: (options: Omit<DialogOptions, 'open'>) => void;
  hideDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const useDialog = () => {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('useDialog must be used within a DialogProvider');
  return ctx;
};

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [dialog, setDialog] = useState<DialogOptions>({ open: false });

  const showDialog = (options: Omit<DialogOptions, 'open'>) => {
    setDialog({ ...options, open: true });
  };

  const hideDialog = () => {
    setDialog({ open: false });
  };

  const handleConfirm = () => {
    dialog.onConfirm?.();
    hideDialog();
  };

  const handleCancel = () => {
    dialog.onCancel?.();
    hideDialog();
  };

  return (
    <DialogContext.Provider value={{ showDialog, hideDialog }}>
      {children}
      {/* Dialog visual */}
      {dialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-[90vw]">
            <div className="flex items-center mb-4">
              <span className="mr-3">
                {dialog.type === 'danger' && (
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#f87171"/><path d="M12 7v5m0 4h.01" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                )}
                {dialog.type === 'success' && (
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#4ade80"/><path d="M8 12l2.5 2.5L16 9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                )}
                {dialog.type === 'info' && (
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#60a5fa"/><path d="M12 8h.01M12 12v4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                )}
              </span>
              <span className="text-lg font-semibold">{dialog.title || '¿Está seguro?'}</span>
            </div>
            <div className="mb-6 text-gray-700">{dialog.description || ''}</div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                onClick={handleCancel}
              >
                {dialog.cancelText || 'Cancelar'}
              </button>
              <button
                className={`px-4 py-2 rounded text-white font-semibold ${dialog.type === 'danger' ? 'bg-red-600 hover:bg-red-700' : dialog.type === 'success' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                onClick={handleConfirm}
              >
                {dialog.confirmText || 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
};
