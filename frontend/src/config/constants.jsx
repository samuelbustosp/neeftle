import MyToken from "../abi/MyToken.json";
import MyNFT from "../abi/MyNFT.json";
import Marketplace from "../abi/Marketplace.json";

// Direcciones de contratos y configuración
export const CONTRACTS = {
  MY_TOKEN_ADDRESS: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  MY_NFT_ADDRESS: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  MARKETPLACE_ADDRESS: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
};

export const MyTokenABI = MyToken.abi

export const  MyNFTABI = MyNFT.abi

export const MarketplaceABI = Marketplace.abi

export const LISTING_PRICE_DEFAULT = "100";