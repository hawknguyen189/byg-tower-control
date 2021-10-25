import React, { createContext, useState, useMemo } from "react";

interface Ship {
  id: string;
  ast_id: number | null;
  plt_id: number | null;
  uri: string;
  name: string;
  image: string;
  class: string;
  type: string;
  status: string;
  price?: number | string;
}
interface ContextType {
  ship: Ship[];
  setShip: (tokenID: Ship[]) => void;
}
export const ShipContext = createContext<ContextType>({} as ContextType);

const ShipContextProvider: React.FC = ({ children }) => {
  const [ship, setShip] = useState<Ship[]>([]);
  const contextValues = useMemo(
    () => ({
      ship,
      setShip,
    }),
    [ship]
  );
  return (
    <ShipContext.Provider value={contextValues}>
      {children}
    </ShipContext.Provider>
  );
};

export default ShipContextProvider;
