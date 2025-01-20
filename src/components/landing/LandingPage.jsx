import React, { useState } from 'react';
import { LandingHeader } from './LandingHeader';
import { HeroSection } from './HeroSection';
import { BenefitsSection } from './BenefitsSection';
import { PricingSection } from './PricingSection';
import { AuthModal } from '../auth/AuthModal';

export function LandingPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signup');

  const handleLogin = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const handleSignup = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      <LandingHeader onLogin={handleLogin} onSignup={handleSignup} />
      <HeroSection onGetStarted={handleSignup} />
      <BenefitsSection />
      <PricingSection />
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
}