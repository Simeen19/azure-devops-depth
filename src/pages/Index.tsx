import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import Header from '@/components/Header';
import AuthModal from '@/components/AuthModal';
import HeroScene from '@/components/three/HeroScene';

const Index = () => {
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'login' | 'signup' }>({
    open: false,
    mode: 'login',
  });

  const openLogin = () => setAuthModal({ open: true, mode: 'login' });
  const openSignUp = () => setAuthModal({ open: true, mode: 'signup' });
  const closeAuth = () => setAuthModal({ ...authModal, open: false });
  const switchMode = () =>
    setAuthModal((prev) => ({
      ...prev,
      mode: prev.mode === 'login' ? 'signup' : 'login',
    }));

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      {/* 3D Scene Background */}
      <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
        <HeroScene />
      </Suspense>

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/80 pointer-events-none z-10" />

      {/* Header */}
      <Header onLoginClick={openLogin} onSignUpClick={openSignUp} />

      {/* Hero Content */}
      <main className="relative z-20 h-full flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="max-w-4xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            
          >
           
            <span className="text-sm font-medium text-primary">Azure Certified Training</span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight mb-6">
            Master <span className="hover-blue">DevOps</span>
            <br />
            <span className="text-muted-foreground">with Azure Cloud</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Industry-leading DevOps training powered by Microsoft Azure. 
            Transform your career with hands-on cloud expertise.
          </p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={openSignUp}
              className="btn-azure flex items-center gap-2 text-base group"
            >
              Start Learning
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>

          
          </motion.div>
        </motion.div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.open}
        onClose={closeAuth}
        mode={authModal.mode}
        onModeSwitch={switchMode}
      />
      
      <footer className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-foreground/80 z-50 pointer-events-none">
        © 2026 VEDINC. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;
