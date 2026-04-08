'use client';

import { Search } from 'lucide-react';
import { MainNavItems } from './mega-menu';

export function MainNav() {
  return (
    <nav className="border-t-2 border-dotted border-[#e8e4e0] bg-white" aria-label="Navegação principal">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Nav Items */}
        <div className="flex items-center">
          <MainNavItems />
        </div>

        {/* Search Icon - Right */}
        <div className="hidden md:block">
          <button
            type="button"
            className="p-2 text-[#788090] hover:text-[#be7374]"
            aria-label="Buscar"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
