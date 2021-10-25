import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Hidden,
  Grid,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import BackArrow from "../../../components/BackArrow";
import ModelScene from "../ModelScene";
import MapModal from "../PlanetMap/MapModal";
import axios from "axios";
import {
  useActiveWeb3React,
  useContract,
  useTokenContract,
} from "../../../../hooks/useUtils";
import {
  ASTEROID_POOL_ADDRESS,
  FLIGHT_POOL_ADDRESS,
  SPACESHIP,
  SHIP_FIXED_MARKET,
  REPAIR_POOL_ADDRESS,
  BYG_ADDRESS,
} from "../../../constants";
import FLIGHT_POOL_ABI from "../../../constants/abis/FlightPool.json";
import ASTEROID_POOL_ABI from "../../../constants/abis/AsteroidPool.json";
import SHIP_ABI from "../../../constants/abis/spaceship.json";
import { BigNumber } from "@ethersproject/bignumber";
import { formatUnits, parseUnits } from "@ethersproject/units";
import FIXED_MARKET_ABI from "../../../constants/abis/FixedMarket721.json";
import FixedMarket721Control from "../../../components/market/FixedMarket721Control";
import OutlinedWhiteButton from "../../../components/buttons/OutlinedWhiteButton";
import { getTxErrorMsg } from "../../../utils";
import {
  useShowErrorMsg,
  useShowSuccessMsg,
} from "../../../contexts/Application";
import REPAIR_POOL_ABI from "../../../constants/abis/RepairPool.json";
import RepairControl from "../RepairControl";
import RepairStatus from "../RepairStatus";
import BlackButton from "../../../components/buttons/BlackButton";
import AsteroidMap from "../AsteroidMap";
import ERC20_ABI from "../../../constants/abis/erc20.json";
import { ethers, utils } from "ethers";
import { openInNewTab } from "../../../utils";
import RenameControl from "../RenameControl";
import HelpTooltip from "../../../components/HelpTooltip";
import axiosInstance from "../../../services/AuthApi";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    minHeight: "90vh",
    zIndex: 2,
  },
  name: {
    fontWeight: "bold",
    fontSize: 28,
    [theme.breakpoints.down("xs")]: {
      fontSize: 24,
    },
  },
  text: {
    fontSize: 16,
    [theme.breakpoints.down("xs")]: {
      fontSize: 12,
    },
  },
  content: {
    width: 400,
    [theme.breakpoints.down("sm")]: {
      width: "94%",
      margin: "0 3%",
      justifyContent: "center",
    },
  },
  bottom: {
    marginTop: 80,
    marginLeft: "-4.55%",
    marginRight: "-4.55%",
    [theme.breakpoints.down("sm")]: {
      marginTop: 50,
      marginLeft: "0%",
      marginRight: "0%",
    },
    [theme.breakpoints.down("xs")]: {
      marginTop: 20,
    },
  },
  panel: {
    width: "100%",
    background: "rgba(30, 30, 30, 0.1)",
    backdropFilter: "blur(4px)",
    boxShadow:
      "inset 54.3333px -54.3333px 54.3333px rgba(23, 23, 23, 0.1), inset -54.3333px 54.3333px 54.3333px rgba(255, 255, 255, 0.1)",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: "20px 10px",
  },
  textProp: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
  },
  textVal: {
    fontSize: 20,
    fontWeight: 300,
    [theme.breakpoints.down("sm")]: {
      fontSize: 16,
    },
  },
  navpanel: {
    backgroundColor: "#5A5A5A",
    textAlign: "center",
    color: "white",
    padding: "12px 0",
  },
  detail: {
    backgroundColor: "white",
    zIndex: -1,
    padding: "50px 0",
    minHeight: 200,
    [theme.breakpoints.down("xs")]: {
      padding: "40px 0 40px 0",
    },
    marginBottom: -80,
  },
  detailText: {
    fontSize: 16,
    color: "#000000",
    paddingTop: 1,
    [theme.breakpoints.down("xs")]: {
      fontSize: 12,
    },
  },
  detailLabel: {
    fontSize: 20,
    color: "#000000",
    fontWeight: "bold",
    [theme.breakpoints.down("xs")]: {
      fontSize: 12,
    },
  },
  locImg: {
    maxWidth: 250,
    [theme.breakpoints.down("xs")]: {
      maxWidth: 150,
    },
  },
  tripbtn: {
    marginTop: 30,
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      marginTop: -45,
    },
    [theme.breakpoints.down("xs")]: {
      marginTop: 0,
    },
  },
  navTxt: {
    fontSize: 20,
    width: "100%",
    fontWeight: "bold",
  },
  model: {
    [theme.breakpoints.up("md")]: {
      margin: "-100px 0",
    },
    [theme.breakpoints.down("sm")]: {
      height: 500,
    },
    [theme.breakpoints.down("xs")]: {
      height: 400,
    },
  },
}));

