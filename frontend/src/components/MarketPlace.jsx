import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Heart, 
  Share2, 
  Eye, 
  TrendingUp, 
  Grid3X3, 
  List, 
  Wallet, 
  LogOut, 
  Bell, 
  User, 
  Sparkles,
  Zap,
  ShoppingCart,
  Star,
  Flame,
  RefreshCw,
  X
} from 'lucide-react';
import NFTCard from './NFTCard';


const Marketplace = ({ 
  marketplaceNFTs = [], 
  isLoading = false, 
  onBuyNFT, 
  onCancelListing, 
  onLoadMarketplace,
  currentAccount,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [likedNFTs, setLikedNFTs] = useState(new Set());
  console.log('marketplaceNFTs',marketplaceNFTs)

  const categories = ['All', 'Art', 'Digital', 'Photography', 'Abstract', 'Character', 'Space'];

  const filteredNFTs = marketplaceNFTs.filter(nft => {
    const matchesSearch = nft.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nft.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nft.seller?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || nft.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatPrice = (price) => {
    if (!price) return '0 MTK';
    // Si price es un string que ya tiene MTK, devolverlo tal como está
    if (typeof price === 'string' && price.includes('MTK')) {
      return price;
    }
    // Si es un número o string numérico, agregar MTK
    return `${price} MTK`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Marketplace
            </h2>
            <p className="text-gray-400">
              {isLoading ? 'Cargando...' : `${filteredNFTs.length} NFTs disponibles`}
            </p>
          </div>
          
          <button
            onClick={onLoadMarketplace}
            disabled={isLoading}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-4 py-2 rounded-xl transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Recargar</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 mb-8">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar NFTs, vendedores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl pl-12 pr-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2 sm:py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {categories.map(category => (
                <option key={category} value={category} className="bg-slate-800">
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-white/5 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{marketplaceNFTs.length}</p>
                <p className="text-sm text-gray-400">Total NFTs</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{new Set(marketplaceNFTs.map(nft => nft.seller)).size}</p>
                <p className="text-sm text-gray-400">Vendedores</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-sm text-gray-400">Ventas Hoy</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center">
                <Flame className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {marketplaceNFTs.reduce((sum, nft) => sum + parseFloat(nft.price || 0), 0).toFixed(1)}
                </p>
                <p className="text-sm text-gray-400">Volumen MTK</p>
              </div>
            </div>
          </div>
        </div>

        {/* NFTs Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 text-lg">Cargando marketplace...</p>
          </div>
        ) : filteredNFTs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 text-lg mb-2">No hay NFTs disponibles</p>
            <p className="text-gray-500 text-sm">
              {marketplaceNFTs.length === 0 
                ? "No hay NFTs listados en este momento."
                : "Prueba con diferentes filtros de búsqueda."
              }
            </p>
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredNFTs.map((nft) => {
                  const isOwner = currentAccount && nft.seller && 
                    nft.seller.toLowerCase() === currentAccount.toLowerCase();
                  
                  return (
                    <NFTCard
                      key={nft.tokenId}
                      nft={nft}
                      onAction={isOwner ? onCancelListing : onBuyNFT}
                      actionType={isOwner ? 'cancel' : 'buy'}
                      isOwner={isOwner}
                    />
                  );
                })}
              </div>
            ) : (
              /* List View */
              <div className="space-y-4">
                {filteredNFTs.map((nft) => {
                  const isOwner = currentAccount && nft.seller && 
                    nft.seller.toLowerCase() === currentAccount.toLowerCase();
                  
                  return (
                    <div
                      key={nft.tokenId}
                      className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <img
                          src={nft.image || `https://via.placeholder.com/300x300/6366f1/ffffff?text=${encodeURIComponent(nft.name || 'NFT')}`}
                          alt={nft.name || 'NFT'}
                          className="w-full sm:w-20 h-40 sm:h-20 object-cover rounded-xl"
                          onError={(e) => {
                            e.target.src = `https://via.placeholder.com/300x300/6366f1/ffffff?text=${encodeURIComponent(nft.name || 'NFT')}`;
                          }}
                        />
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <h3 className="font-bold text-white text-lg mb-1">
                                {nft.name || `NFT #${nft.tokenId}`}
                              </h3>
                              <p className="text-gray-400 text-sm">por {formatAddress(nft.seller)}</p>
                              {nft.description && (
                                <p className="text-gray-300 text-sm mt-1">{nft.description}</p>
                              )}
                            </div>
                            <div className="mt-2 sm:mt-0 text-left sm:text-right">
                              <p className="text-purple-400 font-bold text-lg">{formatPrice(nft.price)}</p>
                              <p className="text-gray-500 text-sm">#{nft.tokenId}</p>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => isOwner ? onCancelListing(nft) : onBuyNFT(nft)}
                          className={`w-full sm:w-auto font-semibold py-2 px-6 rounded-xl transition-all duration-300 ${
                            isOwner 
                              ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white'
                              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                          }`}
                        >
                          {isOwner ? 'Cancelar' : 'Comprar'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Marketplace;