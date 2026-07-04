import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { notificationAPI } from '../services/services';
import {
  FiMenu,
  FiX,
  FiBell,
  FiLogOut,
  FiHome,
  FiPlusCircle,
  FiList,
  FiUsers,
  FiAlertOctagon,
  FiAlertTriangle,
  FiBarChart2,
  FiShield,
} from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [shakeBell, setShakeBell] = useState(false);
  const prevCountRef = useRef(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const { data } = await notificationAPI.getUnreadCount();
        setUnreadCount(data.data.count);
      } catch {
        /* ignore */
      }
    };
    if (user) fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (unreadCount > prevCountRef.current) {
      setShakeBell(true);
    }
    prevCountRef.current = unreadCount;
  }, [unreadCount]);

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: FiHome },
    ...(user?.role !== 'admin'
      ? [
          { to: '/reports/new', label: 'New Report', icon: FiPlusCircle },
          { to: '/reports', label: 'My Reports', icon: FiList },
        ]
      : []),
    ...(user?.role === 'admin'
      ? [{ to: '/admin', label: 'Admin Panel', icon: FiShield }]
      : []),
    ...(user?.role === 'admin'
      ? [{ to: '/admin/reports', label: 'Manage Reports', icon: FiUsers }]
      : []),
    ...(user?.role === 'admin'
      ? [
          { to: '/admin/analytics', label: 'Analytics', icon: FiBarChart2 },
          { to: '/admin/alerts', label: 'Emergency Alerts', icon: FiAlertOctagon },
        ]
      : []),
    { to: '/notifications', label: 'Notifications', icon: FiBell },
  ];

  const navListVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
            <Link to="/dashboard" className="flex items-center gap-2">
              <FiAlertTriangle className="text-danger-600" size={24} />
              <span className="font-bold text-lg hidden sm:block">Disaster Portal</span>
            </Link>
          </div>

          <motion.div
            className="hidden md:flex items-center gap-1"
            initial="hidden"
            animate="visible"
            variants={navListVariants}
          >
            {navLinks.map(({ to, label, icon: Icon }) => (
              <motion.div key={to} variants={navItemVariants} whileHover={{ y: -2 }} className="group relative">
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `nav-link-animated flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 relative ${
                      isActive
                        ? 'text-primary-600 active-nav-link'
                        : 'text-gray-600 dark:text-gray-300 hover:text-primary-600'
                    }`
                  }
                >
                  <Icon className="transition-transform duration-300 group-hover:rotate-10" size={16} />
                  <span className="transition-colors duration-300 group-hover:text-primary-500">{label}</span>
                  <span className="nav-underline" />
                  {to === '/notifications' && unreadCount > 0 && (
                    <span className="notification-dot" />
                  )}
                </NavLink>
              </motion.div>
            ))}
          </motion.div>

          <div className="flex items-center gap-2">
              <motion.div
              whileHover={{ scale: 1.03, rotate: 0.8 }}
              className="hidden sm:flex items-center gap-3 rounded-2xl border border-gray-200/80 bg-white/80 px-3 py-2 shadow-sm dark:border-gray-700/80 dark:bg-gray-900/70 transition"
            >
              <div className="h-10 w-10 rounded-full bg-primary-500/10 text-primary-500 font-semibold flex items-center justify-center text-sm">
                {user?.name?.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
              </div>
            </motion.div>
            <button
              onClick={logout}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <FiLogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
            >
              <FiLogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
