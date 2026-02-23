import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import api from '../lib/api';
import { toast } from 'sonner';
import { TrendingUp } from 'lucide-react';

const ReferencePriceUpdate = () => {
  const navigate = useNavigate();
  const [theses, setTheses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    thesis_id: '',
    old_price: '',
    new_price: '',
    reason: ''
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
    setLoading(true);

    try {
      const payload = {
        thesis_id: formData.thesis_id,
        old_price: formData.old_price ? parseFloat(formData.old_price) : null,
        new_price: parseFloat(formData.new_price),
        reason: formData.reason
      };

      await api.post('/reference-prices', payload);
      toast.success('Reference price updated successfully!');
      navigate('/business/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update price');
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
                <TrendingUp className="h-8 w-8 text-primary" strokeWidth={1.5} />
                <h1 className="font-serif text-5xl md:text-6xl font-light tracking-tight" data-testid="price-update-heading">
                  Reference Price Update
                </h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Submit an event-based reference price update with clear justification
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
                    <Label htmlFor="old_price">Previous Reference Price</Label>
                    <Input
                      id="old_price"
                      type="number"
                      step="0.01"
                      data-testid="input-old-price"
                      value={formData.old_price}
                      onChange={(e) => setFormData({ ...formData, old_price: e.target.value })}
                      className="h-12 rounded-xl"
                      placeholder="100.00"
                    />
                    <p className="text-xs text-muted-foreground">Leave empty if this is the first price update</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new_price">New Reference Price *</Label>
                    <Input
                      id="new_price"
                      type="number"
                      step="0.01"
                      data-testid="input-new-price"
                      value={formData.new_price}
                      onChange={(e) => setFormData({ ...formData, new_price: e.target.value })}
                      required
                      className="h-12 rounded-xl"
                      placeholder="150.00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Update *</Label>
                  <Textarea
                    id="reason"
                    data-testid="textarea-reason"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    required
                    className="min-h-[150px] rounded-xl"
                    placeholder="Describe the event or milestone that justifies this price update (e.g., new funding round, major partnership, product launch, revenue milestone)..."
                  />
                </div>

                <Card className="p-6 rounded-xl bg-muted/30 border-border/20">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    <strong>Note:</strong> Reference price updates must be event-based and auditable. They are used for informational purposes only and do not represent guaranteed valuations or trading prices.
                  </p>
                </Card>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="flex-1 h-12 rounded-full"
                    disabled={loading}
                    data-testid="submit-price"
                  >
                    {loading ? 'Submitting...' : 'Submit Price Update'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 rounded-full px-8"
                    onClick={() => navigate('/business/dashboard')}
                    data-testid="cancel-price"
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

export default ReferencePriceUpdate;