import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import axios from "axios";
import { useActiveWeb3React } from "../../hooks";
import { safeAccess } from "../utils";
import {
  PLANET_ADDRESS,
  PLT_FIXED_MARKET,
  PLT_STAKING_CONTRACT,
} from "../constants";
import { useContract } from "../hooks";
import PLANET_ABI from "../constants/abis/planet.json";
import PLT_STAKING_ABI from "../constants/abis/PlanetStaking.json";
import { BigNumber } from "@ethersproject/bignumber";
import FIXED_MARKET_ABI from "../constants/abis/FixedMarket721.json";
import { formatUnits } from "@ethersproject/units";
import { range } from "../utils";
const PLANET_LIST = "PLANET_LIST";
const MY_PLANETS = "MY_PLANETS";
const ADD_PLANET = "ADD_PLANET";
const SET_MY_PLANETS = "SET_MY_PLANETS";
const MY_PLANETS_ON_SALE = "MY_PLANETS_ON_SALE";
const SET_MY_PLANETS_ON_SALE = "MY_PLANETS_ON_SALE";
const MARKET_PLTS = "MARKET_PLTS";
const SET_MARKET_PLTS = "SET_MARKET_PLTS";
const LOADING = "LOADING";
const SET_LOADING = "SET_LOADING";
const PROD_LOADING = "PROD_LOADING";
const SET_PROD_LOADING = "SET_PROD_LOADING";

const PlanetListContext = createContext(null);

function usePlanetListContext() {
  return useContext(PlanetListContext);
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ADD_PLANET: {
      return {
        ...state,
        [PLANET_LIST]: [...safeAccess(state, [PLANET_LIST]), payload],
      };
    }
    case SET_MY_PLANETS: {
      return { ...state, [MY_PLANETS]: payload };
    }
    case SET_MY_PLANETS_ON_SALE: {
      return { ...state, [MY_PLANETS_ON_SALE]: payload };
    }
    case SET_MARKET_PLTS: {
      return { ...state, [MARKET_PLTS]: payload };
    }
    case SET_LOADING: {
      return { ...state, [LOADING]: payload };
    }
    case SET_PROD_LOADING: {
      return { ...state, [PROD_LOADING]: payload };
    }
    default: {
      throw Error(
        `Unexpected action type in PlanetListContext reducer: '${type}'.`
      );
    }
  }
}

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    [PLANET_LIST]: [],
    [MY_PLANETS]: [],
    [MY_PLANETS_ON_SALE]: [],
    [MARKET_PLTS]: [],
    [LOADING]: false,
    [PROD_LOADING]: false,
  });

  const addPlanet = useCallback(
    (planet) => {
      dispatch({ type: ADD_PLANET, payload: planet });
    },
    [dispatch]
  );

  const setMyPlanets = useCallback(
    (planets) => {
      dispatch({ type: SET_MY_PLANETS, payload: planets });
    },
    [dispatch]
  );

  const setMyPlanetsOnSale = useCallback(
    (planets) => {
      dispatch({ type: SET_MY_PLANETS_ON_SALE, payload: planets });
    },
    [dispatch]
  );

  const setMarketPlts = useCallback(
    (planets) => {
      dispatch({ type: SET_MARKET_PLTS, payload: planets });
    },
    [dispatch]
  );

  const setLoading = useCallback((amount) => {
    dispatch({ type: SET_LOADING, payload: amount });
  }, []);

  const setProdLoading = useCallback((amount) => {
    dispatch({ type: SET_PROD_LOADING, payload: amount });
  }, []);

  return (
    <PlanetListContext.Provider
      value={useMemo(
        () => [
          state,
          {
            addPlanet,
            setMyPlanets,
            setMyPlanetsOnSale,
            setMarketPlts,
            setLoading,
            setProdLoading,
          },
        ],
        [
          state,
          addPlanet,
          setMyPlanets,
          setMyPlanetsOnSale,
          setMarketPlts,
          setLoading,
          setProdLoading,
        ]
      )}
    >
      {children}
    </PlanetListContext.Provider>
  );
}

