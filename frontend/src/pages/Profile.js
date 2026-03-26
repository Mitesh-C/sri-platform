import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { toast } from 'sonner';
import { User, Mail, MapPin, Shield, Building2, TrendingUp, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    country: '',
    role: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.full_name || '',
        email: user.email || '',
        country: user.country || '',
        role: user.role || ''
      });
      // Check email verification status (we'll implement this)
      checkEmailVerification();
    }
  }, [user]);

  const checkEmailVerification = async () => {
    // Mock for now - will implement actual verification
    setEmailVerified(true);
  };

  const handleSendVerification = async () => {
    setLoading(true);
    try {
      await api.post('/auth/send-verification');
      toast.success('Verification email sent! Please check your inbox.');
    } catch (error) {
      toast.error('Failed to send verification email');
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplay = (role) => {
    const roles = {
      investor: 'Investor',
      business: 'Founder/Business',
      both: 'Investor & Founder',
      admin: 'Administrator'
    };
    return roles[role] || role;
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'investor':
        return <TrendingUp className="h-6 w-6 text-primary" strokeWidth={1.5} />;
      case 'business':
        return <Building2 className="h-6 w-6 text-primary" strokeWidth={1.5} />;
      case 'both':
        return <Shield className="h-6 w-6 text-primary" strokeWidth={1.5} />;
      case 'admin':
        return <Shield className="h-6 w-6 text-primary" strokeWidth={1.5} />;
      default:
        return <User className="h-6 w-6 text-primary" strokeWidth={1.5} />;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-8 sm:mb-12" data-testid="profile-heading">
            My Profile
          </h1>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6 sm:mb-8 w-full sm:w-auto overflow-x-auto" data-testid="profile-tabs">
              <TabsTrigger value="overview" className="text-sm sm:text-base">Overview</TabsTrigger>
              <TabsTrigger value="activity" className="text-sm sm:text-base">Activity</TabsTrigger>
              <TabsTrigger value="settings" className="text-sm sm:text-base">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="space-y-6 sm:space-y-8">
                {/* Profile Info Card */}
                <Card className="p-6 sm:p-8 md:p-12 rounded-2xl border-border/50" data-testid="profile-info-card">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                    <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {getRoleIcon(user.role)}
                    </div>
                    <div className="flex-1 w-full sm:w-auto">
                      <h2 className="font-sans text-2xl sm:text-3xl font-semibold mb-2">{profileData.full_name}</h2>
                      <p className="text-base sm:text-lg text-muted-foreground mb-3">{getRoleDisplay(user.role)}</p>
                      
                      {/* Email Verification Status */}
                      <div className="flex items-center gap-2">
                        {emailVerified ? (
                          <>
                            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" strokeWidth={1.5} />
                            <span className="text-sm sm:text-base text-green-600">Email Verified</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" strokeWidth={1.5} />
                            <span className="text-sm sm:text-base text-yellow-600">Email Not Verified</span>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={handleSendVerification}
                              disabled={loading}
                              className="ml-2 text-xs sm:text-sm"
                            >
                              Send Verification
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground mt-0.5" strokeWidth={1.5} />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p className="text-sm sm:text-base break-all">{profileData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" strokeWidth={1.5} />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Country</p>
                        <p className="text-sm sm:text-base">{profileData.country}</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Role-Specific Quick Actions */}
                {user.role === 'investor' || user.role === 'both' ? (
                  <Card className="p-6 sm:p-8 md:p-12 rounded-2xl border-border/50">
                    <h3 className="font-sans text-xl sm:text-2xl font-semibold mb-6">Investor Actions</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Link to="/explore">
                        <Button variant="outline" className="w-full h-auto py-4 px-4 sm:px-6 rounded-xl justify-start text-left">
                          <div>
                            <p className="font-medium mb-1 text-sm sm:text-base">Browse Theses</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">Find investment opportunities</p>
                          </div>
                        </Button>
                      </Link>
                      <Link to="/investor/dashboard">
                        <Button variant="outline" className="w-full h-auto py-4 px-4 sm:px-6 rounded-xl justify-start text-left">
                          <div>
                            <p className="font-medium mb-1 text-sm sm:text-base">View Portfolio</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">Manage your investments</p>
                          </div>
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ) : null}

                {user.role === 'business' || user.role === 'both' ? (
                  <Card className="p-6 sm:p-8 md:p-12 rounded-2xl border-border/50">
                    <h3 className="font-sans text-xl sm:text-2xl font-semibold mb-6">Founder Actions</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Link to="/business/company/new">
                        <Button variant="outline" className="w-full h-auto py-4 px-4 sm:px-6 rounded-xl justify-start text-left">
                          <div>
                            <p className="font-medium mb-1 text-sm sm:text-base">Create Company</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">Add your company profile</p>
                          </div>
                        </Button>
                      </Link>
                      <Link to="/business/thesis/new">
                        <Button variant="outline" className="w-full h-auto py-4 px-4 sm:px-6 rounded-xl justify-start text-left">
                          <div>
                            <p className="font-medium mb-1 text-sm sm:text-base">Publish Thesis</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">Create investment thesis</p>
                          </div>
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ) : null}

                {user.role === 'admin' ? (
                  <Card className="p-6 sm:p-8 md:p-12 rounded-2xl border-border/50 border-primary/20 bg-primary/5">
                    <h3 className="font-sans text-xl sm:text-2xl font-semibold mb-6">Administrator Access</h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-6">
                      You have full access to all platform features and oversight capabilities.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Link to="/investor/dashboard">
                        <Button variant="outline" className="w-full">View All Investments</Button>
                      </Link>
                      <Link to="/business/dashboard">
                        <Button variant="outline" className="w-full">View All Theses</Button>
                      </Link>
                    </div>
                  </Card>
                ) : null}
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity">
              <Card className="p-6 sm:p-8 md:p-12 rounded-2xl border-border/50">
                <h3 className="font-sans text-xl sm:text-2xl font-semibold mb-6">Recent Activity</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Activity history coming soon...</p>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card className="p-6 sm:p-8 md:p-12 rounded-2xl border-border/50">
                <h3 className="font-sans text-xl sm:text-2xl font-semibold mb-8">Account Settings</h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-sm sm:text-base">Full Name</Label>
                    <Input
                      id="full_name"
                      value={profileData.full_name}
                      disabled
                      className="h-12 rounded-xl text-sm sm:text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled
                      className="h-12 rounded-xl text-sm sm:text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm sm:text-base">Role</Label>
                    <Input
                      id="role"
                      value={getRoleDisplay(profileData.role)}
                      disabled
                      className="h-12 rounded-xl text-sm sm:text-base"
                    />
                  </div>

                  <div className="pt-6">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      To update your profile information, please contact support at hello@mahakalitribunal.com
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;