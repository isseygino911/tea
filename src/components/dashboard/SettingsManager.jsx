import { useState, useEffect } from 'react';
import { settingsAPI } from '../../services/settingsAPI';
import { Percent, Save, Check, AlertCircle } from 'lucide-react';
import { LoadingBar } from '../ui/LoadingBar';

export const SettingsManager = () => {
  const [taxRate, setTaxRate] = useState(8); // Default 8%
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await settingsAPI.getSettings();
      const settings = res.data.settings || {};
      
      if (settings.tax_rate) {
        // Convert from decimal (0.08) to percentage (8)
        setTaxRate(parseFloat(settings.tax_rate) * 100);
      }
    } catch (err) {
      setError('Failed to load settings');
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Convert from percentage to decimal
      const taxRateDecimal = taxRate / 100;
      
      await settingsAPI.updateSettings({
        tax_rate: taxRateDecimal
      });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleTaxRateChange = (e) => {
    const value = e.target.value;
    // Allow empty string or numbers 0-100
    if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
      setTaxRate(value === '' ? '' : parseFloat(value));
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <LoadingBar text="Loading settings..." />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Settings</h2>
      </div>

      {/* Alerts */}
      {error && (
        <div style={styles.errorAlert}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div style={styles.successAlert}>
          <Check size={18} />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Settings Card */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={{...styles.iconBox, backgroundColor: '#8b5cf620', color: '#8b5cf6'}}>
            <Percent size={20} />
          </div>
          <div>
            <h3 style={styles.cardTitle}>Tax Rate</h3>
            <p style={styles.cardDescription}>
              Set the tax rate applied to all orders at checkout
            </p>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Tax Percentage (%)</label>
          <div style={styles.inputWrapper}>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={taxRate}
              onChange={handleTaxRateChange}
              style={styles.input}
              placeholder="8.00"
            />
            <span style={styles.inputSuffix}>%</span>
          </div>
          <p style={styles.helpText}>
            Enter a value between 0 and 100. Example: 8 for 8% tax
          </p>
        </div>

        {/* Preview */}
        <div style={styles.preview}>
          <h4 style={styles.previewTitle}>Preview</h4>
          <div style={styles.previewContent}>
            <div style={styles.previewRow}>
              <span style={styles.previewLabel}>Subtotal</span>
              <span style={styles.previewValue}>$100.00</span>
            </div>
            <div style={styles.previewRow}>
              <span style={styles.previewLabel}>Tax ({taxRate || 0}%)</span>
              <span style={styles.previewValue}>${((100 * (taxRate || 0)) / 100).toFixed(2)}</span>
            </div>
            <div style={styles.previewDivider} />
            <div style={styles.previewTotal}>
              <span>Total</span>
              <span>${(100 + (100 * (taxRate || 0)) / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || taxRate === ''}
          style={{
            ...styles.saveButton,
            opacity: saving || taxRate === '' ? 0.6 : 1,
            cursor: saving || taxRate === '' ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? (
            <span>Saving...</span>
          ) : (
            <>
              <Save size={16} />
              <span>Save Settings</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '1.5rem',
    maxWidth: '600px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 600,
  },
  card: {
    backgroundColor: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '1.5rem',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  iconBox: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: '0.25rem',
  },
  cardDescription: {
    fontSize: '0.875rem',
    color: 'rgba(255,255,255,0.5)',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '0.5rem',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '0.875rem 2.5rem 0.875rem 1rem',
    fontSize: '0.95rem',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#ffffff',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  inputSuffix: {
    position: 'absolute',
    right: '1rem',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.9rem',
    pointerEvents: 'none',
  },
  helpText: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.4)',
    marginTop: '0.5rem',
  },
  preview: {
    backgroundColor: '#000000',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '1.25rem',
    marginBottom: '1.5rem',
  },
  previewTitle: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '1rem',
  },
  previewContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  previewRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
  },
  previewLabel: {
    color: 'rgba(255,255,255,0.6)',
  },
  previewValue: {
    color: '#ffffff',
  },
  previewDivider: {
    height: '1px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    margin: '0.25rem 0',
  },
  previewTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#ffffff',
    paddingTop: '0.25rem',
  },
  saveButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '0.875rem 1.5rem',
    backgroundColor: '#ffffff',
    color: '#000000',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '8px',
    color: '#ef4444',
    marginBottom: '1.5rem',
    fontSize: '0.9rem',
  },
  successAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.2)',
    borderRadius: '8px',
    color: '#22c55e',
    marginBottom: '1.5rem',
    fontSize: '0.9rem',
  },
  loading: {
    padding: '4rem',
  },
};
