import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';

const ToastContext = createContext({});

const ICONS = {
    success: FaCheckCircle,
    error: FaTimesCircle,
    info: FaInfoCircle,
    warning: FaExclamationTriangle,
};

const STYLES = {
    success: {
        bg: 'linear-gradient(135deg, #00B074 0%, #00D68F 100%)',
        icon: '#fff',
        shadow: 'rgba(0, 176, 116, 0.35)',
    },
    error: {
        bg: 'linear-gradient(135deg, #FF4757 0%, #FF6B81 100%)',
        icon: '#fff',
        shadow: 'rgba(255, 71, 87, 0.35)',
    },
    info: {
        bg: 'linear-gradient(135deg, #2D9CDB 0%, #56CCF2 100%)',
        icon: '#fff',
        shadow: 'rgba(45, 156, 219, 0.35)',
    },
    warning: {
        bg: 'linear-gradient(135deg, #F2994A 0%, #F2C94C 100%)',
        icon: '#fff',
        shadow: 'rgba(242, 153, 74, 0.35)',
    },
};

function Toast({ toast, onDismiss }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const style = STYLES[toast.type] || STYLES.info;
    const Icon = ICONS[toast.type] || ICONS.info;

    useEffect(() => {
        requestAnimationFrame(() => setIsVisible(true));

        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => onDismiss(toast.id), 400);
        }, toast.duration || 4000);

        return () => clearTimeout(timer);
    }, [toast.id, toast.duration, onDismiss]);

    const handleDismiss = () => {
        setIsExiting(true);
        setTimeout(() => onDismiss(toast.id), 400);
    };

    return (
        <div
            onClick={handleDismiss}
            style={{
                background: style.bg,
                boxShadow: `0 12px 40px ${style.shadow}, 0 4px 12px rgba(0,0,0,0.08)`,
                transform: isVisible && !isExiting ? 'translateY(0) scale(1)' : 'translateY(-20px) scale(0.95)',
                opacity: isVisible && !isExiting ? 1 : 0,
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                cursor: 'pointer',
                borderRadius: '20px',
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                minWidth: '320px',
                maxWidth: '480px',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Shimmer effect */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                    animation: isVisible ? 'shimmer 2s ease-in-out' : 'none',
                }}
            />

            {/* Icon with pulse */}
            <div
                style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '14px',
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    animation: isVisible ? 'pulse-icon 0.6s ease-out' : 'none',
                }}
            >
                <Icon style={{ color: style.icon, fontSize: '20px' }} />
            </div>

            {/* Text */}
            <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                {toast.title && (
                    <div
                        style={{
                            color: '#fff',
                            fontWeight: 800,
                            fontSize: '14px',
                            letterSpacing: '-0.01em',
                            marginBottom: '2px',
                        }}
                    >
                        {toast.title}
                    </div>
                )}
                <div
                    style={{
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: '13px',
                        fontWeight: 500,
                        lineHeight: '1.4',
                    }}
                >
                    {toast.message}
                </div>
            </div>

            {/* Progress bar */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    height: '3px',
                    background: 'rgba(255,255,255,0.4)',
                    borderRadius: '0 0 20px 20px',
                    animation: `progress ${(toast.duration || 4000) / 1000}s linear forwards`,
                }}
            />
        </div>
    );
}

