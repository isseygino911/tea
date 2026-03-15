import { useState, useEffect, useRef } from 'react';
import { X, Upload, ChevronDown, GripVertical, Trash2 } from 'lucide-react';
import { adminAPI } from '../../services/adminAPI';
import { LoadingSpinner } from '../ui/LoadingBar';

const predefinedCategories = [
  'Accessories', 'Bags', 'Electronics', 'Home', 
  'Lighting', 'Stationery', 'Kitchen', 'Lifestyle',
  'Clothing', 'Footwear', 'Beauty', 'Sports'
];

export const ProductFormModal = ({ product, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock_quantity: 0,
    status: 'active',
  });
  const [images, setImages] = useState([]); // Array of image URLs
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [suggestions, setSuggestions] = useState(predefinedCategories);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const categoryInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        stock_quantity: product.stock_quantity || 0,
        status: product.status || 'active',
      });
      // If editing, set images from product
      if (product.images) {
        setImages(product.images.map(img => img.image_url));
      } else if (product.image_url) {
        setImages([product.image_url]);
      } else {
        setImages([]);
      }
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock_quantity: 0,
        status: 'active',
      });
      setImages([]);
    }
    setError('');
  }, [product, isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await adminAPI.getCategories();
      setCategories(res.data.categories || []);
      const allCats = [...new Set([...(res.data.categories || []), ...predefinedCategories])];
      setSuggestions(allCats);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Create local preview URLs immediately
    const localImages = files.map(file => ({
      url: URL.createObjectURL(file),
      file,
      isUploading: true,
    }));

    // Add local previews to state immediately
    setImages(prev => [...prev, ...localImages.map(img => img.url)]);
    setUploadingImages(true);

    // Upload each file and replace local URL with S3 URL
    for (let i = 0; i < localImages.length; i++) {
      const { file, url: localUrl } = localImages[i];
      
      try {
        // Get presigned URL from backend
        const res = await adminAPI.getUploadUrl(file.name, file.type);
        
        // Upload to S3
        await fetch(res.data.uploadUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type },
        });

        // Replace local URL with permanent S3 URL (not presigned viewUrl)
        setImages(prev => prev.map(imgUrl => 
          imgUrl === localUrl ? (res.data.publicUrl || res.data.viewUrl) : imgUrl
        ));
        
        // Clean up local object URL
        URL.revokeObjectURL(localUrl);
      } catch (err) {
        console.error('Failed to upload image:', err);
        setError(`Failed to upload ${file.name}. Please try again.`);
        // Remove the failed local preview
        setImages(prev => prev.filter(imgUrl => imgUrl !== localUrl));
        URL.revokeObjectURL(localUrl);
      }
    }

    setUploadingImages(false);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const moveImage = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    setImages(prev => {
      const newImages = [...prev];
      const [moved] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, moved);
      return newImages;
    });
  };

  const handleCategoryChange = (value) => {
    setFormData(prev => ({ ...prev, category: value }));
    if (value) {
      const filtered = suggestions.filter(cat => 
        cat.toLowerCase().includes(value.toLowerCase())
      );
      setCategories(filtered);
    } else {
      setCategories(suggestions);
    }
  };

  const selectCategory = (cat) => {
    setFormData(prev => ({ ...prev, category: cat }));
    setShowCategoryDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
        image_url: images[0], // First image is primary
        images: images, // All images
      };

      if (product) {
        await adminAPI.updateProduct(product.id, data);
      } else {
        await adminAPI.createProduct(data);
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <h3 style={styles.title}>{product ? 'Edit Product' : 'Add New Product'}</h3>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Multiple Images Upload */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Product Images *
              <span style={styles.imageCount}> ({images.length} uploaded)</span>
            </label>
            
            {/* Image Gallery */}
            {images.length > 0 && (
              <div style={styles.imageGallery}>
                {images.map((imgUrl, index) => (
                  <div key={index} style={styles.imageItem}>
                    <img src={imgUrl} alt={`Product ${index + 1}`} style={styles.galleryImg} />
                    {index === 0 && <span style={styles.primaryBadge}>Primary</span>}
                    <div style={styles.imageActions}>
                      <button
                        type="button"
                        onClick={() => moveImage(index, index - 1)}
                        disabled={index === 0}
                        style={{...styles.imageActionBtn, opacity: index === 0 ? 0.3 : 1}}
                      >
                        <ChevronDown style={{ transform: 'rotate(90deg)' }} size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(index, index + 1)}
                        disabled={index === images.length - 1}
                        style={{...styles.imageActionBtn, opacity: index === images.length - 1 ? 0.3 : 1}}
                      >
                        <ChevronDown style={{ transform: 'rotate(-90deg)' }} size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        style={{...styles.imageActionBtn, color: '#ef4444'}}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            <label style={styles.uploadArea}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              {uploadingImages ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <LoadingSpinner size={20} thickness={2} />
                  <span>Uploading...</span>
                </div>
              ) : (
                <>
                  <Upload size={24} />
                  <span>Click to upload images</span>
                  <span style={styles.uploadHint}>First image will be primary</span>
                </>
              )}
            </label>
          </div>

          <div style={styles.grid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Price *</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                style={styles.input}
                required
              />
            </div>
          </div>

          {/* Category with Autocomplete */}
          <div style={styles.formGroup} ref={dropdownRef}>
            <label style={styles.label}>Category *</label>
            <div style={styles.categoryInputWrapper}>
              <input
                ref={categoryInputRef}
                type="text"
                value={formData.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                onFocus={() => {
                  setCategories(suggestions);
                  setShowCategoryDropdown(true);
                }}
                style={styles.categoryInput}
                placeholder="Type or select category"
                required
              />
              <button
                type="button"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                style={styles.dropdownToggle}
              >
                <ChevronDown size={18} />
              </button>
              
              {showCategoryDropdown && (
                <div style={styles.dropdown}>
                  {categories.length === 0 && formData.category && (
                    <button
                      type="button"
                      onClick={() => selectCategory(formData.category)}
                      style={{
                        ...styles.dropdownItem,
                        ...styles.addNewCategory,
                      }}
                    >
                      + Add "{formData.category}" as new category
                    </button>
                  )}
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => selectCategory(cat)}
                      style={{
                        ...styles.dropdownItem,
                        backgroundColor: formData.category === cat ? 'rgba(255,255,255,0.1)' : 'transparent',
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                  {categories.length === 0 && !formData.category && (
                    <div style={{...styles.dropdownItem, color: 'rgba(255,255,255,0.5)'}}>
                      Type to search or create new category
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div style={styles.grid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Stock Quantity</label>
              <input
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Status</label>
              <div style={styles.statusOptions}>
                {['active', 'inactive', 'out_of_stock'].map(status => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFormData({ ...formData, status })}
                    style={{
                      ...styles.statusBtn,
                      backgroundColor: formData.status === status ? '#ffffff' : 'transparent',
                      color: formData.status === status ? '#000000' : 'rgba(255,255,255,0.6)',
                    }}
                  >
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={styles.textarea}
              rows={3}
            />
          </div>

          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading || uploadingImages || images.length === 0} 
              style={{
                ...styles.saveBtn,
                opacity: loading || uploadingImages || images.length === 0 ? 0.5 : 1,
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                  <LoadingSpinner size={16} thickness={2} />
                  Saving...
                </span>
              ) : (product ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    backdropFilter: 'blur(4px)',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  modal: {
    backgroundColor: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '700px',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 600,
  },
  closeBtn: {
    padding: '0.5rem',
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer',
    transition: 'color 0.2s',
    ':hover': {
      color: '#ffffff',
    },
  },
  error: {
    margin: '1rem 1.5rem',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(239,68,68,0.1)',
    color: '#ef4444',
    borderRadius: '8px',
    fontSize: '0.875rem',
  },
  form: {
    padding: '1.5rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '1rem',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '0.5rem',
  },
  imageCount: {
    color: 'rgba(255,255,255,0.3)',
    fontWeight: 'normal',
  },
  imageGallery: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  imageItem: {
    position: 'relative',
    aspectRatio: '1',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#111',
  },
  galleryImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  primaryBadge: {
    position: 'absolute',
    top: '4px',
    left: '4px',
    padding: '2px 6px',
    backgroundColor: '#22c55e',
    color: '#000',
    fontSize: '0.65rem',
    fontWeight: 600,
    borderRadius: '4px',
  },
  imageActions: {
    position: 'absolute',
    bottom: '4px',
    left: '4px',
    right: '4px',
    display: 'flex',
    gap: '4px',
    justifyContent: 'center',
  },
  imageActionBtn: {
    padding: '4px',
    backgroundColor: 'rgba(0,0,0,0.7)',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '1.5rem',
    border: '2px dashed rgba(255,255,255,0.2)',
    borderRadius: '8px',
    cursor: 'pointer',
    color: 'rgba(255,255,255,0.6)',
    transition: 'all 0.2s',
    ':hover': {
      borderColor: 'rgba(255,255,255,0.4)',
      color: '#ffffff',
    },
  },
  uploadHint: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.4)',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    ':focus': {
      borderColor: 'rgba(255,255,255,0.3)',
    },
  },
  categoryInputWrapper: {
    position: 'relative',
  },
  categoryInput: {
    width: '100%',
    padding: '0.75rem 2.5rem 0.75rem 1rem',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  dropdownToggle: {
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    padding: '0.25rem',
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: '4px',
    backgroundColor: '#141414',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    maxHeight: '200px',
    overflowY: 'auto',
    zIndex: 10,
  },
  dropdownItem: {
    width: '100%',
    padding: '0.625rem 1rem',
    textAlign: 'left',
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
    ':hover': {
      backgroundColor: 'rgba(255,255,255,0.05)',
    },
  },
  addNewCategory: {
    color: '#22c55e',
    fontWeight: 500,
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '0.9rem',
    outline: 'none',
    resize: 'vertical',
    minHeight: '80px',
  },
  statusOptions: {
    display: 'flex',
    gap: '0.5rem',
  },
  statusBtn: {
    padding: '0.5rem 1rem',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '6px',
    fontSize: '0.8rem',
    textTransform: 'capitalize',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
  cancelBtn: {
    flex: 1,
    padding: '0.875rem',
    backgroundColor: 'transparent',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      borderColor: 'rgba(255,255,255,0.4)',
      color: '#ffffff',
    },
  },
  saveBtn: {
    flex: 1,
    padding: '0.875rem',
    backgroundColor: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    color: '#000000',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    ':hover': {
      opacity: 0.9,
    },
  },
};
