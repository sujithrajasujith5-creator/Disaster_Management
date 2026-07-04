import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FiAlertTriangle, FiFileText, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const icons = {
  total: FiFileText,
  pending: FiAlertCircle,
  resolved: FiCheckCircle,
  critical: FiAlertTriangle,
};

const colors = {
  total: 'bg-blue-500',
  pending: 'bg-yellow-500',
  resolved: 'bg-green-500',
  critical: 'bg-red-500',
};

const variants = {
  total: { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } } },
  pending: { hidden: { opacity: 0, scale: 0.82 }, visible: { opacity: 1, scale: [0.82, 1.06, 1], transition: { duration: 0.6, ease: 'easeOut' } } },
  resolved: { hidden: { opacity: 0, rotate: -8 }, visible: { opacity: 1, rotate: 0, transition: { duration: 0.55, ease: 'easeOut' } } },
  critical: { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } } },
};

const StatCard = ({ title, value, type = 'total' }) => {
  const Icon = icons[type] || FiFileText;
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frame;
    const duration = 900;
    const start = performance.now();
    const target = Number(value || 0);

    if (target === 0) {
      setCount(0);
      return;
    }

    const animate = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <motion.div
      className="card relative overflow-hidden rounded-[28px] border border-white/10 bg-white/80 dark:bg-slate-900/80 shadow-sm backdrop-blur-xl transition-transform duration-300 will-change-transform"
      variants={variants[type]}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -10, scale: 1.04 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <div className="absolute inset-0 rounded-[28px] border border-transparent bg-gradient-to-r from-cyan-400/0 via-blue-400/10 to-sky-500/0 opacity-0 transition duration-300 will-change-transform group-hover:opacity-100 group-hover:shadow-[0_0_0_1px_rgba(56,189,248,0.28)]" />
      <div className="absolute -inset-1 rounded-[30px] bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.18),_transparent_35%)] opacity-0 transition duration-500" />
      <div className="relative flex items-center gap-4 p-6">
        <div className={`${colors[type]} relative p-3 rounded-3xl text-white shadow-[0_12px_30px_rgba(15,23,42,0.12)]`}>
          <motion.div
            initial={{ rotate: type === 'pending' ? -6 : 0 }}
            animate={
              type === 'pending'
                ? { rotate: [0, 10, -6, 0] }
                : { rotate: 0 }
            }
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
            className="relative"
          >
            <motion.span
              className="absolute inset-0 rounded-full bg-white/15 opacity-0"
              animate={{ opacity: [0, 0.28, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <Icon size={24} />
          </motion.div>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-2xl font-bold"
          >
            {count}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
