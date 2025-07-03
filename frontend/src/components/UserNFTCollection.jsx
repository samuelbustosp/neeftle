import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  RefreshCw,
  User,
  Star,
  Sparkles,
  ShoppingCart,
  Package,
  TrendingUp,
  Zap,
  DollarSign,
  Eye
} from 'lucide-react';
import NFTCard from './NFTCard';
import LogDisplay from './LogDisplay';

const UserNFTCollection = ({ 
  userNFTs = [], 
  isLoading = false, 
  onListNFT, 
  onCancelListing, 
  onListAllNFTs,
  currentAccount,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedStatus, setSelectedStatus] = useState('All');
  console.log("userNFTs =>", userNFTs);


  const categories = ['All', 'Art', 'Digital', 'Photography', 'Abstract', 'Character', 'Space'];
  const statusOptions = ['All', 'Listed', 'Not Listed'];

  const filteredNFTs = userNFTs.filter(nft => {
    const matchesSearch = nft.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nft.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || nft.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || 
                         (selectedStatus === 'Listed' && nft.isListed) ||
                         (selectedStatus === 'Not Listed' && !nft.isListed);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatPrice = (price) => {
    if (!price) return '0 MTK';
    if (typeof price === 'string' && price.includes('MTK')) {
      return price;
    }
    return `${price} MTK`;
  };

  const listedNFTs = userNFTs.filter(nft => nft.isListed);
  const totalValue = listedNFTs.reduce((sum, nft) => sum + parseFloat(nft.price || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Mi Colección
            </h2>
            <p className="text-gray-400">
              {isLoading ? 'Cargando...' : `${filteredNFTs.length} de ${userNFTs.length} NFTs`}
            </p>
            {currentAccount && (
              <p className="text-sm text-gray-500 mt-1">
                Wallet: {formatAddress(currentAccount)}
              </p>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            {userNFTs.length > 0 && (
              <button
                onClick={onListAllNFTs}
                disabled={isLoading}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:bg-gray-700 text-white px-4 py-2 rounded-xl transition-all duration-300"
              >
                <Sparkles className="w-4 h-4" />
                <span>Listar Todos</span>
              </button>
            )}
            
            <button
              onClick={() => window.location.reload()}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-4 py-2 rounded-xl transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Recargar</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 mb-8">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar en mi colección..."
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

          {/* Status Filter */}
          <div className="flex items-center space-x-3">
            <ShoppingCart className="w-5 h-5 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2 sm:py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {statusOptions.map(status => (
                <option key={status} value={status} className="bg-slate-800">
                  {status}
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
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{userNFTs.length}</p>
                <p className="text-sm text-gray-400">Total NFTs</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{listedNFTs.length}</p>
                <p className="text-sm text-gray-400">En Venta</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{userNFTs.length - listedNFTs.length}</p>
                <p className="text-sm text-gray-400">No Listados</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalValue.toFixed(1)}</p>
                <p className="text-sm text-gray-400">Valor MTK</p>
              </div>
            </div>
          </div>
        </div>

        {/* NFTs Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 text-lg">Cargando tu colección...</p>
          </div>
        ) : userNFTs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-6">
              <Package className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No tienes NFTs todavía</h3>
            <p className="text-gray-400 text-center max-w-md">
              Tu colección está vacía. ¡Mintea tu primer NFT o compra uno en el marketplace para empezar tu colección!
            </p>
            <div className="flex gap-4 mt-6">
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl transition-all duration-300">
                Mintear NFT
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-all duration-300">
                Ir al Marketplace
              </button>
            </div>
          </div>
        ) : filteredNFTs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 text-lg mb-2">No se encontraron NFTs</p>
            <p className="text-gray-500 text-sm">
              Prueba con diferentes filtros de búsqueda.
            </p>
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredNFTs.map((nft) => (
                  <NFTCard
                    key={nft.tokenId}
                    nft={nft}
                    onAction={nft.isListed ? onCancelListing : onListNFT}
                    actionType={nft.isListed ? 'cancel' : 'list'}
                    isOwner={true}
                    
                  />
                ))}
              </div>
            ) : (
              /* List View */
              <div className="space-y-4">
                {filteredNFTs.map((nft) => (
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
                            <div className="flex items-center space-x-2 mb-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                nft.isListed 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-gray-500/20 text-gray-400'
                              }`}>
                                {nft.isListed ? 'En Venta' : 'No Listado'}
                              </span>
                              <span className="text-gray-500 text-sm">#{nft.tokenId}</span>
                            </div>
                            {nft.description && (
                              <p className="text-gray-300 text-sm">{nft.description}</p>
                            )}
                          </div>
                          <div className="mt-2 sm:mt-0 text-left sm:text-right">
                            {nft.isListed && (
                              <p className="text-purple-400 font-bold text-lg">{formatPrice(nft.price)}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => nft.isListed ? onCancelListing(nft) : onListNFT(nft)}
                        className={`w-full sm:w-auto font-semibold py-2 px-6 rounded-xl transition-all duration-300 ${
                          nft.isListed 
                            ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                        }`}
                      >
                        {nft.isListed ? 'Cancelar Venta' : 'Listar para Venta'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserNFTCollection;