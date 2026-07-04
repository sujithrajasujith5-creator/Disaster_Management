import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AnimatedBackground from '../components/AnimatedBackground';
import toast from 'react-hot-toast';
import { FiAlertTriangle, FiUser, FiMail, FiLock, FiBriefcase, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    department: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newUser = await register(form);
      toast.success('Account created successfully!');
      if (newUser?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-950/70 text-cyan-300 shadow-[0_18px_50px_rgba(139,92,246,0.18)]">
              <FiAlertTriangle size={24} />
            </div>
            <div>
              <h1>Create your account</h1>
              <p>Register for the premium AI disaster portal.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-float">
              <FiUser className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 transition duration-300" />
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder=" "
                className="input-card pl-12"
              />
              <label>Name</label>
            </div>

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
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                type={showPassword ? 'text' : 'password'}
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

            <div className="form-float">
              <FiBriefcase className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 transition duration-300" />
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value, department: e.target.value === 'admin' ? '' : form.department })}
                className="input-card pl-12"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <label>Role</label>
            </div>

            {form.role !== 'admin' && (
              <div className="form-float">
                <FiBriefcase className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 transition duration-300" />
                <input
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  placeholder=" "
                  className="input-card pl-12"
                />
                <label>Department</label>
              </div>
            )}

            <div className="form-float">
              <FiPhone className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 transition duration-300" />
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder=" "
                className="input-card pl-12"
              />
              <label>Phone</label>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-cyan-300 transition hover:text-cyan-200">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
