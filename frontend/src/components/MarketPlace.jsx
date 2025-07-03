import React from 'react';
import NFTCard from './NFTCard';

const Marketplace = ({ 
  marketplaceNFTs, 
  isLoading, 
  onBuyNFT, 
  onCancelListing, 
  onLoadMarketplace,
  currentAccount 
}) => (
  <div className="bg-gray-800 rounded-lg p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-white">
        Marketplace ({marketplaceNFTs.length} NFTs)
      </h2>
      <button
        onClick={onLoadMarketplace}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
      >
        Recargar Marketplace
      </button>
    </div>

    {isLoading ? (
      <p className="text-gray-400">Cargando marketplace...</p>
    ) : marketplaceNFTs.length === 0 ? (
      <p className="text-gray-400">No hay NFTs listados en este momento.</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {marketplaceNFTs.map((nft) => {
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
    )}
  </div>
);

export default Marketplace;