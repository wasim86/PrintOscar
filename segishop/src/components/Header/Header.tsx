'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { User, Heart, ShoppingCart, Menu, X, ChevronDown, ChevronUp } from 'lucide-react';
import { NavigationLink } from '@/components/Navigation';

import { MegaMenu } from './MegaMenu';
import { SearchBar } from './SearchBar';
import { SignupModal } from '../Auth/SignupModal';
import { LoginModal } from '../Auth/LoginModal';
import { ForgotPasswordModal } from '../Auth/ForgotPasswordModal';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Cart } from '../Cart/Cart';
import { ComparisonIndicator } from '../ComparisonIndicator';
import { CurrencySelector } from '../Currency/CurrencySelector';

interface HeaderProps {
  // No props needed - using contexts
}

// Navigation structure based on database slugs
const navigationItems = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Trophies',
    href: '/products?category=trophies',
    dropdown: [
      { label: '1, 2, 3, 4 Columns Trophy', href: '/products?category=1234-columns-trophy' },
      { label: 'Cups Trophy', href: '/products?category=cups-trophy' },
      { label: 'Completed Metal Cups', href: '/products?category=metal-cups' },
      { label: 'Completed Plastic Cups', href: '/products?category=plastic-cups' },
      { label: 'Resins Trophy', href: '/products?category=resins-trophy' },
      { label: 'Trophy', href: '/products?category=trophy' },
    ],
  },
  {
    label: 'Medals',
    href: '/products?category=medals',
    dropdown: [
      { label: 'Baseball / Softball', href: '/products?category=baseball-softball' },
      { label: 'Basketball', href: '/products?category=basketball' },
      { label: 'Bowling', href: '/products?category=bowling' },
      { label: 'Cheer / Gymnastics', href: '/products?category=cheer-gymnastics' },
      { label: 'Football', href: '/products?category=football' },
      { label: 'Golf', href: '/products?category=golf' },
      { label: 'Hockey', href: '/products?category=hockey' },
      { label: 'Martial Arts & Wrestling', href: '/products?category=martial-arts' },
      { label: 'Pickleball / Tennis', href: '/products?category=tennis' },
      { label: 'Place / Participant', href: '/products?category=placeparticipantsportsmanship' },
      { label: 'Racing / Motor Sports', href: '/products?category=racing' },
      { label: 'Soccer', href: '/products?category=soccer' },
      { label: 'Swimming', href: '/products?category=swimming' },
      { label: 'Track & Field', href: '/products?category=track-field' },
      { label: 'Volleyball', href: '/products?category=volleyball' },
      { label: 'Insert Holder Medals', href: '/products?category=insert-holder-medals' },
      { label: 'Victory / Torch / Achievement', href: '/products?category=victorytorchachievement' },
    ],
  },
  {
    label: 'Sports & American Awards',
    href: '/products?category=awards',
    dropdown: [
      { label: 'Academic / Music / Religion / Theater Awards', href: '/products?category=academic-musicreligion-theater-awards' },
      { label: 'American Eagle Awards', href: '/products?category=eagle-awards' },
      { label: 'Auto Show Awards', href: '/products?category=auto-show-awards' },
      { label: 'Baseball Awards', href: '/products?category=baseball-awards' },
      { label: 'Basketball Awards', href: '/products?category=basketball-awards' },
      { label: 'Bowling Awards', href: '/products?category=bowling-awards' },
      { label: 'Football Awards', href: '/products?category=football-awards' },
      { label: 'Hockey Awards', href: '/products?category=hockey-awards' },
      { label: 'Soccer Awards', href: '/products?category=soccer-awards' },
      { label: 'Golf Awards', href: '/products?category=golf' },
      { label: 'Martial Arts & Wrestling Awards', href: '/products?category=martial-arts-1' },
      { label: 'Swimming Awards', href: '/products?category=swimming-awards' },
      { label: 'Track & Field Awards', href: '/products?category=track-field' },
      { label: 'Volleyball Awards', href: '/products?category=volleyball' },
      { label: 'Lacrosse Awards', href: '/products?category=lacrosse-awards' },
      { label: 'Pageantry Awards', href: '/products?category=pageantry-awards' },
      { label: 'Police / Fire / EMS & Military Awards', href: '/products?category=service-awards' },
      { label: 'Miscellaneous Awards', href: '/products?category=miscellaneous-award' },
      { label: 'Achiever & Star Awards', href: '/products?category=achiever-and-star-awards' },
    ],
  },
  {
    label: 'Plaques & Executive Awards',
    href: '/products?category=plaques-executive-awards',
    dropdown: [
      { label: 'Achiever & Star Awards', href: '/products?category=achiever-and-star-awards' },
      { label: 'Alder & Cherry Wood Plaques', href: '/products?category=alder-cherry-wood-plaques' },
      { label: 'Certificate / Photo Plaques', href: '/products?category=certificate-photo-plaques' },
      { label: 'Eagle Plaques & Awards', href: '/products?category=eagel-plaques-awards' },
      { label: 'Frame Plaques', href: '/products?category=frame-plaques' },
      { label: 'Gavel Plaques & Awards', href: '/products?category=gavel-plaques-awards' },
      { label: 'Perpetual / Annual Plaques', href: '/products?category=perpetualannual-plaques' },
      { label: 'Piano Finish / High Gloss Plaques', href: '/products?category=piano-finishhigh-gloss-plaques-awards' },
      { label: 'Plaques Metal Accessories', href: '/products?category=plaques-metal-accessories' },
      { label: 'Sublimitable Full Color Plaques', href: '/products?category=sublimitable-full-color-plaques-awards' },
      { label: 'Walnut Plaques', href: '/products?category=walnut-plaques' },
    ],
  },
  {
    label: 'Acrylic Awards',
    href: '/products?category=acrylics',
    dropdown: [
      { label: 'Acrylic Plaques', href: '/products?category=acrylic-plaques' },
      { label: 'Piano Finish Bases', href: '/products?category=piano-finish-bases' },
      { label: 'Self Standing (No Base)', href: '/products?category=self-standing-no-base' },
      { label: 'Full Color Acrylics with Bases', href: '/products?category=full-color-acrylics-with-bases' },
      { label: 'Round & Octagon with Base', href: '/products?category=round-and-octagon-with-base' },
      { label: 'Star Awards with Bases', href: '/products?category=star-awards-with-bases' },
      { label: 'Tower & Diamond with Base', href: '/products?category=tower-diamond-with-base' },
      { label: 'Acrylics with Acrylic Bases', href: '/products?category=acrylics-with-acrylic-bases' },
      { label: 'Acrylic w/ wood & metal Bases', href: '/products?category=acrylic-w-wood-metal-bases' },
      { label: 'Free standing Acrylics', href: '/products?category=free-standing-acrylics' },
    ],
  },
  {
    label: 'Crystal Awards',
    href: '/products?category=crystal',
    dropdown: [
      { label: 'Crystal Cups & Plates', href: '/products?category=crystal-cups-and-plates' },
      { label: 'Crystal on Bases', href: '/products?category=crystal-on-bases' },
      { label: 'Cubes', href: '/products?category=cubes' },
      { label: 'Diamonds', href: '/products?category=diamonds' },
      { label: 'Globes', href: '/products?category=globes' },
      { label: 'Self-Standing Crystal Awards', href: '/products?category=self-standing-crystal-awards-no-base' },
      { label: 'Crystal Eagle', href: '/products?category=crystal-eagle' },
    ],
  },
  {
    label: 'Glass Awards',
    href: '/products?category=glass',
    dropdown: [
      { label: 'Classic Glass Awards & Plaques', href: '/products?category=classic-glass-awards-and-plaques' },
      { label: 'Classic Glass & Plaques', href: '/products?category=classic-glass-plaques' },
      { label: 'Art Glass', href: '/products?category=art-glass' },
      { label: 'Glass and Crystal Paperweights', href: '/products?category=glass-and-crystal-paperweights' },
      { label: 'Paperweights', href: '/products?category=paperweights' },
    ],
  },
  {
    label: 'Clocks',
    href: '/products?category=clocks',
    dropdown: [
      { label: 'Desk/Mantle Clocks', href: '/products?category=deskmantle-clocks' },
      { label: 'Wall Clocks', href: '/products?category=wall-clocks' },
      { label: 'Book Clocks', href: '/products?category=book-clocks' },
    ]
  },
  {
    label: 'Pens & Accessories',
    href: '/products?category=pens',
    dropdown: [
      { label: 'Pens', href: '/products?category=pens-1' },
      { label: 'Business Cards', href: '/products?category=business-cards' },
      { label: 'Deck Wedges / Cutting Boards', href: '/products?category=deck-wedges-cuttingserving-boards-and-coasters-ewelry-boxes' },
    ],
  },
  {
    label: 'Banners & Signs',
    href: '/products?category=banners',
  },
  {
    label: 'Promotional Products',
    href: 'https://oscarprinting.espwebsites.com/',
    target: '_blank',
  },
  {
    label: 'Wedding Invitations',
    href: '/wedding-invitations',
  },
];


