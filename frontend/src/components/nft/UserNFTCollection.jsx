import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  RefreshCw,
  ShoppingCart,
  Package,
  TrendingUp,
  DollarSign,
  Eye,
  Plus
} from 'lucide-react';
import NFTCard from './NFTCard';
import { Link } from 'react-router-dom';

const UserNFTCollection = ({ 
  userNFTs = [], 
  isLoading = false, 
  onListNFT, 
  onCancelListing, 
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
  console.log('listedNFTs',listedNFTs)
  const totalValue = listedNFTs.reduce((sum, nft) => sum + parseFloat(nft.price || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Main Content */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 4xl:px-24 py-6 sm:py-8 lg:py-12 4xl:py-16">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-8 4xl:mb-12 gap-4 lg:gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl 4xl:text-7xl font-bold text-white mb-2 lg:mb-4">
              Mi Colección
            </h2>
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl 4xl:text-3xl">
              {isLoading ? 'Cargando...' : `${filteredNFTs.length} de ${userNFTs.length} NFTs`}
            </p>
            {currentAccount && (
              <p className="text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl 4xl:text-2xl text-gray-500 mt-1 lg:mt-2">
                Wallet: {formatAddress(currentAccount)}
              </p>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 xl:gap-4 2xl:gap-5 4xl:gap-6">
            <Link 
              to={'/mint'} 
              className="flex items-center space-x-2 lg:space-x-3 4xl:space-x-4 border border-purple-700 hover:bg-purple-700 disabled:bg-purple-800 text-white px-4 py-2 lg:px-6 lg:py-3 xl:px-8 xl:py-4 2xl:px-10 2xl:py-5 4xl:px-12 4xl:py-6 rounded-xl lg:rounded-2xl transition-colors text-sm lg:text-base xl:text-lg 2xl:text-xl 4xl:text-2xl"
            >
              <Plus className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7 4xl:w-8 4xl:h-8"/>
              <span>Crear NFT</span>
            </Link>
            
            <button
              onClick={() => window.location.reload()}
              disabled={isLoading}
              className="flex items-center space-x-2 lg:space-x-3 4xl:space-x-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-4 py-2 lg:px-6 lg:py-3 xl:px-8 xl:py-4 2xl:px-10 2xl:py-5 4xl:px-12 4xl:py-6 rounded-xl lg:rounded-2xl transition-colors cursor-pointer text-sm lg:text-base xl:text-lg 2xl:text-xl 4xl:text-2xl"
            >
              <RefreshCw className={`w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7 4xl:w-8 4xl:h-8 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Recargar</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 xl:gap-8 2xl:gap-10 4xl:gap-12 mb-8 lg:mb-12 4xl:mb-16">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-4 lg:left-6 xl:left-8 top-1/2 transform -translate-y-1/2 w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 4xl:w-10 4xl:h-10 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar en mi colección..."
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
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl lg:rounded-2xl px-4 lg:px-6 xl:px-8 py-2 sm:py-3 lg:py-4 xl:py-5 2xl:py-6 4xl:py-7 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm lg:text-base xl:text-lg 2xl:text-xl 4xl:text-2xl min-w-[140px] lg:min-w-[180px] xl:min-w-[220px] 2xl:min-w-[260px] 4xl:min-w-[300px]"
            >
              {categories.map(category => (
                <option key={category} value={category} className="bg-slate-800">
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-3 lg:space-x-4 xl:space-x-5 2xl:space-x-6 4xl:space-x-8">
            <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 4xl:w-10 4xl:h-10 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl lg:rounded-2xl px-4 lg:px-6 xl:px-8 py-2 sm:py-3 lg:py-4 xl:py-5 2xl:py-6 4xl:py-7 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm lg:text-base xl:text-lg 2xl:text-xl 4xl:text-2xl min-w-[140px] lg:min-w-[180px] xl:min-w-[220px] 2xl:min-w-[260px] 4xl:min-w-[300px]"
            >
              {statusOptions.map(status => (
                <option key={status} value={status} className="bg-slate-800">
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-white/5 rounded-xl lg:rounded-2xl p-1 lg:p-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 lg:p-3 xl:p-4 2xl:p-5 4xl:p-6 rounded-lg lg:rounded-xl transition-colors ${
                viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid3X3 className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 4xl:w-10 4xl:h-10" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 lg:p-3 xl:p-4 2xl:p-5 4xl:p-6 rounded-lg lg:rounded-xl transition-colors ${
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
              <div className="w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 4xl:w-20 4xl:h-20 bg-blue-500/20 rounded-xl lg:rounded-2xl flex items-center justify-center">
                <Package className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 4xl:w-10 4xl:h-10 text-blue-400" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 4xl:text-6xl font-bold text-white">{userNFTs.length}</p>
                <p className="text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl 4xl:text-2xl text-gray-400">Total NFTs</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl xl:rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 4xl:p-16 border border-white/10">
            <div className="flex items-center space-x-3 lg:space-x-4 xl:space-x-5 2xl:space-x-6 4xl:space-x-8">
              <div className="w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 4xl:w-20 4xl:h-20 bg-green-500/20 rounded-xl lg:rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 4xl:w-10 4xl:h-10 text-green-400" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 4xl:text-6xl font-bold text-white">{listedNFTs.length}</p>
                <p className="text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl 4xl:text-2xl text-gray-400">En Venta</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl xl:rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 4xl:p-16 border border-white/10">
            <div className="flex items-center space-x-3 lg:space-x-4 xl:space-x-5 2xl:space-x-6 4xl:space-x-8">
              <div className="w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 4xl:w-20 4xl:h-20 bg-purple-500/20 rounded-xl lg:rounded-2xl flex items-center justify-center">
                <Eye className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 4xl:w-10 4xl:h-10 text-purple-400" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 4xl:text-6xl font-bold text-white">{userNFTs.length - listedNFTs.length}</p>
                <p className="text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl 4xl:text-2xl text-gray-400">No Listados</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl xl:rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 4xl:p-16 border border-white/10">
            <div className="flex items-center space-x-3 lg:space-x-4 xl:space-x-5 2xl:space-x-6 4xl:space-x-8">
              <div className="w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 4xl:w-20 4xl:h-20 bg-yellow-500/20 rounded-xl lg:rounded-2xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 4xl:w-10 4xl:h-10 text-yellow-400" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 4xl:text-6xl font-bold text-white">{totalValue.toFixed(1)}</p>
                <p className="text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl 4xl:text-2xl text-gray-400">Valor MTK</p>
              </div>
            </div>
          </div>
        </div>

        {/* NFTs Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 lg:py-24 4xl:py-32">
            <div className="w-16 h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 4xl:w-32 4xl:h-32 border-4 lg:border-6 xl:border-8 border-purple-500 border-t-transparent rounded-full animate-spin mb-4 lg:mb-6 4xl:mb-8"></div>
            <p className="text-gray-400 text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 4xl:text-4xl">Cargando tu colección...</p>
          </div>
        ) : userNFTs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 lg:py-24 4xl:py-32">
            <div className="w-20 h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 2xl:w-32 2xl:h-32 4xl:w-40 4xl:h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-6 lg:mb-8 4xl:mb-10">
              <Package className="w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 4xl:w-20 4xl:h-20 text-purple-400" />
            </div>
            <h3 className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl 4xl:text-5xl font-bold text-white mb-2 lg:mb-4">No tienes NFTs todavía</h3>
            <p className="text-gray-400 text-center max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl 4xl:max-w-3xl text-sm lg:text-base xl:text-lg 2xl:text-xl 4xl:text-2xl">
              Tu colección está vacía. ¡Mintea tu primer NFT o compra uno en el marketplace para empezar tu colección!
            </p>
            <div className="flex gap-4 lg:gap-6 xl:gap-8 2xl:gap-10 4xl:gap-12 mt-6 lg:mt-8 4xl:mt-10">
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 lg:px-8 lg:py-4 xl:px-10 xl:py-5 2xl:px-12 2xl:py-6 4xl:px-16 4xl:py-8 rounded-xl lg:rounded-2xl transition-all duration-300 text-sm lg:text-base xl:text-lg 2xl:text-xl 4xl:text-2xl">
                Mintear NFT
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 lg:px-8 lg:py-4 xl:px-10 xl:py-5 2xl:px-12 2xl:py-6 4xl:px-16 4xl:py-8 rounded-xl lg:rounded-2xl transition-all duration-300 text-sm lg:text-base xl:text-lg 2xl:text-xl 4xl:text-2xl">
                Ir al Marketplace
              </button>
            </div>
          </div>
        ) : filteredNFTs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 lg:py-24 4xl:py-32">
            <div className="w-16 h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 4xl:w-32 4xl:h-32 bg-gray-700 rounded-full flex items-center justify-center mb-4 lg:mb-6 4xl:mb-8">
              <Search className="w-8 h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 4xl:w-16 4xl:h-16 text-gray-400" />
            </div>
            <p className="text-gray-400 text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 4xl:text-4xl mb-2">No se encontraron NFTs</p>
            <p className="text-gray-500 text-sm lg:text-base xl:text-lg 2xl:text-xl 4xl:text-2xl">
              Prueba con diferentes filtros de búsqueda.
            </p>
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 4xl:grid-cols-7 gap-4 lg:gap-6 xl:gap-8 2xl:gap-10 4xl:gap-12">
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
              <div className="space-y-4 lg:space-y-6 xl:space-y-8 2xl:space-y-10 4xl:space-y-12">
                {filteredNFTs.map((nft) => (
                  <div
                    key={nft.tokenId}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl xl:rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 4xl:p-16 border border-white/10 hover:border-purple-500/50 transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-8 xl:space-x-10 2xl:space-x-12 4xl:space-x-16">
                      <img
                        src={nft.image || `https://via.placeholder.com/300x300/6366f1/ffffff?text=${encodeURIComponent(nft.name || 'NFT')}`}
                        alt={nft.name || 'NFT'}
                        className="w-full sm:w-20 lg:w-24 xl:w-28 2xl:w-32 4xl:w-40 h-40 sm:h-20 lg:h-24 xl:h-28 2xl:h-32 4xl:h-40 object-cover rounded-xl lg:rounded-2xl"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/300x300/6366f1/ffffff?text=${encodeURIComponent(nft.name || 'NFT')}`;
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="font-bold text-white text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 4xl:text-4xl mb-1 lg:mb-2">
                              {nft.name || `NFT #${nft.tokenId}`}
                            </h3>
                            <div className="flex items-center space-x-2 lg:space-x-3 xl:space-x-4 2xl:space-x-5 4xl:space-x-6 mb-1 lg:mb-2">
                              <span className={`px-2 py-1 lg:px-3 lg:py-1 xl:px-4 xl:py-2 2xl:px-5 2xl:py-2 4xl:px-6 4xl:py-3 rounded-full text-xs lg:text-sm xl:text-base 2xl:text-lg 4xl:text-xl font-medium ${
                                nft.isListed 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-gray-500/20 text-gray-400'
                              }`}>
                                {nft.isListed ? 'En Venta' : 'No Listado'}
                              </span>
                              <span className="text-gray-500 text-sm lg:text-base xl:text-lg 2xl:text-xl 4xl:text-2xl">#{nft.tokenId}</span>
                            </div>
                            {nft.description && (
                              <p className="text-gray-300 text-sm lg:text-base xl:text-lg 2xl:text-xl 4xl:text-2xl">{nft.description}</p>
                            )}
                          </div>
                          <div className="mt-2 sm:mt-0 text-left sm:text-right">
                            {nft.isListed && (
                              <p className="text-purple-400 font-bold text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 4xl:text-4xl">{formatPrice(nft.price)}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => nft.isListed ? onCancelListing(nft) : onListNFT(nft)}
                        className={`w-full sm:w-auto font-semibold py-2 lg:py-3 xl:py-4 2xl:py-5 4xl:py-6 px-6 lg:px-8 xl:px-10 2xl:px-12 4xl:px-16 rounded-xl lg:rounded-2xl transition-all duration-300 cursor-pointer text-sm lg:text-base xl:text-lg 2xl:text-xl 4xl:text-2xl ${
                          nft.isListed 
                            ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                        }`}
                      >
                        {nft.isListed ? 'Cancelar' : 'Listar'}
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



