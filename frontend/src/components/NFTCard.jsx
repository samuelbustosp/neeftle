import React from 'react';

const NFTCard = ({ nft, onAction, actionType, isOwner}) => {
  console.log('nft image',nft.image)
  const getActionButton = () => {
    if (!onAction) return null;
  
    switch (actionType) {
      case 'list':
        return (
          <button
            onClick={() => onAction(nft.tokenId, nft.price)}
            className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            Listar por {nft.price} MTK
          </button>
        );
      case 'cancel':
        return (
          <button
            onClick={() => onAction(nft.tokenId)}
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Cancelar Listado
          </button>
        );
      case 'buy':
        return (
          <button
            onClick={() => onAction(nft.tokenId, nft.price)}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            disabled={isOwner}
          >
            {isOwner ? 'Tu NFT' : `Comprar por ${nft.price} MTK`}
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500 transition-colors">
      <img
        src={nft.image}
        alt={nft.name}
        className="w-full h-48 object-cover rounded-lg mb-4"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://placehold.co/400x400/808080/FFFFFF?text=Error+Loading';
        }}
      />
      <h3 className="text-lg font-bold text-blue-300 mb-2">
        {nft.name} (#{nft.tokenId})
      </h3>
      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{nft.description}</p>
      
      {nft.price && (
        <p className="text-white mb-2">
          Precio: <span className="text-green-400 font-semibold">{nft.price} MTK</span>
        </p>
      )}
      
      {nft.seller && (
        <p className="text-gray-400 text-sm mb-3">
          Vendedor: {nft.seller.slice(0, 6)}...{nft.seller.slice(-4)}
        </p>
      )}
      
      <p className="text-gray-400 text-sm mb-4">
        Estado: <span className="text-yellow-400">{nft.status}</span>
      </p>
      
      {getActionButton()}
    </div>
  );
};

export default NFTCard;