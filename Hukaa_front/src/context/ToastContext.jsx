import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const [confirmDialog, setConfirmDialog] = useState(null);

    const showToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, duration);
    }, []);

    const showConfirm = useCallback((title, message, onConfirm, onCancel) => {
        setConfirmDialog({ title, message, onConfirm, onCancel });
    }, []);

    const closeConfirm = useCallback(() => {
        setConfirmDialog(null);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, showConfirm, closeConfirm }}>
            {children}
            <ToastContainer toasts={toasts} confirmDialog={confirmDialog} closeConfirm={closeConfirm} />
        </ToastContext.Provider>
    );
};

// Component to render toasts and confirm dialog
const ToastContainer = ({ toasts, confirmDialog, closeConfirm }) => {
    return (
        <>
            {/* Toasts */}
            <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`min-w-[300px] p-4 rounded-2xl shadow-xl flex items-center space-x-3 animate-fade-in-right ${toast.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' :
                            toast.type === 'info' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                'bg-green-50 text-green-600 border border-green-100'
                            }`}
                    >
                        <i className={`text-xl ${toast.type === 'error' ? 'ri-error-warning-fill' :
                            toast.type === 'info' ? 'ri-information-fill' :
                                'ri-checkbox-circle-fill'
                            }`}></i>
                        <p className="font-bold text-[14px]">{toast.message}</p>
                    </div>
                ))}
            </div>

            {/* Confirmation Dialog */}
            {confirmDialog && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
                        onClick={closeConfirm}
                    ></div>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm relative overflow-hidden animate-zoom-in p-8 text-center">
                        <div className="w-16 h-16 bg-main/10 rounded-full flex items-center justify-center mx-auto mb-6 text-main">
                            <i className="ri-question-line text-4xl"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{confirmDialog.title}</h3>
                        <p className="text-gray-500 mb-8">{confirmDialog.message}</p>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => {
                                    if (confirmDialog.onCancel) confirmDialog.onCancel();
                                    closeConfirm();
                                }}
                                className="flex-1 py-3 font-bold text-gray-400 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all border border-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    confirmDialog.onConfirm();
                                    closeConfirm();
                                }}
                                className="flex-1 py-3 font-bold text-white bg-main rounded-2xl hover:shadow-lg hover:shadow-main/30 transition-all"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
