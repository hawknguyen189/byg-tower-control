import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback,
  useEffect,
} from "react";

import { useActiveWeb3React } from "../../hooks";
import { BYG_ADDRESS } from "../constants";
import { useTokenContract } from "../../hooks";
import { formatUnits } from "@ethersproject/units";
const TOTAL_SUPPLY = "TOTAL_SUPPLY";
const BALANCE = "BALANCE";
const SET_TOTAL_SUPPLY = "SET_TOTAL_SUPPLY";
const SET_BALANCE = "SET_BALANCE";

const TokenContext = createContext(null);

function useTokenContext() {
  return useContext(TokenContext);
}

function reducer(state, { type, payload }) {
  switch (type) {
    case SET_TOTAL_SUPPLY: {
      return { ...state, [TOTAL_SUPPLY]: payload };
    }
    case SET_BALANCE: {
      return { ...state, [BALANCE]: payload };
    }

    default: {
      throw Error(`Unexpected action type in TokenContext reducer: '${type}'.`);
    }
  }
}

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    [TOTAL_SUPPLY]: "",
    [BALANCE]: "",
  });

  const setTotalSupply = useCallback((amount) => {
    dispatch({ type: SET_TOTAL_SUPPLY, payload: amount });
  }, []);

  const setBalance = useCallback((amount) => {
    dispatch({ type: SET_BALANCE, payload: amount });
  }, []);

  return (
    <TokenContext.Provider
      value={useMemo(
        () => [state, { setTotalSupply, setBalance }],
        [state, setTotalSupply, setBalance]
      )}
    >
      {children}
    </TokenContext.Provider>
  );
}

export function Updater() {
  const { chainId, account } = useActiveWeb3React();
  const Contract = useTokenContract(BYG_ADDRESS[chainId], false);
  const [, { setTotalSupply, setBalance }] = useTokenContext();

  // update planet list
  useEffect(() => {
    try {
      Contract.totalSupply()
        .then((amount) => {
          setTotalSupply(formatUnits(amount));
        })
        .catch((e) => {
          console.log(e);
        });
      if (account) {
        Contract.balanceOf(account)
          .then((amount) => {
            setBalance(formatUnits(amount));
          })
          .catch((e) => {
            console.log(e);
          });
      }
    } catch (e) {}
  }, [Contract, setBalance, setTotalSupply, account]);

  return null;
}

export function useTotalSupply() {
  const [state] = useTokenContext();
  return state[TOTAL_SUPPLY];
}

export function useTokenBalance() {
  const [state] = useTokenContext();
  return state[BALANCE];
}
