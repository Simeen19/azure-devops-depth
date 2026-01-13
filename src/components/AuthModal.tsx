import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  onModeSwitch: () => void;
}

const AuthModal = ({ isOpen, onClose, mode, onModeSwitch }: AuthModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle auth logic here
    console.log('Auth submitted:', { email, password, name, mode });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="modal-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="glass-card w-full max-w-md mx-4 rounded-2xl p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <motion.h2
                key={mode}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-foreground mb-2"
              >
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </motion.h2>
              <p className="text-muted-foreground text-sm">
                {mode === 'login'
                  ? 'Sign in to continue your DevOps journey'
                  : 'Start your DevOps mastery today'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="input-dark pl-12"
                      required
                    />
                  </div>
                </motion.div>
              )}

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input-dark pl-12"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-dark pl-12"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-azure w-full flex items-center justify-center gap-2 group"
              >
                {mode === 'login' ? 'Sign In' : 'Create Account'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={onModeSwitch}
                  className="text-primary hover:text-azure-light font-medium transition-colors"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>

            {/* Azure branding */}
            <div className="mt-6 pt-6 border-t border-border/50 text-center">
              <p className="text-xs text-muted-foreground">
                Powered by Microsoft Azure
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
