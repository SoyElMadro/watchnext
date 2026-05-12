import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TrailerModal({ videoKey, onClose }) {
  if (!videoKey) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-label="Reproducir trailer"
      >
        <motion.div
          className="absolute inset-0 bg-black/85 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-5xl"
        >
          <button
            onClick={onClose}
            className="absolute -top-14 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20
                       flex items-center justify-center transition-all duration-200 border border-white/10"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="relative pt-[56.25%] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/5">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1`}
              title="Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
