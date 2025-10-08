import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Coins } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.string().email({ message: "Ungültige E-Mail-Adresse" });
const passwordSchema = z.string().min(6, { message: "Passwort muss mindestens 6 Zeichen lang sein" });
const usernameSchema = z.string().min(3, { message: "Benutzername muss mindestens 3 Zeichen lang sein" }).max(20, { message: "Benutzername darf maximal 20 Zeichen lang sein" });

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if already logged in
  if (user) {
    navigate('/');
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      emailSchema.parse(loginEmail);
      passwordSchema.parse(loginPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
        return;
      }
    }

    const { error } = await signIn(loginEmail, loginPassword);
    if (!error) {
      navigate('/');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      usernameSchema.parse(signupUsername);
      emailSchema.parse(signupEmail);
      passwordSchema.parse(signupPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
        return;
      }
    }

    const { error } = await signUp(signupEmail, signupPassword, signupUsername);
    if (!error) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-effect mx-auto mb-4">
            <Coins className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-gradient-gold mb-2">VirtualCasino</h1>
          <p className="text-muted-foreground">Spielen Sie sicher mit Spielgeld</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Anmelden</TabsTrigger>
            <TabsTrigger value="signup">Registrieren</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Anmelden</CardTitle>
                <CardDescription>Melden Sie sich mit Ihrem Konto an</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">E-Mail</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="ihre@email.de"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                    {errors.loginEmail && <p className="text-sm text-destructive">{errors.loginEmail}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Passwort</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                    {errors.loginPassword && <p className="text-sm text-destructive">{errors.loginPassword}</p>}
                  </div>
                  <Button type="submit" className="w-full">
                    Anmelden
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Registrieren</CardTitle>
                <CardDescription>Erstellen Sie ein neues Konto</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-username">Benutzername</Label>
                    <Input
                      id="signup-username"
                      type="text"
                      placeholder="IhrBenutzername"
                      value={signupUsername}
                      onChange={(e) => setSignupUsername(e.target.value)}
                      required
                    />
                    {errors.signupUsername && <p className="text-sm text-destructive">{errors.signupUsername}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">E-Mail</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="ihre@email.de"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                    {errors.signupEmail && <p className="text-sm text-destructive">{errors.signupEmail}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Passwort</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                    />
                    {errors.signupPassword && <p className="text-sm text-destructive">{errors.signupPassword}</p>}
                  </div>
                  <Button type="submit" className="w-full">
                    Registrieren
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
