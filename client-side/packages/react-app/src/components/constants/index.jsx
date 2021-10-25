// import { injected, walletconnect } from "../connectors";

export const MAX_WIDTH = 1100;
export const MAX_HEIGHT = 500;
export const MAX_HEIGHT_MOBILE = 350;
export const MOBILE_BREAKPOINT = 768;
export const GRID_STEP = 30;
export const API_URL = `${process.env.REACT_APP_API_PATH}/v1/`;
export const PATHS = {
  CLUSTERS: "/clusters",
  STARS: "/stars",
};

export const MAP_WIDTH = 2400;
export const MAP_HEIGHT = 1600;
export const GRID_NUM_WIDTH = 48;
export const GRID_NUM_HEIGHT = 32;

export const PLANET_ADDRESS = {
  56: "0xe8A6a374f9A623745971C847F8734AA6C09f6c1D",
  97: "0x7b155F709d239d7F7472d27e6Cff46ac96096Bdf",
};

export const BYG_ADDRESS = {
  56: "0x4f7b627b88651e3dddca0240bca68a3062632c8c",
  97: "0xc3c654ca7f48e2a2345679cb9f31d6f522a450af",
};

export const ALLIANCE_ADDRESS = {
  56: "0x4371E7D9c95232B4d1a718cbb7bD1F121BdA83Eb",
  97: "0x79F3c54235ef16b325B0Db424ba2832784041d63",
};

export const BYG_ALLIANCE_POOL = {
  56: "0xD5030409Ea3705dB4Ba1100A8C15E86869F46880",
  97: "0xb128D921f74Eb32dD82B68b569f93c0213c761ed",
};

export const SUPER_ALLIANCE_POOL = {
  56: "0x7281DaD412d05775555495E92ebDC95790beb43b",
  97: "0xA674b71451285de1180483B4B6E7CEd246EDf001",
};

export const LAND_ALLIANCE_POOL = {
  56: "0x05E63bed05ceD6c3CB8082922e41cE533aBBA797",
  97: "0xd4098952F33a877CFAf5e3431c2CbC2a0E0dF7aC",
};

export const SHARK_ALLIANCE_POOL = {
  56: "0xA8F673aa075113118abd6973b656feeae862b6D3",
  97: "0xD7d6dF4f25c04001d37Df0cBE068ff593687B569",
};

export const PLANET_POOL = {
  56: "0xF75b3A81FDf7c69619455C882c97EBFcc171De76",
  97: "0x34834BDB573120b0BDe6605F78fAefA3A8932220",
};

export const SPACESHIP = {
  56: "0x0eD6B3CD4D009575b63b10F944Cd0e6a196B74ae",
  97: "0xCC0a836290C1579614A75ef0a6Dc397d16d4A1c8",
};

export const CARGO_STAKING_CONTRACT = {
  56: "0x0e813767bFE68D240d92389ce98a4CF900fef01F",
  97: "0xF87B55F5a1dB7bd16329C75FAaB6Af73F6e84631",
};

export const DISCOVERY_STAKING_CONTRACT = {
  56: "0x7F39151DA61740b10033B12A82919c5E5d980C12",
  97: "0x4b07a6558Cb31E1A13739837f1b291098aBa483d",
};

export const PLT_FIXED_MARKET = {
  56: "0xD18E3bF450251263B6beC4264f889784F20E5639",
  97: "0xBE056f6db7008383ac4743EaF52AFf96aF3e27f1",
};

export const SHIP_FIXED_MARKET = {
  56: "0xD2d40129c94789F90f77CA996eD8523D349FbAb8",
  97: "0x8BB10eDB3ACd7802a8c0a286875937FBBc0f94b6",
};

export const ALLI_FIXED_MARKET = {
  56: "0x0353cc983A457cb1169b689F2F964902b22eB43b",
  97: "0x1FF7A6138BA304b2282d812192d0c2E147FD9732",
};

