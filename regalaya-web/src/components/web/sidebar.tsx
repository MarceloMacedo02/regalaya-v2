'use client';

import Link from 'next/link';
import { Gift, Truck, Zap, ChevronRight } from 'lucide-react';
import { categories } from '@/lib/mock-data';

interface SidebarProps {
  className?: string;
}

const sidebarWidgets = [
  {
    icon: Gift,
    title: 'Presentes Populares',
    description: 'Descubra os presentes mais procurados',
    href: '/products?popular=true',
    bgColor: 'bg-[#fed2cc]/60',
    iconColor: 'text-[#be7374]',
  },
  {
    icon: Truck,
    title: 'Entrega Rápida',
    description: 'Receba em até 24h na capital',
    href: '/products?fast-delivery=true',
    bgColor: 'bg-[#fed2cc]/60',
    iconColor: 'text-[#be7374]',
  },
  {
    icon: Zap,
    title: 'Ofertas Relâmpago',
    description: 'Promoções por tempo limitado',
    href: '/products?sale=true',
    bgColor: 'bg-[#fed2cc]/60',
    iconColor: 'text-[#be7374]',
  },
];

export function Sidebar({ className = '' }: SidebarProps) {
  const activeCategories = categories.slice(0, 8);

  return (
    <aside className={`space-y-6 ${className}`}>
      {/* Categories Box */}
      <div className="rounded-2xl bg-[#fed2cc]/60 p-6">
        <h2 className="mb-4 text-lg font-bold text-[#1a1a1a]">Categorias</h2>
        <ul className="space-y-0">
          {activeCategories.map((category, index) => (
            <li key={category.id}>
              <Link
                href={`/categories/${category.slug}`}
                className={`flex items-center justify-between py-3 text-sm text-[#788090] transition-colors hover:text-[#be7374] ${
                  index < activeCategories.length - 1 ? 'border-b border-dotted border-[#be7374]/30' : ''
                }`}
              >
                <span>{category.name}</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Widget Boxes */}
      {sidebarWidgets.map((widget) => (
        <Link
          key={widget.title}
          href={widget.href}
          className={`block rounded-2xl ${widget.bgColor} p-6 transition-all hover:shadow-md`}
        >
          <div className="flex items-start gap-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-white ${widget.iconColor}`}>
              <widget.icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1a1a1a]">{widget.title}</h3>
              <p className="mt-1 text-xs text-[#788090]">{widget.description}</p>
            </div>
          </div>
        </Link>
      ))}
    </aside>
  );
}
