import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { AlertTriangle, Building2, MapPin, TrendingUp, Shield, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

const ThesisDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [thesis, setThesis] = useState(null);
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInvestForm, setShowInvestForm] = useState(false);
  const [investmentData, setInvestmentData] = useState({
    amount: '',
    investment_type: 'one_time',
    frequency: 'monthly',
    acknowledged_risks: false
  });

  useEffect(() => {
    fetchThesisData();
  }, [id]);

  const fetchThesisData = async () => {
    try {
      const [thesisRes, discussionsRes] = await Promise.all([
        api.get(`/theses/${id}`),
        api.get(`/discussions/${id}`).catch(() => ({ data: [] }))
      ]);
      setThesis(thesisRes.data);
      setDiscussions(discussionsRes.data);
    } catch (error) {
      toast.error('Failed to load thesis');
    } finally {
      setLoading(false);
    }
  };

  const handleInvest = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to invest');
      navigate('/auth');
      return;
    }

    if (!investmentData.acknowledged_risks) {
      toast.error('Please acknowledge the investment risks');
      return;
    }

    try {
      if (investmentData.investment_type === 'recurring') {
        await api.post('/recurring-investments', {
          thesis_id: id,
          amount: parseFloat(investmentData.amount),
          frequency: investmentData.frequency
        });
        toast.success('Recurring investment set up successfully!');
      } else {
        await api.post('/investments', {
          thesis_id: id,
          amount: parseFloat(investmentData.amount),
          investment_type: 'one_time',
          acknowledged_risks: true
        });
        toast.success('Investment submitted successfully!');
      }
      
      setShowInvestForm(false);
      navigate('/investor/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Investment failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <p className="text-muted-foreground" data-testid="loading-state">Loading thesis...</p>
      </div>
    );
  }

  if (!thesis) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <p className="text-muted-foreground">Thesis not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary" data-testid="thesis-industry">
                  {thesis.industry}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    thesis.status === 'active'
                      ? 'bg-green-500/10 text-green-700'
                      : thesis.status === 'draft'
                      ? 'bg-yellow-500/10 text-yellow-700'
                      : 'bg-gray-500/10 text-gray-700'
                  }`}
                  data-testid="thesis-status"
                >
                  {thesis.status}
                </span>
              </div>
              <h1 className="font-serif text-5xl md:text-6xl font-light tracking-tight mb-4" data-testid="thesis-title">
                {thesis.title}
              </h1>
              <div className="flex items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" strokeWidth={1.5} />
                  <span>{thesis.geography}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" strokeWidth={1.5} />
                  <span>{thesis.stage}</span>
                </div>
              </div>
            </div>

            {/* Overview */}
            <Card className="p-8 md:p-12 rounded-2xl border-border/50 mb-8" data-testid="overview-card">
              <h2 className="font-serif text-3xl font-normal mb-6">Overview</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">{thesis.overview}</p>
            </Card>

            {/* Investment Thesis */}
            <Card className="p-8 md:p-12 rounded-2xl border-border/50 mb-8" data-testid="thesis-content-card">
              <h2 className="font-serif text-3xl font-normal mb-6">Investment Thesis</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-base leading-relaxed whitespace-pre-wrap">{thesis.thesis_content}</p>
              </div>
            </Card>

            {/* Risks */}
            <Card className="p-8 md:p-12 rounded-2xl border-border/50 border-yellow-500/20 bg-yellow-500/5 mb-8" data-testid="risks-card">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="h-6 w-6 text-yellow-600" strokeWidth={1.5} />
                <h2 className="font-serif text-3xl font-normal">Risks & Disclosures</h2>
              </div>
              <div className="prose max-w-none">
                <p className="text-base leading-relaxed whitespace-pre-wrap text-muted-foreground">{thesis.risks}</p>
              </div>
            </Card>

            {/* SAFE Structure */}
            <Card className="p-8 md:p-12 rounded-2xl border-border/50 mb-8" data-testid="safe-structure-card">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-6 w-6 text-primary" strokeWidth={1.5} />
                <h2 className="font-serif text-3xl font-normal">SAFE Structure</h2>
              </div>
              <div className="space-y-4">
                {Object.entries(thesis.safe_structure || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-4 rounded-xl bg-muted/30">
                    <span className="font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                    <span className="font-mono">{value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Invest Button / Form */}
            {thesis.status === 'active' && (
              <Card className="p-8 md:p-12 rounded-2xl border-border/50 mb-8" data-testid="invest-card">
                {!showInvestForm ? (
                  <div className="text-center">
                    <h2 className="font-serif text-3xl font-normal mb-4">Ready to invest?</h2>
                    <p className="text-muted-foreground mb-6">
                      Support this thesis through one-time or recurring investments
                    </p>
                    <Button
                      size="lg"
                      className="rounded-full px-8 py-6"
                      onClick={() => setShowInvestForm(true)}
                      data-testid="show-invest-form-btn"
                    >
                      Invest Now
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleInvest} className="space-y-6">
                    <h2 className="font-serif text-3xl font-normal mb-6">Investment Details</h2>
                    
                    <div className="space-y-2">
                      <Label>Investment Type</Label>
                      <RadioGroup
                        value={investmentData.investment_type}
                        onValueChange={(value) => setInvestmentData({ ...investmentData, investment_type: value })}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="one_time" id="one_time" data-testid="radio-one-time" />
                          <Label htmlFor="one_time" className="cursor-pointer">One-time Investment</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="recurring" id="recurring" data-testid="radio-recurring" />
                          <Label htmlFor="recurring" className="cursor-pointer">Recurring Investment (SIP)</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (USD)</Label>
                      <Input
                        id="amount"
                        type="number"
                        min="1"
                        step="0.01"
                        data-testid="input-amount"
                        value={investmentData.amount}
                        onChange={(e) => setInvestmentData({ ...investmentData, amount: e.target.value })}
                        required
                        className="h-12 rounded-xl"
                        placeholder="1000"
                      />
                    </div>

                    {investmentData.investment_type === 'recurring' && (
                      <div className="space-y-2">
                        <Label htmlFor="frequency">Frequency</Label>
                        <Select
                          value={investmentData.frequency}
                          onValueChange={(value) => setInvestmentData({ ...investmentData, frequency: value })}
                        >
                          <SelectTrigger className="h-12 rounded-xl" data-testid="select-frequency">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <Separator />

                    <div className="p-6 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="acknowledge"
                          checked={investmentData.acknowledged_risks}
                          onCheckedChange={(checked) =>
                            setInvestmentData({ ...investmentData, acknowledged_risks: checked })
                          }
                          data-testid="checkbox-acknowledge-risks"
                        />
                        <label htmlFor="acknowledge" className="text-sm leading-relaxed cursor-pointer">
                          I acknowledge that this investment is illiquid, high-risk, and may result in total loss. I have read the risks and SAFE terms disclosed above.
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="submit"
                        className="flex-1 h-12 rounded-full"
                        data-testid="submit-investment-btn"
                      >
                        Submit Investment
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-12 rounded-full px-6"
                        onClick={() => setShowInvestForm(false)}
                        data-testid="cancel-investment-btn"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </Card>
            )}

            {/* Discussions */}
            <Card className="p-8 md:p-12 rounded-2xl border-border/50" data-testid="discussions-card">
              <div className="flex items-center gap-3 mb-6">
                <MessageCircle className="h-6 w-6 text-primary" strokeWidth={1.5} />
                <h2 className="font-serif text-3xl font-normal">Discussion</h2>
              </div>
              {discussions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8" data-testid="discussions-empty">
                  No discussions yet
                </p>
              ) : (
                <div className="space-y-4">
                  {discussions.map((disc) => (
                    <div
                      key={disc.id}
                      className="p-6 rounded-xl border border-border/40"
                      data-testid={`discussion-${disc.id}`}
                    >
                      <p className="text-sm text-muted-foreground mb-2">
                        {new Date(disc.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-base leading-relaxed">{disc.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ThesisDetail;