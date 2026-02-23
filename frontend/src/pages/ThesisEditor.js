import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import api from '../lib/api';
import { toast } from 'sonner';
import { FileText, Plus, Trash2 } from 'lucide-react';

const ThesisEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_id: '',
    title: '',
    overview: '',
    thesis_content: '',
    risks: '',
    industry: '',
    geography: '',
    stage: 'Pre-seed',
    status: 'draft'
  });
  const [safeFields, setSafeFields] = useState([
    { key: 'valuation_cap', value: '' },
    { key: 'discount_rate', value: '' },
    { key: 'type', value: '' }
  ]);

  useEffect(() => {
    fetchCompanies();
    if (id) {
      fetchThesis();
    }
  }, [id]);

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/companies/my');
      setCompanies(response.data);
    } catch (error) {
      toast.error('Failed to load companies');
    }
  };

  const fetchThesis = async () => {
    try {
      const response = await api.get(`/theses/${id}`);
      const thesis = response.data;
      setFormData({
        company_id: thesis.company_id,
        title: thesis.title,
        overview: thesis.overview,
        thesis_content: thesis.thesis_content,
        risks: thesis.risks,
        industry: thesis.industry,
        geography: thesis.geography,
        stage: thesis.stage,
        status: thesis.status
      });
      
      if (thesis.safe_structure) {
        const fields = Object.entries(thesis.safe_structure).map(([key, value]) => ({ key, value }));
        setSafeFields(fields);
      }
    } catch (error) {
      toast.error('Failed to load thesis');
    }
  };

  const handleAddSafeField = () => {
    setSafeFields([...safeFields, { key: '', value: '' }]);
  };

  const handleRemoveSafeField = (index) => {
    setSafeFields(safeFields.filter((_, i) => i !== index));
  };

  const handleSafeFieldChange = (index, field, value) => {
    const updated = [...safeFields];
    updated[index][field] = value;
    setSafeFields(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const safe_structure = {};
      safeFields.forEach(field => {
        if (field.key && field.value) {
          safe_structure[field.key] = field.value;
        }
      });

      const payload = { ...formData, safe_structure };

      if (id) {
        await api.put(`/theses/${id}`, payload);
        toast.success('Thesis updated successfully!');
      } else {
        await api.post('/theses', payload);
        toast.success('Thesis created successfully!');
      }

      navigate('/business/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save thesis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-8 w-8 text-primary" strokeWidth={1.5} />
                <h1 className="font-serif text-5xl md:text-6xl font-light tracking-tight" data-testid="thesis-editor-heading">
                  {id ? 'Edit Thesis' : 'Create Investment Thesis'}
                </h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Publish a comprehensive investment thesis with transparent risks and governance
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <Card className="p-8 md:p-12 rounded-2xl border-border/50 mb-8" data-testid="thesis-form">
                <h2 className="font-serif text-3xl font-normal mb-8">Basic Information</h2>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="company_id">Company *</Label>
                    <Select value={formData.company_id} onValueChange={(value) => setFormData({ ...formData, company_id: value })} required>
                      <SelectTrigger className="h-12 rounded-xl" data-testid="select-company">
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Thesis Title *</Label>
                    <Input
                      id="title"
                      data-testid="input-title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="h-12 rounded-xl"
                      placeholder="Democratizing Clean Energy Storage"
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

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="stage">Stage *</Label>
                      <Select value={formData.stage} onValueChange={(value) => setFormData({ ...formData, stage: value })}>
                        <SelectTrigger className="h-12 rounded-xl" data-testid="select-stage">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pre-seed">Pre-seed</SelectItem>
                          <SelectItem value="Seed">Seed</SelectItem>
                          <SelectItem value="Series A">Series A</SelectItem>
                          <SelectItem value="Series B">Series B</SelectItem>
                          <SelectItem value="Series C+">Series C+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status *</Label>
                      <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                        <SelectTrigger className="h-12 rounded-xl" data-testid="select-status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-8 md:p-12 rounded-2xl border-border/50 mb-8">
                <h2 className="font-serif text-3xl font-normal mb-8">Thesis Content</h2>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="overview">Overview *</Label>
                    <Textarea
                      id="overview"
                      data-testid="textarea-overview"
                      value={formData.overview}
                      onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                      required
                      className="min-h-[100px] rounded-xl"
                      placeholder="A brief overview of your company and investment opportunity..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="thesis_content">Full Investment Thesis *</Label>
                    <Textarea
                      id="thesis_content"
                      data-testid="textarea-thesis"
                      value={formData.thesis_content}
                      onChange={(e) => setFormData({ ...formData, thesis_content: e.target.value })}
                      required
                      className="min-h-[300px] rounded-xl"
                      placeholder="Provide detailed information about market opportunity, technology, team, traction, use of capital..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="risks">Risks & Disclosures *</Label>
                    <Textarea
                      id="risks"
                      data-testid="textarea-risks"
                      value={formData.risks}
                      onChange={(e) => setFormData({ ...formData, risks: e.target.value })}
                      required
                      className="min-h-[200px] rounded-xl"
                      placeholder="Technology risk, market risk, competition, liquidity risk, regulatory risk..."
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-8 md:p-12 rounded-2xl border-border/50 mb-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-serif text-3xl font-normal">SAFE Structure</h2>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddSafeField} data-testid="add-safe-field">
                    <Plus className="h-4 w-4 mr-2" strokeWidth={1.5} />
                    Add Field
                  </Button>
                </div>

                <div className="space-y-4">
                  {safeFields.map((field, index) => (
                    <div key={index} className="flex gap-4 items-end">
                      <div className="flex-1 space-y-2">
                        <Label>Field Name</Label>
                        <Input
                          value={field.key}
                          onChange={(e) => handleSafeFieldChange(index, 'key', e.target.value)}
                          className="h-12 rounded-xl"
                          placeholder="valuation_cap"
                          data-testid={`safe-key-${index}`}
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label>Value</Label>
                        <Input
                          value={field.value}
                          onChange={(e) => handleSafeFieldChange(index, 'value', e.target.value)}
                          className="h-12 rounded-xl"
                          placeholder="$30M"
                          data-testid={`safe-value-${index}`}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveSafeField(index)}
                        data-testid={`remove-safe-${index}`}
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 h-12 rounded-full"
                  disabled={loading}
                  data-testid="submit-thesis"
                >
                  {loading ? 'Saving...' : id ? 'Update Thesis' : 'Create Thesis'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 rounded-full px-8"
                  onClick={() => navigate('/business/dashboard')}
                  data-testid="cancel-thesis"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ThesisEditor;