export const PLT_STAKING_CONTRACT = {
  1: {
    56: "0x906240c1954f48e27F869ECcd8fFB88317c4cf7C",
    97: "0xA0b3d64F38082Ae2375cFF7106f67Af5a0D5A4F5",
  },
  2: {
    56: "0x66F2fa9f81EAa839aD8Ceb8d72419359F32D1582",
    97: "0x0E82dDe6B16c4beC16a94B2E8d62AD60fE9925EA",
  },
  3: {
    56: "0x1d67759C7b2BD798291f36868aaCc8a3d142bdA3",
    97: "0x0E82dDe6B16c4beC16a94B2E8d62AD60fE9925EA",
  },
  4: {
    56: "0xD8cB2C1162Ab67768181bA739361683a73d4a97c",
    97: "0x0E82dDe6B16c4beC16a94B2E8d62AD60fE9925EA",
  },
  5: {
    56: "0x2578D7279E0d31146e486c383929DeDBE3C419Bd",
    97: "0x0E82dDe6B16c4beC16a94B2E8d62AD60fE9925EA",
  },
};

export const ALLIANCE_MASTER = {
  0: {
    56: "0x5298D2596d457F8863A6CA465Ed3e17Ba9A4b5B7",
    97: "0xc917b5887b0F71Bca1490Bae178205F527B10dEF",
  },
  1: {
    56: "0xb030ce51B875e15b559fFB8a44C128a4DCe0A137",
    97: "0xCf58e00b305Bd2809091C4AEbEFf2206f36CfC42",
  },
  2: {
    56: "0xbA36f1f10b41E75EeaDB9C4A1f917E3eb853e110",
    97: "0x3f7CFc01D3BEBb3DBb5594E2fbb515c0e45d761b",
  },
  3: {
    56: "0xe3E41b88039A7F61738B999Ba09009045bF5B37b",
    97: "0xEc7E7A1d256562a428C73Da4d78842A14aB9875f",
  },
  4: {
    56: "0xe99729b78c168C7bd7511EFCd2487aD0189813A8",
    97: "0xEc7E7A1d256562a428C73Da4d78842A14aB9875f",
  },
};

export const REPAIR_POOL_ADDRESS = {
  56: "0xc8af56E7E189397594D49E89a39bccf4e2629Da5",
  97: "0xf060B513A11a99821D77ed61ef652AC23d00b862",
};

export const FLIGHT_POOL_ADDRESS = {
  56: "0x43b8Db8e945026844883d013C11599e38eA82050",
  97: "0xf993d263aa66b937ae1b23A2fd452bceDB586cb2",
};

export const ASTEROID_POOL_ADDRESS = {
  56: "0x227583388594f4b02C8C960735AF1E1D3F4DADa3",
  97: "0x9119393d3015CC584d8Db3b4290B9c8B666F11A2",
};

export const REPUTATION_POOL_ADDRESS = {
  56: "0xa767E3DdeDC0B0B5225e3049051e5B5fbB0f1A94",
  97: "0x46a299505bA15a0dD21D27Fa9B8A94c63F7aBB14",
};

export const BYG_STAKING_PERIOD = process.env.REACT_APP_BYG_STAKING_PERIOD;

export const BYG_POOL_OPEN_TIMESTAMP =
  process.env.REACT_APP_BYG_POOL_OPEN_TIMESTAMP;

export const LAND_POOL_OPEN_TIMESTAMP = 1631196000;

export const SHARK_POOL_OPEN_TIMESTAMP = 1631887200;

