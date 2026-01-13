import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MessageSquare, User, Phone } from 'lucide-react';
import Header from '@/components/Header';
import AuthModal from '@/components/AuthModal';

const Contact = () => {
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'login' | 'signup' }>({
    open: false,
    mode: 'login',
  });

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const openLogin = () => setAuthModal({ open: true, mode: 'login' });
  const openSignUp = () => setAuthModal({ open: true, mode: 'signup' });
  const closeAuth = () => setAuthModal({ ...authModal, open: false });
  const switchMode = () =>
    setAuthModal((prev) => ({ ...prev, mode: prev.mode === 'login' ? 'signup' : 'login' }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 2500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Decorative backgrounds */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -left-20 top-1/4 w-96 h-96 bg-primary/6 rounded-full blur-3xl transform rotate-12" />
        <div className="absolute right-8 bottom-1/4 w-96 h-96 bg-azure-light/6 rounded-full blur-3xl -translate-x-6" />
      </div>

      <Header onLoginClick={openLogin} onSignUpClick={openSignUp} />

      <main className="relative z-10 pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left - Branding / Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-5xl md:text-6xl font-extrabold leading-tight text-foreground">
              Get in <span className="text-gradient-azure">Touch</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-lg">
              Have a question about our Azure DevOps courses, certification paths, or corporate training?
              Drop us a line, we typically respond within 24 hours.
            </p>

            <div className="mt-6 bg-gradient-to-tr from-background/40 to-background/20 border border-border/40 rounded-2xl p-6 shadow-glow">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-azure-light/10">
                  <Mail className="text-azure-light" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="text-foreground font-medium">bharat.reddy@vedinc.in</div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/8">
                  <Phone className="text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Phone</div>
                  <div className="text-foreground font-medium">+91 9123456781</div>
                </div>
              </div>

             
            </div>
          </motion.div>

          {/* Right - Form */}
         {/* Right - Form */}
<motion.div
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6 }}
>
  <form 
    onSubmit={handleSubmit} 
    className="bg-black border border-blue-500 rounded-none p-8 md:p-12 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="space-y-2">
        <label className="block text-[10px] uppercase tracking-[0.3em] text-white/70 font-bold">
          Full name
        </label>
        <div className="relative group">
          <User className="absolute left-0 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-500 transition-colors" size={16} />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full bg-transparent border-b border-white/20 rounded-none h-10 pl-8 pr-4 text-sm text-white outline-none focus:border-blue-500 transition-all placeholder:text-white/50"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-[10px] uppercase tracking-[0.3em] text-white/70 font-bold">
          Email Address
        </label>
        <div className="relative group">
          <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-500 transition-colors" size={16} />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full bg-transparent border-b border-white/20 rounded-none h-10 pl-8 pr-4 text-sm text-white outline-none focus:border-blue-500 transition-all placeholder:text-white/50"
            required
          />
        </div>
      </div>
    </div>

    <div className="mt-10 space-y-2">
      <label className="block text-[10px] uppercase tracking-[0.3em] text-white/70 font-bold">
        Detailed Message
      </label>
      <div className="relative group">
        <MessageSquare className="absolute left-0 top-2 text-white/40 group-focus-within:text-blue-500 transition-colors" size={16} />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="How can we help you?"
          rows={4}
          className="w-full bg-transparent border-b border-white/20 rounded-none pl-8 pt-1 text-sm text-white outline-none focus:border-blue-500 transition-all resize-none placeholder:text-white/50"
          required
        />
      </div>
    </div>

    <div className="mt-12">
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white font-black uppercase tracking-[0.2em] text-[12px] py-5 rounded-none hover:bg-blue-500 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
      >
        {isSubmitting ? (
          "PROCESSING..."
        ) : (
          <>
            <Send size={16} />
            <span>Send Message</span>
          </>
        )}
      </button>
    </div>
  </form>
</motion.div>
        </div>
      </main>
      
      <footer className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-foreground/80 z-50 pointer-events-none">
        © 2026 VEDINC. All rights reserved.
      </footer>

      <AuthModal isOpen={authModal.open} onClose={closeAuth} mode={authModal.mode} onModeSwitch={switchMode} />
    </div>
  );
};

export default Contact;
