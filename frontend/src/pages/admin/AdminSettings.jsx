import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, Save, Loader, Settings, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSiteSettings, updateSiteSettings } from '../../utils/api';
import styles from './AdminSettings.module.css';

const FIELDS = [
  { key: 'contact_phone',   label: 'Phone Number',  Icon: Phone,  placeholder: '+60 1111769177' },
  { key: 'contact_email',   label: 'Email Address',  Icon: Mail,   placeholder: 'husseinobood88@gmail.com' },
  { key: 'contact_address', label: 'Address',         Icon: MapPin, placeholder: 'Your business address', multiline: true },
  { key: 'working_hours',   label: 'Working Hours',   Icon: Clock,  placeholder: 'Mon – Fri: 9 AM – 6 PM', multiline: true },
];

export default function AdminSettings() {
  const [form, setForm] = useState({});
  const [original, setOriginal] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSiteSettings()
      .then(({ data }) => {
        setForm(data);
        setOriginal(data);
      })
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const hasChanges = JSON.stringify(form) !== JSON.stringify(original);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await updateSiteSettings(form);
      setForm(data);
      setOriginal(data);
      toast.success('Settings saved successfully!');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <Loader size={32} className={styles.spin} />
        <span>Loading settings…</span>
      </div>
    );
  }

  return (
    <div className={`${styles.page} page-enter`}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Settings size={24} className={styles.headerIcon} />
          <div>
            <h1 className={styles.title}>Site Settings</h1>
            <p className={styles.sub}>
              Manage your contact information displayed on the website.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Contact Information</h2>
            <p>This information is displayed on the Contact page and Footer across your website.</p>
          </div>

          <div className={styles.fields}>
            {FIELDS.map(({ key, label, Icon, placeholder, multiline }) => (
              <div key={key} className={styles.field}>
                <label className={styles.label}>
                  <Icon size={15} />
                  {label}
                </label>
                {multiline ? (
                  <textarea
                    className={styles.input}
                    value={form[key] || ''}
                    onChange={(e) => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    rows={3}
                  />
                ) : (
                  <input
                    className={styles.input}
                    type="text"
                    value={form[key] || ''}
                    onChange={(e) => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                  />
                )}
                {key === 'contact_email' && (
                  <div className={styles.warning}>
                    <AlertTriangle size={14} />
                    <span>
                      Changing this email only updates what visitors see on the website.
                      To change where contact form messages are delivered, update the
                      SMTP settings in the server <code>.env</code> file and restart the backend.
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          {hasChanges && (
            <span className={styles.unsaved}>You have unsaved changes</span>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving || !hasChanges}
          >
            {saving ? (
              <>
                <Loader size={16} className={styles.spin} /> Saving…
              </>
            ) : (
              <>
                <Save size={16} /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
