import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: string | null;
}

const initialState: WalletState = {
  address: null,
  isConnected: false,
  chainId: null,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWalletAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
      state.isConnected = true;
    },
    setChainId: (state, action: PayloadAction<string>) => {
      state.chainId = action.payload;
    },
    disconnectWallet: (state) => {
      state.address = null;
      state.isConnected = false;
      state.chainId = null;
    },
  },
});

export const { setWalletAddress, setChainId, disconnectWallet } =
  walletSlice.actions;
export default walletSlice.reducer;
