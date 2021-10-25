import React, { createContext, useState, useMemo } from "react";

interface Contract {
  accounts: string;
  chainID: number;
  spaceShipContract: any;
  cargoStakingContract: any;
  discoveryStakingContract: any;
  marketContract: any;
  repairContract: any;
  asteroidContract: any;
  flightContract: any;
  signer: any;
}
interface ContextType {
  contract: Contract;
  setContract: (contract: Contract) => void;
}

export const ContractContext = createContext<ContextType>({} as ContextType);

const ContractContextProvider: React.FC = ({ children }) => {
  const [contract, setContract] = useState<Contract>({} as Contract);

  const contextValues = useMemo(
    () => ({
      contract,
      setContract,
    }),
    [contract]
  );
  return (
    <ContractContext.Provider value={contextValues}>
      {children}
    </ContractContext.Provider>
  );
};

export default ContractContextProvider;
