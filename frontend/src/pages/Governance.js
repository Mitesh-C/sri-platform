import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Shield, FileText, AlertTriangle, Users } from 'lucide-react';

const Governance = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-16">
            <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Shield className="h-10 w-10 text-primary" strokeWidth={1.5} />
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-light tracking-tight mb-6" data-testid="governance-heading">
              How It Works
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">
              The foundation of Sri: transparent rules, investor protection, and founder responsibility.
            </p>
          </div>

          {/* Investor Protection Charter */}
          <Card className="p-8 md:p-12 rounded-2xl border-border/50 mb-8" data-testid="investor-protection-card">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-6 w-6 text-primary" strokeWidth={1.5} />
              <h2 className="font-serif text-3xl font-normal">Investor Protection Charter</h2>
            </div>
            <div className="space-y-6 text-base leading-relaxed">
              <div>
                <h3 className="font-medium mb-2 text-lg">1. Transparency First</h3>
                <p className="text-muted-foreground">
                  All investment theses must disclose material risks, governance structures, and SAFE terms in plain language.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-lg">2. No Speculative Language</h3>
                <p className="text-muted-foreground">
                  Startups are prohibited from using urgency tactics, trading language, or guaranteed return promises.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-lg">3. Governed Liquidity</h3>
                <p className="text-muted-foreground">
                  Liquidity windows must be pre-announced, time-bound, and subject to governance approval.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-lg">4. Investor Recourse</h3>
                <p className="text-muted-foreground">
                  Investors have access to dispute resolution and governance escalation mechanisms.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-lg">5. Illiquidity Acknowledgement</h3>
                <p className="text-muted-foreground">
                  All investors must explicitly acknowledge that investments are illiquid and long-term commitments.
                </p>
              </div>
            </div>
          </Card>

          {/* Founder Responsibility Charter */}
          <Card className="p-8 md:p-12 rounded-2xl border-border/50 mb-8" data-testid="founder-responsibility-card">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-6 w-6 text-primary" strokeWidth={1.5} />
              <h2 className="font-serif text-3xl font-normal">Founder Responsibility Charter</h2>
            </div>
            <div className="space-y-6 text-base leading-relaxed">
              <div>
                <h3 className="font-medium mb-2 text-lg">1. Honest Communication</h3>
                <p className="text-muted-foreground">
                  Founders must provide regular, truthful updates on company progress, challenges, and material changes.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-lg">2. Risk Disclosure</h3>
                <p className="text-muted-foreground">
                  All material risks must be disclosed upfront and updated as circumstances change.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-lg">3. Reference Price Integrity</h3>
                <p className="text-muted-foreground">
                  Reference price updates must be event-based, justified, and auditable.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-lg">4. Governed Capital Use</h3>
                <p className="text-muted-foreground">
                  Capital raised must be used according to stated thesis and subject to governance review.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-lg">5. Investor Alignment</h3>
                <p className="text-muted-foreground">
                  Founders must act in alignment with long-term investor interests, not short-term extraction.
                </p>
              </div>
            </div>
          </Card>

          {/* Internal Standards */}
          <Card className="p-8 md:p-12 rounded-2xl border-border/50 mb-8" data-testid="internal-standards-card">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="h-6 w-6 text-primary" strokeWidth={1.5} />
              <h2 className="font-serif text-3xl font-normal">Sri Internal Standards</h2>
            </div>
            <div className="space-y-6 text-base leading-relaxed">
              <div>
                <h3 className="font-medium mb-2 text-lg">No Wallet Behavior</h3>
                <p className="text-muted-foreground">
                  Bank accounts are settlement rails only. Sri does not hold investor funds or act as a wallet.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-lg">No Instant Transactions</h3>
                <p className="text-muted-foreground">
                  All investments and exits follow governance-approved processes with built-in review periods.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-lg">No Trading UI Patterns</h3>
                <p className="text-muted-foreground">
                  Sri deliberately avoids trading terminology, live price feeds, and speculative design patterns.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-lg">Audit Logging</h3>
                <p className="text-muted-foreground">
                  All material actions are logged for governance review and regulatory compliance.
                </p>
              </div>
            </div>
          </Card>

          {/* Governance Alerts */}
          <Card className="p-8 md:p-12 rounded-2xl border-border/50 border-yellow-500/20 bg-yellow-500/5" data-testid="governance-alert">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-yellow-600" strokeWidth={1.5} />
              <h2 className="font-serif text-2xl font-normal">Important Notice</h2>
            </div>
            <p className="text-base leading-relaxed text-muted-foreground">
              Sri is a governed investment infrastructure platform. It is not a trading platform, stock exchange, or wallet system. 
              All investments are illiquid and carry risk of total loss. Only invest what you can afford to lose permanently.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Governance;