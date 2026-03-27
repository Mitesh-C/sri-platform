import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import api from '../lib/api';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('No verification token provided');
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await api.get(`/auth/verify-email/${token}`);
      setStatus('success');
      setMessage(response.data.message || 'Email verified successfully!');
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.detail || 'Verification failed. The link may have expired.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md mx-auto"
        >
          <Card className="p-8 md:p-12 rounded-2xl border-border/50 text-center" data-testid="verify-email-card">
            {status === 'verifying' && (
              <>
                <Loader2 className="h-16 w-16 text-primary mx-auto mb-6 animate-spin" strokeWidth={1.5} />
                <h2 className="font-serif text-3xl font-light mb-4" data-testid="verify-status">Verifying...</h2>
                <p className="text-muted-foreground">Please wait while we verify your email address.</p>
              </>
            )}

            {status === 'success' && (
              <>
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" strokeWidth={1.5} />
                <h2 className="font-serif text-3xl font-light mb-4" data-testid="verify-status">Email Verified</h2>
                <p className="text-muted-foreground mb-8">{message}</p>
                <Link to="/auth">
                  <Button className="rounded-full px-8" data-testid="verify-signin-btn">
                    Sign In
                  </Button>
                </Link>
              </>
            )}

            {status === 'error' && (
              <>
                <XCircle className="h-16 w-16 text-destructive mx-auto mb-6" strokeWidth={1.5} />
                <h2 className="font-serif text-3xl font-light mb-4" data-testid="verify-status">Verification Failed</h2>
                <p className="text-muted-foreground mb-8">{message}</p>
                <Link to="/auth">
                  <Button className="rounded-full px-8" data-testid="verify-try-again-btn">
                    Back to Sign In
                  </Button>
                </Link>
              </>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyEmail;
