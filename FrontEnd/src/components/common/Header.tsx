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
  Sun,
  Moon,
  Heart,
  Laptop,
  Home as HomeIcon,
  Headphones,
  Watch,
  Sliders,
  Tag,
  Globe,
  Layers,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useThemeStore } from '../../store/useThemeStore';

interface HeaderProps {
  currentView: 'store' | 'admin';
  onNavigate: (view: 'store' | 'admin') => void;
  canAccessAdmin: boolean;
  onOpenAuth: () => void;
  onFocusSearch: () => void;
  onSelectCategory?: (category: string) => void;
  onOpenAiRecommendations?: () => void;
  onOpenUiShowcase?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  canAccessAdmin,
  onOpenAuth,
  onFocusSearch,
  onSelectCategory,
  onOpenAiRecommendations,
  onOpenUiShowcase,
}) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getTotalItems, setIsOpen: setCartOpen } = useCartStore();
  const { theme, toggleTheme } = useThemeStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');

  const totalCartItems = getTotalItems();
  const isDark = theme === 'dark';

  const subCategories = [
    { id: 'All', label: 'All Products', icon: Laptop },
    { id: 'Audio', label: 'Audio', icon: Headphones },
    { id: 'Wearables', label: 'Wearables', icon: Watch },
    { id: 'Smart Home', label: 'Smart Tech', icon: HomeIcon },
    { id: 'Accessories', label: 'Accessories', icon: Sliders },
    { id: 'Sale', label: 'In Stock', icon: Tag, highlight: true },
  ];

  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId);
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
    if (currentView !== 'store') {
      onNavigate('store');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-urban-darker/95 backdrop-blur-md transition-colors duration-300">
      {/* Top Banner with Logo Signature Gradient & Showcase Pill */}
      <div className="bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-accent-200" />
            <span>Urban Scenery Ventures — Intelligent Electronics Grounded in AI</span>
          </div>

          {onOpenUiShowcase && (
            <button
              onClick={onOpenUiShowcase}
              className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold backdrop-blur-sm transition-all"
            >
              <Layers className="w-3 h-3 text-accent-200" />
              <span>UI Showcase (16 Interfaces)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent-300 animate-ping" />
            </button>
          )}
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div
          onClick={() => onNavigate('store')}
          className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
        >
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden bg-gradient-to-tr from-brand-500 via-brand-600 to-accent-400 p-0.5 shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300">
            <img
              src="/urban-scenery-logo.png"
              alt="Urban Scenery Ventures"
              className="w-full h-full object-cover rounded-[10px] bg-white dark:bg-urban-darker"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5 font-heading">
              <span>URBAN</span>
              <span className="text-brand-500">SCENERY</span>
              <span className="hidden sm:inline text-[9px] px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/30 uppercase tracking-widest font-mono">
                Ventures
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-wider hidden sm:block">
              ELECTRONICS & AI PLATFORM
            </p>
          </div>
        </div>

        {/* Center Search Bar in Header (as seen in TechVerse / NovaShop Reference 2 & 3) */}
        <div className="hidden lg:flex flex-1 max-w-lg mx-4">
          <div
            onClick={onFocusSearch}
            className="w-full relative flex items-center cursor-pointer group"
          >
            <input
              type="text"
              readOnly
              placeholder="Search for tech gadgets, ideas and more..."
              className="w-full pl-10 pr-10 py-2 bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-900 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-full text-xs text-slate-700 dark:text-slate-200 placeholder-slate-400 cursor-pointer transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 group-hover:text-brand-500 transition-colors" />
            <div className="absolute right-2 px-2 py-0.5 rounded-full bg-brand-500 text-white text-[10px] font-bold">
              AI
            </div>
          </div>
        </div>

        {/* Navigation Switcher (Store vs Admin) */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900/80 p-1 rounded-full border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => onNavigate('store')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              currentView === 'store'
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Storefront
          </button>

          {canAccessAdmin && (
          <button
            onClick={() => onNavigate('admin')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              currentView === 'admin'
                ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-md shadow-brand-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Merchant Hub</span>
            {canAccessAdmin && (
              <span className="w-2 h-2 rounded-full bg-accent-400 ring-2 ring-accent-400/30"></span>
            )}
          </button>
          )}
        </nav>

        {/* Right Actions: Theme, Wishlist, Cart, Profile */}
        <div className="flex items-center gap-2">
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            data-theme-toggle
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-all hover:scale-105"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-accent-400 hover:rotate-45 transition-transform duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>

          {/* Wishlist Button (Reference 2 & 3) */}
          <button
            onClick={() => setWishlistCount((prev) => prev + 1)}
            title="Wishlist"
            className="relative p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/90 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-400 border border-slate-200 dark:border-slate-800 transition-all hidden sm:flex"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setCartOpen(true)}
            aria-label="View Shopping Cart"
            className="relative p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/90 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 transition-all"
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            {totalCartItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-brand-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md shadow-brand-500/40 animate-bounce">
                {totalCartItems}
              </span>
            )}
          </button>

          {/* User Profile / Auth Button */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/90 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-left transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white uppercase shadow-sm">
                  {user.name ? user.name[0] : 'U'}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-brand-600 dark:text-brand-400 font-mono capitalize">
                    {user.role || 'customer'}
                  </div>
                </div>
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-dropdown p-2 text-sm shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 border border-slate-200 dark:border-brand-500/30">
                  <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Signed in as</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.email}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-accent-500" />
                      <span className="text-xs font-mono text-accent-600 dark:text-accent-400 uppercase tracking-wide">
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
                      className="w-full text-left px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 flex items-center gap-2 text-xs font-medium"
                    >
                      <ShoppingBag className="w-4 h-4 text-brand-500" />
                      <span>Browse Store</span>
                    </button>

                    {canAccessAdmin && (
                    <button
                      onClick={() => {
                        onNavigate('admin');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 flex items-center gap-2 text-xs font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4 text-accent-500" />
                      <span>Merchant Dashboard</span>
                    </button>
                    )}
                  </div>

                  <div className="pt-1 border-t border-slate-200 dark:border-slate-800">
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center gap-2 text-xs font-semibold"
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
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/25 transition-all hover:scale-102"
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sub-Category Navigation Bar (TechVerse Reference 2 Style) */}
      <div className="border-t border-slate-200/80 dark:border-slate-800/60 bg-slate-50/60 dark:bg-urban-darker/60 px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-1 sm:gap-2">
            {subCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-brand-500 text-white shadow-sm'
                      : cat.highlight
                      ? 'text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-500/10 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                  {cat.highlight && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></span>
                  )}
                </button>
              );
            })}

            {onOpenAiRecommendations && (
              <button
                onClick={onOpenAiRecommendations}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-accent-700 dark:text-accent-400 bg-accent-500/10 hover:bg-accent-500/20 border border-accent-500/30 transition-all whitespace-nowrap shadow-sm ml-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-accent-500 animate-pulse" />
                <span>AI Recommend</span>
              </button>
            )}

            {onOpenUiShowcase && (
              <button
                onClick={onOpenUiShowcase}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 transition-all whitespace-nowrap shadow-sm ml-1"
              >
                <Layers className="w-3.5 h-3.5 text-brand-500" />
                <span>UI Showcase (16)</span>
              </button>
            )}
          </div>

          {/* Live Backend & Multi-Rail Gateway Status Indicator */}
          <div className="hidden md:flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">FastAPI Connected</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-[11px] text-brand-600 dark:text-brand-400 font-bold">
              Rails: Bank • MoMo • Crypto
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-urban-darker px-4 py-4 space-y-2">
          <button
            onClick={() => {
              onNavigate('store');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold ${
              currentView === 'store'
                ? 'bg-brand-500 text-white'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            Electronics Storefront
          </button>
          <button
            onClick={() => {
              onFocusSearch();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center gap-2"
          >
            <Search className="w-4 h-4 text-brand-500" />
            <span>AI Smart Search</span>
          </button>
          {onOpenAiRecommendations && (
            <button
              onClick={() => {
                onOpenAiRecommendations();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-500/10 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-accent-500" />
              <span>AI Recommendation Engine</span>
            </button>
          )}
          {onOpenUiShowcase && (
            <button
              onClick={() => {
                onOpenUiShowcase();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-accent-600 dark:text-accent-400 hover:bg-accent-50 dark:hover:bg-accent-500/10 flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-accent-500" />
              <span>UI Showcase (16 Interfaces)</span>
            </button>
          )}
          {canAccessAdmin && (
          <button
            onClick={() => {
              onNavigate('admin');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between ${
              currentView === 'admin'
                ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <span>Merchant & AI Hub</span>
            {canAccessAdmin && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-accent-500/20 text-accent-700 dark:text-accent-400 font-mono">
                Admin
              </span>
            )}
          </button>
          )}
        </div>
      )}
    </header>
  );
};
