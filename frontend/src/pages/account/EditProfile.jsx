import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, getProfile } from '../../utils/api';
import toast from 'react-hot-toast';
import styles from './Account.module.css';

export default function EditProfile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    full_name: user?.username || '',
    email: user?.email || '',
    password: '',
    address: '',
    city: '',
    country: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    getProfile()
      .then(({ data }) => {
        setForm(prev => ({
          ...prev,
          full_name: data.full_name || data.username || '',
          email: data.email || '',
          address: data.address || '',
          city: data.city || '',
          country: data.country || '',
          phone: data.phone || ''
        }));
      })
      .catch((err) => {
        console.error('Failed to load profile', err);
      })
      .finally(() => setFetching(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {};
    if (form.full_name) payload.full_name = form.full_name;
    if (form.email) payload.email = form.email;
    if (form.password) payload.password = form.password;
    if (form.address !== undefined) payload.address = form.address;
    if (form.city !== undefined) payload.city = form.city;
    if (form.country !== undefined) payload.country = form.country;
    if (form.phone !== undefined) payload.phone = form.phone;

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

  if (fetching) return <p>Loading profile...</p>;

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

        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1.1rem', color: '#0c3b2e' }}>Shipping Address</h3>
        
        <div className={styles.formGroup}>
          <label>Phone Number</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+1 234 567 8900"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Address</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="123 Main St"
          />
        </div>

        <div className={styles.twoCol}>
          <div className={styles.formGroup}>
            <label>City</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="New York"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Country</label>
            <input
              type="text"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              placeholder="USA"
            />
          </div>
        </div>
        
        <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '1.5rem 0 1rem' }} />
        
        <div className={styles.formGroup}>
          <label>New Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Leave blank to keep current password"
          />
        </div>

        <button type="submit" disabled={loading} className={`btn btn-primary ${styles.submitBtn}`}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </>
  );
}