export function Updater() {
  const { chainId, account } = useActiveWeb3React();

  const planetContract = useContract(PLANET_ADDRESS[chainId], PLANET_ABI);
  const marketContract = useContract(
    PLT_FIXED_MARKET[chainId],
    FIXED_MARKET_ABI
  );
  const stakingBYG = useContract(
    PLT_STAKING_CONTRACT[1][chainId],
    PLT_STAKING_ABI
  );
  const [, { setMyPlanets, setMyPlanetsOnSale, setLoading, setProdLoading }] =
    usePlanetListContext();

  // update planet list
  useEffect(() => {
    async function getMyPlanets() {
      var ids = [];
      var sales = [];
      console.log("my planet update");
      if (account) {
        var loaded = 0;
        setLoading(true);
        planetContract
          .balanceOf(account)
          .then((balance) => {
            if (BigNumber.from(balance).toNumber() === 0) {
              setLoading(false);
            } else {
              range(0, BigNumber.from(balance).toNumber() - 1).forEach((i) => {
                planetContract.tokenOfOwnerByIndex(account, i).then((id) => {
                  planetContract.tokenURI(id).then((uri) => {
                    axios.get(uri).then((res) => {
                      loaded++;
                      ids.push({
                        id: BigNumber.from(id).toNumber(),
                        uri: String(uri),
                        name: res.data?.name,
                        image: res.data?.image,
                        class: res.data?.class,
                      });
                      if (BigNumber.from(balance).toNumber() === loaded) {
                        setMyPlanets(ids);
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
      if (account && stakingBYG) {
        var stakedLoaded = 0;
        stakingBYG
          .getStakedNftsOf(account)
          .then((nfts) => {
            if (nfts.length === 0) {
              setLoading(false);
            }
            nfts.forEach((nft) => {
              planetContract.tokenURI(nft).then((uri) => {
                axios.get(uri).then((res) => {
                  stakedLoaded++;
                  ids.push({
                    id: BigNumber.from(nft).toNumber(),
                    uri: String(uri),
                    name: res.data?.name,
                    image: res.data?.image,
                    class: res.data?.class,
                  });
                  if (nfts.length === stakedLoaded) {
                    setMyPlanets(ids);
                    setLoading(false);
                  }
                });
              });
            });
          })
          .catch((e) => {});
      }

      if (account && marketContract) {
        var prodLoaded = 0;
        setProdLoading(true);
        marketContract
          .getNftsOfSeller(account)
          .then((saleIds) => {
            if (saleIds.length === 0) {
              setProdLoading(false);
            }
            saleIds.forEach((id) => {
              marketContract.pricesOfNft(id).then((price) => {
                planetContract.tokenURI(id).then((uri) => {
                  axios.get(uri).then((res) => {
                    prodLoaded++;
                    sales.push({
                      id: BigNumber.from(id).toNumber(),
                      uri: String(uri),
                      name: res.data?.name,
                      image: res.data?.image,
                      class: res.data?.class,
                      price: formatUnits(price),
                    });
                    if (saleIds.length === prodLoaded) {
                      setMyPlanetsOnSale(sales);
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
      getMyPlanets();
    } catch (e) {}

    try {
      marketContract.on("NftBuy", () => {
        getMyPlanets();
      });
    } catch (e) {}

    return () => {
      try {
        marketContract.removeListener("NftBuy");
      } catch (e) {}
    };
  }, [
    planetContract,
    account,
    setMyPlanets,
    marketContract,
    setMyPlanetsOnSale,
    stakingBYG,
    setLoading,
    setProdLoading,
  ]);

  return null;
}

export function MarketUpdater() {
  const { chainId } = useActiveWeb3React();

  const planetContract = useContract(PLANET_ADDRESS[chainId], PLANET_ABI);
  const marketContract = useContract(
    PLT_FIXED_MARKET[chainId],
    FIXED_MARKET_ABI
  );

  const [, { setMarketPlts, setLoading }] = usePlanetListContext();

  useEffect(() => {
    async function getPlanets() {
      setLoading(true);
      var plts = [];
      // var counter=0
      planetContract
        .balanceOf(PLT_FIXED_MARKET[chainId])
        .then((balance) => {
          console.log("market planets", BigNumber.from(balance).toNumber());
          if (BigNumber.from(balance).toNumber() === 0) {
            setLoading(false);
          }
          var loaded = 0;
          range(0, BigNumber.from(balance).toNumber() - 1).forEach((i) => {
            planetContract
              .tokenOfOwnerByIndex(PLT_FIXED_MARKET[chainId], i)
              .then((id) => {
                planetContract.tokenURI(id).then((uri) => {
                  marketContract.pricesOfNft(id).then((price) => {
                    axios.get(uri).then((res) => {
                      loaded++;
                      plts.push({
                        id: BigNumber.from(id).toNumber(),
                        uri: String(uri),
                        price: formatUnits(price),
                        name: res.data?.name,
                        image: res.data?.image,
                        class: res.data?.class,
                      });
                      if (BigNumber.from(balance).toNumber() === loaded) {
                        console.log("setPLTs");
                        setMarketPlts(plts);
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
      getPlanets();
    } catch (e) {}

    try {
      marketContract.on("NftSellCreate", () => {
        getPlanets();
      });
      marketContract.on("NftSellCancel", () => {
        getPlanets();
      });
      marketContract.on("NftBuy", () => {
        getPlanets();
      });
    } catch (e) {}

    return () => {
      try {
        marketContract.removeListener("NftSellCreate");
        marketContract.removeListener("NftSellCancel");
        marketContract.removeListener("NftBuy");
      } catch (e) {}
    };
  }, [planetContract, chainId, setMarketPlts, marketContract, setLoading]);

  return null;
}

export function usePlanetList() {
  const [state] = usePlanetListContext();
  return state[PLANET_LIST];
}

export function useMyPlanets() {
  const [state] = usePlanetListContext();
  return state[MY_PLANETS];
}

export function useMyPlanetsOnSale() {
  const [state] = usePlanetListContext();
  return state[MY_PLANETS_ON_SALE];
}

export function useMarketPlanets() {
  const [state] = usePlanetListContext();
  return state[MARKET_PLTS];
}

export function usePlanetLoading() {
  const [state] = usePlanetListContext();
  return state[LOADING];
}

export function usePlanetProdLoading() {
  const [state] = usePlanetListContext();
  return state[PROD_LOADING];
}
