import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { Building2, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <Building2 className="h-8 w-8 text-primary" strokeWidth={1.5} />
            <span className="font-serif text-2xl font-light tracking-tight">Sri</span>
          </Link>

          <div className="flex items-center gap-6">
            {user ? (
              <>
                <Link to="/explore">
                  <Button variant="ghost" data-testid="nav-explore">Explore</Button>
                </Link>
                <Link to="/governance">
                  <Button variant="ghost" data-testid="nav-governance">Governance</Button>
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
                  <Button variant="ghost" data-testid="nav-governance-public">Governance</Button>
                </Link>
                <Link to="/auth">
                  <Button className="rounded-full" data-testid="nav-signin">Sign In</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;