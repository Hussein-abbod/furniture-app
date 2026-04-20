import { useState } from 'react';
import { User, Lock, Eye, EyeOff, Save, Loader, UserCog, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateAdminAccount } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import styles from './AdminAccount.module.css';

export default function AdminAccount() {
  const { user, setUser } = useAuth();

  const [username, setUsername]           = useState(user?.username || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent]   = useState(false);
  const [showNew, setShowNew]           = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);

  const [savingUsername, setSavingUsername] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  /* ── Save Username ─────────────────────── */
  const handleSaveUsername = async (e) => {
    e.preventDefault();
    if (!username.trim() || username.trim().length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }
    if (username.trim() === user?.username) {
      toast('No changes to save', { icon: 'ℹ️' });
      return;
    }
    setSavingUsername(true);
    try {
      const { data } = await updateAdminAccount({ username: username.trim() });
      setUser({ ...user, username: data.username });
      toast.success('Username updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update username');
    } finally {
      setSavingUsername(false);
    }
  };

  /* ── Save Password ─────────────────────── */
  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      toast.error('Please enter a new password');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setSavingPassword(true);
    try {
      await updateAdminAccount({ password: newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className={`${styles.page} page-enter`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <UserCog size={24} className={styles.headerIcon} />
          <div>
            <h1 className={styles.title}>My Account</h1>
            <p className={styles.sub}>Manage your admin username and password.</p>
          </div>
        </div>
      </div>

      {/* Avatar badge */}
      <div className={styles.profileBadge}>
        <div className={styles.avatarLarge}>
          {user?.username?.[0]?.toUpperCase()}
        </div>
        <div>
          <div className={styles.badgeName}>{user?.username}</div>
          <div className={styles.badgeRole}>
            <ShieldCheck size={13} /> Administrator
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        {/* ── Username card ── */}
        <form onSubmit={handleSaveUsername} className={styles.card}>
          <div className={styles.cardHeader}>
            <User size={18} className={styles.cardIcon} />
            <div>
              <h2>Change Username</h2>
              <p>Your username is used to log in to the admin panel.</p>
            </div>
          </div>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label}>New Username</label>
              <div className={styles.inputWrap}>
                <User size={16} className={styles.inputIcon} />
                <input
                  id="admin-username"
                  className={styles.input}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter new username"
                  minLength={3}
                  maxLength={100}
                  required
                />
              </div>
            </div>
          </div>
          <div className={styles.cardFooter}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={savingUsername}
            >
              {savingUsername ? (
                <><Loader size={15} className={styles.spin} /> Saving…</>
              ) : (
                <><Save size={15} /> Save Username</>
              )}
            </button>
          </div>
        </form>

        {/* ── Password card ── */}
        <form onSubmit={handleSavePassword} className={styles.card}>
          <div className={styles.cardHeader}>
            <Lock size={18} className={styles.cardIcon} />
            <div>
              <h2>Change Password</h2>
              <p>Use a strong password with at least 6 characters.</p>
            </div>
          </div>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label}>New Password</label>
              <div className={styles.inputWrap}>
                <Lock size={16} className={styles.inputIcon} />
                <input
                  id="admin-new-password"
                  className={styles.input}
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowNew(v => !v)}
                  tabIndex={-1}
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Confirm Password</label>
              <div className={styles.inputWrap}>
                <Lock size={16} className={styles.inputIcon} />
                <input
                  id="admin-confirm-password"
                  className={styles.input}
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowConfirm(v => !v)}
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <span className={styles.mismatch}>Passwords do not match</span>
              )}
            </div>
          </div>
          <div className={styles.cardFooter}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={savingPassword}
            >
              {savingPassword ? (
                <><Loader size={15} className={styles.spin} /> Saving…</>
              ) : (
                <><Save size={15} /> Save Password</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
