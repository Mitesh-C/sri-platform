import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'investor',
    country: 'US'
  });
  const [acknowledged, setAcknowledged] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLogin && !acknowledged) {
      toast.error('Please acknowledge that Sri is not a trading platform');
      return;
    }

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success('Welcome back!');
      } else {
        await signup(formData);
        toast.success('Account created successfully!');
      }
      
      if (formData.role === 'investor' || formData.role === 'both') {
        navigate('/investor/dashboard');
      } else if (formData.role === 'business') {
        navigate('/business/dashboard');
      } else {
        navigate('/explore');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-5"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1694303165593-f9b9812f212a?crop=entropy&cs=srgb&fm=jpg&q=85')`,
        }}
      />
      <div className="container relative mx-auto px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md mx-auto"
        >
          <Card className="p-8 md:p-12 rounded-2xl border-border/50" data-testid="auth-card">
            <h2 className="font-serif text-4xl font-light tracking-tight mb-2" data-testid="auth-heading">
              {isLogin ? 'Welcome back' : 'Join Sri'}
            </h2>
            <p className="text-base text-muted-foreground mb-8">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    data-testid="input-fullname"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                    className="h-12 rounded-xl"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  data-testid="input-email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  data-testid="input-password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="h-12 rounded-xl"
                />
              </div>

              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="role">I am a...</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData({ ...formData, role: value })}
                    >
                      <SelectTrigger className="h-12 rounded-xl" data-testid="select-role">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="investor" data-testid="role-investor">Investor</SelectItem>
                        <SelectItem value="business" data-testid="role-business">Business / Founder</SelectItem>
                        <SelectItem value="both" data-testid="role-both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      data-testid="input-country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      required
                      className="h-12 rounded-xl"
                      placeholder="US"
                    />
                  </div>

                  <div className="flex items-start space-x-3 p-4 rounded-xl bg-muted/30">
                    <Checkbox
                      id="acknowledge"
                      checked={acknowledged}
                      onCheckedChange={setAcknowledged}
                      data-testid="checkbox-acknowledge"
                    />
                    <label htmlFor="acknowledge" className="text-sm leading-relaxed cursor-pointer">
                      I acknowledge that Sri is not a trading platform, stock exchange, or wallet system. It is a governed investment infrastructure for long-term ownership.
                    </label>
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="w-full h-12 rounded-full font-medium"
                data-testid="auth-submit"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary hover:underline"
                data-testid="auth-toggle"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;