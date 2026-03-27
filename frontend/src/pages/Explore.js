import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import api from '../lib/api';
import { Search, Filter, ArrowRight, Plus, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

const Explore = () => {
  const [theses, setTheses] = useState([]);
  const [filteredTheses, setFilteredTheses] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    industry: 'all',
    geography: 'all'
  });
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTheses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, theses]);

  const fetchTheses = async () => {
    try {
      const response = await api.get('/theses');
      setTheses(response.data);
      setFilteredTheses(response.data);
    } catch (error) {
      toast.error('Failed to load theses');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...theses];

    if (filters.search) {
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          t.overview.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter((t) => t.status === filters.status);
    }

    if (filters.industry !== 'all') {
      filtered = filtered.filter((t) => t.industry === filters.industry);
    }

    if (filters.geography !== 'all') {
      filtered = filtered.filter((t) => t.geography === filters.geography);
    }

    setFilteredTheses(filtered);
  };

  const uniqueIndustries = [...new Set(theses.map((t) => t.industry))];
  const uniqueGeographies = [...new Set(theses.map((t) => t.geography))];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="font-serif text-5xl md:text-6xl font-light tracking-tight" data-testid="explore-heading">
              Investment Thesis
            </h1>
            {user && (user.role === 'business' || user.role === 'both' || user.role === 'admin') && (
              <div className="flex gap-3">
                <Link to="/business/thesis/new">
                  <Button className="rounded-full" data-testid="create-thesis-cta">
                    <Plus className="h-4 w-4 mr-2" strokeWidth={1.5} />
                    Create Thesis
                  </Button>
                </Link>
                <Link to="/business/company/new">
                  <Button variant="outline" className="rounded-full" data-testid="create-company-cta">
                    <Building2 className="h-4 w-4 mr-2" strokeWidth={1.5} />
                    Create Company
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <p className="text-lg leading-relaxed text-muted-foreground mb-12 max-w-2xl">
            Explore long-form investment thesis from startups seeking aligned, long-term investors.
          </p>

          {/* Filters */}
          <Card className="p-6 md:p-8 rounded-2xl border-border/50 mb-12" data-testid="filters-card">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
              <h3 className="font-serif text-xl font-normal">Filters</h3>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                <Input
                  placeholder="Search theses..."
                  className="pl-10 h-12 rounded-xl"
                  data-testid="filter-search"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
              
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="h-12 rounded-xl" data-testid="filter-status">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.industry} onValueChange={(value) => setFilters({ ...filters, industry: value })}>
                <SelectTrigger className="h-12 rounded-xl" data-testid="filter-industry">
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {uniqueIndustries.map((ind) => (
                    <SelectItem key={ind} value={ind}>
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.geography} onValueChange={(value) => setFilters({ ...filters, geography: value })}>
                <SelectTrigger className="h-12 rounded-xl" data-testid="filter-geography">
                  <SelectValue placeholder="Geography" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Geographies</SelectItem>
                  {uniqueGeographies.map((geo) => (
                    <SelectItem key={geo} value={geo}>
                      {geo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Theses Grid */}
          {loading ? (
            <div className="text-center py-12" data-testid="loading-state">
              <p className="text-muted-foreground">Loading theses...</p>
            </div>
          ) : filteredTheses.length === 0 ? (
            <div className="text-center py-12" data-testid="empty-state">
              <p className="text-muted-foreground">No theses found matching your filters.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="theses-grid">
              {filteredTheses.map((thesis, index) => (
                <motion.div
                  key={thesis.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Card
                    className="group p-6 rounded-2xl border-border/50 hover:shadow-lg transition-all h-full flex flex-col"
                    data-testid={`thesis-card-${thesis.id}`}
                  >
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
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
                        >
                          {thesis.status}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-serif text-2xl font-normal mb-3 group-hover:text-primary transition-colors" data-testid={`thesis-title-${thesis.id}`}>
                      {thesis.title}
                    </h3>

                    <p className="text-base leading-relaxed text-muted-foreground mb-4 flex-grow line-clamp-3">
                      {thesis.overview}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span>{thesis.geography}</span>
                      <span>•</span>
                      <span>{thesis.stage}</span>
                    </div>

                    <Link to={`/thesis/${thesis.id}`}>
                      <Button
                        variant="ghost"
                        className="w-full rounded-xl justify-between"
                        data-testid={`view-thesis-${thesis.id}`}
                      >
                        View Thesis
                        <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                      </Button>
                    </Link>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Explore;