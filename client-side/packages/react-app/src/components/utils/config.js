const BSC_ID = 56;

const BINANCE_NETWORK = {
  method: "wallet_addEthereumChain",
  params: [
    {
      chainId: `0x${BSC_ID.toString(16)}`,
      chainName: "Smart Chain",
      nativeCurrency: {
        name: "BNB",
        symbol: "BNB",
        decimals: 18,
      },
      rpcUrls: ["https://bsc-dataseed.binance.org"],
      blockExplorerUrls: [`https://bscscan.com`],
    },
  ],
};

export { BINANCE_NETWORK, BSC_ID };
