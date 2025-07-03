import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import WalletConnection from './components/WalletConnection';
import MintNFT from './components/MintNFT';
import UserNFTCollection from './components/UserNFTCollection';
import Marketplace from './components/MarketPlace';
import LogDisplay from './components/LogDisplay';
import { useBlockchain } from './hooks/useBlockchain';

const App = () => {
  const blockchain = useBlockchain();

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">NFT Marketplace</h1>
            <p className="text-gray-300">Crear, comprar y vender NFTs en la blockchain</p>
          </header>

          <Routes>
            <Route path="/" element={<Navigate to="/marketplace" />} />

            <Route
              path="/login"
              element={
                <WalletConnection
                  isConnected={blockchain.isConnected}
                  currentAccount={blockchain.currentAccount}
                  mtkBalance={blockchain.mtkBalance}
                  onConnect={blockchain.connectWallet}
                  onAddNetwork={blockchain.addHardhatNetwork}
                />
              }
            />

            <Route
              path="/mint"
              element={
                blockchain.isConnected ? (
                  <MintNFT onMintNFT={blockchain.mintNFT} isConnected />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/collection"
              element={
                blockchain.isConnected ? (
                  <UserNFTCollection
                    userNFTs={blockchain.userNFTs}
                    isLoading={blockchain.isLoadingUser}
                    onListNFT={blockchain.listNFT}
                    onCancelListing={blockchain.cancelListing}
                    onListAllNFTs={blockchain.listAllUserNFTs}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/marketplace"
              element={
                <Marketplace
                  marketplaceNFTs={blockchain.marketplaceNFTs}
                  isLoading={blockchain.isLoadingMarketplace}
                  onBuyNFT={blockchain.buyNFT}
                  onCancelListing={blockchain.cancelListing}
                  onLoadMarketplace={blockchain.loadMarketplaceNFTs}
                  currentAccount={blockchain.currentAccount}
                />
              }
            />
          </Routes>

          <div className="mt-8">
            <LogDisplay logs={blockchain.logs} />
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
