import React from 'react';
import { ProductGrid } from './sections/ProductGrid';
import { Categories } from './sections/Categories';
import { FeaturedProducts } from './sections/FeaturedProducts';
import { ShoppingCart } from './sections/ShoppingCart';

export function StorePage() {
  return (
    <main className="flex-1 min-w-0 overflow-auto">
      <div className="max-w-[1440px] mx-auto animate-fade-in">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <h1 className="text-gray-900 dark:text-white text-2xl md:text-3xl font-bold">Wedding Store</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
          <div className="lg:col-span-3 space-y-4">
            <FeaturedProducts />
            <ProductGrid />
          </div>
          <div className="space-y-4">
            <Categories />
            <ShoppingCart />
          </div>
        </div>
      </div>
    </main>
  );
}