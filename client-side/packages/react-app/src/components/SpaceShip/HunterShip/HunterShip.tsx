import { BigNumber } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";
import React, { useCallback, useEffect, useState } from "react";
import { ContractContext } from "../../Context/ContractContext";
import AvailableAsteroid from "../AvailableAsteroid/AvailableAsteroid";

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

interface Props {
  item: Ship;
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
interface MiningAst {
  asteroidId: number;
  owner: string;
  lastClaimedTimestamp: number;
  stakedTimestamp: number;
  ast_reward: number;
}

const HunterShip = ({ item }: Props) => {
  const { contract } = React.useContext(ContractContext);
  const [endTime, setEndTime] = React.useState(0);
  const [arrived, setArrived] = useState(false);
  const [currentTarget, setCurrentTarget] = useState<Asteriod>({} as Asteriod);
  const [flightInfo, setFlightInfo] = React.useState<FlightInfo>(
    {} as FlightInfo
  );
  const [miningAst, setMiningAst] = React.useState<MiningAst>({} as MiningAst);
  const [leftTime, setLeftTime] = useState("0:00:00");

  //get asteroid reward
  const handleFindReward = async (astID: number) => {
    const res = await fetch(
      `https://be.blackeyegalaxy.space/v1/asteroids/${astID}?address=0xd39e2a1b9ed5a7c3c834020d2bf543cb5d96baa9`
    );
    const ast = await res.json();
    if (ast) {
      setCurrentTarget({
        ast_id: String(astID),
        period: ast.asteroids[0].ast_mining_length_days,
        ast_reward: parseInt(ast.asteroids[0].ast_mining_resource_pool.BYG),
      });
    }
  };

  //fetch asteroid info
  const getAsteroidInfo = async (astID: number) => {
    const response = await contract.asteroidContract.infoOfAsteroid(astID);
    return {
      ast_id: String(astID),
      period: BigNumber.from(response.period).toNumber(),
      ast_reward: parseInt(formatUnits(response.rewardAmount)),
    };
  };

  //retrieve all status
  const getStatus = useCallback(async () => {
    if (item.id) {
      try {
        const flightStatus = await contract.flightContract.shipsInFlight(
          item.id
        );
        setFlightInfo({
          targetType: BigNumber.from(flightStatus.targetType).toNumber(),
          lengthInDays: BigNumber.from(flightStatus.lengthInDays)
            .mul(24 * 3600)
            .toNumber(),
          owner: flightStatus.owner,
          from: BigNumber.from(flightStatus.from).toNumber(),
          to: BigNumber.from(flightStatus.to).toNumber(),
          start: BigNumber.from(flightStatus.start).toNumber(),
        });
        const seller = await contract?.marketContract.sellersOfNft(item.id);
        const repairInfo = await contract?.repairContract.shipInfos(item.id);
        //get mining asteroid info if status is mining
        if (item.status === "Mining asteroid") {
          const miningAsteroid = await contract?.asteroidContract.ships(
            item.id
          );
          if (
            miningAsteroid.owner !==
            "0x0000000000000000000000000000000000000000"
          ) {
            const { ast_reward } = await getAsteroidInfo(
              BigNumber.from(miningAsteroid.asteroidId).toNumber()
            );

            setMiningAst({
              ...miningAst,
              asteroidId: BigNumber.from(miningAsteroid.asteroidId).toNumber(),
              owner: miningAsteroid.owner,
              lastClaimedTimestamp: BigNumber.from(
                miningAsteroid.lastClaimedTimestamp
              ).toNumber(),
              stakedTimestamp: BigNumber.from(
                miningAsteroid.stakedTimestamp
              ).toNumber(),
              ast_reward: ast_reward,
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [item]);

  const calculateEndTime = useCallback(() => {
    let sec: number = 0;
    let min: number = 0;
    let hour: number = 0;
    let day: number;
    const nowtimestamp = new Date().getTime() / 1000;
    if (endTime - nowtimestamp >= 0) {
      sec = ((endTime - nowtimestamp) % 3600) % 60;
      min = ((endTime - nowtimestamp - sec) / 60) % 60;
      hour = ((endTime - nowtimestamp - sec - min * 60) / 3600) % 24;
      day = (endTime - nowtimestamp - sec - min * 60 - hour * 3600) / 3600 / 24;
      setLeftTime(day + "day(s) : " + hour + "hour(s) : " + min + " min(s)");
      setArrived(false);
    } else {
      setArrived(true);
      setLeftTime("0:00:00");
    }
  }, [endTime]);

  useEffect(() => {
    //retrieve status of current ship, flight info, mining asteroid
    getStatus();
    return () => {};
  }, [getStatus]);

  useEffect(() => {
    if (flightInfo.start) {
      //set end time of flight
      setEndTime(flightInfo.start + flightInfo.lengthInDays);
    }
    return () => {};
  }, [flightInfo]);

  useEffect(() => {
    calculateEndTime();
    return () => {};
  }, [calculateEndTime]);
  //   useEffect(() => {
  //     //get current asteroid info for in flight
  //     const fetchCurrentAst = async () => {
  //       if (flightInfo.to) {
  //         //can't be null
  //         try {
  //           const currentTarget = await getAsteroidInfo(flightInfo.to);
  //           setCurrentAst(currentTarget);
  //         } catch (error) {
  //           console.log(error, "item", item);
  //         }
  //       }
  //     };
  //     if (item.status === "In flight") {
  //       fetchCurrentAst();
  //     }
  //     return () => {};
  //   }, [flightInfo]);
  return (
    <div className="col-sm-4 py-2">
      <div className="space-ship-item row">
        <div className="space-ship-item-img col-sm-5">
          <img className="img-thumbnail" src={item.image} alt="space-ship" />
        </div>
        <div className="space-ship-item-info col-sm-7">
          <div className="row">
            <h6>{item.name}</h6>
            <p
              className={
                item.status === "available" || arrived
                  ? "strong text-danger"
                  : "text-primary"
              }
            >
              {item.status === "Mining asteroid"
                ? "Mining asteroid"
                : item.status === "Available"
                ? "Available"
                : arrived
                ? "Arrived the Asteroid"
                : `${item.status} from ${item.ast_id || item.plt_id}`}
            </p>

            <p
              className={
                miningAst.ast_reward > 1000 ? "strong text-success" : ""
              }
            >
              {item.status === "In flight"
                ? `TargetID ${flightInfo.to} - `
                : item.status === "Mining asteroid"
                ? `mining ${miningAst.asteroidId}-${miningAst.ast_reward}BYG`
                : ""}
              {item.status === "In flight" ? (
                <span>
                  {currentTarget.ast_reward ? (
                    <span>{currentTarget.ast_reward}BYG</span>
                  ) : (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleFindReward(flightInfo.to);
                      }}
                    >
                      Find Reward
                    </a>
                  )}
                </span>
              ) : (
                ""
              )}
            </p>

            <p>{leftTime}</p>
          </div>
          <AvailableAsteroid item={item} flightInfo={flightInfo} />
        </div>
      </div>
    </div>
  );
};

export default HunterShip;