export const NetworkContextName = "NETWORK";
export const addressList = [
  "0xd39e2a1b9ed5a7c3c834020d2bf543cb5d96baa9",
  "0x50ae8b6a0d4f0440b49ddbfc1744e8fed91b9d69",
  "0xc0d8a1ade9f35d0dd31f944c0e9908468b0ddd68",
  "0x60c94df925b4e09446dac73d84b1f68372f682c4",
  "0xa36df78109236138fd7c0e58cab2f6e0d414afb3",
  "0x3502e12f4ec36da62e0b829bd90242a3070c9233",
  "0xfaf6a8973e5a16d5b722b1d3b9a5613a627af974",
  "0x39659f6dbee51f2fe9d2030c0face3868baea92b",
  "0x0b9558a072e59a34f1b44f4f74f211716a0bd60e",
  "0x34cd6686fb8ece1a12f09b8a2e338cb1bcf7f8ce",
  "0x25d0cff8c47f33b32192b3ea9824ac1bc550bd43",
  "0x5262361d3171b4e684c835a37d628dc1b532817a",
  "0xf2abedce72ffeaed4758f32495f513d53e2fcc2e",
  "0xfd1d1c2990860769d314b8ed14ead85fa14d16b4",
  "0x50d3088f94e1f074e4adaa4a69fba3fcc528e731",
  "0xa738a3eee0d7135188383682d49e7cb6fed61ec4",
  "0xdb1e7cbb3b839cdad0e83da120327a2f37893cfe",
  "0x51a23f481037ca208086f42fe83d28b71c1ebc2c",
  "0x8918dcad835a67e464652fe6f5d39556018b5191",
  "0x4d3826e44b31ed86d50397b8084b6b81152fd054",
  "0x31386e4b622ad37db10246e32932dbf03b175354",
  "0x872b84e5d76107b7f0e3e699dfdc2b49a8185dc7",
  "0xda25824ee511fd8cbfce7dc8b316820418a34a10",
  "0xbe535c49d8e65da9cd9a809a3d59248a89a2496b",
  "0x7f6162f5b237daa04d39482c4e4f4036bce8254b",
  "0xfbad3c03996378c0ce1eb6ee4cd6a9fcecba0483",
  "0xcf17a969555ef783fb664e80a31525406f0d0936",
  "0x955cac533b0871d32f798d9b2b3243edbb8331eb",
  "0x8fa48220b8f6140ca29f1cf532f6e79835b2abe2",
  "0x153463b316cbf8fc4bb58ab034002a5efeaabf19",
  "0x161bc4092af2463bb03257519febd6f90f86e5f6",
  "0x679c3d812f69042671ab45bc1beb124299c870b2",
  "0xd0af4da42b7d4f0b92c386fb44b4da451a2c22f4",
  "0x7c361828849293684ddf7212fd1d2cb5f0aade70",
  "0x22df3ba92b7bf7d35a63faa192353ca227565282",
  "0xaafa31630355bed7cb2fb7190feafa8a97d45037",
];
// export const SUPPORTED_WALLETS = {
//   INJECTED: {
//     connector: injected,
//     name: "Injected",
//     iconName: "arrow-right.svg",
//     description: "Injected web3 provider.",
//     href: null,
//     color: "#010101",
//     primary: true,
//   },
//   METAMASK: {
//     connector: injected,
//     name: "MetaMask",
//     iconName: "metamask.png",
//     description: "Easy-to-use browser extension.",
//     href: null,
//     color: "#E8831D",
//   },
//   WALLET_CONNECT: {
//     connector: walletconnect,
//     name: "WalletConnect",
//     iconName: "walletConnectIcon.svg",
//     description: "Connect to Trust Wallet, Rainbow Wallet and more...",
//     href: null,
//     color: "#4196FC",
//   },
//   TRUST_WALLET_LINK: {
//     name: "Open in Trust Wallet",
//     iconName: "trustWallet.png",
//     description: "iOS and Android app.",
//     href: `https://link.trustwallet.com/open_url?coin_id=${process.env.REACT_APP_COIN_ID}&url=${process.env.REACT_APP_URL}`,
//     color: "#1C74CC",
//     mobile: true,
//     mobileOnly: true,
//   },
// };

export const REPUTATION_LEVELS = {
  0: 0,
  1: 30000,
  2: 60000,
  3: 90000,
  4: 120000,
  5: 150000,
  6: 180000,
  7: 210000,
  8: 240000,
  9: 270000,
  10: 300000,
  11: 350000,
  12: 400000,
  13: 450000,
  14: 500000,
  15: 750000,
};
