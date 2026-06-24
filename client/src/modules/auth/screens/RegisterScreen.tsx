import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router';
import { useAuth } from "../../../lib/hooks/useAuth";

import { TextInput } from "../../../../../library/components/textinput";
import { PasswordInput } from "../../../../../library/components/passwordinput";
import { Button } from "../../../../../library/components/button";

export function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: signUpError } = await register({
        name,
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message || "Failed to register. Please try again.");
        setLoading(false);
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch {
      setError("An unexpected error occurred. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle} className="glass">
        {/* Logo/Icon */}
        <div style={headerStyle}>
          <div style={logoContainerStyle}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="var(--color-text-primary)" strokeWidth="2.5" />
              <circle cx="12" cy="12" r="6" stroke="var(--color-primary)" strokeWidth="2" strokeDasharray="4 2" />
              <circle cx="12" cy="12" r="2" fill="var(--color-text-primary)" />
            </svg>
          </div>
          <h1 style={titleStyle}>AgendaStudio</h1>
        </div>

        {error && <div style={errorStyle}>{error}</div>}
        {success && <div style={successStyle}>Account created successfully! Redirecting...</div>}

        <form onSubmit={handleRegister} style={formStyle}>
          <TextInput
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />

          <TextInput
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <PasswordInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />

          <Button
            type="submit"
            loading={loading}
            variant="primary"
            fullWidth
            style={{ marginTop: 'var(--space-2)' }}
          >
            Create Account
          </Button>
        </form>

        <div style={footerStyle}>
          <RouterLink to="/login" style={{ textDecoration: 'none' }}>
            <button style={toggleButtonStyle} type="button">
              Already have an account? Sign In
            </button>
          </RouterLink>
        </div>
      </div>
    </div>
  );
}

// Styles
const containerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100vw',
  height: '100vh',
  background: 'var(--color-surface-app)',
  overflow: 'hidden',
  position: 'relative',
  fontFamily: 'var(--sans)'
};

const cardStyle: React.CSSProperties = {
  width: '400px',
  padding: '40px',
  borderRadius: 'var(--space-2)',
  border: '1px solid var(--color-border-default)',
  background: 'var(--color-surface-card)',
  zIndex: 10,
  boxShadow: 'var(--shadow-lg)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-6)'
};

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 'var(--space-2)'
};

const logoContainerStyle: React.CSSProperties = {
  padding: 'var(--space-3)',
  borderRadius: 'var(--space-2)',
  background: 'var(--color-base50)',
  border: '1px solid var(--color-border-default)',
  marginBottom: 'var(--space-2)'
};

const titleStyle: React.CSSProperties = {
  fontSize: 'var(--space-6)',
  fontWeight: 600,
  color: 'var(--color-text-primary)',
  letterSpacing: '-0.5px'
};

const errorStyle: React.CSSProperties = {
  padding: '10px 14px',
  background: 'rgba(239, 68, 68, 0.08)',
  border: '1px solid rgba(239, 68, 68, 0.18)',
  borderRadius: '6px',
  color: '#ef4444',
  fontSize: 'var(--space-3)',
  lineHeight: '1.4'
};

const successStyle: React.CSSProperties = {
  padding: '10px 14px',
  background: 'var(--color-bg-success)',
  border: '1px solid var(--color-success)',
  borderRadius: '6px',
  color: 'var(--color-text-success)',
  fontSize: 'var(--space-3)',
  lineHeight: '1.4'
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-4)'
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  marginTop: 'var(--space-2)'
};

const toggleButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--color-primary)',
  fontSize: 'var(--space-3)',
  cursor: 'pointer',
  outline: 'none',
  transition: 'color var(--transition-fast)'
};
