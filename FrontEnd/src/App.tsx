import React, { useState } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HeroBanner } from './components/storefront/HeroBanner';
import { ProductGrid } from './components/storefront/ProductGrid';
import { CartDrawer } from './components/storefront/CartDrawer';
import { CheckoutModal } from './components/storefront/CheckoutModal';
import { AuthModal } from './components/auth/AuthModal';
import { AiShoppingAssistant } from './components/storefront/AiShoppingAssistant';
import { AiRecommendationModal } from './components/storefront/AiRecommendationModal';
import { UiShowcaseModal, UiInterfaceItem } from './components/common/UiShowcaseModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { useCartStore } from './store/useCartStore';
import { useThemeStore } from './store/useThemeStore';
import { useAuthStore } from './store/useAuthStore';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'store' | 'admin'>('store');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [recommendationModalOpen, setRecommendationModalOpen] = useState(false);
  const [uiShowcaseOpen, setUiShowcaseOpen] = useState(false);

  const { setIsOpen: setCartOpen, addItem } = useCartStore();
  const { setTheme } = useThemeStore();
  const { setAuth, logout, isAuthenticated } = useAuthStore();

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

  const handleCategorySelect = (category: string) => {
    const queryMap: Record<string, string> = {
      All: '',
      'Smart Home': 'smart',
      Audio: 'audio',
      Wearables: 'watch',
      Accessories: 'accessories',
      Sale: 'deal',
    };
    const targetQuery = queryMap[category] !== undefined ? queryMap[category] : category.toLowerCase();
    handleHeroSearch(targetQuery);
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

  const handleTriggerUiAction = (actionType: UiInterfaceItem['actionType']) => {
    switch (actionType) {
      case 'theme_dark':
        setTheme('dark');
        break;
      case 'theme_light':
        setTheme('light');
        break;
      case 'scroll_catalog':
        if (currentView !== 'store') setCurrentView('store');
        setTimeout(handleExploreProducts, 100);
        break;
      case 'open_ai_recommend':
        setRecommendationModalOpen(true);
        break;
      case 'open_cart':
        setCartOpen(true);
        break;
      case 'open_checkout':
        // Ensure cart has at least 1 item to preview checkout
        addItem(
          {
            id: 1,
            name: 'Sony WH-1000XM5 Wireless Headphones',
            price: '399.99',
            description: 'Industry-leading noise canceling Bluetooth headphones with 30-hour battery life.',
            banner_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
            quantity: 30,
            status: 'AVAILABLE',
            created_at: new Date().toISOString(),
          },
          1
        );
        setCheckoutModalOpen(true);
        break;
      case 'open_auth':
        setAuthModalOpen(true);
        break;
      case 'open_ai_assistant':
        setAssistantPrompt('What flagship hardware do you recommend under $500?');
        break;
      case 'admin_gate':
        logout();
        setCurrentView('admin');
        break;
      case 'admin_overview':
      case 'admin_products':
      case 'admin_customers':
      case 'admin_orders':
      case 'admin_payments':
      case 'admin_ai_studio':
      case 'admin_platforms':
        if (!isAuthenticated) {
          // Provide instant admin access for live review
          setAuth('demo-admin-token', {
            public_id: 'usr_admin_001',
            name: 'Admin Reviewer',
            email: 'admin@urbanscenery.com',
            role: 'admin',
            created_at: new Date().toISOString(),
          });
        }
        setCurrentView('admin');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-urban-darker text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Global Header */}
      <Header
        currentView={currentView}
        onNavigate={(v) => setCurrentView(v)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onFocusSearch={handleFocusSearch}
        onSelectCategory={handleCategorySelect}
        onOpenAiRecommendations={() => setRecommendationModalOpen(true)}
        onOpenUiShowcase={() => setUiShowcaseOpen(true)}
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
              onSelectCategory={handleCategorySelect}
              onOpenAiRecommendations={() => setRecommendationModalOpen(true)}
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

      {/* AI Recommendation Dialog Grounded in /api/v1/ai/recommend */}
      <AiRecommendationModal
        isOpen={recommendationModalOpen}
        onClose={() => setRecommendationModalOpen(false)}
      />

      {/* Checkout & Instant Payment Modal */}
      {checkoutModalOpen && (
        <CheckoutModal
          onClose={() => setCheckoutModalOpen(false)}
          onOpenAuth={() => setAuthModalOpen(true)}
        />
      )}

      {/* Authentication Modal */}
      {authModalOpen && <AuthModal onClose={() => setAuthModalOpen(false)} />}

      {/* 16 Interfaces Interactive UI Showcase Modal */}
      <UiShowcaseModal
        isOpen={uiShowcaseOpen}
        onClose={() => setUiShowcaseOpen(false)}
        onTriggerAction={handleTriggerUiAction}
      />

      {/* Footer */}
      <Footer onOpenUiShowcase={() => setUiShowcaseOpen(true)} />
    </div>
  );
};

export default App;

