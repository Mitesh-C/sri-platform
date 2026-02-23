import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import api from '../lib/api';
import { DollarSign, Users, FileText, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const BusinessDashboard = () => {
  const [stats, setStats] = useState({
    capital_raised: 0,
    active_investors: 0,
    active_theses: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/business');
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
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
          <div className="flex items-center justify-between mb-12">
            <h1 className="font-serif text-5xl md:text-6xl font-light tracking-tight" data-testid="dashboard-heading">
              Business Dashboard
            </h1>
            <Link to="/business/company/new">
              <Button className="rounded-full" data-testid="create-company-btn">
                <Plus className="h-4 w-4 mr-2" strokeWidth={1.5} />
                New Company
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-8 rounded-2xl border-border/50" data-testid="stat-capital-raised">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" strokeWidth={1.5} />
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">Capital Raised</p>
              <p className="font-mono text-3xl font-medium">${stats.capital_raised.toLocaleString()}</p>
            </Card>

            <Card className="p-8 rounded-2xl border-border/50" data-testid="stat-active-investors">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" strokeWidth={1.5} />
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">Active Investors</p>
              <p className="font-mono text-3xl font-medium">{stats.active_investors}</p>
            </Card>

            <Card className="p-8 rounded-2xl border-border/50" data-testid="stat-active-theses">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" strokeWidth={1.5} />
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">Active Theses</p>
              <p className="font-mono text-3xl font-medium">{stats.active_theses}</p>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="p-8 md:p-12 rounded-2xl border-border/50" data-testid="quick-actions-card">
            <h2 className="font-serif text-3xl font-normal mb-8">Quick Actions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Link to="/business/thesis/new">
                <Button variant="outline" className="w-full h-20 rounded-xl justify-start text-left" data-testid="create-thesis-btn">
                  <div>
                    <p className="font-medium mb-1">Create Investment Thesis</p>
                    <p className="text-sm text-muted-foreground">Publish a new thesis for investors</p>
                  </div>
                </Button>
              </Link>
              <Link to="/business/liquidity-window/new">
                <Button variant="outline" className="w-full h-20 rounded-xl justify-start text-left" data-testid="create-window-btn">
                  <div>
                    <p className="font-medium mb-1">Create Liquidity Window</p>
                    <p className="text-sm text-muted-foreground">Open a governed liquidity window</p>
                  </div>
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default BusinessDashboard;