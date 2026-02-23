import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import api from '../lib/api';
import { CreditCard, Plus, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const BankAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    country: 'US',
    bank_name: '',
    account_holder: '',
    account_number: '',
    routing_code: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await api.get('/bank-accounts/my');
      setAccounts(response.data);
    } catch (error) {
      toast.error('Failed to load bank accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/bank-accounts', formData);
      toast.success('Bank account added successfully. Verification pending.');
      setShowForm(false);
      setFormData({
        country: 'US',
        bank_name: '',
        account_holder: '',
        account_number: '',
        routing_code: ''
      });
      fetchAccounts();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to add bank account');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-600" strokeWidth={1.5} />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" strokeWidth={1.5} />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" strokeWidth={1.5} />;
      default:
        return null;
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
            <div className="flex items-center justify-between mb-12">
              <div>
                <h1 className="font-serif text-5xl md:text-6xl font-light tracking-tight mb-4" data-testid="bank-accounts-heading">
                  Bank Accounts
                </h1>
                <p className="text-lg text-muted-foreground">
                  Settlement rails only. Sri connects to banks, it does not replace them.
                </p>
              </div>
              {!showForm && (
                <Button
                  onClick={() => setShowForm(true)}
                  className="rounded-full"
                  data-testid="add-bank-btn"
                >
                  <Plus className="h-4 w-4 mr-2" strokeWidth={1.5} />
                  Add Bank
                </Button>
              )}
            </div>

            {/* Info Card */}
            <Card className="p-6 rounded-2xl border-border/50 bg-muted/30 mb-8" data-testid="info-card">
              <p className="text-sm leading-relaxed text-muted-foreground">
                <strong>Important:</strong> Bank accounts are used solely for settlement of investments and exits. 
                Sri does not hold funds, show balances, or enable instant transfers. Your bank remains your primary financial institution.
              </p>
            </Card>

            {/* Add Bank Form */}
            {showForm && (
              <Card className="p-8 md:p-12 rounded-2xl border-border/50 mb-8" data-testid="add-bank-form">
                <h2 className="font-serif text-3xl font-normal mb-8">Add Bank Account</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
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

                  <div className="space-y-2">
                    <Label htmlFor="bank_name">Bank Name</Label>
                    <Input
                      id="bank_name"
                      data-testid="input-bank-name"
                      value={formData.bank_name}
                      onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                      required
                      className="h-12 rounded-xl"
                      placeholder="Bank of America"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="account_holder">Account Holder Name</Label>
                    <Input
                      id="account_holder"
                      data-testid="input-account-holder"
                      value={formData.account_holder}
                      onChange={(e) => setFormData({ ...formData, account_holder: e.target.value })}
                      required
                      className="h-12 rounded-xl"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="account_number">Account Number</Label>
                    <Input
                      id="account_number"
                      data-testid="input-account-number"
                      value={formData.account_number}
                      onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                      required
                      className="h-12 rounded-xl"
                      placeholder="1234567890"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="routing_code">Routing Code / SWIFT</Label>
                    <Input
                      id="routing_code"
                      data-testid="input-routing-code"
                      value={formData.routing_code}
                      onChange={(e) => setFormData({ ...formData, routing_code: e.target.value })}
                      required
                      className="h-12 rounded-xl"
                      placeholder="123456789"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" className="flex-1 h-12 rounded-full" data-testid="submit-bank-btn">
                      Add Bank Account
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 rounded-full px-6"
                      onClick={() => setShowForm(false)}
                      data-testid="cancel-bank-btn"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Bank Accounts List */}
            <Card className="p-8 md:p-12 rounded-2xl border-border/50" data-testid="bank-accounts-list">
              <h2 className="font-serif text-3xl font-normal mb-8">Your Bank Accounts</h2>
              {loading ? (
                <div className="text-center py-12" data-testid="loading-state">
                  <p className="text-muted-foreground">Loading accounts...</p>
                </div>
              ) : accounts.length === 0 ? (
                <div className="text-center py-12" data-testid="empty-state">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" strokeWidth={1.5} />
                  <p className="text-muted-foreground mb-4">No bank accounts added yet</p>
                  {!showForm && (
                    <Button onClick={() => setShowForm(true)} className="rounded-full" data-testid="add-first-bank-btn">
                      Add Your First Bank Account
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {accounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between p-6 rounded-xl border border-border/40"
                      data-testid={`account-${account.id}`}
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <CreditCard className="h-5 w-5 text-primary" strokeWidth={1.5} />
                          <p className="font-medium">{account.bank_name}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {account.account_holder} • {account.country}
                        </p>
                        <p className="font-mono text-sm text-muted-foreground">
                          ****{account.account_number.slice(-4)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(account.status)}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            account.status === 'verified'
                              ? 'bg-green-500/10 text-green-700'
                              : account.status === 'pending'
                              ? 'bg-yellow-500/10 text-yellow-700'
                              : 'bg-red-500/10 text-red-700'
                          }`}
                        >
                          {account.status}
                        </span>
                      </div>
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

export default BankAccounts;