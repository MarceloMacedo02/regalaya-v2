'use client';

import Link from 'next/link';
import { Truck, Headset, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlistContext } from '@/contexts/wishlist-context';
import { Button } from '@/components/ui/button';
import { Search, Heart, User, Menu, X, Gift } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProductSearch } from '@/hooks/useProductSearch';
import { SearchDropdown } from './search-dropdown';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Settings, Package, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CartDrawer } from './cart-drawer';

interface MainHeaderProps {
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
  onCategoriesSheetToggle?: () => void;
  isCategoriesSheetOpen?: boolean;
}

export function MainHeader({
  onMobileMenuToggle,
  isMobileMenuOpen,
  onCategoriesSheetToggle,
  isCategoriesSheetOpen,
}: MainHeaderProps) {
  const { logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const { itemCount: cartItemCount, subtotal: cartSubtotal } = useCart();
  const { wishlistCount } = useWishlistContext();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { query, setQuery, results, isLoading, showDropdown, setShowDropdown, clearSearch } =
    useProductSearch({
      debounceMs: 300,
      minCharacters: 2,
      maxResults: 5,
    });

  // Close user menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length > 0) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowDropdown(false);
      setIsSearchOpen(false);
    }
  };

  const openSearch = () => {
    setIsSearchOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 100);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setShowDropdown(false);
    clearSearch();
  };

  const handleResultClick = () => {
    closeSearch();
  };

  // Calculate cart total
  const cartTotal = cartSubtotal

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="font-sacramento text-4xl font-bold text-[#be7374] md:text-5xl">
              Regalaya
            </h1>
          </Link>

          {/* Info Blocks - Desktop */}
          <div className="hidden items-center gap-6 lg:flex">
            {/* Free Shipping */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fed2cc]/60">
                <Truck className="h-5 w-5 text-[#be7374]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a1a1a]">Frete grátis</p>
                <p className="text-xs text-[#788090]">Em pedidos acima de R$199</p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-10 w-px bg-[#e8e4e0]" />

            {/* Support */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fed2cc]/60">
                <Headset className="h-5 w-5 text-[#be7374]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a1a1a]">suporte@regalaya.com</p>
                <p className="text-xs text-[#788090]">(11) 99999-9999</p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-10 w-px bg-[#e8e4e0]" />

            {/* Cart */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#fed2cc]/60">
                <ShoppingBag className="h-5 w-5 text-[#be7374]" />
                {cartItemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#be7374] text-[10px] font-bold text-white">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a1a1a]">
                  Carrinho: {cartItemCount} {cartItemCount === 1 ? 'item' : 'itens'}
                </p>
                <p className="text-xs text-[#788090]">R$ {cartTotal.toFixed(2).replace('.', ',')}</p>
              </div>
            </button>
          </div>

          {/* Right Actions - Desktop */}
          <div className="hidden items-center gap-2 md:flex">
            {/* Search */}
            <div className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Buscar produtos..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => query.length >= 2 && setShowDropdown(true)}
                      className="h-10 w-72 rounded-full border border-[#e8e4e0] bg-[#f6f3f2] px-4 pr-10 text-sm text-[#1a1a1a] outline-none focus:border-[#be7374]"
                      autoFocus
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={closeSearch}
                    >
                      <X className="h-4 w-4 text-[#788090]" />
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
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full hover:bg-[#fed2cc]/60"
                  onClick={openSearch}
                  aria-label="Abrir busca"
                >
                  <Search className="h-5 w-5 text-[#788090]" />
                </Button>
              )}
            </div>

            {/* Wishlist */}
            <Link href="/wishlist">
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-full hover:bg-[#fed2cc]/60"
                aria-label="Lista de desejos"
              >
                <Heart className="h-5 w-5 text-[#788090]" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#be7374] p-0 text-[10px] font-bold text-white">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {isAuthenticated && (
              <div className="relative" ref={userMenuRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full hover:bg-[#fed2cc]/60"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  aria-label="Menu do usuário"
                >
                  <User className="h-5 w-5 text-[#788090]" />
                </Button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-56 rounded-md border border-[#e8e4e0] bg-white p-1 shadow-lg">
                    <Link
                      href="/account"
                      className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm text-[#788090] hover:bg-[#fed2cc]/60"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Minha Conta
                    </Link>
                    <Link
                      href="/account/orders"
                      className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm text-[#788090] hover:bg-[#fed2cc]/60"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Package className="h-4 w-4" />
                      Meus Pedidos
                    </Link>
                    <Link
                      href="/track"
                      className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm text-[#788090] hover:bg-[#fed2cc]/60"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Package className="h-4 w-4" />
                      Rastrear Pedido
                    </Link>
                    <Link
                      href="/wishlist"
                      className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm text-[#788090] hover:bg-[#fed2cc]/60"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Heart className="h-4 w-4" />
                      Lista de Desejos
                    </Link>
                    <div className="my-1 h-px bg-[#e8e4e0]" />
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-[#788090] hover:bg-[#fed2cc]/60"
                    >
                      <LogOut className="h-4 w-4" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Categories Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onCategoriesSheetToggle}
              aria-label="Abrir categorias"
            >
              <Gift className="h-5 w-5 text-[#788090]" />
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onMobileMenuToggle}
              aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      <CartDrawer isOpen={isCartDrawerOpen} onClose={() => setIsCartDrawerOpen(false)} />
    </div>
  );
}
