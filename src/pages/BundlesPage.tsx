import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Bundle } from '../types';
import { fetchBundles } from '../services/api';
import { BundleCard } from '../components/BundleCard';
import { CheckoutModal } from '../components/CheckoutModal';
import { Search, SlidersHorizontal, Film, ArrowUpDown } from 'lucide-react';

export const BundlesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || 'All'
  );
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [selectedBundleForCheckout, setSelectedBundleForCheckout] = useState<Bundle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBundles()
      .then((data) => {
        setBundles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const categories = ['All', 'Viral Reels', 'Cinematic B-Roll', '3D Animations', 'Luxury Lifestyle', 'Audio FX'];

  const filteredBundles = bundles
    .filter((b) => {
      const matchesCategory =
        selectedCategory === 'All' || b.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesQuery =
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      {selectedBundleForCheckout && (
        <CheckoutModal
          bundle={selectedBundleForCheckout}
          onClose={() => setSelectedBundleForCheckout(null)}
        />
      )}

      {/* Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider mb-2">
          <Film className="w-4 h-4" /> Full Catalog
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          All Video Bundles
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Explore our collection of royalty-free video assets, vertical reels, and creative sound packs.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#11131a] border border-white/5 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search packs by keyword..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs sm:text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSearchParams(cat === 'All' ? {} : { category: cat });
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <ArrowUpDown className="w-4 h-4 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-gray-300 text-xs focus:outline-none focus:border-purple-500"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Bundles Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="rounded-2xl bg-[#11131a] border border-white/5 h-96 animate-pulse" />
          ))}
        </div>
      ) : filteredBundles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBundles.map((bundle) => (
            <BundleCard
              key={bundle.id}
              bundle={bundle}
              onQuickBuy={(b) => setSelectedBundleForCheckout(b)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#11131a] rounded-3xl border border-white/5">
          <SlidersHorizontal className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No video bundles found</h3>
          <p className="text-gray-400 text-xs">Try adjusting your search or category filter.</p>
        </div>
      )}
    </div>
  );
};
