import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import api from '../lib/api';
import { toast } from 'sonner';
import { Clock } from 'lucide-react';

const LiquidityWindowCreate = () => {
  const navigate = useNavigate();
  const [theses, setTheses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    thesis_id: '',
    start_date: '',
    end_date: '',
    governance_confirmed: false
  });

  useEffect(() => {
    fetchTheses();
  }, []);

  const fetchTheses = async () => {
    try {
      const companiesRes = await api.get('/companies/my');
      const companyIds = companiesRes.data.map(c => c.id);
      
      const thesesRes = await api.get('/theses');
      const myTheses = thesesRes.data.filter(t => companyIds.includes(t.company_id));
      setTheses(myTheses);
    } catch (error) {
      toast.error('Failed to load theses');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.governance_confirmed) {
      toast.error('Please confirm governance approval');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString()
      };

      await api.post('/liquidity-windows', payload);
      toast.success('Liquidity window created successfully!');
      navigate('/business/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create liquidity window');
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
                <Clock className="h-8 w-8 text-primary" strokeWidth={1.5} />
                <h1 className="font-serif text-5xl md:text-6xl font-light tracking-tight" data-testid="liquidity-window-heading">
                  Create Liquidity Window
                </h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Open a governed, time-bound window for permissioned investor exits
              </p>
            </div>

            <Card className="p-8 md:p-12 rounded-2xl border-border/50 mb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="thesis_id">Investment Thesis *</Label>
                  <Select value={formData.thesis_id} onValueChange={(value) => setFormData({ ...formData, thesis_id: value })} required>
                    <SelectTrigger className="h-12 rounded-xl" data-testid="select-thesis">
                      <SelectValue placeholder="Select thesis" />
                    </SelectTrigger>
                    <SelectContent>
                      {theses.map((thesis) => (
                        <SelectItem key={thesis.id} value={thesis.id}>{thesis.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date *</Label>
                    <Input
                      id="start_date"
                      type="datetime-local"
                      data-testid="input-start-date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      required
                      className="h-12 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date *</Label>
                    <Input
                      id="end_date"
                      type="datetime-local"
                      data-testid="input-end-date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      required
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>

                <Card className="p-6 rounded-xl bg-yellow-500/5 border-yellow-500/20">
                  <h3 className="font-medium mb-4">Governance Requirements</h3>
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="governance"
                      checked={formData.governance_confirmed}
                      onCheckedChange={(checked) => setFormData({ ...formData, governance_confirmed: checked })}
                      data-testid="checkbox-governance"
                    />
                    <label htmlFor="governance" className="text-sm leading-relaxed cursor-pointer">
                      I confirm that this liquidity window has been approved through proper governance channels and complies with investor protection requirements. All participating investors will be notified in advance.
                    </label>
                  </div>
                </Card>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="flex-1 h-12 rounded-full"
                    disabled={loading}
                    data-testid="submit-window"
                  >
                    {loading ? 'Creating...' : 'Create Liquidity Window'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 rounded-full px-8"
                    onClick={() => navigate('/business/dashboard')}
                    data-testid="cancel-window"
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

export default LiquidityWindowCreate;