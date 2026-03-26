import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { Building2, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
            <img src="/sri-logo.jpeg" alt="Sri Logo" className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg object-cover" />
            <span className="font-sans text-xl sm:text-2xl font-medium tracking-tight">Sri</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {user ? (
              <>
                <Link to="/explore">
                  <Button variant="ghost" data-testid="nav-explore">Explore</Button>
                </Link>
                <Link to="/governance">
                  <Button variant="ghost" data-testid="nav-governance">How It Works</Button>
                </Link>
                {(user.role === 'investor' || user.role === 'both') && (
                  <Link to="/investor/dashboard">
                    <Button variant="ghost" data-testid="nav-investor-dashboard">Dashboard</Button>
                  </Link>
                )}
                {(user.role === 'business' || user.role === 'both') && (
                  <Link to="/business/dashboard">
                    <Button variant="ghost" data-testid="nav-business-dashboard">Business</Button>
                  </Link>
                )}
                <Link to="/settings/profile">
                  <Button variant="ghost" size="icon" data-testid="nav-profile">
                    <User className="h-5 w-5" strokeWidth={1.5} />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleLogout} data-testid="nav-logout">
                  <LogOut className="h-5 w-5" strokeWidth={1.5} />
                </Button>
              </>
            ) : (
              <>
                <Link to="/explore">
                  <Button variant="ghost" data-testid="nav-explore-public">Explore</Button>
                </Link>
                <Link to="/governance">
                  <Button variant="ghost" data-testid="nav-governance-public">How It Works</Button>
                </Link>
                <Link to="/auth">
                  <Button className="rounded-full" data-testid="nav-signin">Sign In</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" strokeWidth={1.5} />
            ) : (
              <Menu className="h-6 w-6" strokeWidth={1.5} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 py-4">
            <div className="flex flex-col space-y-3">
              {user ? (
                <>
                  <Link to="/explore" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">Explore</Button>
                  </Link>
                  <Link to="/governance" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">How It Works</Button>
                  </Link>
                  {(user.role === 'investor' || user.role === 'both') && (
                    <Link to="/investor/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
                    </Link>
                  )}
                  {(user.role === 'business' || user.role === 'both') && (
                    <Link to="/business/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">Business</Button>
                    </Link>
                  )}
                  <Link to="/settings/profile" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="h-5 w-5 mr-2" strokeWidth={1.5} />
                      Profile
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                    <LogOut className="h-5 w-5 mr-2" strokeWidth={1.5} />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/explore" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">Explore</Button>
                  </Link>
                  <Link to="/governance" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">How It Works</Button>
                  </Link>
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="rounded-full w-full">Sign In</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;