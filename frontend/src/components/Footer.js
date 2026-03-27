import React from 'react';
import { Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-background py-6 sm:py-8 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Left side - Brand name */}
          <div className="text-center sm:text-left">
            <h3 className="font-sans text-lg sm:text-xl md:text-2xl font-medium text-foreground">
              Sri by Mahakali Tribunal
            </h3>
          </div>

          {/* Right side - Contact */}
          <div className="flex flex-col items-center sm:items-end gap-2 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" strokeWidth={1.5} />
              <a 
                href="mailto:hello@mahakalitribunal.com" 
                className="text-sm md:text-base text-primary hover:underline transition-colors"
                data-testid="footer-email"
              >
                hello@mahakalitribunal.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" strokeWidth={1.5} />
              <a 
                href="tel:+919916912450" 
                className="text-sm md:text-base text-primary hover:underline transition-colors"
                data-testid="footer-phone"
              >
                +91 9916912450
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
