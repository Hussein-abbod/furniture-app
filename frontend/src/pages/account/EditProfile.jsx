import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../utils/api';
import toast from 'react-hot-toast';
import styles from './Account.module.css';

export default function EditProfile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    full_name: user?.username || '',
    email: user?.email || '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {};
    if (form.full_name !== user.username) payload.full_name = form.full_name;
    if (form.email !== user.email) payload.email = form.email;
    if (form.password) payload.password = form.password;

    if (Object.keys(payload).length === 0) {
      toast('No changes made');
      setLoading(false);
      return;
    }

    try {
      const { data } = await updateProfile(payload);
      setUser({ username: data.full_name || data.username, email: data.email });
      toast.success('Profile updated successfully');
      setForm({ ...form, password: '' }); // Clear password field
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className={styles.pageTitle}>Profile Settings</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Full Name</label>
          <input
            type="text"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            placeholder="John Doe"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Email Address</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        
        <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '1rem 0' }} />
        
        <div className={styles.formGroup}>
          <label>New Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Leave blank to keep current password"
          />
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </>
  );
}
