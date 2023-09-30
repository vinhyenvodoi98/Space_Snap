import {
  createContext,
  Dispatch,
  ReactNode,
  Reducer,
  useEffect,
  useReducer,
} from 'react';
import Web3 from 'web3';
import { ContractABI, BscContractAddress } from '../config/spaceId';

import { Snap } from '../types';
import { connectAccount, detectSnaps, getSnap, isFlask } from '../utils';

export type MetamaskState = {
  snapsDetected: boolean;
  isFlask: boolean;
  installedSnap?: Snap;
  error?: Error;
  web3: Web3 | null;
  contract: any;
  account: Array<string>
};

const initialState: MetamaskState = {
  snapsDetected: false,
  isFlask: false,
  web3: null,
  contract: null,
  account: []
};

type MetamaskDispatch = { type: MetamaskActions; payload: any };

export const MetaMaskContext = createContext<
  [MetamaskState, Dispatch<MetamaskDispatch>]
>([
  initialState,
  () => {
    /* no op */
  },
]);

export enum MetamaskActions {
  SetInstalled = 'SetInstalled',
  SetSnapsDetected = 'SetSnapsDetected',
  SetError = 'SetError',
  SetIsFlask = 'SetIsFlask',
  SetWeb3 = 'SetWeb3',
  SetContract = 'SetContract',
  SetAccount = 'SetAccount'
}

const reducer: Reducer<MetamaskState, MetamaskDispatch> = (state, action) => {
  switch (action.type) {
    case MetamaskActions.SetInstalled:
      return {
        ...state,
        installedSnap: action.payload,
      };
    case MetamaskActions.SetSnapsDetected:
      return {
        ...state,
        snapsDetected: action.payload,
      };
    case MetamaskActions.SetIsFlask:
      return {
        ...state,
        isFlask: action.payload,
      };
    case MetamaskActions.SetError:
      return {
        ...state,
        error: action.payload,
      };
    case MetamaskActions.SetWeb3:
      return {
        ...state,
        web3: action.payload,
      };
    case MetamaskActions.SetContract:
      return {
        ...state,
        contract: action.payload,
      };
    case MetamaskActions.SetContract:
      return {
        ...state,
        account: action.payload,
      };
    default:
      return state;
  }
};

/**
 * MetaMask context provider to handle MetaMask and snap status.
 *
 * @param props - React Props.
 * @param props.children - React component to be wrapped by the Provider.
 * @returns JSX.
 */
export const MetaMaskProvider = ({ children }: { children: ReactNode }) => {
  if (typeof window === 'undefined') {
    return <>{children}</>;
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  // Find MetaMask Provider and search for Snaps
  // Also checks if MetaMask version is Flask
  useEffect(() => {
    const setSnapsCompatibility = async () => {
      dispatch({
        type: MetamaskActions.SetSnapsDetected,
        payload: await detectSnaps(),
      });
    };

    const setWeb3 = async () => {
      const web3 = new Web3(window.ethereum);
      dispatch({
        type: MetamaskActions.SetWeb3,
        payload: web3,
      });

      const account = await connectAccount()
      dispatch({
        type: MetamaskActions.SetAccount,
        payload: account,
      });

      const contract = new web3.eth.Contract(ContractABI, BscContractAddress);
      dispatch({
        type: MetamaskActions.SetContract,
        payload: contract,
      });
    };

    setSnapsCompatibility();
    setWeb3()
  }, [window.ethereum]);

  // Set installed snaps
  useEffect(() => {
    async function detectSnapInstalled() {
      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: await getSnap(),
      });
    }

    const checkIfFlask = async () => {
      dispatch({
        type: MetamaskActions.SetIsFlask,
        payload: await isFlask(),
      });
    };

    if (state.snapsDetected) {
      detectSnapInstalled();
      checkIfFlask();
    }
  }, [state.snapsDetected]);

  useEffect(() => {
    let timeoutId: number;

    if (state.error) {
      timeoutId = window.setTimeout(() => {
        dispatch({
          type: MetamaskActions.SetError,
          payload: undefined,
        });
      }, 10000);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [state.error]);

  return (
    <MetaMaskContext.Provider value={[state, dispatch]}>
      {children}
    </MetaMaskContext.Provider>
  );
};
