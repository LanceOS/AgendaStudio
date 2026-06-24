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

export function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await authClient.signIn.email({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message || "Failed to login. Please check your credentials.");
      } else {
        navigate("/");
      }
    } catch {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex align="center" justify="center" style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-default)' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-4)' }}>
        <Card>
          <div style={{ padding: '24px 24px 0 24px', textAlign: 'center' }}>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Welcome Back</h1>
            <p style={{ marginTop: '8px', marginBottom: 0, color: 'var(--color-text-secondary)', fontSize: '14px' }}>Sign in to continue to AgendaStudio</p>
          </div>
          <div style={{ padding: '24px' }}>
            {error && (
              <Alert type="error" style={{ marginBottom: '16px' }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleLogin}>
              <Stack gap="16px">
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
                  autoComplete="current-password"
                />

                <Button type="submit" variant="primary" loading={loading} fullWidth style={{ marginTop: '8px' }}>
                  Sign In
                </Button>
              </Stack>
            </form>

            <Flex justify="center" style={{ marginTop: '24px' }}>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                Don't have an account?{' '}
                <RouterLink 
                  to="/register" 
                  style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}
                  className="clickable"
                >
                  Create one
                </RouterLink>
              </p>
            </Flex>
          </div>
        </Card>
      </div>
    </Flex>
  );
}
