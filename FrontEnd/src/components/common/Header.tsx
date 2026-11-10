import React, { useState } from 'react';
import {
  ShoppingBag,
  Sparkles,
  User,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Menu,
  X,
  Search,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';

interface HeaderProps {
  currentView: 'store' | 'admin';
  onNavigate: (view: 'store' | 'admin') => void;
  onOpenAuth: () => void;
  onFocusSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenAuth,
  onFocusSearch,
}) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
  const { getTotalItems, setIsOpen: setCartOpen } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const totalCartItems = getTotalItems();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 px-4 py-1.5 text-center text-xs font-medium text-white flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
        <span>Next-Gen AI Shopping Experience — Intelligent Product Discovery & Instant Checkout</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div
          onClick={() => onNavigate('store')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-tr from-sky-500 to-indigo-600 p-0.5 shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <img
              src="/urban-scenery-logo.png"
              alt="Urban Scenery Ventures"
              className="w-full h-full object-cover rounded-[10px] bg-slate-950"
              onError={(e) => {
                // Fallback icon if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
              <span>Urban Scenery</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30 uppercase tracking-widest font-mono">
                Ventures
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono tracking-wider">
              ELECTRONICS & AI PLATFORM
            </p>
          </div>
        </div>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800">
          <button
            onClick={() => onNavigate('store')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentView === 'store'
                ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Storefront
          </button>

          <button
            onClick={onFocusSearch}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium text-slate-400 hover:text-sky-400 hover:bg-slate-800/60 transition-all"
          >
            <Search className="w-3.5 h-3.5" />
            <span>AI Search</span>
          </button>

          <button
            onClick={() => onNavigate('admin')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentView === 'admin'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Merchant Hub</span>
            {isAdmin && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-400/20"></span>
            )}
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Cart Trigger */}
          <button
            onClick={() => setCartOpen(true)}
            aria-label="View Shopping Cart"
            className="relative p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-center"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCartItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-sky-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md shadow-sky-500/40 animate-bounce">
                {totalCartItems}
              </span>
            )}
          </button>

          {/* User Profile / Auth Button */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-left transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                  {user.name ? user.name[0] : 'U'}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-semibold text-white leading-tight">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-sky-400 font-mono capitalize">
                    {user.role || 'customer'}
                  </div>
                </div>
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-dropdown p-2 text-sm shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-xs font-mono text-emerald-400 uppercase tracking-wide">
                        {user.role} Account
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        onNavigate('store');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-2 text-xs"
                    >
                      <ShoppingBag className="w-4 h-4 text-sky-400" />
                      <span>Browse Store</span>
                    </button>

                    <button
                      onClick={() => {
                        onNavigate('admin');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-2 text-xs"
                    >
                      <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                      <span>Merchant Dashboard</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-800">
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 text-xs font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-medium text-xs shadow-md shadow-sky-500/30 transition-all hover:scale-102"
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 space-y-2">
          <button
            onClick={() => {
              onNavigate('store');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
              currentView === 'store'
                ? 'bg-sky-500 text-white'
                : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            Electronics Storefront
          </button>
          <button
            onClick={() => {
              onFocusSearch();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-900 flex items-center gap-2"
          >
            <Search className="w-4 h-4 text-sky-400" />
            <span>AI Smart Search</span>
          </button>
          <button
            onClick={() => {
              onNavigate('admin');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
              currentView === 'admin'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <span>Merchant & AI Hub</span>
            {isAdmin && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                Admin
              </span>
            )}
          </button>
        </div>
      )}
    </header>
  );
};

