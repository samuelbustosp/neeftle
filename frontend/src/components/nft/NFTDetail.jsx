import { 
  ArrowLeft, 
  Tag, 
  User, 
  Hash, 
  Clock, 
  Eye,
  ShoppingCart,
  X,
  ExternalLink,
  Copy,
  Share2
} from 'lucide-react';

const NFTDetail = ({ nft, onBack, onAction, actionType, isOwner }) => {
  const handleCopyAddress = (address) => {
    navigator.clipboard.writeText(address);
    // Aquí podrías agregar una notificación de "copiado"
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${nft.name} - NFT`,
        text: `Mira este increíble NFT: ${nft.name}`,
        url: window.location.href
      });
    } else {
      // Fallback: copiar URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

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
                <ShoppingCart className="w-4 h-4" />
                <span>Comprar por {nft.price} MTK</span>
              </>
            ) : (
              <>
                <User className="w-4 h-4" />
                <span>Tu NFT</span>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleShare}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-xl">
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full rounded-xl"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/600x600/808080/FFFFFF?text=Error+Loading';
                }}
              />
            </div>

            {/* Properties/Attributes */}
            {nft.attributes && nft.attributes.length > 0 && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-xl">
                <h3 className="text-lg font-bold mb-4">Atributos</h3>
                <div className="grid grid-cols-2 gap-3">
                  {nft.attributes.map((attr, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="text-sm text-gray-400">{attr.trait_type}</div>
                      <div className="font-medium">{attr.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* NFT Info */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Hash className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{nft.name}</h1>
                  <p className="text-gray-400">Token ID: #{nft.tokenId}</p>
                </div>
              </div>

              {nft.description && (
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {nft.description}
                </p>
              )}

              {/* Status */}
              <div className={`bg-gradient-to-r ${getStatusColor(nft.status)} rounded-lg p-4 border mb-6`}>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-current opacity-60"></div>
                  <span className="text-sm text-gray-400">Estado:</span>
                  <span className="font-medium capitalize">{nft.status}</span>
                </div>
              </div>

              {/* Price */}
              {nft.price && (
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/20 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Tag className="w-5 h-5 text-green-400" />
                      <span className="text-gray-400">Precio:</span>
                    </div>
                    <span className="text-2xl font-bold text-green-400">{nft.price} MTK</span>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="space-y-3">
                {getActionButton()}
              </div>
            </div>

            {/* Owner/Seller Info */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-xl">
              <h3 className="text-lg font-bold mb-4">Información del Propietario</h3>
              
              {/* Current Owner */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-400">Propietario</p>
                      <p className="font-mono text-sm">{nft.owner?.slice(0, 6)}...{nft.owner?.slice(-4)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopyAddress(nft.owner)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                {/* Seller if different from owner */}
                {nft.seller && nft.seller !== nft.owner && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Tag className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-sm text-gray-400">Vendedor</p>
                        <p className="font-mono text-sm">{nft.seller.slice(0, 6)}...{nft.seller.slice(-4)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopyAddress(nft.seller)}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Transaction History */}
            {nft.history && nft.history.length > 0 && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-xl">
                <h3 className="text-lg font-bold mb-4">Historial de Transacciones</h3>
                <div className="space-y-3">
                  {nft.history.map((tx, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{tx.type}</p>
                        <p className="text-xs text-gray-400">{tx.date}</p>
                      </div>
                      {tx.price && (
                        <span className="text-sm font-medium text-green-400">{tx.price} MTK</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetail;