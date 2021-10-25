import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { useActiveWeb3React } from "../hooks";
import {
  SPACESHIP,
  CARGO_STAKING_CONTRACT,
  DISCOVERY_STAKING_CONTRACT,
  SHIP_FIXED_MARKET,
  REPAIR_POOL_ADDRESS,
  FLIGHT_POOL_ADDRESS,
  ASTEROID_POOL_ADDRESS,
} from "../constants";
import { useContract } from "../../hooks/useUtils";
import SHIP_ABI from "../constants/abis/spaceship.json";
import { BigNumber } from "@ethersproject/bignumber";
import CARGO_STAKING_ABI from "../constants/abis/CargoStaking.json";
import DISCOVERY_STAKING_ABI from "../constants/abis/DiscoveryStaking.json";
import ASTEROID_POOL_ABI from "../constants/abis/AsteroidPool.json";
import FLIGHT_POOL_ABI from "../constants/abis/FlightPool.json";
import SHIP_FIXED_ABI from "../constants/abis/FixedMarket721.json";
import REPAIR_POOL_ABI from "../constants/abis/RepairPool.json";
import { formatUnits } from "@ethersproject/units";
import axios from "axios";
import { range } from "../utils";

const MY_SHIPS = "MY_SHIPS";
const SET_MY_SHIPS = "SET_MY_SHIPS";
const MY_SHIPS_ON_SALE = "MY_SHIPS_ON_SALE";
const SET_MY_SHIPS_ON_SALE = "SET_MY_SHIPS_ON_SALE";
const MARKET_SHIPS = "MARKET_SHIPS";
const SET_MARKET_SHIPS = "SET_MARKET_SHIPS";
const LOADING = "LOADING";
const SET_LOADING = "SET_LOADING";
const PROD_LOADING = "PROD_LOADING";
const SET_PROD_LOADING = "SET_PROD_LOADING";

const SpaceshipContext = createContext();

function useSpaceshipContext() {
  return useContext(SpaceshipContext);
}

function reducer(state, { type, payload }) {
  switch (type) {
    case SET_MY_SHIPS: {
      return { ...state, [MY_SHIPS]: payload };
    }
    case SET_MY_SHIPS_ON_SALE: {
      return { ...state, [MY_SHIPS_ON_SALE]: payload };
    }
    case SET_MARKET_SHIPS: {
      return { ...state, [MARKET_SHIPS]: payload };
    }
    case SET_LOADING: {
      return { ...state, [LOADING]: payload };
    }
    case SET_PROD_LOADING: {
      return { ...state, [PROD_LOADING]: payload };
    }
    default: {
      throw Error(`Unexpected action type in TokenContext reducer: '${type}'.`);
    }
  }
}

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    [MY_SHIPS]: [],
    [MY_SHIPS_ON_SALE]: [],
    [MARKET_SHIPS]: [],
    [LOADING]: false,
    [PROD_LOADING]: false,
  });

  const setMyShips = useCallback((data) => {
    dispatch({ type: SET_MY_SHIPS, payload: data });
  }, []);

  const setMyShipsOnSale = useCallback((data) => {
    dispatch({ type: SET_MY_SHIPS_ON_SALE, payload: data });
  }, []);

  const setMarketShips = useCallback((data) => {
    dispatch({ type: SET_MARKET_SHIPS, payload: data });
  }, []);

  const setLoading = useCallback((amount) => {
    dispatch({ type: SET_LOADING, payload: amount });
  }, []);

  const setProdLoading = useCallback((amount) => {
    dispatch({ type: SET_PROD_LOADING, payload: amount });
  }, []);

  return (
    <SpaceshipContext.Provider
      value={useMemo(
        () => [
          state,
          {
            setMyShips,
            setMyShipsOnSale,
            setMarketShips,
            setLoading,
            setProdLoading,
          },
        ],
        [
          state,
          setMyShips,
          setMyShipsOnSale,
          setMarketShips,
          setLoading,
          setProdLoading,
        ]
      )}
    >
      {children}
    </SpaceshipContext.Provider>
  );
}

export function Updater() {
  const { chainId, account } = useActiveWeb3React();
  const shipContract = useContract(SPACESHIP[chainId], SHIP_ABI);
  const cargoStakingContract = useContract(
    CARGO_STAKING_CONTRACT[chainId],
    CARGO_STAKING_ABI
  );
  const discoveryStakingContract = useContract(
    DISCOVERY_STAKING_CONTRACT[chainId],
    DISCOVERY_STAKING_ABI
  );
  const marketContract = useContract(
    SHIP_FIXED_MARKET[chainId],
    SHIP_FIXED_ABI
  );
  const repairContract = useContract(
    REPAIR_POOL_ADDRESS[chainId],
    REPAIR_POOL_ABI
  );
  const asteroidContract = useContract(
    ASTEROID_POOL_ADDRESS[chainId],
    ASTEROID_POOL_ABI
  );
  const flightContract = useContract(
    FLIGHT_POOL_ADDRESS[chainId],
    FLIGHT_POOL_ABI
  );
  const [, { setMyShips, setMyShipsOnSale, setLoading, setProdLoading }] =
    useSpaceshipContext();

  useEffect(() => {
    async function getMyShips() {
      var assets = [];
      var onSales = [];
      console.log("my ship update");
      if (account) {
        setLoading(true);
        shipContract
          .balanceOf(account)
          .then((balance) => {
            if (BigNumber.from(balance).toNumber() === 0) {
              setLoading(false);
            } else {
              var loaded = 0;
              range(0, BigNumber.from(balance).toNumber() - 1).forEach((i) => {
                shipContract.tokenOfOwnerByIndex(account, i).then((id) => {
                  shipContract.tokenURI(id).then((uri) => {
                    axios.get(uri).then((res) => {
                      loaded++;
                      assets.push({
                        id: res.data?.data?.ssh_id,
                        uri: String(uri),
                        name: res.data?.name,
                        image: res.data?.image,
                        class: res.data?.data?.sshm_class,
                        type: res.data?.data?.sshm_type,
                      });
                      if (loaded === BigNumber.from(balance).toNumber()) {
                        setMyShips(assets);
                        setLoading(false);
                      }
                    });
                  });
                });
              });
            }
          })
          .catch((e) => {});
      }

      if (account) {
        var stakedLoaded = 0;
        cargoStakingContract
          .getStakedTokenIds(account)
          .then((ids) => {
            if (ids.length === 0) {
              setLoading(false);
            }
            ids.forEach((id) => {
              shipContract.tokenURI(id).then((uri) => {
                axios.get(uri).then((res) => {
                  stakedLoaded++;
                  assets.push({
                    id: res.data?.data?.ssh_id,
                    uri: String(uri),
                    name: res.data?.name,
                    image: res.data?.image,
                    class: res.data?.data?.sshm_class,
                    type: res.data?.data?.sshm_type,
                  });
                  if (stakedLoaded === ids.length) {
                    setMyShips(assets);
                    setLoading(false);
                  }
                });
              });
            });
          })
          .catch((e) => {});
      }

      if (account) {
        discoveryStakingContract
          .getStakedTokenIds(account)
          .then((ids) => {
            if (ids.length === 0) {
              setLoading(false);
            }
            var disLoaded = 0;
            ids.forEach((id) => {
              shipContract.tokenURI(id).then((uri) => {
                axios.get(uri).then((res) => {
                  disLoaded++;
                  assets.push({
                    id: res.data?.data?.ssh_id,
                    uri: String(uri),
                    name: res.data?.name,
                    image: res.data?.image,
                    class: res.data?.data?.sshm_class,
                    type: res.data?.data?.sshm_type,
                  });
                  if (disLoaded === ids.length) {
                    setMyShips(assets);
                    setLoading(false);
                  }
                });
              });
            });
          })
          .catch((e) => {});
      }

      if (account) {
        repairContract
          .getStakedShipsOf(account)
          .then((ids) => {
            if (ids.length === 0) {
              setLoading(false);
            }
            var reLoaded = 0;
            ids.forEach((id) => {
              shipContract.tokenURI(id).then((uri) => {
                axios.get(uri).then((res) => {
                  reLoaded++;
                  assets.push({
                    id: res.data?.data?.ssh_id,
                    uri: String(uri),
                    name: res.data?.name,
                    image: res.data?.image,
                    class: res.data?.data?.sshm_class,
                    type: res.data?.data?.sshm_type,
                  });
                  if (ids.length === reLoaded) {
                    setMyShips(assets);
                    setLoading(false);
                  }
                });
              });
            });
          })
          .catch((e) => {});
      }

      if (account) {
        asteroidContract
          .stakedShipsOf(account)
          .then((ids) => {
            if (ids.length === 0) {
              setLoading(false);
            }
            var asLoaded = 0;
            ids.forEach((id) => {
              shipContract.tokenURI(id).then((uri) => {
                axios.get(uri).then((res) => {
                  asLoaded++;
                  assets.push({
                    id: res.data?.data?.ssh_id,
                    uri: String(uri),
                    name: res.data?.name,
                    image: res.data?.image,
                    class: res.data?.data?.sshm_class,
                    type: res.data?.data?.sshm_type,
                  });
                  if (ids.length === asLoaded) {
                    setMyShips(assets);
                    setLoading(false);
                  }
                });
              });
            });
          })
          .catch((e) => {});
      }

      if (account) {
        flightContract
          .getStakedTokensOf(account)
          .then((ids) => {
            if (ids.length === 0) {
              setLoading(false);
            }
            var flLoaded = 0;
            ids.forEach((id) => {
              shipContract.tokenURI(id).then((uri) => {
                axios.get(uri).then((res) => {
                  flLoaded++;
                  assets.push({
                    id: res.data?.data?.ssh_id,
                    uri: String(uri),
                    name: res.data?.name,
                    image: res.data?.image,
                    class: res.data?.data?.sshm_class,
                    type: res.data?.data?.sshm_type,
                  });
                  if (ids.length === flLoaded) {
                    setMyShips(assets);
                    setLoading(false);
                  }
                });
              });
            });
          })
          .catch((e) => {});
      }

      if (account) {
        setProdLoading(true);
        marketContract
          .getNftsOfSeller(account)
          .then((ids) => {
            if (ids.length === 0) {
              setProdLoading(false);
            }
            var prodLoaded = 0;
            ids.forEach((id) => {
              marketContract.pricesOfNft(id).then((price) => {
                shipContract.tokenURI(id).then((uri) => {
                  axios.get(uri).then((res) => {
                    prodLoaded++;
                    onSales.push({
                      id: res.data?.data?.ssh_id,
                      uri: String(uri),
                      name: res.data?.name,
                      image: res.data?.image,
                      class: res.data?.data?.sshm_class,
                      type: res.data?.data?.sshm_type,
                      price: formatUnits(price),
                    });
                    if (ids.length === prodLoaded) {
                      setMyShipsOnSale(onSales);
                      setProdLoading(false);
                    }
                  });
                });
              });
            });
          })
          .catch((e) => {});
      }
    }
    try {
      getMyShips();
    } catch (e) {}

    try {
      marketContract.on("NftBuy", () => {
        getMyShips();
      });
    } catch (e) {}

    return () => {
      try {
        marketContract.removeListener("NftBuy");
      } catch (e) {}
    };
  }, [
    account,
    repairContract,
    shipContract,
    setMyShips,
    setMyShipsOnSale,
    cargoStakingContract,
    discoveryStakingContract,
    marketContract,
    asteroidContract,
    flightContract,
    setLoading,
    setProdLoading,
  ]);
  return null;
}