export const Header: React.FC<HeaderProps> = () => {
  const { customer, isAuthenticated, logout } = useAuth();
  const { cart, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [expandedMobileMenus, setExpandedMobileMenus] = useState<string[]>([]);

  const handleSearch = (query: string, category?: string) => {
    console.log('Search query:', query, 'Category:', category);
    // TODO: Navigate to search results page
    // router.push(`/search?q=${encodeURIComponent(query)}${category ? `&category=${category}` : ''}`);
  };

  const toggleMobileDropdown = (itemLabel: string) => {
    setExpandedMobileMenus(prev =>
      prev.includes(itemLabel)
        ? prev.filter(label => label !== itemLabel)
        : [...prev, itemLabel]
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-black shadow-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-20 py-2">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 mr-4">
            <NavigationLink href="/" className="flex items-center">
              <img
                src="/uploads/logo/logo.png"
                alt="SegiShop"
                className="h-10 w-auto object-contain filter brightness-110"
              />
            </NavigationLink>
          </div>

          {/* Utility Icons */}
          <div className="flex items-center space-x-4 flex-shrink-0 ml-4">
            {/* Currency Selector */}
            <CurrencySelector compact className="hidden sm:block" />

            {/* User Account */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="p-2 text-gray-300 hover:text-yellow-400 transition-colors duration-200"
              >
                <User className="h-6 w-6" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 rounded-lg shadow-xl border border-gray-700 py-2 z-50">
                  {isAuthenticated && customer ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-sm font-medium text-gray-200">{customer.firstName} {customer.lastName}</p>
                        <p className="text-xs text-gray-400">{customer.email}</p>
                      </div>
                      <Link href="/account" prefetch={false} className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 hover:text-yellow-400">
                        My Account
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 hover:text-yellow-400"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setIsLoginModalOpen(true);
                          setIsUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 hover:text-yellow-400"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => {
                          setIsSignupModalOpen(true);
                          setIsUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 hover:text-yellow-400"
                      >
                        Create Account
                      </button>
                    </>
                  )
                  }
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link href="/wishlist" prefetch={false} className="relative p-2 text-gray-300 hover:text-yellow-400 transition-colors duration-200">
              <Heart className="h-6 w-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Product Comparison */}
            <ComparisonIndicator className="p-2 text-gray-300 hover:text-yellow-400 transition-colors duration-200" />

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative p-2 text-gray-300 hover:text-yellow-400 transition-colors duration-200"
            >
              <ShoppingCart className="h-6 w-6" />
              {cart && cart.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {cart.totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-yellow-400 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Navigation - Dedicated Row */}
      <div className="hidden lg:block bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-center flex-wrap gap-x-8 gap-y-4 py-3">
            {navigationItems.map((item) => (
              <div key={item.label} className="whitespace-nowrap">
                <MegaMenu
                  item={item}
                  onClose={() => setIsMobileMenuOpen(false)}
                />
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Search Bar Section */}
      <div className="bg-gray-900 border-t border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-4xl mx-auto">
            <Suspense fallback={null}>
              <SearchBar onSearch={handleSearch} placeholder="Search products..." />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-gray-900 border-t border-gray-700">
          <div className="px-4 py-4 space-y-2">
            {navigationItems.map((item) => (
              <div key={item.label}>
                {item.dropdown ? (
                  // Items with dropdown (Shop Snacks, Shop Handmades)
                  <div>
                    <button
                      onClick={() => toggleMobileDropdown(item.label)}
                      className="flex items-center justify-between w-full px-4 py-3 text-gray-200 hover:bg-gray-800 hover:text-yellow-400 rounded-md font-medium text-base"
                    >
                      <span>{item.label}</span>
                      {expandedMobileMenus.includes(item.label) ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>

                    {/* Expandable Dropdown */}
                    {expandedMobileMenus.includes(item.label) && (
                      <div className="ml-6 mt-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                        <NavigationLink
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-yellow-400 rounded-md"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          View All {item.label.replace('Shop ', '')}
                        </NavigationLink>
                        {item.dropdown.map((dropdownItem) => (
                          <NavigationLink
                            key={dropdownItem.label}
                            href={dropdownItem.href}
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-yellow-400 rounded-md"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {dropdownItem.label}
                          </NavigationLink>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Regular menu items (Home, Trending, About, Contact)
                  <NavigationLink
                    href={item.href}
                    className="block px-4 py-3 text-gray-200 hover:bg-gray-800 hover:text-yellow-400 rounded-md font-medium text-base"
                    onClick={() => setIsMobileMenuOpen(false)}
                    target={item.target}
                  >
                    {item.label}
                  </NavigationLink>
                )}
              </div>
            ))}

            {/* Mobile Currency Selector */}
            <div className="border-t border-gray-700 pt-4 mt-4">
              <div className="px-4 py-3">
                <div className="text-sm font-medium text-gray-300 mb-2">Currency</div>
                <CurrencySelector />
              </div>
            </div>

            {/* Mobile Comparison Link */}
            <div className="border-t border-gray-700 pt-4 mt-4">
              <ComparisonIndicator
                className="flex items-center px-4 py-3 text-gray-200 hover:bg-gray-800 hover:text-yellow-400 rounded-md font-medium text-base w-full"
                showText={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Auth Modals */}
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onSwitchToLogin={() => {
          setIsSignupModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToSignup={() => {
          setIsLoginModalOpen(false);
          setIsSignupModalOpen(true);
        }}
        onSwitchToForgotPassword={() => {
          setIsLoginModalOpen(false);
          setIsForgotPasswordModalOpen(true);
        }}
      />

      <ForgotPasswordModal
        isOpen={isForgotPasswordModalOpen}
        onClose={() => setIsForgotPasswordModalOpen(false)}
        onSwitchToLogin={() => {
          setIsForgotPasswordModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />

      {/* Cart Panel */}
      <Cart />
    </header>
  );
};
