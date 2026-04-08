'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TopBar } from './top-bar';
import { MainHeader } from './main-header';
import { MainNav } from './main-nav';
import { MobileCategoriesSheet } from './mobile-categories-sheet';
import { Button } from '@/components/ui/button';
import {
  Heart,
  LogOut,
  Menu,
  Package,
  Search,
  Settings,
  ShoppingCart,
  User,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useProductSearch } from '@/hooks/useProductSearch';
import { useWishlistContext } from '@/contexts/wishlist-context';
import { useCart } from '@/hooks/useCart';
import { SearchDropdown } from './search-dropdown';
import { Badge } from '@/components/ui/badge';

export function Header() {
  const { logout } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesSheetOpen, setIsCategoriesSheetOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { wishlistCount } = useWishlistContext();
  const { itemCount: cartItemCount } = useCart();

  const { query, setQuery, results, isLoading, showDropdown, setShowDropdown, clearSearch } =
    useProductSearch({
      debounceMs: 300,
      minCharacters: 2,
      maxResults: 5,
    });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length > 0) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowDropdown(false);
      setIsSearchOpen(false);
    }
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setShowDropdown(false);
    clearSearch();
  };

  const handleResultClick = () => {
    closeSearch();
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Top Bar */}
      <TopBar />

      {/* Main Header */}
      <MainHeader
        onMobileMenuToggle={handleMobileMenuToggle}
        isMobileMenuOpen={isMobileMenuOpen}
        onCategoriesSheetToggle={() => setIsCategoriesSheetOpen(!isCategoriesSheetOpen)}
        isCategoriesSheetOpen={isCategoriesSheetOpen}
      />

      {/* Main Navigation */}
      <div className="hidden md:block">
        <MainNav />
      </div>

      {/* Mobile Categories Sheet */}
      <MobileCategoriesSheet
        isOpen={isCategoriesSheetOpen}
        onClose={() => setIsCategoriesSheetOpen(false)}
      />

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-[#e8e4e0] bg-white md:hidden">
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => query.length >= 2 && setShowDropdown(true)}
                  className="h-10 w-full rounded-full border border-[#e8e4e0] bg-[#f6f3f2] px-4 pr-10 text-sm text-[#1a1a1a] outline-none focus:border-[#be7374]"
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                >
                  <Search className="h-4 w-4 text-[#788090]" />
                </Button>

                {showDropdown && (
                  <SearchDropdown
                    query={query}
                    results={results}
                    isLoading={isLoading}
                    show={showDropdown}
                    onClose={() => setShowDropdown(false)}
                    onResultClick={handleResultClick}
                  />
                )}
              </div>
            </form>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="rounded-md px-3 py-2 text-sm font-medium text-[#788090] hover:bg-[#fed2cc]/60 hover:text-[#be7374]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Início
              </Link>
              <Link
                href="/products"
                className="rounded-md px-3 py-2 text-sm font-medium text-[#788090] hover:bg-[#fed2cc]/60 hover:text-[#be7374]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Loja
              </Link>
              <Link
                href="/about"
                className="rounded-md px-3 py-2 text-sm font-medium text-[#788090] hover:bg-[#fed2cc]/60 hover:text-[#be7374]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Nossa História
              </Link>
              <Link
                href="/blog"
                className="rounded-md px-3 py-2 text-sm font-medium text-[#788090] hover:bg-[#fed2cc]/60 hover:text-[#be7374]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="rounded-md px-3 py-2 text-sm font-medium text-[#788090] hover:bg-[#fed2cc]/60 hover:text-[#be7374]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contato
              </Link>
              <div className="my-2 h-px bg-[#e8e4e0]" />
              <Link
                href="/wishlist"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[#788090] hover:bg-[#fed2cc]/60 hover:text-[#be7374]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Heart className="h-4 w-4" />
                Lista de Desejos ({wishlistCount})
              </Link>
              <Link
                href="/cart"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[#788090] hover:bg-[#fed2cc]/60 hover:text-[#be7374]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ShoppingCart className="h-4 w-4" />
                Carrinho ({cartItemCount} itens)
              </Link>
              <div className="my-2 h-px bg-[#e8e4e0]" />
              <Link
                href="/login"
                className="rounded-md px-3 py-2 text-sm font-medium text-[#788090] hover:bg-[#fed2cc]/60 hover:text-[#be7374]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Entrar / Cadastrar
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
