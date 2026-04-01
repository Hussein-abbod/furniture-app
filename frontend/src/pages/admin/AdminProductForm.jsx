import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Upload, X, Loader, Image as ImageIcon, Move } from 'lucide-react';
import toast from 'react-hot-toast';
import { getProduct, createProduct, updateProduct, uploadImage } from '../../utils/api';
import styles from './AdminProductForm.module.css';

const CATEGORIES = ['Living Room','Bedroom','Dining Room','Office','Outdoor','Kitchen','Bathroom','Hallway'];

const EMPTY = { name: '', description: '', price: '', category: '', stock: 0, image_url: '', is_featured: 0 };

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const fileRef = useRef();
  const previewRef = useRef();
  const dragRef = useRef({ active: false, startX: 0, startY: 0, posX: 50, posY: 50 });

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(isEdit);
  // crop position as percentage (0-100)
  const [cropPos, setCropPos] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    getProduct(id)
      .then(({ data }) => setForm({
        name: data.name,
        description: data.description || '',
        price: data.price,
        category: data.category,
        stock: data.stock,
        image_url: data.image_url || '',
        is_featured: data.is_featured,
      }))
      .catch(() => toast.error('Failed to load product'))
      .finally(() => setLoadingProduct(false));
  }, [id, isEdit]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.price || isNaN(form.price) || +form.price <= 0) e.price = 'Valid price required';
    if (!form.category) e.category = 'Category is required';
    if (form.stock < 0) e.stock = 'Stock cannot be negative';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setCropPos({ x: 50, y: 50 }); // reset crop when new image uploaded
    dragRef.current.posX = 50;
    dragRef.current.posY = 50;
    try {
      const { data } = await uploadImage(file);
      setForm(f => ({ ...f, image_url: data.image_url }));
      toast.success('Image uploaded — drag the preview to adjust crop');
    } catch {
      toast.error('Upload failed — check file size (max 5MB)');
    } finally {
      setUploading(false);
    }
  };

  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    dragRef.current.active = true;
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
    setIsDragging(true);
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!dragRef.current.active) return;
    const box = previewRef.current?.getBoundingClientRect();
    if (!box) return;
    const dx = ((e.clientX - dragRef.current.startX) / box.width) * -100;
    const dy = ((e.clientY - dragRef.current.startY) / box.height) * -100;
    const newX = Math.min(100, Math.max(0, dragRef.current.posX + dx));
    const newY = Math.min(100, Math.max(0, dragRef.current.posY + dy));
    setCropPos({ x: newX, y: newY });
  }, []);

  const onMouseUp = useCallback((e) => {
    if (!dragRef.current.active) return;
    const box = previewRef.current?.getBoundingClientRect();
    if (box) {
      const dx = ((e.clientX - dragRef.current.startX) / box.width) * -100;
      const dy = ((e.clientY - dragRef.current.startY) / box.height) * -100;
      dragRef.current.posX = Math.min(100, Math.max(0, dragRef.current.posX + dx));
      dragRef.current.posY = Math.min(100, Math.max(0, dragRef.current.posY + dy));
    }
    dragRef.current.active = false;
    setIsDragging(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const payload = { ...form, price: +form.price, stock: +form.stock };
    try {
      if (isEdit) {
        await updateProduct(id, payload);
        toast.success('Product updated!');
      } else {
        await createProduct(payload);
        toast.success('Product created!');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const field = (key, val) => setForm(f => ({ ...f, [key]: val }));

  if (loadingProduct) return (
    <div className={styles.loadingWrap}>
      <Loader size={32} className={styles.spin} />
      <span>Loading product…</span>
    </div>
  );

  return (
    <div className={`${styles.page} page-enter`}>
      <div className={styles.header}>
        <Link to="/admin/products" className={styles.back}>
          <ArrowLeft size={16} /> Back to Products
        </Link>
        <h1 className={styles.title}>{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.grid}>
          {/* Left column */}
          <div className={styles.mainCol}>
            {/* Basic Info */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Basic Information</h2>

              <div className={styles.field}>
                <label className="label">Product Name *</label>
                <input
                  className={`input ${errors.name ? styles.inputError : ''}`}
                  value={form.name}
                  onChange={e => field('name', e.target.value)}
                  placeholder="e.g. Oslo Sofa"
                />
                {errors.name && <span className={styles.errMsg}>{errors.name}</span>}
              </div>

              <div className={styles.field}>
                <label className="label">Description</label>
                <textarea
                  className={`input ${styles.textarea}`}
                  value={form.description}
                  onChange={e => field('description', e.target.value)}
                  placeholder="Describe the product in detail…"
                  rows={5}
                />
              </div>

              <div className={styles.twoFields}>
                <div className={styles.field}>
                  <label className="label">Price ($) *</label>
                  <input
                    className={`input ${errors.price ? styles.inputError : ''}`}
                    type="number" min="0.01" step="0.01"
                    value={form.price}
                    onChange={e => field('price', e.target.value)}
                    placeholder="0.00"
                  />
                  {errors.price && <span className={styles.errMsg}>{errors.price}</span>}
                </div>
                <div className={styles.field}>
                  <label className="label">Stock Quantity *</label>
                  <input
                    className={`input ${errors.stock ? styles.inputError : ''}`}
                    type="number" min="0"
                    value={form.stock}
                    onChange={e => field('stock', e.target.value)}
                  />
                  {errors.stock && <span className={styles.errMsg}>{errors.stock}</span>}
                </div>
              </div>

              <div className={styles.field}>
                <label className="label">Category *</label>
                <select
                  className={`input ${errors.category ? styles.inputError : ''}`}
                  value={form.category}
                  onChange={e => field('category', e.target.value)}
                >
                  <option value="">Select a category…</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <span className={styles.errMsg}>{errors.category}</span>}
              </div>

              <div className={styles.field}>
                <label className={styles.checkLabel}>
                  <input
                    type="checkbox"
                    checked={form.is_featured === 1}
                    onChange={e => field('is_featured', e.target.checked ? 1 : 0)}
                    className={styles.checkbox}
                  />
                  <span>Mark as Featured Product</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right column — image */}
          <div className={styles.sideCol}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Product Image</h2>

              {/* Preview with drag-to-crop */}
              <div
                ref={previewRef}
                className={`${styles.imagePreview} ${form.image_url ? styles.hasCrop : ''} ${isDragging ? styles.dragging : ''}`}
                onMouseDown={form.image_url ? onMouseDown : undefined}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
              >
                {form.image_url
                  ? <img
                      src={form.image_url}
                      alt="Preview"
                      style={{ objectPosition: `${cropPos.x}% ${cropPos.y}%` }}
                      onError={e => { e.target.src = ''; }}
                    />
                  : (
                    <div className={styles.imagePlaceholder}>
                      <ImageIcon size={40} />
                      <span>No image yet</span>
                    </div>
                  )
                }
                {form.image_url && (
                  <>
                    <div className={styles.cropHint}>
                      <Move size={13} /> Drag to adjust crop
                    </div>
                    <button type="button" className={styles.clearImage} onClick={() => { field('image_url', ''); setCropPos({ x:50, y:50 }); dragRef.current.posX=50; dragRef.current.posY=50; }}>
                      <X size={14} />
                    </button>
                  </>
                )}
              </div>
              {form.image_url && (
                <p className={styles.cropNote}>This is how the image will appear in the shop (cropped). Drag above to reposition.</p>
              )}

              {/* Upload */}
              <input ref={fileRef} type="file" accept="image/*" className={styles.hidden} onChange={handleFileUpload} />
              <button
                type="button"
                className={`btn btn-outline ${styles.uploadBtn}`}
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? <><Loader size={15} className={styles.spin} /> Uploading…</> : <><Upload size={15} /> Upload Image</>}
              </button>
              <p className={styles.uploadHint}>Accepted formats: JPG, PNG, WEBP, GIF · Max 5 MB</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.formFooter}>
          <Link to="/admin/products" className="btn btn-ghost">Cancel</Link>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? <><Loader size={16} className={styles.spin} /> Saving…</> : isEdit ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
