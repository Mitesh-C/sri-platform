import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import api from '../lib/api';
import { TrendingUp, Repeat, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const InvestorDashboard = () => {
  const [stats, setStats] = useState({
    total_invested: 0,
    active_investments: 0,
    recurring_count: 0
  });
  const [investments, setInvestments] = useState([]);
  const [recurring, setRecurring] = useState([]);
  const [referencePrices, setReferencePrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, investmentsRes, recurringRes, pricesRes] = await Promise.all([
        api.get('/dashboard/investor'),
        api.get('/investments/my'),
        api.get('/recurring-investments/my'),
        api.get('/reference-prices')
      ]);

      setStats(statsRes.data);
      setInvestments(investmentsRes.data);
      setRecurring(recurringRes.data);
      setReferencePrices(pricesRes.data.slice(0, 10));
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handlePauseRecurring = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      await api.patch(`/recurring-investments/${id}/status?status=${newStatus}`);
      toast.success(`Recurring investment ${newStatus}`);
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update recurring investment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <p className="text-muted-foreground" data-testid="loading-state">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="font-serif text-5xl md:text-6xl font-light tracking-tight mb-12" data-testid="dashboard-heading">
            Investor Dashboard
          </h1>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-8 rounded-2xl border-border/50" data-testid="stat-total-invested">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" strokeWidth={1.5} />
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">Total Invested</p>
              <p className="font-mono text-3xl font-medium">${stats.total_invested.toLocaleString()}</p>
            </Card>

            <Card className="p-8 rounded-2xl border-border/50" data-testid="stat-active-investments">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" strokeWidth={1.5} />
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">Active Investments</p>
              <p className="font-mono text-3xl font-medium">{stats.active_investments}</p>
            </Card>

            <Card className="p-8 rounded-2xl border-border/50" data-testid="stat-recurring">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Repeat className="h-6 w-6 text-primary" strokeWidth={1.5} />
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">Recurring Plans</p>
              <p className="font-mono text-3xl font-medium">{stats.recurring_count}</p>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="investments" className="w-full">
            <TabsList className="mb-8" data-testid="dashboard-tabs">
              <TabsTrigger value="investments" data-testid="tab-investments">Investments</TabsTrigger>
              <TabsTrigger value="recurring" data-testid="tab-recurring">Recurring</TabsTrigger>
              <TabsTrigger value="reference-prices" data-testid="tab-reference-prices">Reference Prices</TabsTrigger>
            </TabsList>

            <TabsContent value="investments">
              <Card className="p-8 rounded-2xl border-border/50" data-testid="investments-list">
                <h2 className="font-serif text-2xl font-normal mb-6">Investment History</h2>
                {investments.length === 0 ? (
                  <div className="text-center py-12" data-testid="investments-empty">
                    <p className="text-muted-foreground mb-4">No investments yet</p>
                    <Link to="/explore">
                      <Button className="rounded-full" data-testid="explore-theses-cta">Explore Theses</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {investments.map((inv) => (
                      <div
                        key={inv.id}
                        className="flex items-center justify-between p-6 rounded-xl border border-border/40 hover:bg-muted/30 transition-colors"
                        data-testid={`investment-${inv.id}`}
                      >
                        <div>
                          <p className="font-medium mb-1">Investment #{inv.id.slice(0, 8)}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(inv.created_at).toLocaleDateString()} • {inv.investment_type}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-xl font-medium">${inv.amount.toLocaleString()}</p>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              inv.status === 'completed'
                                ? 'bg-green-500/10 text-green-700'
                                : inv.status === 'pending'
                                ? 'bg-yellow-500/10 text-yellow-700'
                                : 'bg-red-500/10 text-red-700'
                            }`}
                          >
                            {inv.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="recurring">
              <Card className="p-8 rounded-2xl border-border/50" data-testid="recurring-list">
                <h2 className="font-serif text-2xl font-normal mb-6">Recurring Investments</h2>
                {recurring.length === 0 ? (
                  <div className="text-center py-12" data-testid="recurring-empty">
                    <p className="text-muted-foreground mb-4">No recurring investments</p>
                    <Link to="/explore">
                      <Button className="rounded-full" data-testid="setup-recurring-cta">Set Up Recurring Investment</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recurring.map((rec) => (
                      <div
                        key={rec.id}
                        className="flex items-center justify-between p-6 rounded-xl border border-border/40"
                        data-testid={`recurring-${rec.id}`}
                      >
                        <div>
                          <p className="font-medium mb-1">{rec.frequency} Investment</p>
                          <p className="text-sm text-muted-foreground">
                            Next run: {new Date(rec.next_run).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-mono text-xl font-medium">${rec.amount.toLocaleString()}</p>
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                rec.status === 'active'
                                  ? 'bg-green-500/10 text-green-700'
                                  : rec.status === 'paused'
                                  ? 'bg-yellow-500/10 text-yellow-700'
                                  : 'bg-gray-500/10 text-gray-700'
                              }`}
                            >
                              {rec.status}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            onClick={() => handlePauseRecurring(rec.id, rec.status)}
                            data-testid={`recurring-toggle-${rec.id}`}
                          >
                            {rec.status === 'active' ? 'Pause' : 'Resume'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="reference-prices">
              <Card className="p-8 rounded-2xl border-border/50" data-testid="reference-prices-list">
                <h2 className="font-serif text-2xl font-normal mb-6">Recent Reference Price Updates</h2>
                {referencePrices.length === 0 ? (
                  <div className="text-center py-12" data-testid="reference-prices-empty">
                    <p className="text-muted-foreground">No reference price updates yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {referencePrices.map((price) => (
                      <div
                        key={price.id}
                        className="p-6 rounded-xl border border-border/40"
                        data-testid={`reference-price-${price.id}`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                            <p className="text-sm text-muted-foreground">
                              {new Date(price.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mb-2">
                          {price.old_price && (
                            <>
                              <span className="font-mono text-lg line-through text-muted-foreground">
                                ${price.old_price}
                              </span>
                              <span className="text-muted-foreground">→</span>
                            </>
                          )}
                          <span className="font-mono text-xl font-medium">${price.new_price}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{price.reason}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default InvestorDashboard;