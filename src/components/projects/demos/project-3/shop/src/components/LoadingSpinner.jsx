// frontend/src/components/LoadingSpinner.jsx
import { motion } from 'framer-motion';

const LoadingSpinner = ({ text = 'در حال بارگذاری...' }) => {
  return (
    <div className="loading-spinner-container">
      <motion.div
        className="spinner"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <p className="loading-text">{text}</p>

      <style>{`
        .loading-spinner-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          gap: 1rem;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #e2e8f0;
          border-top-color: #6366f1;
          border-radius: 50%;
        }

        .loading-text {
          color: #64748b;
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