export function MarketUpdater() {
  const { chainId } = useActiveWeb3React();

  const shipContract = useContract(SPACESHIP[chainId], SHIP_ABI);
  const marketContract = useContract(
    SHIP_FIXED_MARKET[chainId],
    SHIP_FIXED_ABI
  );

  const [, { setMarketShips, setLoading }] = useSpaceshipContext();

  useEffect(() => {
    async function getShips() {
      setLoading(true);
      var ships = [];
      // var counter=0
      shipContract
        .balanceOf(SHIP_FIXED_MARKET[chainId])
        .then((balance) => {
          console.log("market ships", BigNumber.from(balance).toNumber());
          if (BigNumber.from(balance).toNumber() === 0) {
            setLoading(false);
          }
          var loaded = 0;
          range(0, BigNumber.from(balance).toNumber() - 1).forEach((i) => {
            shipContract
              .tokenOfOwnerByIndex(SHIP_FIXED_MARKET[chainId], i)
              .then((id) => {
                shipContract.tokenURI(id).then((uri) => {
                  marketContract.pricesOfNft(id).then((price) => {
                    axios.get(uri).then((res) => {
                      loaded++;
                      ships.push({
                        id: res.data?.data?.ssh_id,
                        uri: String(uri),
                        price: formatUnits(price),
                        name: res.data?.name,
                        image: res.data?.image,
                        class: res.data?.data?.sshm_class,
                        type: res.data?.data?.sshm_type,
                        sshm_id: res.data?.data?.sshm_id,
                      });
                      if (BigNumber.from(balance).toNumber() === loaded) {
                        console.log("setShips");
                        setMarketShips(ships);
                        setLoading(false);
                      }
                    });
                  });
                });
              });
          });
        })
        .catch((e) => {});
    }
    try {
      getShips();
    } catch (e) {}

    try {
      marketContract.on("NftSellCreate", () => {
        getShips();
      });
      marketContract.on("NftSellCancel", () => {
        getShips();
      });
      marketContract.on("NftBuy", () => {
        getShips();
      });
    } catch (e) {}

    return () => {
      try {
        marketContract.removeListener("NftSellCreate");
        marketContract.removeListener("NftSellCancel");
        marketContract.removeListener("NftBuy");
      } catch (e) {}
    };
  }, [shipContract, chainId, setMarketShips, marketContract, setLoading]);

  return null;
}

export function useMyShips() {
  const [state] = useSpaceshipContext();
  return state[MY_SHIPS];
}

export function useMyShipsOnSale() {
  const [state] = useSpaceshipContext();
  return state[MY_SHIPS_ON_SALE];
}

export function useMarketShips() {
  const [state] = useSpaceshipContext();
  return state[MARKET_SHIPS];
}

export function useSpaceshipLoading() {
  const [state] = useSpaceshipContext();
  return state[LOADING];
}

export function useSpaceshipProdLoading() {
  const [state] = useSpaceshipContext();
  return state[PROD_LOADING];
}
