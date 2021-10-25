import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import CargoShip from "./Cargo";
import DiscoveryShip from "./Discovery";
import HunterShip from "./Hunter";

const SpaceShip = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [currentLoc, setCurrentLoc] = useState(null);
  const [toggle, setToggle] = useState(false);
  useEffect(() => {
    let isSubscribed = true;
    axios
      .get(`${process.env.REACT_APP_API_PATH}/v1/starships/${id}`)
      .then((res) => {
        setData(res.data?.starships[0]);
        if (res.data?.starships[0].ast_id !== null) {
          axios
            .get(
              `${process.env.REACT_APP_API_PATH}/v1/asteroids/${res.data?.starships[0].ast_id}`
            )
            .then((res) => {
              if (isSubscribed) {
                setCurrentLoc({
                  name: res.data.asteroids[0]?.ast_name,
                  image: res.data.asteroids[0]?.ast_image_small,
                  plt_id: null,
                  ast_id: res.data.asteroids[0]?.ast_id,
                  code: res.data.asteroids[0]?.ast_code,
                });
              }
            })
            .catch((e) => {
              if (isSubscribed) {
                setCurrentLoc(null);
              }
            });
        } else {
          axios
            .get(
              `${process.env.REACT_APP_API_PATH}/v1/planet/${res.data?.starships[0].plt_id}`
            )
            .then((res) => {
              if (isSubscribed) {
                setCurrentLoc({
                  name: res.data.planet?.plt_name,
                  image: res.data.planet?.plt_image_small,
                  plt_id: res.data.planet?.plt_id,
                  ast_id: null,
                  code: null,
                });
              }
            })
            .catch((e) => {
              if (isSubscribed) {
                setCurrentLoc(null);
              }
            });
        }
      })
      .catch((e) => {
        setData(null);
        setCurrentLoc(null);
      });
    return () => (isSubscribed = false);
  }, [id, toggle]);

  return (
    <div style={{ minHeight: "71vh" }}>
      {data &&
        currentLoc &&
        (data.sshm_type === "Cargo" ? (
          <CargoShip
            data={data}
            currentLoc={currentLoc}
            toggle={toggle}
            setToggle={setToggle}
          />
        ) : data.sshm_type === "Discovery" ? (
          <DiscoveryShip
            data={data}
            currentLoc={currentLoc}
            toggle={toggle}
            setToggle={setToggle}
          />
        ) : (
          <HunterShip
            data={data}
            currentLoc={currentLoc}
            toggle={toggle}
            setToggle={setToggle}
          />
        ))}
    </div>
  );
};

export default SpaceShip;
