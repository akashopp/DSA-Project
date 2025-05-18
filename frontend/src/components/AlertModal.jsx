import React, { useEffect } from 'react';

/**
 * AlertModal Component
 * @param {Object} props
 * @param {string} props.data - The message to display
 * @param {string} [props.type='info'] - Type of alert ('info', 'success', 'warning', 'error')
 * @param {number} [props.duration=3000] - Auto-dismiss duration in milliseconds
 * @param {function} [props.onClose] - Optional close callback
 */
function AlertModal({ data, type = 'info', duration = 3000, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    info: {
      bg: 'bg-blue-100 text-blue-900 border-blue-300',
    },
    success: {
      bg: 'bg-green-100 text-green-900 border-green-300',
    },
    warning: {
      bg: 'bg-yellow-100 text-yellow-900 border-yellow-300',
    },
    error: {
      bg: 'bg-red-100 text-red-900 border-red-300',
    }
  };

  const { bg } = styles[type] || styles.info;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className={`w-full max-w-2xl mx-6 md:mx-auto p-8 rounded-lg shadow-xl border ${bg} transition-all duration-300`}
      >
        <div className="flex justify-between items-start">
          <div className="text-lg leading-relaxed font-medium break-words">
            {data}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl ml-6"
            aria-label="Close Alert"
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertModal;