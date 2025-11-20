import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "@/store/store";
import {
  setWalletAddress,
  setChainId,
  disconnectWallet,
} from "@/store/reducers/walletSlice";
import httpClient from "@/lib/http-client";
import { getErrorMessage } from "@/lib/api-utils";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function useMetaMask() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const address = useSelector((state: RootState) => state.wallet.address);

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

          // POST wallet address to backend if user is authenticated
          if (user?._id) {
            try {
              await httpClient.post("/wallet/connect", {
                address: address,
              });
            } catch (error) {
              // Log error but don't block wallet connection
              console.error("Error saving wallet to backend:", error);
            }
          }

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
      // Verify persisted wallet is still connected in MetaMask
      const verifyWallet = async () => {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });

          if (accounts.length > 0) {
            // Get current wallet state from Redux (persisted by redux-persist)
            const currentAddress = address;

            // If we have a persisted address, verify it matches MetaMask
            if (currentAddress) {
              if (accounts[0].toLowerCase() !== currentAddress.toLowerCase()) {
                // Address doesn't match, disconnect
                dispatch(disconnectWallet());
              } else {
                // Update chainId if needed
                const chainId = await window.ethereum.request({
                  method: "eth_chainId",
                });
                dispatch(setChainId(chainId));
              }
            }
          } else if (address) {
            // MetaMask is not connected but we have persisted address, disconnect
            dispatch(disconnectWallet());
          }
        } catch (error) {
          console.error("Error verifying wallet:", error);
        }
      };

      verifyWallet();

      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          dispatch(disconnectWallet());
          toast.warning("Wallet account changed. Please reconnect.");
        } else {
          const address = accounts[0];
          dispatch(setWalletAddress(address));

          // POST new wallet address to backend if user is authenticated
          if (user?._id) {
            try {
              await httpClient.post("/wallet/connect", {
                address: address,
              });
            } catch (error) {
              console.error("Error saving wallet to backend:", error);
            }
          }
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
  }, [dispatch, user, address]);

  return {
    connectWallet,
    disconnect,
    formatAddress,
  };
}
