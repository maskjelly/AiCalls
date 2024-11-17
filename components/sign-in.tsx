"use client";
import { useState } from "react";
import { User, LogOut, ChevronDown, Wrench } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { handleSignIn, handleSignOut } from "@/app/actions/auth";

interface SignInProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export function SignIn({ user }: SignInProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (user) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border-2 border-yellow-500/20 transition-all group"
        >
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || "User"}
              className="w-8 h-8 rounded-lg border-2 border-yellow-500/20 group-hover:border-yellow-500/40 transition-colors"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-zinc-700 flex items-center justify-center border-2 border-yellow-500/20">
              <Wrench className="w-4 h-4 text-yellow-500/70" />
            </div>
          )}
          <div className="text-left hidden sm:block">
            <p className="text-sm text-zinc-200">
              {user.name || "Engineer"}
            </p>
            <p className="text-xs text-zinc-400 truncate max-w-[150px]">
              {user.email}
            </p>
          </div>
          <ChevronDown className={`w-4 h-4 text-yellow-500/50 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-48 bg-zinc-800 rounded-xl border-2 border-yellow-500/20 overflow-hidden z-50"
            >
              <div className="p-3 border-b border-zinc-700">
                <p className="text-sm text-zinc-200">{user.name}</p>
                <p className="text-xs text-zinc-400 truncate">{user.email}</p>
              </div>
              
              <form action={handleSignOut} className="p-1">
                <button
                  type="submit"
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-zinc-700/50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Power Off
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <form action={handleSignIn}>
      <button
        type="submit"
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border-2 border-yellow-500/20 hover:border-yellow-500/40 transition-all group"
      >
        <Wrench className="w-4 h-4 text-yellow-500/70" />
        <span className="text-sm text-zinc-200">Power Up</span>
      </button>
    </form>
  );
}