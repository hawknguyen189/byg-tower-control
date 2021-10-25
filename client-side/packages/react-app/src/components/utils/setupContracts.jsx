import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import { BINANCE_NETWORK, BSC_ID } from "./config";

import SPACESHIP_ABI from "../constants/abis/SPACESHIP_ABI.json";
import {
  SPACESHIP,
  CARGO_STAKING_CONTRACT,
  DISCOVERY_STAKING_CONTRACT,
  SHIP_FIXED_MARKET,
  REPAIR_POOL_ADDRESS,
  ASTEROID_POOL_ADDRESS,
  FLIGHT_POOL_ADDRESS,
} from "../constants/index";
import CARGO_STAKING_ABI from "../constants/abis/CARGO_STAKING_ABI.json";
import DISCOVERY_STAKING_ABI from "../constants/abis/DISCOVERY_STAKING_ABI.json";
import ASTEROID_POOL_ABI from "../constants/abis/ASTEROID_POOL_ABI.json";
import FLIGHT_POOL_ABI from "../constants/abis/FLIGHT_POOL_ABI.json";
import SHIP_FIXED_ABI from "../constants/abis/SHIP_FIXED_ABI.json";
import REPAIR_POOL_ABI from "../constants/abis/REPAIR_POOL_ABI.json";

export const setupContracts = async ({ onError, onRefresh }) => {
  const defaultProvider = new Web3Provider(window.ethereum, "any", {
    bscscan: process.env.REACT_APP_ETHERSCAN_API_TOKEN,
    infura: process.env.REACT_APP_INFURA_ID,
    // Or if using a project secret:
    // infura: {
    //   projectId: YOUR_INFURA_PROJECT_ID,
    //   projectSecret: YOUR_INFURA_PROJECT_SECRET,
    // },
    alchemy: process.env.REACT_APP_ALCHEMY_ID,
    pocket: process.env.REACT_APP_POCKET_ID,
    // Or if using an application secret key:
    // pocket: {
    //   applicationId: ,
    //   applicationSecretKey:
  });
  // const defaultProvider = ethers.getDefaultProvider("homestead", {
  //   etherscan: process.env.REACT_APP_ETHERSCAN_API_TOKEN,
  //   infura: process.env.REACT_APP_INFURA_ID,
  //   // Or if using a project secret:
  //   // infura: {
  //   //   projectId: YOUR_INFURA_PROJECT_ID,
  //   //   projectSecret: YOUR_INFURA_PROJECT_SECRET,
  //   // },
  //   alchemy: process.env.REACT_APP_ALCHEMY_ID,
  //   pocket: process.env.REACT_APP_POCKET_ID,
  //   // Or if using an application secret key:
  //   // pocket: {
  //   //   applicationId: ,
  //   //   applicationSecretKey:
  //   // }
  // }); //fantom chain id

  // Force page refreshes on network changes
  // The "any" network will allow spontaneous network changes
  // defaultProvider.on("network", (newNetwork, oldNetwork) => {
  //   // When a Provider makes its initial connection, it emits a "network"
  //   // event with a null oldNetwork along with the newNetwork. So, if the
  //   // oldNetwork exists, it represents a changing network
  //   if (oldNetwork) {
  //     window.location.reload();
  //   }
  // });

  const signer = await defaultProvider.getSigner();
  const webId = await signer.getChainId();
  if (webId !== BSC_ID) {
    const confirmation = onError(
      "Please, switch networks to use Binance Smart Chain"
    );
    if (confirmation) {
      await window.ethereum.request(BINANCE_NETWORK);
      onRefresh(true);
    }
  } else {
    const accounts = await signer.getAddress();
    const spaceShipContract = new Contract(
      SPACESHIP[BSC_ID],
      SPACESHIP_ABI,
      signer
    );
    const cargoStakingContract = new Contract(
      CARGO_STAKING_CONTRACT[BSC_ID],
      CARGO_STAKING_ABI,
      signer
    );
    const discoveryStakingContract = new Contract(
      DISCOVERY_STAKING_CONTRACT[BSC_ID],
      DISCOVERY_STAKING_ABI,
      signer
    );
    const marketContract = new Contract(
      SHIP_FIXED_MARKET[BSC_ID],
      SHIP_FIXED_ABI,
      signer
    );
    const repairContract = new Contract(
      REPAIR_POOL_ADDRESS[BSC_ID],
      REPAIR_POOL_ABI,
      signer
    );
    const asteroidContract = new Contract(
      ASTEROID_POOL_ADDRESS[BSC_ID],
      ASTEROID_POOL_ABI,
      signer
    );
    const flightContract = new Contract(
      FLIGHT_POOL_ADDRESS[BSC_ID],
      FLIGHT_POOL_ABI,
      signer
    );

    return {
      accounts: accounts,
      chainID: webId,
      spaceShipContract: spaceShipContract,
      cargoStakingContract: cargoStakingContract,
      discoveryStakingContract: discoveryStakingContract,
      marketContract: marketContract,
      repairContract: repairContract,
      asteroidContract: asteroidContract,
      flightContract: flightContract,
      signer: signer,
    };
  }
};
