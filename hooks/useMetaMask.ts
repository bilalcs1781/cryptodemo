import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { AppDispatch } from "@/store/store";
import {
  setWalletAddress,
  setChainId,
  disconnectWallet,
} from "@/store/reducers/walletSlice";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function useMetaMask() {
  const dispatch = useDispatch<AppDispatch>();

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts.length > 0) {
          const address = accounts[0];
          dispatch(setWalletAddress(address));

          const chainId = await window.ethereum.request({
            method: "eth_chainId",
          });
          dispatch(setChainId(chainId));

          toast.success("Wallet connected successfully!");
        }
      } catch (error: any) {
        console.error("Error connecting wallet:", error);
        const errorMessage =
          error.message || "Failed to connect wallet. Please try again.";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } else {
      const errorMessage =
        "MetaMask is not installed. Please install MetaMask.";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const disconnect = () => {
    dispatch(disconnectWallet());
    toast.info("Wallet disconnected");
  };

  const formatAddress = (address: string | null) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          dispatch(disconnectWallet());
          toast.warning("Wallet account changed. Please reconnect.");
        } else {
          dispatch(setWalletAddress(accounts[0]));
          toast.info("Wallet account changed");
        }
      };

      const handleChainChanged = (chainId: string) => {
        dispatch(setChainId(chainId));
        toast.warning("Network changed. Please verify your connection.");
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [dispatch]);

  return {
    connectWallet,
    disconnect,
    formatAddress,
  };
}
