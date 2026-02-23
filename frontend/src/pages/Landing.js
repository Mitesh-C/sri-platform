import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowRight, Shield, TrendingUp, Users } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-5"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1563949708631-963ad2447fa8?crop=entropy&cs=srgb&fm=jpg&q=85')`,
          }}
        />
        <div className="container relative mx-auto px-6 md:px-12 lg:px-24 py-32 md:py-48">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <h1 className="font-serif text-5xl md:text-7xl font-light tracking-tight leading-tight mb-8" data-testid="hero-heading">
              Sit with the future.
            </h1>
            <p className="text-lg md:text-xl leading-relaxed text-muted-foreground mb-12 max-w-2xl" data-testid="hero-subtitle">
              A governed startup ownership platform built for long-term investors and responsible founders. Not a trading app. Not a wallet. A ledger of commitment.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/explore">
                <Button size="lg" className="rounded-full px-8 py-6 font-medium" data-testid="hero-cta-explore">
                  Explore Investment Theses
                  <ArrowRight className="ml-2 h-5 w-5" strokeWidth={1.5} />
                </Button>
              </Link>
              <Link to="/governance">
                <Button size="lg" variant="outline" className="rounded-full px-8 py-6 font-medium" data-testid="hero-cta-governance">
                  Read Governance Charter
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What Sri Is / Is Not */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 md:p-12 rounded-2xl border-border/50" data-testid="what-sri-is">
                <h3 className="font-serif text-2xl md:text-3xl font-normal mb-6 text-primary">What Sri Is</h3>
                <ul className="space-y-4 text-base leading-relaxed text-foreground">
                  <li className="flex items-start">
                    <span className="mr-3 text-primary">✓</span>
                    <span>A governed investment infrastructure</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 text-primary">✓</span>
                    <span>SAFE instrument platform</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 text-primary">✓</span>
                    <span>Long-term ownership ledger</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 text-primary">✓</span>
                    <span>Permissioned liquidity windows</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 text-primary">✓</span>
                    <span>Bank-connected settlement rails</span>
                  </li>
                </ul>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 md:p-12 rounded-2xl border-border/50" data-testid="what-sri-is-not">
                <h3 className="font-serif text-2xl md:text-3xl font-normal mb-6 text-muted-foreground">What Sri Is Not</h3>
                <ul className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-3">✗</span>
                    <span>Not a trading platform</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3">✗</span>
                    <span>Not a stock exchange</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3">✗</span>
                    <span>Not a wallet system</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3">✗</span>
                    <span>Not instant liquidity</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3">✗</span>
                    <span>Not speculative infrastructure</span>
                  </li>
                </ul>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-light tracking-tight mb-4" data-testid="features-heading">
              Governance-First Platform
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
              Built for alignment, transparency, and responsible ownership
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 rounded-2xl border-border/50 hover:shadow-lg transition-shadow" data-testid="feature-investment-theses">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <TrendingUp className="h-6 w-6 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-2xl font-normal mb-4">Investment Theses</h3>
                <p className="text-base leading-relaxed text-muted-foreground">
                  Startups publish detailed theses with risks, governance structures, and SAFE terms.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 rounded-2xl border-border/50 hover:shadow-lg transition-shadow" data-testid="feature-recurring-investments">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-2xl font-normal mb-4">Recurring Investments</h3>
                <p className="text-base leading-relaxed text-muted-foreground">
                  Support startups through micro-investments on weekly, monthly, or quarterly basis.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 rounded-2xl border-border/50 hover:shadow-lg transition-shadow" data-testid="feature-liquidity-windows">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Shield className="h-6 w-6 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-2xl font-normal mb-4">Liquidity Windows</h3>
                <p className="text-base leading-relaxed text-muted-foreground">
                  Governed, time-bound windows for permissioned exits and secondary transactions.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-light tracking-tight mb-6" data-testid="cta-heading">
            Ready to participate?
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join investors and founders building the future with governance and alignment.
          </p>
          <Link to="/auth">
            <Button size="lg" className="rounded-full px-8 py-6 font-medium" data-testid="cta-get-started">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" strokeWidth={1.5} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;