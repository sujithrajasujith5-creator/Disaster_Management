import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AnimatedBackground from '../components/AnimatedBackground';
import toast from 'react-hot-toast';
import { FiAlertTriangle, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form);
      toast.success('Welcome back!');
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page min-h-screen overflow-hidden">
      <AnimatedBackground />
      <div className="auth-page-content">
        <div className="glass-card max-w-md">
          <div className="auth-card-title">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-950/70 text-cyan-300 shadow-[0_18px_50px_rgba(56,189,248,0.18)]">
              <FiAlertTriangle size={24} />
            </div>
            <div>
              <h1>Welcome back</h1>
              <p>Securely sign in to your AI workspace.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-float">
              <FiMail className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 transition duration-300" />
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                type="email"
                placeholder=" "
                className="input-card pl-12"
              />
              <label>Email address</label>
            </div>

            <div className="form-float">
              <FiLock className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 transition duration-300" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                placeholder=" "
                className="input-card pl-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-300"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
              <label>Password</label>
            </div>

            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-slate-300 transition hover:text-cyan-300">
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Don’t have an account?{' '}
            <Link to="/register" className="font-semibold text-cyan-300 transition hover:text-cyan-200">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
