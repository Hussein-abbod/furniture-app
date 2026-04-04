import { useState, useEffect } from 'react';
import {
  Mail, Phone, MapPin, Send, Clock, CheckCircle,
  MessageSquare, User, ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { sendContactMessage, getSiteSettings } from '../../utils/api';
import styles from './Contact.module.css';

const FALLBACK = {
  contact_phone: '+60 1111769177',
  contact_email: 'husseinobood88@gmail.com',
  contact_address: 'Puncak Muzaffar Hang Tuah Jaya, Jalan MH Utama, Taman Muzaffar Heights, 75450 Ayer Keroh, Malacca',
  working_hours: 'Mon – Fri: 9 AM – 6 PM\nSat: 10 AM – 4 PM',
};

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [settings, setSettings] = useState(FALLBACK);

  useEffect(() => {
    getSiteSettings()
      .then(({ data }) => setSettings(prev => ({ ...prev, ...data })))
      .catch(() => {});
  }, []);

  const CONTACT_INFO = [
    {
      Icon: Phone,
      title: 'Phone',
      value: settings.contact_phone,
      href: `tel:${settings.contact_phone.replace(/\s/g, '')}`,
      accent: '#b46617',
    },
    {
      Icon: Mail,
      title: 'Email',
      value: settings.contact_email,
      href: `mailto:${settings.contact_email}`,
      accent: '#0C3B2E',
    },
    {
      Icon: MapPin,
      title: 'Address',
      value: settings.contact_address,
      href: `https://maps.google.com/?q=${encodeURIComponent(settings.contact_address)}`,
      accent: '#2d5c40',
    },
    {
      Icon: Clock,
      title: 'Working Hours',
      value: settings.working_hours,
      href: null,
      accent: '#4a3828',
    },
  ];

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      await sendContactMessage(form);
      setSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      toast.success('Message sent successfully!');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to send message. Please try again later.';
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={styles.page}>

      {/* ── Hero ─────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={`container ${styles.heroInner}`}>
          <span className={styles.eyebrow}>Get in Touch</span>
          <h1 className={styles.heroH1}>
            We'd Love to<br />Hear From <em>You</em>
          </h1>
          <p className={styles.heroP}>
            Whether you have a question about our products, need design advice,
            or just want to say hello — we're here to help.
          </p>
        </div>
      </section>

      {/* ── Contact Info Cards ────────────────────── */}
      <section className={styles.infoSection}>
        <div className={`container ${styles.infoGrid}`}>
          {CONTACT_INFO.map(({ Icon, title, value, href, accent }) => (
            <div key={title} className={styles.infoCard}>
              <div className={styles.infoIconWrap} style={{ background: accent }}>
                <Icon size={22} color="#fff" />
              </div>
              <h3 className={styles.infoTitle}>{title}</h3>
              {href ? (
                <a href={href} className={styles.infoValue} target="_blank" rel="noopener noreferrer">
                  {value}
                </a>
              ) : (
                <p className={styles.infoValue} style={{ whiteSpace: 'pre-line' }}>{value}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Form + Map  ───────────────────────────── */}
      <section className={styles.formSection}>
        <div className={`container ${styles.formGrid}`}>

          {/* Form */}
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <MessageSquare size={28} className={styles.formHeaderIcon} />
              <div>
                <h2 className={styles.formH2}>Send Us a Message</h2>
                <p className={styles.formSub}>
                  Fill out the form and our team will get back to you within 24 hours.
                </p>
              </div>
            </div>

            {submitted ? (
              <div className={styles.success}>
                <div className={styles.successIcon}>
                  <CheckCircle size={48} />
                </div>
                <h3>Message Sent!</h3>
                <p>
                  Thank you for reaching out. We'll get back to you as soon as possible.
                </p>
                <button
                  className={styles.resetBtn}
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Message <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formRow}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="contact-name">
                      <User size={14} /> Full Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="contact-email">
                      <Mail size={14} /> Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="contact-subject">Subject</label>
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    required
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="contact-message">
                    <MessageSquare size={14} /> Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={sending}
                >
                  {sending ? (
                    <>
                      <span className={styles.spinner} />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Map */}
          <div className={styles.mapCard}>
            <div className={styles.mapHeader}>
              <MapPin size={20} />
              <h3>Find Us Here</h3>
            </div>
            <div className={styles.mapWrap}>
              <iframe
                title="ONYX Location"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.contact_address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className={styles.mapAddress}>
              <MapPin size={16} />
              <p>{settings.contact_address}</p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
