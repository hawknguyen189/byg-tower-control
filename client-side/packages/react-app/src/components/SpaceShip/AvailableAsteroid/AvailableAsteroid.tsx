import { BigNumber } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";
import React, { useEffect } from "react";
import { ContractContext } from "../../Context/ContractContext";
import { addressList } from "../../constants";

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
interface FlightInfo {
  targetType: number; // 1: asteroid, 0: planet
  lengthInDays: number;
  owner: string;
  from: number; //origin
  to: number; //to asteroid id
  start: number; //start time
}
interface Asteriod {
  ast_id: string;
  ast_reward: number;
  period: number;
}
interface Props {
  item: Ship;
  flightInfo: FlightInfo;
}

const AvailableAsteroid = ({ item, flightInfo }: Props) => {
  const { contract } = React.useContext(ContractContext);
  const [asteroid, setAsteroid] = React.useState<Asteriod[]>([]);
  const fetchAsteroid = async (
    plannetID: any,
    asteroidID: any,
    shipID: string
  ) => {
    try {
      const response = await fetch(
        `https://be.blackeyegalaxy.space/v1/get-available-asteroids?source=${
          asteroidID || plannetID
        }&spaceship=${shipID}&sourcetype=${asteroidID ? 1 : 0}`
      );
      const data = await response.json();
      const delay = (ms = 2500) => new Promise((r) => setTimeout(r, ms));
      let temp: Asteriod[] = [];
      for (let i = 0; i < data.destinations.length; i++) {
        await delay();
        const randomAdd = Math.floor(Math.random() * addressList.length);
        const res = await fetch(
          `https://be.blackeyegalaxy.space/v1/asteroids/${data.destinations[i].ast_id}?address=${addressList[randomAdd]}`
        );
        const ast = await res.json();
        if (ast) {
          temp[i] = {
            ...temp[i],
            ast_id: data.destinations[i].ast_id,
            period: ast.asteroids[0].ast_mining_length_days,
            ast_reward: parseInt(ast.asteroids[0].ast_mining_resource_pool.BYG),
          };
        }
      }
      setAsteroid(temp);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (item.id) {
      fetchAsteroid(item.plt_id, item.ast_id, item.id);
    }
  }, [item]);

  return (
    <div className="row asteroid-container">
      {asteroid.length &&
        asteroid.map((item, index) => {
          return (
            <div key={index} className="asteroid-card">
              <span>{`ID ${item.ast_id}`}</span>" "
              <span
                className={item.ast_reward > 1000 ? "strong text-warning" : ""}
              >
                {item.ast_reward}
              </span>
            </div>
          );
        })}
    </div>
  );
};

export default AvailableAsteroid;