// Success modal overlay (for big moments like checkout)
function SuccessModal({ config, onClose }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setIsVisible(true));
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose(), 350);
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isVisible ? 'rgba(0,0,0,0.5)' : 'transparent',
                backdropFilter: isVisible ? 'blur(6px)' : 'none',
                transition: 'all 0.35s ease',
                padding: '24px',
            }}
            onClick={handleClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: '#fff',
                    borderRadius: '28px',
                    padding: '48px 40px 36px',
                    maxWidth: '420px',
                    width: '100%',
                    textAlign: 'center',
                    transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(30px)',
                    opacity: isVisible ? 1 : 0,
                    transition: 'all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.04)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Decorative circles */}
                <div style={{
                    position: 'absolute', top: '-30px', right: '-30px',
                    width: '120px', height: '120px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(0,176,116,0.08), rgba(0,214,143,0.05))',
                }} />
                <div style={{
                    position: 'absolute', bottom: '-20px', left: '-20px',
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(0,176,116,0.06), rgba(0,214,143,0.03))',
                }} />

                {/* Animated checkmark circle */}
                <div
                    style={{
                        width: '88px',
                        height: '88px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #00B074 0%, #00D68F 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                        boxShadow: '0 12px 30px rgba(0, 176, 116, 0.3)',
                        animation: isVisible ? 'bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
                    }}
                >
                    <FaCheckCircle style={{ color: '#fff', fontSize: '40px' }} />
                </div>

                {/* Confetti dots */}
                {isVisible && (
                    <>
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                style={{
                                    position: 'absolute',
                                    width: `${6 + Math.random() * 6}px`,
                                    height: `${6 + Math.random() * 6}px`,
                                    borderRadius: '50%',
                                    background: ['#00B074', '#F2C94C', '#2D9CDB', '#FF6B81', '#BB6BD9', '#00D68F'][i],
                                    top: `${15 + Math.random() * 30}%`,
                                    left: `${10 + (i * 15) + Math.random() * 5}%`,
                                    animation: `confetti-float ${1.5 + Math.random()}s ease-out forwards`,
                                    animationDelay: `${0.2 + i * 0.1}s`,
                                    opacity: 0,
                                }}
                            />
                        ))}
                    </>
                )}

                <h3 style={{
                    fontSize: '22px',
                    fontWeight: 800,
                    color: '#1a1a2e',
                    marginBottom: '10px',
                    letterSpacing: '-0.02em',
                    position: 'relative',
                }}>
                    {config.title || 'Berhasil! 🎉'}
                </h3>

                <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    lineHeight: '1.6',
                    marginBottom: '28px',
                    position: 'relative',
                }}>
                    {config.message || 'Operasi berhasil dilakukan.'}
                </p>

                <button
                    onClick={handleClose}
                    style={{
                        background: 'linear-gradient(135deg, #00B074 0%, #00D68F 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '16px',
                        padding: '14px 40px',
                        fontWeight: 700,
                        fontSize: '15px',
                        cursor: 'pointer',
                        boxShadow: '0 8px 24px rgba(0, 176, 116, 0.3)',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        width: '100%',
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                    {config.buttonText || 'OK, Mengerti!'}
                </button>
            </div>
        </div>
    );
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const [successModal, setSuccessModal] = useState(null);

    const dismissToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback((type, title, message, duration = 4000) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, type, title, message, duration }]);
    }, []);

    const showSuccess = useCallback((title, message, duration) => {
        showToast('success', title, message, duration);
    }, [showToast]);

    const showError = useCallback((title, message, duration) => {
        showToast('error', title, message, duration || 5000);
    }, [showToast]);

    const showInfo = useCallback((title, message, duration) => {
        showToast('info', title, message, duration);
    }, [showToast]);

    const showWarning = useCallback((title, message, duration) => {
        showToast('warning', title, message, duration);
    }, [showToast]);

    const showSuccessModal = useCallback((config = {}) => {
        setSuccessModal(config);
    }, []);

    const value = {
        showToast,
        showSuccess,
        showError,
        showInfo,
        showWarning,
        showSuccessModal,
    };

    return (
        <ToastContext.Provider value={value}>
            {children}

            {/* Toast Container */}
            <div
                style={{
                    position: 'fixed',
                    top: '24px',
                    right: '24px',
                    zIndex: 10000,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    pointerEvents: 'none',
                }}
            >
                {toasts.map((t) => (
                    <div key={t.id} style={{ pointerEvents: 'auto' }}>
                        <Toast toast={t} onDismiss={dismissToast} />
                    </div>
                ))}
            </div>

            {/* Success Modal */}
            {successModal && (
                <SuccessModal config={successModal} onClose={() => setSuccessModal(null)} />
            )}

            {/* CSS Animations */}
            <style>{`
                @keyframes shimmer {
                    0% { left: -100%; }
                    60% { left: 100%; }
                    100% { left: 100%; }
                }
                @keyframes pulse-icon {
                    0% { transform: scale(0.5); opacity: 0; }
                    60% { transform: scale(1.15); }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes progress {
                    from { width: 100%; }
                    to { width: 0%; }
                }
                @keyframes bounce-in {
                    0% { transform: scale(0); opacity: 0; }
                    50% { transform: scale(1.15); }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes confetti-float {
                    0% { transform: translateY(0) scale(0); opacity: 0; }
                    30% { opacity: 1; transform: translateY(-20px) scale(1); }
                    100% { transform: translateY(-60px) scale(0.5); opacity: 0; }
                }
            `}</style>
        </ToastContext.Provider>
    );
}

export const useToast = () => useContext(ToastContext);
