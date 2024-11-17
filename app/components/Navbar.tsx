"use client";
import { Brain, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { SignIn } from '@/components/sign-in';

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export function Navbar({ user }: NavbarProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-lg border-b border-white/10"
    >
      <div className="max-w-5xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-2 sm:gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <div className="bg-white/10 p-1.5 sm:p-2 rounded-lg backdrop-blur-sm">
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>
            <span className="text-sm sm:text-base text-white/90 font-light tracking-wider">MISTI</span>
          </motion.div>

          {/* User Profile */}
          <div className="flex items-center gap-4">
            <SignIn user={user} />
          </div>
        </div>
      </div>
    </motion.div>
  );
} 