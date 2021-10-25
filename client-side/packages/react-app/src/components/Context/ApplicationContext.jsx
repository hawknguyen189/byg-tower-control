import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback,
} from "react";

// import { useActiveWeb3React } from '../hooks'
// import { safeAccess } from '../utils'

export const ALERT_TYPE = { SUCCESS: "success", ERROR: "error" };
// const BLOCK_NUMBER = 'BLOCK_NUMBER'
// const USD_PRICE = 'USD_PRICE'
const WALLET_MODAL_OPEN = "WALLET_MODAL_OPEN";
const ALERT_MSG = "ALERT_MSG";
const ALERT_STATUS = "ALERT_STATUS";
const ALERT_OPEN = "ALERT_OPEN";

// const UPDATE_BLOCK_NUMBER = 'UPDATE_BLOCK_NUMBER'
const TOGGLE_WALLET_MODAL = "TOGGLE_WALLET_MODAL";
const SHOW_SUCCESS_MSG = "SHOW_SUCCESS_MSG";
const SHOW_ERROR_MSG = "SHOW_ERROR_MSG";
const CLOSE_ALERT = "CLOSE_ALERT";

const ApplicationContext = createContext();

function useApplicationContext() {
  return useContext(ApplicationContext);
}

function reducer(state, { type, payload }) {
  switch (type) {
    // case UPDATE_BLOCK_NUMBER: {
    //   const { networkId, blockNumber } = payload
    //   return {
    //     ...state,
    //     [BLOCK_NUMBER]: {
    //       ...(safeAccess(state, [BLOCK_NUMBER]) || {}),
    //       [networkId]: blockNumber
    //     }
    //   }
    // }

    case TOGGLE_WALLET_MODAL: {
      return { ...state, [WALLET_MODAL_OPEN]: !state[WALLET_MODAL_OPEN] };
    }
    case SHOW_SUCCESS_MSG: {
      return {
        ...state,
        [ALERT_MSG]: payload,
        [ALERT_STATUS]: ALERT_TYPE.SUCCESS,
        [ALERT_OPEN]: true,
      };
    }
    case SHOW_ERROR_MSG: {
      return {
        ...state,
        [ALERT_MSG]: payload,
        [ALERT_STATUS]: ALERT_TYPE.ERROR,
        [ALERT_OPEN]: true,
      };
    }
    case CLOSE_ALERT: {
      return { ...state, [ALERT_OPEN]: false };
    }
    default: {
      throw Error(
        `Unexpected action type in ApplicationContext reducer: '${type}'.`
      );
    }
  }
}

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    // [BLOCK_NUMBER]: {},
    // [USD_PRICE]: {},
    [WALLET_MODAL_OPEN]: false,
    [ALERT_STATUS]: ALERT_TYPE.SUCCESS,
    [ALERT_MSG]: "",
    [ALERT_OPEN]: false,
  });

  // const updateBlockNumber = useCallback((networkId, blockNumber) => {
  //   dispatch({ type: UPDATE_BLOCK_NUMBER, payload: { networkId, blockNumber } })
  // }, [])

  const toggleWalletModal = useCallback(() => {
    dispatch({ type: TOGGLE_WALLET_MODAL });
  }, []);

  const showSuccessMsg = useCallback((msg) => {
    dispatch({ type: SHOW_SUCCESS_MSG, payload: msg });
  }, []);

  const showErrorMsg = useCallback((msg) => {
    dispatch({ type: SHOW_ERROR_MSG, payload: msg });
  }, []);

  const closeAlert = useCallback(() => {
    dispatch({ type: CLOSE_ALERT });
  }, []);

  return (
    <ApplicationContext.Provider
      value={useMemo(
        () => [
          state,
          { toggleWalletModal, showSuccessMsg, showErrorMsg, closeAlert },
        ],
        [state, toggleWalletModal, showSuccessMsg, showErrorMsg, closeAlert]
      )}
    >
      {children}
    </ApplicationContext.Provider>
  );
}

// export function Updater() {
//   const { library, chainId } = useActiveWeb3React()

//   const [, { updateBlockNumber }] = useApplicationContext()

//   // update block number
//   useEffect(() => {
//     if (library) {
//       let stale = false

//       function update() {
//         library
//           .getBlockNumber()
//           .then(blockNumber => {
//             if (!stale) {
//               updateBlockNumber(chainId, blockNumber)
//             }
//           })
//           .catch(() => {
//             if (!stale) {
//               updateBlockNumber(chainId, null)
//             }
//           })
//       }

//       update()
//       library.on('block', update)

//       return () => {
//         stale = true
//         library.removeListener('block', update)
//       }
//     }
//   }, [chainId, library, updateBlockNumber])

//   return null
// }

// export function useBlockNumber() {
//   const { chainId } = useActiveWeb3React()

//   const [state] = useApplicationContext()

//   return safeAccess(state, [BLOCK_NUMBER, chainId])
// }

export function useWalletModalOpen() {
  const [state] = useApplicationContext();

  return state[WALLET_MODAL_OPEN];
}

export function useWalletModalToggle() {
  const [, { toggleWalletModal }] = useApplicationContext();

  return toggleWalletModal;
}

export function useAlertOpen() {
  const [state] = useApplicationContext();
  return state[ALERT_OPEN];
}

export function useAlertStatus() {
  const [state] = useApplicationContext();
  return state[ALERT_STATUS];
}

export function useAlertMsg() {
  const [state] = useApplicationContext();
  return state[ALERT_MSG];
}

export function useShowSuccessMsg() {
  const [, { showSuccessMsg }] = useApplicationContext();
  return showSuccessMsg;
}

export function useShowErrorMsg() {
  const [, { showErrorMsg }] = useApplicationContext();
  return showErrorMsg;
}

export function useCloseAlert() {
  const [, { closeAlert }] = useApplicationContext();
  return closeAlert;
}
