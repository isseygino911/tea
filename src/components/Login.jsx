import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.subtitle}>Sign in to continue</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.button}>
            Sign In <ArrowRight size={18} />
          </button>
        </form>

        <p style={styles.link}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.linkText}>Create one</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    paddingTop: '100px',
    backgroundColor: '#F4EDE0',
  },
  content: {
    width: '100%',
    maxWidth: '420px',
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 'clamp(2rem, 5vw, 3.2rem)',
    fontWeight: 300,
    color: '#1A1A1A',
    letterSpacing: '-0.02em',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.95rem',
    color: 'rgba(26,26,26,0.5)',
    marginBottom: '3rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.68rem',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: '#8FA3A8',
  },
  input: {
    padding: '0.75rem 0',
    background: 'none',
    border: 'none',
    borderBottom: '1px solid rgba(31,61,46,0.2)',
    color: '#1A1A1A',
    fontFamily: 'Inter, sans-serif',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    padding: '1rem 1.5rem',
    marginTop: '1rem',
    backgroundColor: '#1F3D2E',
    color: '#F4EDE0',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.76rem',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    border: 'none',
    transition: 'background-color 0.2s ease',
    cursor: 'pointer',
  },
  error: {
    padding: '0.875rem 1rem',
    marginBottom: '1.5rem',
    backgroundColor: 'rgba(184,120,73,0.08)',
    border: '1px solid rgba(184,120,73,0.2)',
    color: '#B87849',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.85rem',
  },
  link: {
    marginTop: '2rem',
    textAlign: 'center',
    fontFamily: 'Inter, sans-serif',
    color: 'rgba(26,26,26,0.5)',
    fontSize: '0.875rem',
  },
  linkText: {
    color: '#1F3D2E',
    textDecoration: 'none',
    borderBottom: '1px solid rgba(31,61,46,0.25)',
    paddingBottom: '1px',
  },
};
