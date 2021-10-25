import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

import { NetworkConnector } from "./Network";

const POLLING_INTERVAL = 10000;

const NETWORK_URL = {
  56: "https://bsc-dataseed1.binance.org",
  97: "https://speedy-nodes-nyc.moralis.io/30cbc2df75481a9f4a2527a3/bsc/testnet",
};

export const network = new NetworkConnector({
  urls:
    process.env.REACT_APP_ENV === "dev"
      ? { 56: NETWORK_URL[56], 97: NETWORK_URL[97] }
      : { 56: NETWORK_URL[56] },
  defaultChainId: process.env.REACT_APP_DEFAULT_CHAIN_ID,
  pollingInterval: POLLING_INTERVAL * 3,
});

export const injected = new InjectedConnector({
  supportedChainIds: process.env.REACT_APP_ENV === "dev" ? [56, 97] : [56],
});

export const walletconnect = new WalletConnectConnector({
  rpc: { 56: NETWORK_URL[56] },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
});
