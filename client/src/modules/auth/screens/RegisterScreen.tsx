import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router";
import { authClient } from "../../../lib/auth";

import { Card } from "../../../../../library/components/card";
import { TextInput } from "../../../../../library/components/textinput";
import { PasswordInput } from "../../../../../library/components/passwordinput";
import { Button } from "../../../../../library/components/button";
import { Alert } from "../../../../../library/components/alert";
import { Flex } from "../../../../../library/components/flex";
import { Stack } from "../../../../../library/components/stack";

export function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: signUpError } = await authClient.signUp.email({
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
    <Flex align="center" justify="center" style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-default)' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-4)' }}>
        <Card>
          <div style={{ padding: '24px 24px 0 24px', textAlign: 'center' }}>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Create an Account</h1>
            <p style={{ marginTop: '8px', marginBottom: 0, color: 'var(--color-text-secondary)', fontSize: '14px' }}>Join AgendaStudio to organize your life</p>
          </div>
          <div style={{ padding: '24px' }}>
            {error && (
              <Alert type="error" style={{ marginBottom: '16px' }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert type="success" style={{ marginBottom: '16px' }}>
                Account created successfully! Redirecting...
              </Alert>
            )}

            <form onSubmit={handleRegister}>
              <Stack gap="16px">
                <TextInput
                  id="name"
                  type="text"
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  autoComplete="name"
                />

                <TextInput
                  id="email"
                  type="email"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />

                <PasswordInput
                  id="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />

                <Button type="submit" variant="primary" loading={loading} fullWidth style={{ marginTop: '8px' }}>
                  Sign Up
                </Button>
              </Stack>
            </form>

            <Flex justify="center" style={{ marginTop: '24px' }}>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                Already have an account?{' '}
                <RouterLink 
                  to="/login" 
                  style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}
                  className="clickable"
                >
                  Sign in
                </RouterLink>
              </p>
            </Flex>
          </div>
        </Card>
      </div>
    </Flex>
  );
}
