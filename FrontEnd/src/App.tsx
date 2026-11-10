import React, { useState } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HeroBanner } from './components/storefront/HeroBanner';
import { ProductGrid } from './components/storefront/ProductGrid';
import { CartDrawer } from './components/storefront/CartDrawer';
import { CheckoutModal } from './components/storefront/CheckoutModal';
import { AuthModal } from './components/auth/AuthModal';
import { AiShoppingAssistant } from './components/storefront/AiShoppingAssistant';
import { AdminDashboard } from './components/admin/AdminDashboard';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'store' | 'admin'>('store');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  // Search state passed between Hero and Grid
  const [searchQuery, setSearchQuery] = useState('');

  // Initial prompt for AI Assistant when triggered from outside
  const [assistantPrompt, setAssistantPrompt] = useState<string | undefined>(undefined);

  const handleHeroSearch = (query: string) => {
    setSearchQuery(query);
    const gridElem = document.getElementById('catalogue-section');
    if (gridElem) {
      gridElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFocusSearch = () => {
    if (currentView !== 'store') {
      setCurrentView('store');
      setTimeout(() => {
        const input = document.getElementById('main-search-input');
        if (input) input.focus();
      }, 100);
    } else {
      const input = document.getElementById('main-search-input');
      if (input) {
        input.focus();
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleExploreProducts = () => {
    const gridElem = document.getElementById('catalogue-section');
    if (gridElem) {
      gridElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Global Header */}
      <Header
        currentView={currentView}
        onNavigate={(v) => setCurrentView(v)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onFocusSearch={handleFocusSearch}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'store' ? (
          <>
            <HeroBanner
              onSearch={handleHeroSearch}
              onOpenShoppingAssistant={() =>
                setAssistantPrompt('What are your top trending electronics this week?')
              }
              onExploreProducts={handleExploreProducts}
            />

            <ProductGrid
              initialSearchQuery={searchQuery}
              onClearInitialSearch={() => setSearchQuery('')}
              onOpenShoppingAssistant={(prompt) => setAssistantPrompt(prompt)}
            />

            {/* Persistent AI Shopping Assistant */}
            <AiShoppingAssistant
              initialPrompt={assistantPrompt}
              onClearInitialPrompt={() => setAssistantPrompt(undefined)}
            />
          </>
        ) : (
          <AdminDashboard
            onBackToStore={() => setCurrentView('store')}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer onOpenCheckout={() => setCheckoutModalOpen(true)} />

      {/* Checkout & Instant Payment Modal */}
      {checkoutModalOpen && (
        <CheckoutModal
          onClose={() => setCheckoutModalOpen(false)}
          onOpenAuth={() => setAuthModalOpen(true)}
        />
      )}

      {/* Authentication Modal */}
      {authModalOpen && <AuthModal onClose={() => setAuthModalOpen(false)} />}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;

