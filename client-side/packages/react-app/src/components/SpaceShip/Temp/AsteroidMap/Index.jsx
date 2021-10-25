import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import styled from "styled-components";
import { ReactComponent as Close } from "../../../assets/images/x.svg";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Grid, CircularProgress } from "@material-ui/core";
import axios from "axios";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Line, Svg } from "react-svg-path";
import {
  MAP_HEIGHT,
  MAP_WIDTH,
  GRID_NUM_WIDTH,
  GRID_NUM_HEIGHT,
  BYG_ADDRESS,
  FLIGHT_POOL_ADDRESS,
} from "../../../constants";
import { range, getTxErrorMsg } from "../../../utils";
import { useActiveWeb3React, useTokenContract } from "../../../hooks";
import { BigNumber } from "@ethersproject/bignumber";
import { utils } from "ethers";
import {
  useShowErrorMsg,
  useShowSuccessMsg,
} from "../../../contexts/Application";
import { formatUnits } from "@ethersproject/units";
import Asteroid from "./Asteroid";
import Planet from "./Planet";
import axiosInstance from "../../../services/AuthApi";

const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 14px;
  color: white;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`;

const CloseColor = styled(Close)`
  path {
    stroke: black;
  }
`;
const useStyles = makeStyles((theme) => ({
  root: {
    padding: "10px 20px",
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      padding: 10,
    },
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: 300,
    [theme.breakpoints.down("sm")]: {
      fontSize: 16,
    },
  },
  text: {
    color: "white",
    fontSize: 14,
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
  },
  mapwrapper: {
    height: 300,
    position: "relative",
  },
  tools: {
    position: "absolute",
    bottom: 5,
    right: 5,
    zIndex: 100,
    display: "flex",
    flexWrap: "wrap",

    "& button": {
      border: "1px solid #fff",
      borderRadius: 5,
      background: "#000",
      display: "flex",
      justifyContent: "center",
      width: 30,
      height: 30,
      margin: "2px 2px",
      opacity: 0.7,
      color: "#fff",
      fontSize: "24px",
      transition: ".1s ease",
      paddingTop: "0!important",

      "&:hover": {
        opacity: 1,
        cursor: "pointer",
        background: "rgba(#fff, .4)",
      },

      "&:disabled": {
        border: "1px solid rgba(#fff, .3)",
        cursor: "default",
        opacity: 0.3,
        background: "rgba(#000, .1) !important",
      },
    },
  },
}));

const AsteroidMap = ({
  spaceship,
  source,
  sourceType,
  modalOpen,
  setModalOpen,
  nftId,
  setStaked,
  stakingContract,
  shipContract,
  pendingMsg,
  setPendingMsg,
  damage,
}) => {
  const classes = useStyles();
  const [destinations, setDestinations] = useState([]);
  // const [onlyStars, setOnlyStars] = useState(false)
  // const [fromId, setFromId] = useState()
  const showErrorMsg = useShowErrorMsg();
  const showSuccessMsg = useShowSuccessMsg();
  const { account, chainId } = useActiveWeb3React();
  const BYGContract = useTokenContract(BYG_ADDRESS[chainId]);
  const [fuelPrice, setFuelPrice] = useState(null);
  const [cornerPoint, setCornerPoint] = useState(null);
  const [stars, setStars] = useState([]);
  const dx = 14;
  const dy = 11;

  useEffect(() => {
    let isSubscribed = true;
    if (spaceship && source) {
      axios
        .get(
          `${process.env.REACT_APP_API_PATH}/v1/get-available-asteroids?source=${source}&spaceship=${spaceship}&sourcetype=${sourceType}`
        )
        .then((res) => {
          if (isSubscribed) {
            setDestinations(res.data?.destinations);
            if (res.data?.destinations.length > 0) {
              var x = res.data?.destinations[0]?.ast_x;
              var y = res.data?.destinations[0]?.ast_y;
              res.data?.destinations.forEach(({ ast_x, ast_y }) => {
                if (ast_x < x) {
                  x = ast_x;
                }
                if (ast_y < y) {
                  y = ast_y;
                }
              });
              setCornerPoint({ x: x, y: y });
            }

            axios
              .get(
                `${process.env.REACT_APP_API_PATH}/v1/get-available-flight-destinations?source=${source}&spaceship=${spaceship}&onlystars=0&sourcetype=${sourceType}`
              )
              .then((res) => {
                if (isSubscribed) {
                  setStars(res.data?.destinations);
                }
              })
              .catch((e) => {
                if (isSubscribed) {
                  setStars([]);
                }
              });
          }
        })
        .catch((e) => {
          if (isSubscribed) {
            setDestinations([]);
          }
        });
    }
    async function getPrice() {
      try {
        const unit = await shipContract.getFuelUnit(nftId);
        const price = await stakingContract.fuelPrice();
        if (isSubscribed) {
          setFuelPrice(BigNumber.from(unit).toNumber() * formatUnits(price));
        }
      } catch (e) {}
    }
    getPrice();
    return () => (isSubscribed = false);
  }, [spaceship, source, sourceType, nftId, shipContract, stakingContract]);

  const stake = async (target, targetName, length) => {
    try {
      if (!pendingMsg) {
        if (damage > 70) {
          showErrorMsg("Repair your spaceship please");
          setModalOpen(false);
        } else {
          const fuelPrice = await stakingContract.getFuelPriceOfToken(
            nftId,
            length
          );
          if (parseFloat(formatUnits(fuelPrice)) > 0) {
            const allowances = await BYGContract.allowance(
              account,
              FLIGHT_POOL_ADDRESS[chainId]
            );
            if (
              parseFloat(formatUnits(allowances)) <
              parseFloat(formatUnits(fuelPrice))
            ) {
              setPendingMsg("Approving");
              const approveTx = await BYGContract.approve(
                FLIGHT_POOL_ADDRESS[chainId],
                "100000000000000000000000"
              );
              const receipta = await approveTx.wait(1);
              if (receipta?.status === 1) {
                showSuccessMsg("Approval success");
              } else {
                showErrorMsg("Approval failed");
              }
            }
          }
          setPendingMsg(`Sending to ${targetName}`);
          const b_length = BigNumber.from(length);
          const b_from = BigNumber.from(source);
          const b_to = BigNumber.from(target);
          const b_two = BigNumber.from(2);
          const b_type = BigNumber.from(1); //0-to planet, 1-to asteroid
          const transferTx = await shipContract[
            "safeTransferFrom(address,address,uint256,bytes)"
          ](
            account,
            FLIGHT_POOL_ADDRESS[chainId],
            nftId,
            utils.hexZeroPad(
              utils.hexlify(
                b_type.mul(b_two.pow(192)).add(
                  b_length
                    .mul(b_two.pow(128))
                    .add(b_to.mul(b_two.pow(64)))
                    .add(b_from)
                )
              ),
              32
            )
          );
          const receipt = await transferTx.wait(1);
          if (receipt?.status === 1) {
            const params = {
              tokenId: nftId,
              toId: target,
              targetType: 1,
            };
            await axiosInstance.post(`/v1/start-flight`, null, { params });
            showSuccessMsg("Success");
            setStaked(true);
          } else {
            showErrorMsg("Failed");
          }
          setPendingMsg(null);
          setModalOpen(false);
        }
      }
    } catch (e) {
      setPendingMsg(null);
      showErrorMsg(getTxErrorMsg(e));
    }
  };

  function getModalContent() {
    return (
      <Grid className={classes.root} container spacing={2} justify={"center"}>
        <CloseIcon onClick={() => setModalOpen(false)}>
          <CloseColor alt={"close icon"} />
        </CloseIcon>
        <Grid item xs={12}>
          <Typography color="textPrimary" className={classes.title}>
            Available Asteroids
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.mapwrapper}>
          <TransformWrapper
            initialScale={3}
            initialPositionX={
              cornerPoint !== null ? (-cornerPoint.x - dx) * 3 : 0
            }
            initialPositionY={
              cornerPoint !== null ? (-cornerPoint.y - dy) * 3 : 0
            }
            minScale={0.5}
            maxScale={40}
          >
            {({ zoomIn, zoomOut, ...rest }) => (
              <>
                <div className={classes.tools}>
                  <button onClick={() => zoomIn()}>+</button>
                  <button onClick={() => zoomOut()}>-</button>
                </div>
                <TransformComponent
                  wrapperStyle={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                >
                  <Svg width={MAP_WIDTH} height={MAP_HEIGHT}>
                    {range(1, GRID_NUM_WIDTH - 1).map((index) => (
                      <Line
                        key={index}
                        sx={index * (MAP_WIDTH / GRID_NUM_WIDTH)}
                        sy={0}
                        ex={index * (MAP_WIDTH / GRID_NUM_WIDTH)}
                        ey={MAP_HEIGHT}
                        stroke="#FAFAFA"
                        strokeWidth={0.7}
                        fill="#ffffff"
                        opacity={0.2}
                      />
                    ))}
                    {range(1, GRID_NUM_HEIGHT - 1).map((index) => (
                      <Line
                        key={index + 100}
                        sx={0}
                        sy={index * (MAP_HEIGHT / GRID_NUM_HEIGHT)}
                        ex={MAP_WIDTH}
                        ey={index * (MAP_HEIGHT / GRID_NUM_HEIGHT)}
                        stroke="#FAFAFA"
                        strokeWidth={0.7}
                        fill="#ffffff"
                        opacity={0.2}
                      />
                    ))}

                    {stars
                      .filter(({ plt_type }) => plt_type === 0)
                      .map(
                        ({
                          plt_name,
                          plt_status,
                          plt_id,
                          plt_x,
                          plt_y,
                          ss_id,
                        }) => (
                          <Planet
                            key={plt_id}
                            plt_name={plt_name}
                            plt_status={plt_status}
                            plt_x={plt_x}
                            plt_y={plt_y}
                            source={source}
                            sourceType={sourceType}
                          />
                        )
                      )}

                    {destinations.map(({ ast_id, ast_name, ast_x, ast_y }) => (
                      <Asteroid
                        key={ast_id}
                        id={ast_id}
                        name={ast_name}
                        source={source}
                        sourceType={sourceType}
                        x={ast_x + dx}
                        y={ast_y + dy}
                        stake={stake}
                      />
                    ))}
                  </Svg>
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </Grid>
        <Grid item xs={12} container alignItems={"center"}>
          <Typography color="textPrimary">
            Fuel Price: {fuelPrice} BYG per day
          </Typography>
        </Grid>
        <Grid item xs={12} container alignItems={"center"}>
          <div style={{ flexGrow: 1 }}>
            {pendingMsg ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                <CircularProgress size={15} style={{ marginRight: 5 }} />
                <Typography className={classes.text}>{pendingMsg}</Typography>
              </div>
            ) : null}
          </div>
        </Grid>
      </Grid>
    );
  }
  return (
    <Modal
      style={{ userSelect: "none" }}
      isOpen={modalOpen}
      onDismiss={() => setModalOpen(false)}
      minHeight={null}
      maxHeight={800}
    >
      {getModalContent()}
    </Modal>
  );
};

export default AsteroidMap;
