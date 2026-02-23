import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import api from '../lib/api';
import { toast } from 'sonner';
import { Building2 } from 'lucide-react';

const CompanyCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    geography: '',
    website: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/companies', formData);
      toast.success('Company created successfully!');
      navigate('/business/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create company');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="h-8 w-8 text-primary" strokeWidth={1.5} />
                <h1 className="font-serif text-5xl md:text-6xl font-light tracking-tight" data-testid="company-create-heading">
                  Create Company
                </h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Add a new company to your business portfolio
              </p>
            </div>

            <Card className="p-8 md:p-12 rounded-2xl border-border/50">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    data-testid="input-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="h-12 rounded-xl"
                    placeholder="Solar Futures Inc"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    data-testid="textarea-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    className="min-h-[120px] rounded-xl"
                    placeholder="Brief description of your company and what it does..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry *</Label>
                    <Input
                      id="industry"
                      data-testid="input-industry"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      required
                      className="h-12 rounded-xl"
                      placeholder="Energy"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="geography">Geography *</Label>
                    <Input
                      id="geography"
                      data-testid="input-geography"
                      value={formData.geography}
                      onChange={(e) => setFormData({ ...formData, geography: e.target.value })}
                      required
                      className="h-12 rounded-xl"
                      placeholder="North America"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    data-testid="input-website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="h-12 rounded-xl"
                    placeholder="https://yourcompany.com"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="flex-1 h-12 rounded-full"
                    disabled={loading}
                    data-testid="submit-company"
                  >
                    {loading ? 'Creating...' : 'Create Company'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 rounded-full px-8"
                    onClick={() => navigate('/business/dashboard')}
                    data-testid="cancel-company"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;
