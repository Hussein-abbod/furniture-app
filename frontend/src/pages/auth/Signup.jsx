import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup as apiSignup } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import styles from './Auth.module.css';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import logo from '../../assets/images/onyx-logo.png';

export default function Signup() {
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm_password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { setUser, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const data = await googleLogin(credentialResponse.credential);
      toast.success('Signed up successfully!');
      window.location.href = '/';
    } catch (err) {
      toast.error('Google signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (pass) => {
     if (pass.length === 0) return { label: '', color: 'transparent' };
     if (pass.length < 6) return { label: 'Weak', color: '#ff4d4d' };
     if (pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) return { label: 'Strong', color: '#6D9773' };
     return { label: 'Medium', color: '#FFBA00' };
  };

  const strength = getPasswordStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { data } = await apiSignup({ 
        full_name: form.full_name,
        email: form.email, 
        password: form.password 
      });
      // Signup API auto-logs in and sets cookie
      setUser({ username: data.username, email: data.email });
      toast.success('Account created successfully!');
      
      // Auto redirect to home, we need the auth context to update so we might force a hard navigate or rely on setUser
      // We will reload the page to ensure context fetches me correctly if we want, or just navigate since context is updated.
      window.location.href = '/'; 
    } catch (err) {
      let errorMsg = 'Signup failed';
      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          errorMsg = err.response.data.detail[0].msg;
        } else {
          errorMsg = err.response.data.detail;
        }
      }
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Link to="/" className={styles.logoLink}>
            <img src={logo} alt="Onyx Logo" className={styles.logo} />
            <span className={styles.brandName}>ONYX</span>
          </Link>
          <h2>Create Account</h2>
          <p>Join Onyx for exclusive access</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Full Name</label>
            <input
              type="text"
              required
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              placeholder="John Doe"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min 6 characters"
              />
              <button 
                type="button" 
                className={styles.eyeToggleButton} 
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {form.password && (
              <div className={styles.strengthText} style={{ color: strength.color }}>
                {strength.label}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Confirm Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={form.confirm_password}
                onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                placeholder="Confirm password"
              />
              <button 
                type="button" 
                className={styles.eyeToggleButton} 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <div className={styles.divider}>
          <span>OR</span>
        </div>
        
        <div className={styles.googleBtnContainer}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              toast.error('Google signup failed');
            }}
            useOneTap
            theme="outline"
            size="large"
            width="100%"
          />
        </div>

        <p className={styles.footerLink}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
