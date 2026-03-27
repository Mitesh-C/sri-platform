import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Explore from './pages/Explore';
import ThesisDetail from './pages/ThesisDetail';
import Governance from './pages/Governance';
import InvestorDashboard from './pages/InvestorDashboard';
import BusinessDashboard from './pages/BusinessDashboard';
import BankAccounts from './pages/BankAccounts';
import ThesisEditor from './pages/ThesisEditor';
import LiquidityWindowCreate from './pages/LiquidityWindowCreate';
import ReferencePriceUpdate from './pages/ReferencePriceUpdate';
import CompanyCreate from './pages/CompanyCreate';
import Profile from './pages/Profile';
import Pricing from './pages/Pricing';
import VerifyEmail from './pages/VerifyEmail';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppContent() {
  return (
    <div className="App flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/thesis/:id" element={<ThesisDetail />} />
          <Route path="/governance" element={<Governance />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          
          <Route
            path="/investor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['investor', 'both', 'admin']}>
                <InvestorDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/business/dashboard"
            element={
              <ProtectedRoute allowedRoles={['business', 'both', 'admin']}>
                <BusinessDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/business/thesis/new"
            element={
              <ProtectedRoute allowedRoles={['business', 'both', 'admin']}>
                <ThesisEditor />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/business/thesis/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['business', 'both', 'admin']}>
                <ThesisEditor />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/business/liquidity-window/new"
            element={
              <ProtectedRoute allowedRoles={['business', 'both', 'admin']}>
                <LiquidityWindowCreate />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/business/reference-price/new"
            element={
              <ProtectedRoute allowedRoles={['business', 'both', 'admin']}>
                <ReferencePriceUpdate />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/business/company/new"
            element={
              <ProtectedRoute allowedRoles={['business', 'both', 'admin']}>
                <CompanyCreate />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/settings/bank-accounts"
            element={
              <ProtectedRoute>
                <BankAccounts />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/settings/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
