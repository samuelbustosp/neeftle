import React from 'react';
import { ShoppingCart, Tag, X, User, Hash } from 'lucide-react';

const NFTCard = ({ nft, onAction, actionType, isOwner }) => {
  console.log('nft image', nft.image);
  
  const getActionButton = () => {
    if (!onAction) return null;
    
    switch (actionType) {
      case 'list':
        return (
          <button
            onClick={() => onAction(nft.tokenId, nft.price)}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <Tag className="w-4 h-4" />
            <span>Listar por {nft.price} MTK</span>
          </button>
        );
      case 'cancel':
        return (
          <button
            onClick={() => onAction(nft.tokenId)}
            className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Cancelar Listado</span>
          </button>
        );
      case 'buy':
        return (
          <button
            onClick={() => onAction(nft.tokenId, nft.price)}
            className={`w-full py-3 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 ${
              isOwner 
                ? 'bg-gradient-to-r from-gray-500 to-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
            }`}
            disabled={isOwner}
          >
            {isOwner ? (
              <>
                <User className="w-4 h-4" />
                <span>Tu NFT</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Comprar por {nft.price} MTK</span>
              </>
            )}
          </button>
        );
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'listed':
      case 'listado':
        return 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400';
      case 'sold':
      case 'vendido':
        return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400';
      case 'owned':
      case 'propiedad':
        return 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400';
      default:
        return 'from-gray-500/20 to-gray-600/20 border-gray-500/30 text-gray-400';
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-xl text-white hover:bg-white/10 transition-all duration-300 hover:shadow-2xl">
      {/* NFT Image */}
      <div className="relative mb-4 rounded-xl overflow-hidden bg-white/5 border border-white/10">
        <img
          src={nft.image}
          alt={nft.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/400x400/808080/FFFFFF?text=Error+Loading';
          }}
        />
      </div>

      {/* NFT Header */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Hash className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white truncate">
            {nft.name} (#{nft.tokenId})
          </h3>
        </div>
        
        {nft.description && (
          <p className="text-sm text-gray-300 line-clamp-2 mb-3">
            {nft.description}
          </p>
        )}
      </div>

      {/* NFT Details */}
      <div className="space-y-3 mb-4">
        {/* Price */}
        {nft.price && (
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-3 border border-green-500/20">
            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400">Precio:</span>
              <span className="font-bold text-green-400">{nft.price} MTK</span>
            </div>
          </div>
        )}

        {/* Seller */}
        {nft.seller && (
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-400">Vendedor:</span>
              <span className="font-mono text-sm text-white">
                {nft.seller.slice(0, 6)}...{nft.seller.slice(-4)}
              </span>
            </div>
          </div>
        )}

        {/* Status */}
        <div className={`bg-gradient-to-r ${getStatusColor(nft.status)} rounded-lg p-3 border`}>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-current opacity-60"></div>
            <span className="text-sm text-gray-400">Estado:</span>
            <span className="font-medium capitalize">{nft.status}</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      {getActionButton()}
    </div>
  );
};

export default NFTCard;