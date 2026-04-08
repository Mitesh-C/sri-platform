import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import api from '../lib/api';
import { DollarSign, Users, FileText, Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';

const BusinessDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    capital_raised: 0,
    active_investors: 0,
    active_theses: 0
  });
  const [myTheses, setMyTheses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, thesesRes] = await Promise.all([
        api.get('/dashboard/business'),
        api.get('/theses/my').catch(() => ({ data: [] }))
      ]);
      setStats(statsRes.data);
      setMyTheses(thesesRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (thesisId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;
    try {
      await api.delete(`/theses/${thesisId}`);
      setMyTheses(myTheses.filter(t => t.id !== thesisId));
      toast.success('Thesis deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete thesis');
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-700';
      case 'funded': return 'bg-blue-500/10 text-blue-700';
      case 'pending': return 'bg-yellow-500/10 text-yellow-700';
      default: return 'bg-muted text-muted-foreground';
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
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">Active Thesis</p>
              <p className="font-mono text-3xl font-medium">{stats.active_theses}</p>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="p-8 md:p-12 rounded-2xl border-border/50 mb-12" data-testid="quick-actions-card">
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
              <Link to="/business/reference-price/new">
                <Button variant="outline" className="w-full h-20 rounded-xl justify-start text-left" data-testid="update-price-btn">
                  <div>
                    <p className="font-medium mb-1">Update Reference Price</p>
                    <p className="text-sm text-muted-foreground">Submit event-based price update</p>
                  </div>
                </Button>
              </Link>
            </div>
          </Card>

          {/* My Theses */}
          <Card className="p-8 md:p-12 rounded-2xl border-border/50" data-testid="my-theses-card">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-3xl font-normal">My Thesis</h2>
              <Link to="/business/thesis/new">
                <Button size="sm" className="rounded-full" data-testid="new-thesis-btn">
                  <Plus className="h-4 w-4 mr-1" strokeWidth={1.5} />
                  New Thesis
                </Button>
              </Link>
            </div>

            {myTheses.length === 0 ? (
              <div className="text-center py-12" data-testid="no-theses">
                <FileText className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" strokeWidth={1.5} />
                <p className="text-muted-foreground mb-4">You haven't created any thesis yet</p>
                <Link to="/business/thesis/new">
                  <Button className="rounded-full">Create Your First Thesis</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myTheses.map((thesis) => (
                  <div
                    key={thesis.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl border border-border/40 hover:bg-muted/20 transition-colors"
                    data-testid={`thesis-row-${thesis.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-medium truncate">{thesis.title}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${statusColor(thesis.status)}`}>
                          {thesis.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {thesis.industry} &middot; {thesis.geography} &middot; {thesis.stage}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => navigate(`/thesis/${thesis.id}`)}
                        data-testid={`view-thesis-${thesis.id}`}
                      >
                        <Eye className="h-4 w-4" strokeWidth={1.5} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => navigate(`/business/thesis/${thesis.id}/edit`)}
                        data-testid={`edit-thesis-${thesis.id}`}
                      >
                        <Pencil className="h-4 w-4" strokeWidth={1.5} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(thesis.id, thesis.title)}
                        data-testid={`delete-thesis-${thesis.id}`}
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
