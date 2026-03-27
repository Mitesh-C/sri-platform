import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { Building2, TrendingUp, Check, ArrowRight } from 'lucide-react';

const Pricing = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-tight mb-4" data-testid="pricing-heading">
              Pricing
            </h1>
            <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
              Transparent, governance-aligned pricing for founders and investors
            </p>
          </div>

          <Tabs defaultValue="founder" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-10" data-testid="pricing-tabs">
              <TabsTrigger value="founder" data-testid="tab-founder" className="gap-2">
                <Building2 className="h-4 w-4" strokeWidth={1.5} />
                Founder
              </TabsTrigger>
              <TabsTrigger value="investor" data-testid="tab-investor" className="gap-2">
                <TrendingUp className="h-4 w-4" strokeWidth={1.5} />
                Investor
              </TabsTrigger>
            </TabsList>

            {/* Founder Pricing */}
            <TabsContent value="founder">
              <div className="space-y-8">
                {/* Account Opening */}
                <Card className="p-6 sm:p-8 md:p-10 rounded-2xl border-border/50" data-testid="founder-account-opening">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-2xl sm:text-3xl font-normal">Account Opening</h2>
                    <span className="px-4 py-2 rounded-full bg-green-500/10 text-green-700 font-medium text-sm" data-testid="founder-free-badge">
                      Free
                    </span>
                  </div>
                  <p className="text-muted-foreground">Create your founder account and start building your investment thesis at no cost.</p>
                </Card>

                {/* Listing Application */}
                <Card className="p-6 sm:p-8 md:p-10 rounded-2xl border-border/50" data-testid="founder-listing-fees">
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal mb-6">Listing Application</h2>
                  <p className="text-muted-foreground mb-6">One-time deposit based on your company stage</p>
                  <div className="overflow-x-auto">
                    <table className="w-full" data-testid="listing-table">
                      <thead>
                        <tr className="border-b border-border/50">
                          <th className="text-left py-4 pr-4 text-sm font-medium text-muted-foreground uppercase tracking-wide">Stage</th>
                          <th className="text-right py-4 pl-4 text-sm font-medium text-muted-foreground uppercase tracking-wide">Deposit</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border/30">
                          <td className="py-4 pr-4 font-medium">Idea / Prototype</td>
                          <td className="py-4 pl-4 text-right font-mono">CHF 260</td>
                        </tr>
                        <tr className="border-b border-border/30">
                          <td className="py-4 pr-4 font-medium">Seed</td>
                          <td className="py-4 pl-4 text-right font-mono">CHF 525</td>
                        </tr>
                        <tr>
                          <td className="py-4 pr-4 font-medium">Series A+</td>
                          <td className="py-4 pl-4 text-right font-mono">CHF 1,575</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Fundraising Success Fee */}
                <Card className="p-6 sm:p-8 md:p-10 rounded-2xl border-border/50" data-testid="founder-success-fees">
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal mb-6">Fundraising Success Fee</h2>
                  <p className="text-muted-foreground mb-6">Charged only on successfully raised capital</p>
                  <div className="overflow-x-auto">
                    <table className="w-full" data-testid="success-fee-table">
                      <thead>
                        <tr className="border-b border-border/50">
                          <th className="text-left py-4 pr-4 text-sm font-medium text-muted-foreground uppercase tracking-wide">Capital Raised</th>
                          <th className="text-right py-4 pl-4 text-sm font-medium text-muted-foreground uppercase tracking-wide">Sri Fee</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border/30">
                          <td className="py-4 pr-4 font-medium">Up to CHF 650K</td>
                          <td className="py-4 pl-4 text-right font-mono">3%</td>
                        </tr>
                        <tr className="border-b border-border/30">
                          <td className="py-4 pr-4 font-medium">CHF 650K - CHF 3.25M</td>
                          <td className="py-4 pl-4 text-right font-mono">2%</td>
                        </tr>
                        <tr className="border-b border-border/30">
                          <td className="py-4 pr-4 font-medium">CHF 3.25M - CHF 13M</td>
                          <td className="py-4 pl-4 text-right font-mono">1.5%</td>
                        </tr>
                        <tr>
                          <td className="py-4 pr-4 font-medium">CHF 13M+</td>
                          <td className="py-4 pl-4 text-right font-mono">1%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Annual Compliance */}
                <Card className="p-6 sm:p-8 md:p-10 rounded-2xl border-border/50" data-testid="founder-annual-fees">
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal mb-6">Annual Compliance & Disclosure</h2>
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full" data-testid="annual-fee-table">
                      <thead>
                        <tr className="border-b border-border/50">
                          <th className="text-left py-4 pr-4 text-sm font-medium text-muted-foreground uppercase tracking-wide">Stage</th>
                          <th className="text-right py-4 pl-4 text-sm font-medium text-muted-foreground uppercase tracking-wide">Annual Fee</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border/30">
                          <td className="py-4 pr-4 font-medium">Seed</td>
                          <td className="py-4 pl-4 text-right font-mono">CHF 1,050</td>
                        </tr>
                        <tr className="border-b border-border/30">
                          <td className="py-4 pr-4 font-medium">Series A</td>
                          <td className="py-4 pl-4 text-right font-mono">CHF 3,150</td>
                        </tr>
                        <tr>
                          <td className="py-4 pr-4 font-medium">Growth</td>
                          <td className="py-4 pl-4 text-right font-mono">CHF 7,350</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="space-y-3 p-4 sm:p-6 rounded-xl bg-muted/30">
                    <p className="text-sm font-medium text-foreground">Includes:</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-primary shrink-0" strokeWidth={1.5} />
                        <span>Disclosure infrastructure</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-primary shrink-0" strokeWidth={1.5} />
                        <span>Investor communication tools</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-primary shrink-0" strokeWidth={1.5} />
                        <span>Governance tracking</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="text-center pt-4">
                  <Link to="/auth">
                    <Button size="lg" className="rounded-full px-8 py-6" data-testid="founder-cta">
                      Get Started as Founder
                      <ArrowRight className="ml-2 h-5 w-5" strokeWidth={1.5} />
                    </Button>
                  </Link>
                </div>
              </div>
            </TabsContent>

            {/* Investor Pricing */}
            <TabsContent value="investor">
              <div className="space-y-8">
                {/* Account Opening */}
                <Card className="p-6 sm:p-8 md:p-10 rounded-2xl border-border/50" data-testid="investor-account-opening">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-2xl sm:text-3xl font-normal">Account Opening</h2>
                    <span className="px-4 py-2 rounded-full bg-green-500/10 text-green-700 font-medium text-sm" data-testid="investor-free-badge">
                      Free
                    </span>
                  </div>
                  <p className="text-muted-foreground">Create your investor account and explore investment thesis at no cost.</p>
                </Card>

                {/* Trading Fees */}
                <Card className="p-6 sm:p-8 md:p-10 rounded-2xl border-border/50" data-testid="investor-trading-fees">
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal mb-6">Trading Fees</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full" data-testid="trading-fee-table">
                      <thead>
                        <tr className="border-b border-border/50">
                          <th className="text-left py-4 pr-4 text-sm font-medium text-muted-foreground uppercase tracking-wide">Action</th>
                          <th className="text-right py-4 pl-4 text-sm font-medium text-muted-foreground uppercase tracking-wide">Fee</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border/30">
                          <td className="py-4 pr-4 font-medium">Buy</td>
                          <td className="py-4 pl-4 text-right font-mono">0.25%</td>
                        </tr>
                        <tr>
                          <td className="py-4 pr-4 font-medium">Sell</td>
                          <td className="py-4 pl-4 text-right font-mono">0.25%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Optional Tools */}
                <Card className="p-6 sm:p-8 md:p-10 rounded-2xl border-border/50" data-testid="investor-optional-tools">
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal mb-6">Optional Tools</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full" data-testid="optional-tools-table">
                      <thead>
                        <tr className="border-b border-border/50">
                          <th className="text-left py-4 pr-4 text-sm font-medium text-muted-foreground uppercase tracking-wide">Plan</th>
                          <th className="text-right py-4 pl-4 text-sm font-medium text-muted-foreground uppercase tracking-wide">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border/30">
                          <td className="py-4 pr-4 font-medium">Basic Portfolio</td>
                          <td className="py-4 pl-4 text-right font-mono text-green-700">Free</td>
                        </tr>
                        <tr className="border-b border-border/30">
                          <td className="py-4 pr-4 font-medium">Pro Analytics</td>
                          <td className="py-4 pl-4 text-right font-mono">CHF 25 / year</td>
                        </tr>
                        <tr>
                          <td className="py-4 pr-4 font-medium">Institutional Tools</td>
                          <td className="py-4 pl-4 text-right font-mono">Custom</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>

                <div className="text-center pt-4">
                  <Link to="/auth">
                    <Button size="lg" className="rounded-full px-8 py-6" data-testid="investor-cta">
                      Get Started as Investor
                      <ArrowRight className="ml-2 h-5 w-5" strokeWidth={1.5} />
                    </Button>
                  </Link>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;
