import { useState } from 'react';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Grid3X3, 
  List, 
  User, 
  Zap,
  ShoppingCart,
  Flame,
  RefreshCw,
} from 'lucide-react';
import NFTCard from './NFTCard';
import NFTDetail from './NFTDetail';

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
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [showDetail, setShowDetail] = useState(false);


  const categories = ['Todos', 'Legendario','Épico','Raro','Poco común', 'Común'];

  const filteredNFTs = marketplaceNFTs.filter(nft => {
    const matchesSearch = nft.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nft.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nft.seller?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || nft.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleViewDetail = (tokenId) => {
    const nft = marketplaceNFTs.find(nft => nft.tokenId === tokenId);
    if (nft) {
      setSelectedNFT(nft);
      setShowDetail(true);
    }
  };

  const handleBackToMarketplace = () => {
    setShowDetail(false);
    setSelectedNFT(null);
  };

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

  // Si estamos mostrando el detalle, renderizar el componente NFTDetail
  if (showDetail && selectedNFT) {
    const isOwner = currentAccount && selectedNFT.seller && 
      selectedNFT.seller.toLowerCase() === currentAccount.toLowerCase();
    
    return (
      <NFTDetail
        nft={selectedNFT}
        onBack={handleBackToMarketplace}
        onAction={isOwner ? onCancelListing : onBuyNFT}
        actionType={isOwner ? 'cancel' : 'buy'}
        isOwner={isOwner}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      
      {/* Main Content */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 4xl:px-24 py-6 sm:py-8 lg:py-12 4xl:py-16">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-8 4xl:mb-12 gap-4 lg:gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl 4xl:text-7xl font-bold text-white mb-2 lg:mb-4">
              Marketplace
            </h2>
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl 4xl:text-3xl">
              {isLoading ? 'Cargando...' : `${filteredNFTs.length} NFTs disponibles`}
            </p>
          </div>
          
          <button
            onClick={onLoadMarketplace}
            disabled={isLoading}
            className="flex cursor-pointer items-center space-x-2 lg:space-x-3 4xl:space-x-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-4 py-2 lg:px-6 lg:py-3 xl:px-8 xl:py-4 2xl:px-10 2xl:py-5 4xl:px-12 4xl:py-6 rounded-xl lg:rounded-2xl transition-colors text-sm lg:text-base xl:text-lg 2xl:text-xl 4xl:text-2xl"
          >
            <RefreshCw className={`w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7 4xl:w-8 4xl:h-8 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Recargar</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 xl:gap-8 2xl:gap-10 4xl:gap-12 mb-8 lg:mb-12 4xl:mb-16">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-4 lg:left-6 xl:left-8 top-1/2 transform -translate-y-1/2 w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 4xl:w-10 4xl:h-10 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar NFTs, vendedores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl xl:rounded-3xl pl-12 lg:pl-16 xl:pl-20 2xl:pl-24 4xl:pl-28 pr-4 lg:pr-6 xl:pr-8 py-3 sm:py-4 lg:py-5 xl:py-6 2xl:py-7 4xl:py-8 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm lg:text-base xl:text-lg 2xl:text-xl 4xl:text-2xl"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-3 lg:space-x-4 xl:space-x-5 2xl:space-x-6 4xl:space-x-8">
            <Filter className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 4xl:w-10 4xl:h-10 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white/5 cursor-pointer backdrop-blur-xl border border-white/10 rounded-xl lg:rounded-2xl px-4 lg:px-6 xl:px-8 py-2 sm:py-3 lg:py-4 xl:py-5 2xl:py-6 4xl:py-7 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm lg:text-base xl:text-lg 2xl:text-xl 4xl:text-2xl min-w-[140px] lg:min-w-[180px] xl:min-w-[220px] 2xl:min-w-[260px] 4xl:min-w-[300px]"
            >
              {categories.map(category => (
                <option key={category} value={category} className="bg-slate-800">
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-white/5 rounded-xl lg:rounded-2xl p-1 lg:p-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 cursor-pointer lg:p-3 xl:p-4 2xl:p-5 4xl:p-6 rounded-lg lg:rounded-xl transition-colors ${
                viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid3X3 className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 4xl:w-10 4xl:h-10" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 cursor-pointer lg:p-3 xl:p-4 2xl:p-5 4xl:p-6 rounded-lg lg:rounded-xl transition-colors ${
                viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 4xl:w-10 4xl:h-10" />
            </button>
          </div>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 xl:gap-8 2xl:gap-10 4xl:gap-12 mb-8 lg:mb-12 4xl:mb-16">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl xl:rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 4xl:p-16 border border-white/10">
            <div className="flex items-center space-x-3 lg:space-x-4 xl:space-x-5 2xl:space-x-6 4xl:space-x-8">
              <div className="w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 4xl:w-20 4xl:h-20 bg-green-500/20 rounded-xl lg:rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 4xl:w-10 4xl:h-10 text-green-400" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 4xl:text-6xl font-bold text-white">{marketplaceNFTs.length}</p>
                <p className="text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl 4xl:text-2xl text-gray-400">Total NFTs</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl xl:rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 4xl:p-16 border border-white/10">
            <div className="flex items-center space-x-3 lg:space-x-4 xl:space-x-5 2xl:space-x-6 4xl:space-x-8">
              <div className="w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 4xl:w-20 4xl:h-20 bg-purple-500/20 rounded-xl lg:rounded-2xl flex items-center justify-center">
                <User className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 4xl:w-10 4xl:h-10 text-purple-400" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 4xl:text-6xl font-bold text-white">{new Set(marketplaceNFTs.map(nft => nft.seller)).size}</p>
                <p className="text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl 4xl:text-2xl text-gray-400">Vendedores</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl xl:rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 4xl:p-16 border border-white/10">
            <div className="flex items-center space-x-3 lg:space-x-4 xl:space-x-5 2xl:space-x-6 4xl:space-x-8">
              <div className="w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 4xl:w-20 4xl:h-20 bg-blue-500/20 rounded-xl lg:rounded-2xl flex items-center justify-center">
                <Zap className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 4xl:w-10 4xl:h-10 text-blue-400" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 4xl:text-6xl font-bold text-white">0</p>
                <p className="text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl 4xl:text-2xl text-gray-400">Ventas Hoy</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl xl:rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 4xl:p-16 border border-white/10">
            <div className="flex items-center space-x-3 lg:space-x-4 xl:space-x-5 2xl:space-x-6 4xl:space-x-8">
              <div className="w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 4xl:w-20 4xl:h-20 bg-pink-500/20 rounded-xl lg:rounded-2xl flex items-center justify-center">
                <Flame className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 4xl:w-10 4xl:h-10 text-pink-400" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 4xl:text-6xl font-bold text-white">
                  {marketplaceNFTs.reduce((sum, nft) => sum + parseFloat(nft.price || 0), 0).toFixed(1)}
                </p>
                <p className="text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl 4xl:text-2xl text-gray-400">Volumen MTK</p>
              </div>
            </div>
          </div>
        </div>

        {/* NFTs Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 lg:py-24 4xl:py-32">
            <div className="w-16 h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 4xl:w-32 4xl:h-32 border-4 lg:border-6 xl:border-8 border-purple-500 border-t-transparent rounded-full animate-spin mb-4 lg:mb-6 4xl:mb-8"></div>
            <p className="text-gray-400 text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 4xl:text-4xl">Cargando marketplace...</p>
          </div>
        ) : filteredNFTs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 lg:py-24 4xl:py-32">
            <div className="w-16 h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 4xl:w-32 4xl:h-32 bg-gray-700 rounded-full flex items-center justify-center mb-4 lg:mb-6 4xl:mb-8">
              <ShoppingCart className="w-8 h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 4xl:w-16 4xl:h-16 text-gray-400" />
            </div>
            <p className="text-gray-400 text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 4xl:text-4xl mb-2">No hay NFTs disponibles</p>
            <p className="text-gray-500 text-sm lg:text-base xl:text-lg 2xl:text-xl 4xl:text-2xl">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 4xl:grid-cols-7 gap-4 lg:gap-6 xl:gap-8 2xl:gap-10 4xl:gap-12">
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
                      onViewDetail={handleViewDetail}
                    />
                  );
                })}
              </div>
            ) : (
              /* List View */
              <div className="space-y-4 lg:space-y-6 xl:space-y-8 2xl:space-y-10 4xl:space-y-12">
                {filteredNFTs.map((nft) => {
                  const isOwner = currentAccount && nft.seller && 
                    nft.seller.toLowerCase() === currentAccount.toLowerCase();
                  
                  return (
                    <div
                      key={nft.tokenId}
                      className="bg-white/5 backdrop-blur-xl rounded-2xl xl:rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 4xl:p-16 border border-white/10 hover:border-purple-500/50 transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-8 xl:space-x-10 2xl:space-x-12 4xl:space-x-16">
                        <img
                          src={nft.image || `https://via.placeholder.com/300x300/6366f1/ffffff?text=${encodeURIComponent(nft.name || 'NFT')}`}
                          alt={nft.name || 'NFT'}
                          className="w-full sm:w-20 lg:w-24 xl:w-28 2xl:w-32 4xl:w-40 h-40 sm:h-20 lg:h-24 xl:h-28 2xl:h-32 4xl:h-40 object-cover rounded-xl lg:rounded-2xl cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => handleViewDetail(nft.tokenId)}
                          onError={(e) => {
                            e.target.src = `https://via.placeholder.com/300x300/6366f1/ffffff?text=${encodeURIComponent(nft.name || 'NFT')}`;
                          }}
                        />
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <h3 
                                className="font-bold text-white text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 4xl:text-4xl mb-1 lg:mb-2 cursor-pointer hover:text-purple-400 transition-colors"
                                onClick={() => handleViewDetail(nft.tokenId)}
                              >
                                {nft.name || `NFT #${nft.tokenId}`}
                              </h3>
                              <p className="text-gray-400 text-sm lg:text-base xl:text-lg 2xl:text-xl 4xl:text-2xl">por {formatAddress(nft.seller)}</p>
                              {nft.description && (
                                <p className="text-gray-300 text-sm lg:text-base xl:text-lg 2xl:text-xl 4xl:text-2xl mt-1 lg:mt-2">{nft.description}</p>
                              )}
                            </div>
                            <div className="mt-2 sm:mt-0 text-left sm:text-right">
                              <p className="text-purple-400 font-bold text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 4xl:text-4xl">{formatPrice(nft.price)}</p>
                              <p className="text-gray-500 text-sm lg:text-base xl:text-lg 2xl:text-xl 4xl:text-2xl">#{nft.tokenId}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                          <button
                            onClick={() => handleViewDetail(nft.tokenId)}
                            className="w-full cursor-pointer sm:w-auto font-semibold py-2 px-4 lg:py-3 lg:px-6 xl:py-4 xl:px-8 2xl:py-5 2xl:px-10 4xl:py-6 4xl:px-12 rounded-xl lg:rounded-2xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 text-purple-300 border border-purple-500/30 transition-all duration-300 text-sm lg:text-base xl:text-lg 2xl:text-xl 4xl:text-2xl"
                          >
                            Ver Detalle
                          </button>
                          <button 
                            onClick={() => isOwner ? onCancelListing(nft) : onBuyNFT(nft)}
                            className={`w-full cursor-pointer sm:w-auto font-semibold py-2 px-6 lg:py-3 lg:px-8 xl:py-4 xl:px-10 2xl:py-5 2xl:px-12 4xl:py-6 4xl:px-16 rounded-xl lg:rounded-2xl transition-all duration-300 text-sm lg:text-base xl:text-lg 2xl:text-xl 4xl:text-2xl ${
                              isOwner 
                                ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white'
                                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                            }`}
                          >
                            {isOwner ? 'Cancelar' : 'Comprar'}
                          </button>
                        </div>
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