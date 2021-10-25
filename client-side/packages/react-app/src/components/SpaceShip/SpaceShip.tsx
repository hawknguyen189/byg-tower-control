import React from "react";
import { ShipContext } from "../Context/ShipContext";
import HunterShip from "./HunterShip/HunterShip";

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
const SpaceShip = () => {
  const { ship } = React.useContext(ShipContext);
  return (
    <div className="space-ship-container container py-3">
      <p className="h1 text-uppercase fw-bold text-white">
        {" "}
        Your Fleet{" "}
        <span className="h6 fw-italic text-white-50">({ship.length})</span>
      </p>
      <div className="row py-3">
        {ship?.length &&
          ship.map((item: Ship, index: number) => {
            return <HunterShip item={item} key={index}></HunterShip>;
          })}
      </div>
    </div>
  );
};

export default SpaceShip;
