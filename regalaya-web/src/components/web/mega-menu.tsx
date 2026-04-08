'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

interface MegaMenuColumn {
  title: string;
  items: {
    label: string;
    href: string;
    badge?: string;
  }[];
}

interface MegaMenuProps {
  columns: MegaMenuColumn[];
  isActive?: boolean;
}

export function MegaMenu({ columns, isActive }: MegaMenuProps) {
  return (
    <div
      className={`absolute left-0 top-full z-50 w-screen bg-white shadow-lg transition-all duration-300 ${
        isActive ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
      role="menu"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-8">
          {columns.map((column) => (
            <div key={column.title} className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#1a1a1a]">
                {column.title}
              </h3>
              <ul className="space-y-2">
                {column.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex items-center gap-2 text-sm text-[#788090] transition-colors hover:text-[#be7374]"
                      role="menuitem"
                    >
                      <span className="h-px w-3 bg-[#e8e4e0] transition-all group-hover:w-5 group-hover:bg-[#be7374]" />
                      {item.label}
                      {item.badge && (
                        <span className="rounded-full bg-[#fed2cc] px-2 py-0.5 text-[10px] font-semibold text-[#be7374]">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface NavItemProps {
  label: string;
  href?: string;
  megaMenuColumns?: MegaMenuColumn[];
  isActive?: boolean;
}

function NavItem({ label, href, megaMenuColumns, isActive }: NavItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (megaMenuColumns) {
    return (
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          className={`flex items-center gap-1 px-4 py-4 text-sm font-semibold uppercase tracking-wider transition-colors ${
            isActive
              ? 'bg-[#fed2cc] text-[#be7374] [clip-path:polygon(0_0,100%_0,95%_100%,5%_100%)]'
              : 'text-[#1a1a1a] hover:text-[#be7374]'
          }`}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {label}
        </button>
        {megaMenuColumns && <MegaMenu columns={megaMenuColumns} isActive={isOpen} />}
      </div>
    );
  }

  if (href) {
    return (
      <Link
        href={href}
        className={`px-4 py-4 text-sm font-semibold uppercase tracking-wider transition-colors hover:text-[#be7374] ${
          isActive ? 'bg-[#fed2cc] text-[#be7374] [clip-path:polygon(0_0,100%_0,95%_100%,5%_100%)]' : ''
        }`}
      >
        {label}
      </Link>
    );
  }

  return (
    <span className="px-4 py-4 text-sm font-semibold uppercase tracking-wider text-[#788090]">
      {label}
    </span>
  );
}

// Mega menu data
export const shopMegaMenuColumns: MegaMenuColumn[] = [
  {
    title: 'Layouts da Loja',
    items: [
      { label: 'Grid Padrão', href: '/products?layout=grid' },
      { label: 'Lista Detalhada', href: '/products?layout=list' },
      { label: 'Masonry', href: '/products?layout=masonry' },
      { label: 'Carrossel', href: '/products?layout=carousel' },
      { label: 'Minimalista', href: '/products?layout=minimal' },
    ],
  },
  {
    title: 'Layout do Produto',
    items: [
      { label: 'Visualização Padrão', href: '/products/view=default' },
      { label: 'Galeria Expandida', href: '/products/view=expanded' },
      { label: 'Abas de Detalhes', href: '/products/view=tabs' },
      { label: 'Sticky Info', href: '/products/view=sticky' },
    ],
  },
  {
    title: 'Tipos de Produto',
    items: [
      { label: 'Simples', href: '/products?type=simple' },
      { label: 'Variável', href: '/products?type=variable', badge: 'Popular' },
      { label: 'Personalizável', href: '/products?type=customizable' },
      { label: 'Kit / Combo', href: '/products?type=bundle' },
    ],
  },
];

export const pagesMegaMenuColumns: MegaMenuColumn[] = [
  {
    title: 'Páginas da Loja',
    items: [
      { label: 'Carrinho', href: '/cart' },
      { label: 'Checkout', href: '/checkout' },
      { label: 'Lista de Desejos', href: '/wishlist' },
      { label: 'Rastrear Pedido', href: '/track' },
    ],
  },
  {
    title: 'Conta',
    items: [
      { label: 'Minha Conta', href: '/account' },
      { label: 'Meus Pedidos', href: '/account/orders' },
      { label: 'Endereços', href: '/account/addresses' },
      { label: 'Configurações', href: '/account/settings' },
    ],
  },
  {
    title: 'Informações',
    items: [
      { label: 'Sobre Nós', href: '/about' },
      { label: 'Contato', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Termos de Uso', href: '/terms' },
    ],
  },
];

export function MainNavItems() {
  const [activeItem, setActiveItem] = useState('home');

  const navItems = [
    { label: 'Início', href: '/', key: 'home' },
    { label: 'Loja', key: 'shop', megaMenuColumns: shopMegaMenuColumns },
    { label: 'Páginas', key: 'pages', megaMenuColumns: pagesMegaMenuColumns },
    { label: 'Nossa História', href: '/about', key: 'story' },
    { label: 'Blog', href: '/blog', key: 'blog' },
    { label: 'Contato', href: '/contact', key: 'contact' },
  ];

  return (
    <>
      {navItems.map((item) => (
        <div
          key={item.key}
          onMouseEnter={() => setActiveItem(item.key)}
          className="relative"
        >
          {item.megaMenuColumns ? (
            <NavItem
              label={item.label}
              megaMenuColumns={item.megaMenuColumns}
              isActive={activeItem === item.key}
            />
          ) : item.href ? (
            <NavItem
              label={item.label}
              href={item.href}
              isActive={activeItem === item.key}
            />
          ) : (
            <NavItem label={item.label} isActive={activeItem === item.key} />
          )}
        </div>
      ))}
    </>
  );
}
