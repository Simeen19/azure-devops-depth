import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import vedincLogo from '@/assets/vedinc-logo.png';
import azureLogo from '@/assets/azure-logo.png';

interface HeaderProps {
  onLoginClick: () => void;
  onSignUpClick: () => void;
}

const Header = ({ onLoginClick, onSignUpClick }: HeaderProps) => {
  const location = useLocation();
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logos */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-4">
            <img
              src={vedincLogo}
              alt="VEDINC"
              className="h-10 w-auto object-contain"
            />
            <div className="h-8 w-px bg-border/50" />
            <img
              src={azureLogo}
              alt="Microsoft Azure"
              className="h-6 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Right: Navigation */}
        <nav className="flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative text-sm font-medium transition-colors duration-200 ${
                location.pathname === link.path
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                />
              )}
            </Link>
          ))}
          
          <button
            onClick={onLoginClick}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Login
          </button>
          
          <button
            onClick={onSignUpClick}
            className="btn-azure text-sm"
          >
            Sign Up
          </button>
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
