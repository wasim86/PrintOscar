'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { NavigationLink } from '@/components/Navigation';

interface DropdownItem {
  label: string;
  href: string;
  description?: string;
  featured?: boolean;
}

interface NavigationItem {
  label: string;
  href: string;
  dropdown?: DropdownItem[];
  target?: string;
}

interface MegaMenuProps {
  item: NavigationItem;
  onClose?: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ item, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    if (item.dropdown) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  const handleClick = () => {
    if (!item.dropdown) {
      onClose?.();
    }
  };

  if (!item.dropdown) {
    return (
      <NavigationLink
        href={item.href}
        onClick={handleClick}
        className="text-gray-200 hover:text-yellow-400 font-medium transition-colors duration-200 whitespace-nowrap"
        target={item.target}
      >
        {item.label}
      </NavigationLink>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={item.href}
        prefetch={false}
        className="flex items-center text-gray-200 hover:text-yellow-400 font-medium transition-colors duration-200 whitespace-nowrap"
      >
        {item.label}
        <ChevronDown className="ml-1 h-4 w-4" />
      </Link>

      {/* Mega Menu Dropdown */}
      {isOpen && (
        <>
          {/* Invisible bridge to prevent dropdown from closing */}
          <div className="absolute top-full left-0 w-64 h-2 bg-transparent z-40"></div>
          <div className="absolute top-full left-0 mt-2 w-64 bg-gray-900 rounded-lg shadow-xl border border-gray-700 py-4 z-50">
          <div className="px-4 pb-2 mb-2 border-b border-gray-700">
            <h3 className="text-sm font-semibold text-gray-200">{item.label}</h3>
          </div>
          
          <div className="space-y-1">
            {item.dropdown.map((dropdownItem) => (
              <NavigationLink
                key={dropdownItem.label}
                href={dropdownItem.href}
                onClick={onClose}
                className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                  dropdownItem.featured
                    ? 'text-yellow-400 font-medium hover:bg-gray-800'
                    : 'text-gray-200 hover:bg-gray-800 hover:text-yellow-400'
                }`}
              >
                <div>
                  <div className="font-medium">{dropdownItem.label}</div>
                  {dropdownItem.description && (
                    <div className="text-xs text-gray-500 mt-1">
                      {dropdownItem.description}
                    </div>
                  )}
                </div>
              </NavigationLink>
            ))}
          </div>

          {/* Featured Section for Shop Categories */}
          {(item.label === 'Shop Snacks' || item.label === 'Shop Handmades') && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="px-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Popular
                </h4>
                <div className="space-y-2">
                  {item.label === 'Shop Snacks' ? (
                    <>
                      <NavigationLink
                        href="/products?category=snacks&featured=true"
                        onClick={onClose}
                        className="block text-sm text-orange-600 hover:text-orange-700 font-medium"
                      >
                        Featured Snacks
                      </NavigationLink>
                      <NavigationLink
                        href="/products?category=snacks&sort=bestsellers"
                        onClick={onClose}
                        className="block text-sm text-orange-600 hover:text-orange-700 font-medium"
                      >
                        Best Sellers
                      </NavigationLink>
                    </>
                  ) : (
                    <>
                      <NavigationLink
                        href="/products?category=bags&custom=true"
                        onClick={onClose}
                        className="block text-sm text-orange-600 hover:text-orange-700 font-medium"
                      >
                        Custom Orders
                      </NavigationLink>
                      <NavigationLink
                        href="/products?category=bags&sort=newest"
                        onClick={onClose}
                        className="block text-sm text-orange-600 hover:text-orange-700 font-medium"
                      >
                        New Arrivals
                      </NavigationLink>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          </div>
        </>
      )}
    </div>
  );
};