const HunterShip = ({ data, currentLoc, toggle, setToggle }) => {
  const { account, chainId, library } = useActiveWeb3React();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down("sm"));
  const xsDown = useMediaQuery(theme.breakpoints.down("xs"));
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);
  const [isholder, setIsholder] = useState(false);
  const [flight, setFlight] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [targetName, setTargetName] = useState(null);
  const [onSale, setOnSale] = useState(false);
  const [price, setPrice] = useState(null);
  const marketContract = useContract(
    SHIP_FIXED_MARKET[chainId],
    FIXED_MARKET_ABI
  );
  const flightContract = useContract(
    FLIGHT_POOL_ADDRESS[chainId],
    FLIGHT_POOL_ABI
  );
  const shipContract = useContract(SPACESHIP[chainId], SHIP_ABI);
  const repairContract = useContract(
    REPAIR_POOL_ADDRESS[chainId],
    REPAIR_POOL_ABI
  );
  const asteroidContract = useContract(
    ASTEROID_POOL_ADDRESS[chainId],
    ASTEROID_POOL_ABI
  );
  const BYGContract = useTokenContract(BYG_ADDRESS[chainId]);
  const [toId, setToId] = useState();
  const [endTimestamp, setEndTimestamp] = useState();
  const [leftTime, setLeftTime] = useState("0:00:00");
  const [pendingMsg, setPendingMsg] = useState(null);
  const showErrorMsg = useShowErrorMsg();
  const showSuccessMsg = useShowSuccessMsg();
  const [onRepair, setOnRepair] = useState(false);
  const [hasRepair, setHasRepair] = useState(false);
  const [onDmg, setOnDmg] = useState(null);
  const [tar, setTar] = useState(null);
  const [flightType, setFlightType] = useState(null);
  const [onHunt, setOnHunt] = useState(false);
  const [astModalOpen, setAstModaOpen] = useState(false);
  const [discovered, setDiscovered] = useState(false);
  const [discoverPending, setDiscoverPending] = useState(false);
  const [huntPending, setHuntPending] = useState(false);
  const [astResource, setAstResource] = useState(null);
  const [mining, setMining] = useState(false);
  const [claimableAmount, setClaimableAmount] = useState(0);
  const [claimPending, setClaimPending] = useState(false);
  const [update, setUpdate] = useState(false);
  const [cancelPending, setCancelPending] = useState(false);

  useEffect(() => {
    var timer;
    if (flight) {
      timer = setInterval(() => {
        var sec = "00";
        var min = "00";
        var hour = "00";
        var day;
        const nowtimestamp = parseInt(new Date().getTime() / 1000);
        if (endTimestamp - nowtimestamp >= 0) {
          sec = ("00" + (((endTimestamp - nowtimestamp) % 3600) % 60)).slice(
            -2
          );
          min = (
            "00" +
            (((endTimestamp - nowtimestamp - sec) / 60) % 60)
          ).slice(-2);
          hour = (
            "00" +
            (((endTimestamp - nowtimestamp - sec - min * 60) / 3600) % 24)
          ).slice(-2);
          day =
            (endTimestamp - nowtimestamp - sec - min * 60 - hour * 3600) /
            3600 /
            24;
          setLeftTime(day + ":" + hour + ":" + min);
          setArrived(false);
        } else {
          setArrived(true);
          setLeftTime("0:00:00");
        }
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    } else {
      timer && clearTimeout(timer);
    }
  }, [endTimestamp, flight, setArrived]);

  useEffect(() => {
    let isSubscribed = true;
    if (flightType === 0) {
      axios
        .get(`${process.env.REACT_APP_API_PATH}/v1/planet/${toId}`)
        .then((res) => {
          if (isSubscribed) {
            setTargetName(res.data?.planet.plt_name);
          }
        })
        .catch((e) => {
          if (isSubscribed) {
            setTargetName(null);
          }
        });
    } else if (flightType === 1) {
      axios
        .get(`${process.env.REACT_APP_API_PATH}/v1/asteroids/${toId}`)
        .then((res) => {
          if (isSubscribed) {
            setTargetName(res.data?.asteroids[0]?.ast_name);
          }
        })
        .catch((e) => {
          if (isSubscribed) {
            setTargetName(null);
          }
        });
    }

    return () => (isSubscribed = false);
  }, [toId, flightType, setTargetName]);

  const handleDiscover = () => {
    setModalOpen(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let isSubscribed = true;
    async function getStakedStatus() {
      try {
        if (onSale) {
          const price = await marketContract.pricesOfNft(data.nft_id);
          setPrice(formatUnits(price));
        }
        const owner = await shipContract.ownerOf(data.nft_id);
        if (isSubscribed) {
          setOnSale(SHIP_FIXED_MARKET[chainId] === owner);
        }
        const flightStatus = await flightContract.shipsInFlight(data.nft_id);
        const seller = await marketContract.sellersOfNft(data.nft_id);
        const repairInfo = await repairContract.shipInfos(data.nft_id);
        const shipsInfo = await asteroidContract.ships(data.nft_id);
        if (isSubscribed) {
          setIsholder(
            owner === account ||
              flightStatus.owner === account ||
              seller === account ||
              repairInfo.owner === account ||
              shipsInfo.owner === account
          );
        }
        if (isSubscribed) {
          setOnHunt(shipsInfo.owner === account);
        }
        if (isSubscribed) {
          setFlight(flightStatus.owner === account);
        }
        if (isSubscribed) {
          setFlightType(BigNumber.from(flightStatus.targetType).toNumber());
        }
        if (isSubscribed) {
          setOnRepair(repairInfo.owner === account);
        }
        if (isSubscribed) {
          setEndTimestamp(
            BigNumber.from(flightStatus.start).toNumber() +
              BigNumber.from(flightStatus.lengthInDays)
                .mul(24 * 3600)
                .toNumber()
          );
        }
        if (isSubscribed) {
          setToId(BigNumber.from(flightStatus.to).toNumber());
        }
        if (currentLoc && currentLoc.plt_id) {
          const repairalbe = await repairContract.repairabilityOfPlanets(
            parseInt(currentLoc.plt_id) - 1
          );
          if (isSubscribed) {
            setHasRepair(repairalbe);
          }
        }
        if (currentLoc && currentLoc.ast_id) {
          const res = await asteroidContract.discovered(currentLoc.ast_id);
          if (isSubscribed) {
            setDiscovered(res);
          }
          const minStatus = await asteroidContract.mining(currentLoc.ast_id);
          if (isSubscribed) {
            setMining(minStatus);
          }
        }
      } catch (e) {
        if (isSubscribed) {
          setIsholder(false);
        }
      }
    }
    getStakedStatus();

    return () => (isSubscribed = false);
  }, [
    shipContract,
    asteroidContract,
    chainId,
    data.nft_id,
    account,
    flight,
    flightContract,
    onSale,
    marketContract,
    currentLoc,
    repairContract,
    hasRepair,
  ]);

  useEffect(() => {
    let isSubscribed = true;
    if (discovered) {
      async function getRscOfAst() {
        try {
          const info = await asteroidContract.infoOfAsteroid(currentLoc.ast_id);
          if (
            info.rewardAddress !== "0x0000000000000000000000000000000000000000"
          ) {
            const token = new ethers.Contract(
              info.rewardAddress,
              ERC20_ABI,
              library
            );
            const symbol = await token.symbol();
            if (isSubscribed) {
              setAstResource({
                period: BigNumber.from(info.period).toNumber(),
                symbol: symbol,
                amount: formatUnits(info.rewardAmount),
              });
            }
          }
        } catch (e) {
          console.log(e);
        }
      }
      getRscOfAst();
    }
    if (onHunt) {
      async function getReward() {
        try {
          const info = await asteroidContract.getRewardOf(data.nft_id);
          if (isSubscribed) {
            setClaimableAmount(formatUnits(info.rewardAmount));
          }
        } catch (e) {
          console.log(e);
        }
      }
      getReward();
    }
    return () => (isSubscribed = false);
  }, [discovered, asteroidContract, currentLoc, library, onHunt, data, update]);

  useEffect(() => {
    let isSubscribed = true;
    var timer;
    if (onRepair) {
      async function update() {
        try {
          const dmg = await repairContract.getDmgPercent(data.nft_id);
          if (isSubscribed) {
            setOnDmg(BigNumber.from(dmg).toNumber());
          }
        } catch {}
      }
      async function getTarget() {
        try {
          const info = await repairContract.shipInfos(data.nft_id);
          if (isSubscribed) {
            setTar(BigNumber.from(info.targetDamage).toNumber());
          }
        } catch {}
      }
      timer = setInterval(() => {
        update();
      }, 60000);
      getTarget();
      update();
      return () => {
        clearTimeout(timer);
      };
    } else {
      timer && clearTimeout(timer);
    }
    return () => (isSubscribed = false);
  }, [onRepair, data.nft_id, repairContract]);

  const unStake = async () => {
    if (!pendingMsg) {
      try {
        setPendingMsg("Ending");
        const flightStatus = await flightContract.shipsInFlight(data.nft_id);
        const completed = await flightContract.flightStatus(data.nft_id);
        const params = {
          tokenId: Number(data.nft_id),
          toId: BigNumber.from(flightStatus.to).toNumber(),
          targetType: BigNumber.from(flightStatus.targetType).toNumber(),
          lengthInDays: BigNumber.from(flightStatus.lengthInDays).toNumber(),
          completed: completed,
        };
        await axiosInstance.post(`/v1/end-flight`, null, { params });
        const unstakeTx = await flightContract.unStake(data.nft_id);
        const receipt = await unstakeTx.wait(1);
        if (receipt?.status === 1) {
          showSuccessMsg("Success");
          setFlight(false);
        } else {
          showErrorMsg("Failed");
        }
        setPendingMsg(null);
        setModalOpen(false);
        setToggle(!toggle);
      } catch (e) {
        setPendingMsg(null);
        showErrorMsg(getTxErrorMsg(e));
      }
    }
  };

  const handleBuyPermit = async () => {
    if (!discoverPending) {
      try {
        setDiscoverPending(true);
        const charge = await asteroidContract.discoveryCharge();
        const allowances = await BYGContract.allowance(
          account,
          ASTEROID_POOL_ADDRESS[chainId]
        );
        if (
          parseFloat(formatUnits(allowances)) < parseFloat(formatUnits(charge))
        ) {
          const approveTx = await BYGContract.approve(
            ASTEROID_POOL_ADDRESS[chainId],
            parseUnits("10000")
          );
          const receipta = await approveTx.wait(1);
          if (receipta?.status === 1) {
            showSuccessMsg("Approval success");
          } else {
            showErrorMsg("Approval failed");
          }
        }
        const tx = await asteroidContract.discover(currentLoc.ast_id);
        const receipt = await tx.wait(1);
        if (receipt?.status === 1) {
          showSuccessMsg("Success");
          setDiscovered(true);
        } else {
          showErrorMsg("Failed");
        }
        setDiscoverPending(false);
      } catch (e) {
        setDiscoverPending(false);
        showErrorMsg(getTxErrorMsg(e));
      }
    }
  };

  const handleHunt = async () => {
    if (!huntPending && !mining) {
      try {
        setHuntPending(true);
        const astId = BigNumber.from(currentLoc.ast_id);
        const code = BigNumber.from(currentLoc.code);
        const two = BigNumber.from(2);
        const transferTx = await shipContract[
          "safeTransferFrom(address,address,uint256,bytes)"
        ](
          account,
          ASTEROID_POOL_ADDRESS[chainId],
          data.nft_id,
          utils.hexZeroPad(utils.hexlify(astId.mul(two.pow(128)).add(code)), 32)
        );
        const receipt = await transferTx.wait(1);
        if (receipt?.status === 1) {
          showSuccessMsg("Success");
          setOnHunt(true);
        } else {
          showErrorMsg("Failed");
        }
        setHuntPending(false);
      } catch (e) {
        setHuntPending(false);
        showErrorMsg(getTxErrorMsg(e));
      }
    }
  };

  const handleClaim = async () => {
    if (!claimPending) {
      try {
        setClaimPending(true);
        const tx = await asteroidContract.claimRewardOf(data.nft_id);
        const receipt = await tx.wait(1);
        if (receipt?.status === 1) {
          showSuccessMsg("Success");
        } else {
          showErrorMsg("Failed");
        }
        setClaimPending(false);
        setUpdate(!update);
      } catch (e) {
        setClaimPending(false);
        showErrorMsg(getTxErrorMsg(e));
      }
    }
  };

  const handleCancelHunt = async () => {
    if (!cancelPending) {
      try {
        setCancelPending(true);
        const tx = await asteroidContract.unstakeNft(data.nft_id);
        const receipt = await tx.wait(1);
        if (receipt?.status === 1) {
          showSuccessMsg("Success");
          setOnHunt(false);
          setMining(false);
        } else {
          showErrorMsg("Failed");
        }
        setCancelPending(false);
      } catch (e) {
        setCancelPending(false);
        showErrorMsg(getTxErrorMsg(e));
      }
    }
  };

  return (
    <Box className={classes.root}>
      <Grid container justify="center">
        <Grid item xs={11} sm={11} md={12} container justify="center">
          <Grid item sm={12} md={3} container spacing={smDown ? 2 : 1}>
            <Hidden smDown>
              <Grid item xs={12}>
                <BackArrow />
              </Grid>
            </Hidden>
            <Grid item xs={12} container spacing={smDown ? 2 : 5}>
              <Grid item xs={12}>
                <Typography color="textPrimary" className={classes.name}>
                  {data?.ssh_name}
                </Typography>
              </Grid>
            </Grid>
            <Hidden mdUp>
              <Grid item xs={12} className={classes.model}>
                <ModelScene src={data.sshm_3dmodel} />
              </Grid>
            </Hidden>
            <Grid item xs={12} container spacing={2}>
              <Hidden xsDown>
                <Grid item xs={12}>
                  <Typography
                    color="textPrimary"
                    className={classes.text}
                    style={{ maxWidth: 400 }}
                  >
                    Current Location:
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  className={classes.locImg}
                  container
                  justify={"center"}
                >
                  <img
                    src={currentLoc.image}
                    alt="location"
                    className={classes.locImg}
                    onClick={() =>
                      currentLoc.ast_id !== null
                        ? openInNewTab(`/asteroid/${currentLoc.ast_id}`)
                        : openInNewTab(`/planet/${currentLoc.plt_id}`)
                    }
                  />
                  <Typography
                    color="textPrimary"
                    className={classes.text}
                    style={{ fontWeight: 600 }}
                  >
                    {currentLoc.name}
                  </Typography>
                </Grid>
                {onSale && (
                  <Grid item xs={12} container alignItems={"center"}>
                    <Typography color="textPrimary" className={classes.text}>
                      Price:&nbsp;
                    </Typography>
                    <Typography color="textPrimary" className={classes.text}>
                      {price} BYG
                    </Typography>
                  </Grid>
                )}
              </Hidden>
              <Grid
                item
                xs={12}
                container
                spacing={2}
                justify={smDown ? "center" : "flex-start"}
                className={classes.tripbtn}
                alignItems={"center"}
              >
                <Grid item>
                  {!onRepair && !onHunt && (
                    <FixedMarket721Control
                      onSale={onSale}
                      isholder={isholder}
                      staked={flight}
                      setOnSale={setOnSale}
                      price={price}
                      nftId={data.nft_id}
                      nftContract={shipContract}
                      marketContract={marketContract}
                      marketAddress={SHIP_FIXED_MARKET[chainId]}
                      damage={data.ssh_damage_percent}
                    />
                  )}
                </Grid>
                <Grid item>
                  {isholder && !onSale && !onRepair && !onHunt ? (
                    flight ? (
                      <>
                        <Typography color="textPrimary">
                          Flying to {targetName}
                        </Typography>
                        <Typography color="textPrimary">
                          {leftTime.split(":")[0]} Days {leftTime.split(":")[1]}{" "}
                          Hours {leftTime.split(":")[2]} Mins Left
                        </Typography>
                        <OutlinedWhiteButton onClick={unStake}>
                          {pendingMsg && (
                            <>
                              <CircularProgress size={15} />
                              &nbsp;
                            </>
                          )}
                          {arrived ? "End flight" : "Cancel flight"}
                        </OutlinedWhiteButton>
                      </>
                    ) : (
                      <OutlinedWhiteButton onClick={handleDiscover}>
                        Start a flight
                      </OutlinedWhiteButton>
                    )
                  ) : null}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Hidden smDown>
            <Grid item md={9} className={classes.model}>
              <ModelScene src={data.sshm_3dmodel} />
            </Grid>
          </Hidden>
        </Grid>
      </Grid>
      <div className={classes.bottom}>
        <Hidden xsDown>
          <Box className={classes.panel}>
            <Grid
              container
              direction={"column"}
              alignItems={"center"}
              spacing={2}
            >
              <Grid item>
                <Typography color="textPrimary" className={classes.textProp}>
                  type
                </Typography>
              </Grid>
              <Grid item>
                <Typography color="textPrimary" className={classes.textVal}>
                  {data?.sshm_type}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container
              direction={"column"}
              alignItems={"center"}
              spacing={2}
            >
              <Grid item>
                <Typography color="textPrimary" className={classes.textProp}>
                  class
                </Typography>
              </Grid>
              <Grid item>
                <Typography color="textPrimary" className={classes.textVal}>
                  {data?.sshm_class}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container
              direction={"column"}
              alignItems={"center"}
              spacing={2}
            >
              <Grid item>
                <Typography color="textPrimary" className={classes.textProp}>
                  max. flight range
                </Typography>
              </Grid>
              <Grid item>
                <Typography color="textPrimary" className={classes.textVal}>
                  {data?.sshm_flight_range} pc
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container
              direction={"column"}
              alignItems={"center"}
              spacing={2}
            >
              <Grid item>
                <Typography color="textPrimary" className={classes.textProp}>
                  Damage
                </Typography>
              </Grid>
              <Grid item>
                <Typography color="textPrimary" className={classes.textVal}>
                  {onDmg === null ? data.ssh_damage_percent : onDmg} %
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Hidden>
        <Hidden smUp>
          <Box className={classes.navpanel}>
            <Typography className={classes.navTxt}>OVERVIEW</Typography>
          </Box>
        </Hidden>

        <Box className={classes.detail}>
          <Grid container justify="center">
            <Grid item xs={11} container spacing={xsDown ? 3 : 8}>
              <Hidden smUp>
                <Grid item container alignItems={"center"}>
                  <Typography className={classes.detailLabel}>
                    Type&nbsp;
                  </Typography>
                  <Typography className={classes.detailText}>
                    {data?.sshm_type}
                  </Typography>
                </Grid>
                <Grid item container alignItems={"center"}>
                  <Typography className={classes.detailLabel}>
                    Class&nbsp;
                  </Typography>
                  <Typography className={classes.detailText}>
                    {data?.sshm_class}
                  </Typography>
                </Grid>
                <Grid item container alignItems={"center"}>
                  <Typography className={classes.detailLabel}>
                    Max. flight range&nbsp;
                  </Typography>
                  <Typography className={classes.detailText}>
                    {data?.sshm_flight_range} pc
                  </Typography>
                </Grid>
                <Grid item container alignItems={"center"}>
                  <Typography className={classes.detailLabel}>
                    Damage&nbsp;
                  </Typography>
                  <Typography className={classes.detailText}>
                    {onDmg === null ? data.ssh_damage_percent : onDmg} %
                  </Typography>
                </Grid>
                {onSale && (
                  <Grid item container alignItems={"center"}>
                    <Typography className={classes.detailLabel}>
                      Price:&nbsp;
                    </Typography>
                    <Typography className={classes.detailText}>
                      {price} BYG
                    </Typography>
                  </Grid>
                )}
                <Grid item container alignItems={"center"}>
                  <Typography className={classes.detailLabel}>
                    Current location&nbsp;
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  className={classes.locImg}
                  container
                  justify={"center"}
                >
                  <img
                    src={currentLoc.image}
                    alt="location"
                    className={classes.locImg}
                  />
                  <Typography
                    color="textPrimary"
                    className={classes.detailText}
                    style={{ fontWeight: 500 }}
                  >
                    {currentLoc.name}
                  </Typography>
                </Grid>
              </Hidden>
              <Grid item xs={12} container spacing={3}>
                <Grid item xs={12}>
                  <Typography className={classes.detailLabel}>
                    Specifications:
                  </Typography>
                </Grid>
                <Grid item xs={12} style={{ maxWidth: 700 }}>
                  <Typography className={classes.detailText}>
                    {data?.sshm_specification}
                  </Typography>
                </Grid>
              </Grid>

              <Grid
                item
                xs={12}
                spacing={2}
                container
                alignItems={"center"}
                style={{ marginTop: 20 }}
              >
                <Grid item xs={12}>
                  {Number(data.ssh_damage_percent) >= 70 && isholder && (
                    <Typography
                      className={classes.detailText}
                      style={{ color: "red" }}
                    >
                      Your spaceship has critical damage level, please repair it
                      first
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  {isholder && !onSale && !onRepair && !flight && !onHunt && (
                    <BlackButton
                      onClick={() => setAstModaOpen(true)}
                      disabled={Number(data.ssh_damage_percent) >= 70}
                    >
                      Asteroids Radar
                    </BlackButton>
                  )}
                </Grid>
                <Grid item xs={12}>
                  {isholder &&
                    !onSale &&
                    !onRepair &&
                    !flight &&
                    !onHunt &&
                    !discovered &&
                    currentLoc.ast_id !== null && (
                      <BlackButton onClick={handleBuyPermit}>
                        {discoverPending && (
                          <>
                            <CircularProgress size={15} />
                            &nbsp;
                          </>
                        )}
                        Buy mining permit
                      </BlackButton>
                    )}
                </Grid>
                {astResource !== null && (
                  <>
                    <Grid item xs={12}>
                      <Typography className={classes.detailLabel}>
                        Resource of asteroid:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} style={{ maxWidth: 700 }}>
                      <Typography className={classes.detailText}>
                        {astResource.amount} {astResource.symbol}
                      </Typography>
                      <Typography className={classes.detailText}>
                        {astResource.period} Days
                      </Typography>
                    </Grid>
                  </>
                )}
                <Grid item xs={12}>
                  {isholder &&
                    !onSale &&
                    !onRepair &&
                    !flight &&
                    !onHunt &&
                    discovered &&
                    currentLoc.ast_id !== null &&
                    !mining && (
                      <BlackButton
                        onClick={handleHunt}
                        disabled={Number(data.ssh_damage_percent) >= 70}
                      >
                        {huntPending && (
                          <>
                            <CircularProgress size={15} />
                            &nbsp;
                          </>
                        )}
                        Mine resources
                      </BlackButton>
                    )}
                  {isholder &&
                    !onSale &&
                    !onRepair &&
                    !flight &&
                    !onHunt &&
                    discovered &&
                    currentLoc.ast_id !== null &&
                    mining && (
                      <Typography className={classes.detailText}>
                        This asteroid is in mining by someone
                      </Typography>
                    )}
                </Grid>
                {isholder && !onSale && !onRepair && !flight && onHunt && (
                  <>
                    <Grid item xs={12}>
                      <Typography className={classes.detailLabel}>
                        Claimable amount:
                        <HelpTooltip
                          title={
                            "Claimable amount will apear in 24h after mining start"
                          }
                        />
                      </Typography>
                    </Grid>
                    <Grid item xs={12} style={{ maxWidth: 700 }}>
                      <Typography className={classes.detailText}>
                        {claimableAmount} {astResource?.symbol}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <BlackButton onClick={handleClaim}>
                        {claimPending && (
                          <>
                            <CircularProgress size={15} />
                            &nbsp;
                          </>
                        )}
                        Claim
                      </BlackButton>
                      <BlackButton
                        onClick={handleCancelHunt}
                        style={{ marginLeft: 5 }}
                      >
                        {cancelPending && (
                          <>
                            <CircularProgress size={15} />
                            &nbsp;
                          </>
                        )}
                        Cancel
                      </BlackButton>
                    </Grid>
                  </>
                )}
                <Grid item xs={12}>
                  {isholder && !flight && !onSale && onRepair && (
                    <div style={{ width: "300px" }}>
                      <RepairStatus
                        img={data.sshm_image}
                        damage={onDmg}
                        target={tar}
                      />
                    </div>
                  )}
                  {isholder && !flight && !onSale && hasRepair && (
                    <RepairControl
                      currentPlanet={parseInt(currentLoc.plt_id) - 1}
                      currentDamage={data?.ssh_damage_percent}
                      shipContract={shipContract}
                      quoteContract={BYGContract}
                      repairContract={repairContract}
                      repairAddress={REPAIR_POOL_ADDRESS[chainId]}
                      onRepair={onRepair}
                      setOnRepair={setOnRepair}
                      account={account}
                      nftId={data.nft_id}
                      toggle={toggle}
                      setToggle={setToggle}
                    />
                  )}
                </Grid>
                <Grid item xs={12}>
                  {isholder && !flight && !onSale && !onRepair && !onHunt && (
                    <RenameControl
                      nftId={data.nft_id}
                      shipContract={shipContract}
                      quoteContract={BYGContract}
                      account={account}
                      shipContractAddress={SPACESHIP[chainId]}
                      toggle={toggle}
                      setToggle={setToggle}
                    />
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </div>
      <MapModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        source={
          currentLoc.ast_id !== null ? currentLoc.ast_id : currentLoc.plt_id
        }
        sourceType={currentLoc.ast_id !== null ? 1 : 0}
        spaceship={data.ssh_id}
        nftId={data.nft_id}
        isholder={isholder}
        staked={flight}
        setStaked={setFlight}
        stakingContract={flightContract}
        shipContract={shipContract}
        pendingMsg={pendingMsg}
        setPendingMsg={setPendingMsg}
        damage={data?.ssh_damage_percent}
      />
      <AsteroidMap
        modalOpen={astModalOpen}
        setModalOpen={setAstModaOpen}
        source={
          currentLoc.ast_id !== null ? currentLoc.ast_id : currentLoc.plt_id
        }
        sourceType={currentLoc.ast_id !== null ? 1 : 0}
        spaceship={data.ssh_id}
        nftId={data.nft_id}
        setStaked={setFlight}
        pendingMsg={pendingMsg}
        setPendingMsg={setPendingMsg}
        damage={data?.ssh_damage_percent}
        shipContract={shipContract}
        stakingContract={flightContract}
      />
    </Box>
  );
};

export default HunterShip;
