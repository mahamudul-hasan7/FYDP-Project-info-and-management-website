'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, Loader2 } from 'lucide-react';

export default function UniversalSaveOverlay({
  show,
  status = 'saving', // 'saving' | 'success' | 'error'
  title = 'Saving changes...',
  message = 'Synchronizing with workspace database...'
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="universal-save-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          aria-live="assertive"
          role="status"
        >
          <motion.div
            className="universal-save-card"
            initial={{ scale: 0.88, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: -8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          >
            {/* Status Icon */}
            <div className={`save-icon-circle ${status}`}>
              {status === 'saving' && (
                <div className="save-spinner-wrap">
                  <div className="save-spinner-ring" />
                  <Loader2 size={24} className="save-spinner-icon" />
                </div>
              )}

              {status === 'success' && (
                <motion.div
                  className="save-check-wrap"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 18, stiffness: 300 }}
                >
                  <Check size={28} className="save-check-icon" />
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div
                  className="save-error-wrap"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                >
                  <AlertCircle size={28} className="save-error-icon" />
                </motion.div>
              )}
            </div>

            {/* Status Text */}
            <div className="save-text-group">
              <h4>{title}</h4>
              {message && <p>{message}</p>}
            </div>

            {/* Bottom Progress Beam for saving state */}
            {status === 'saving' && (
              <div className="save-card-beam-track">
                <div className="save-card-beam-fill" />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
