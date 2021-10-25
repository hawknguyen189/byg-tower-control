import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Hidden,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Button,
  CircularProgress,
} from "@material-ui/core";
import BackLink from "../../components/BackLink";
import PinkButton from "../../components/buttons/PinkButton";
// import Logo from '../../assets/images/logo.png'
import Planet from "../market/PlanetMarket/Planet";
import Spaceship from "../market/ShipMarket/Spaceship";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
// import {useHistory} from "react-router-dom";
// import { useTotalSupply } from '../../contexts/Token'
import { useTokenBalance, Updater as TokenUpdater } from "../../contexts/Token";
import {
  useMyAlliances,
  useMyAlliancesOnSale,
  Updater as AllianceUpdater,
  useAllianceLoading,
  useAllianceProdLoading,
} from "../../contexts/Alliance";
import {
  useMyPlanets,
  useMyPlanetsOnSale,
  Updater as PlanetUpdater,
  usePlanetLoading,
  usePlanetProdLoading,
} from "../../contexts/PlanetList";
import {
  useMyShips,
  useMyShipsOnSale,
  Updater as SpaceshipUpdater,
  useSpaceshipLoading,
  useSpaceshipProdLoading,
} from "../../contexts/Spaceship";
import { useActiveWeb3React, useContract } from "../../hooks";
import {
  useWalletModalToggle,
  useShowErrorMsg,
  useShowSuccessMsg,
} from "../../contexts/Application";
import { beautifyNumber } from "../../utils";
import AllianceCard from "./Alliance";
import { REPAIR_POOL_ADDRESS } from "../../constants";
import REPAIR_POOL_ABI from "../../constants/abis/RepairPool.json";
import { formatUnits } from "@ethersproject/units";
import { getTxErrorMsg } from "../../utils";
import NftLoading from "../../components/NftLoading";
import PinkOutlineButton from "../../components/buttons/PinkOutlineButton";
const Reputation = React.lazy(() => import("./reputation"));

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    minHeight: "71vh",
    margin: "0 10px",
  },
  content: {
    marginTop: 20,
  },
  box: {
    background: "#0C0C0C",
    borderRadius: 5,
    padding: "20px 20px",
    minHeight: 240,
    maxWidth: 650,
    [theme.breakpoints.down("xs")]: {
      minHeight: 0,
    },
  },
  font20: {
    fontSize: 24,
    fontWeight: 600,
    color: "#FAFAFA",
    [theme.breakpoints.down("xs")]: {
      fontSize: 18,
      fontWeight: 400,
    },
  },
  font16: {
    fontSize: 16,
    color: "#6968A6",
    [theme.breakpoints.down("xs")]: {
      fontSize: 12,
    },
  },
  font24: {
    fontSize: 24,
    fontWeight: 600,
    color: "#FAFAFA",
    [theme.breakpoints.down("xs")]: {
      fontSize: 16,
      fontWeight: 400,
    },
  },
  font28: {
    fontSize: 28,
    fontWeight: 600,
    color: "#FAFAFA",
    flexGrow: 1,
    textAlign: "center",
    [theme.breakpoints.down("xs")]: {
      fontSize: 18,
      fontWeight: 400,
    },
  },
  harvestVal: {
    fontWeight: 500,
    fontSize: 40,
    color: "#FAFAFA",
    [theme.breakpoints.down("xs")]: {
      fontSize: 20,
      fontWeight: 300,
    },
  },
  btn: {
    minWidth: 200,
    textTransform: "none",
    [theme.breakpoints.down("xs")]: {
      minWidth: 100,
    },
  },
  bar: {
    background: "#0C0C0C",
    borderRadius: 5,
    padding: 20,
  },
  assetTitle: {
    fontWeight: "bold",
    fontSize: 30,
    color: "#FAFAFA",
    mixBlendMode: "normal",
    opacity: 0.9,
    margin: "50px 0",
    [theme.breakpoints.down("xs")]: {
      fontSize: 19,
    },
  },
  carousel: {
    margin: "20px 0",
  },
  gap: {
    marginLeft: 20,
    [theme.breakpoints.down("xs")]: {
      marginLeft: 10,
    },
  },
}));

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1200 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 1200, min: 900 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 900, min: 600 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 600, min: 0 },
    items: 2,
  },
};
const MyAssets = () => {
  const allianceAssets = useMyAlliances();
  const toggleWalletModal = useWalletModalToggle();
  const { account, chainId } = useActiveWeb3React();
  const showErrorMsg = useShowErrorMsg();
  const showSuccessMsg = useShowSuccessMsg();
  const balance = useTokenBalance();
  const theme = useTheme();
  const xsDown = useMediaQuery(theme.breakpoints.down("xs"));
  const classes = useStyles();
  const planets = useMyPlanets();
  const planetsOnSale = useMyPlanetsOnSale();
  const ships = useMyShips();
  const shipsOnSale = useMyShipsOnSale();
  const alliancesOnSale = useMyAlliancesOnSale();
  const repairContract = useContract(
    REPAIR_POOL_ADDRESS[chainId],
    REPAIR_POOL_ABI
  );
  const [reward, setReward] = useState(0);
  const [pending, setPending] = useState(false);
  const [amount, setAmount] = useState(0);
  const [toggle, setToggle] = useState(false);
  const alLoading = useAllianceLoading();
  const alProdLoading = useAllianceProdLoading();
  const plLoading = usePlanetLoading();
  const plProdLoading = usePlanetProdLoading();
  const spLoading = useSpaceshipLoading();
  const spProdLoading = useSpaceshipProdLoading();
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    async function get() {
      try {
        const res = await repairContract.rewardsOf(account);
        setReward(formatUnits(res));
      } catch (e) {
        console.log(e);
      }
    }
    get();
    setAmount(balance);
  }, [repairContract, account, balance]);

  const handleClaim = async () => {
    try {
      if (!pending) {
        setPending(true);
        const tx = await repairContract.withDrawRewards();
        const receipt = await tx.wait(1);
        if (receipt?.status === 1) {
          showSuccessMsg("Success");
          setAmount(parseFloat(amount) + parseFloat(reward));
          setReward(0);
        } else {
          showErrorMsg("Failed");
        }
        setPending(false);
      }
    } catch (e) {
      showErrorMsg(getTxErrorMsg(e));
      setPending(false);
    }
  };

  return (
    <div className={classes.root}>
      <Hidden smDown>
        <BackLink />
      </Hidden>
      {account ? (
        <>
          <div style={{ marginTop: 40, marginBottom: 50 }}>
            {tabIndex === 0 ? (
              <PinkButton style={{ width: 160 }}>My Assets</PinkButton>
            ) : (
              <PinkOutlineButton
                style={{ width: 160 }}
                onClick={() => setTabIndex(0)}
              >
                My Assets
              </PinkOutlineButton>
            )}
            <span className={classes.gap}></span>
            {tabIndex === 1 ? (
              <PinkButton style={{ width: 160 }}>
                Reputation&#38;Powers
              </PinkButton>
            ) : (
              <PinkOutlineButton
                style={{ width: 160 }}
                onClick={() => setTabIndex(1)}
              >
                Reputation&#38;Powers
              </PinkOutlineButton>
            )}
          </div>
          {tabIndex === 0 ? (
            <>
              <Grid container spacing={2} className={classes.content}>
                <Grid item xs={12}>
                  <Box className={classes.bar}>
                    <Grid container alignItems={"center"}>
                      <Typography className={classes.font20}>
                        $BYG Balance:
                      </Typography>
                      <Typography className={classes.font28}>
                        {beautifyNumber(amount)}
                      </Typography>
                    </Grid>
                  </Box>
                </Grid>
                {reward > 0 && (
                  <Grid item xs={12}>
                    <Box className={classes.bar}>
                      <Grid container alignItems={"center"}>
                        <Typography className={classes.font20}>
                          $BYG Earnings From Repair Services:
                        </Typography>
                        <Typography className={classes.font28}>
                          {beautifyNumber(reward)}
                        </Typography>
                        <Button variant={"outlined"} onClick={handleClaim}>
                          {pending && (
                            <>
                              <CircularProgress size={15} />
                              &nbsp;
                            </>
                          )}
                          Claim
                        </Button>
                      </Grid>
                    </Box>
                  </Grid>
                )}
              </Grid>
              <Typography className={classes.assetTitle}>My Assets</Typography>
              {allianceAssets.length === 0 && alLoading && (
                <>
                  <Typography className={classes.font20}>
                    Alliance Cards:
                  </Typography>
                  <div className={classes.carousel}>
                    <Carousel
                      responsive={responsive}
                      // showDots={true}
                      dotListClass="custom-dot-list-style"
                      removeArrowOnDeviceType={["tablet", "mobile"]}
                    >
                      <NftLoading />
                      <NftLoading />
                    </Carousel>
                  </div>
                </>
              )}
              {allianceAssets && allianceAssets.length > 0 && (
                <>
                  <Typography className={classes.font20}>
                    Alliance Cards:
                  </Typography>
                  <div className={classes.carousel}>
                    <Carousel
                      responsive={responsive}
                      // showDots={true}
                      dotListClass="custom-dot-list-style"
                      removeArrowOnDeviceType={["tablet", "mobile"]}
                    >
                      {allianceAssets
                        .sort((a, b) => a.id - b.id)
                        .map((asset) => (
                          <AllianceCard
                            key={asset.id}
                            prodId={asset.id}
                            nftId={asset.id}
                            onSale={false}
                            amount={asset.balance}
                            name={asset.name}
                            image={asset.image}
                            animation={asset.animation}
                            onStaked={asset.staked}
                            toggle={toggle}
                            setToggle={setToggle}
                          />
                        ))}
                    </Carousel>
                  </div>
                </>
              )}
              {alliancesOnSale.length === 0 && alProdLoading && (
                <>
                  <Typography className={classes.font20}>
                    Alliance Cards On Sale:
                  </Typography>
                  <div className={classes.carousel}>
                    <Carousel
                      responsive={responsive}
                      // showDots={true}
                      dotListClass="custom-dot-list-style"
                      removeArrowOnDeviceType={["tablet", "mobile"]}
                    >
                      <NftLoading />
                      <NftLoading />
                    </Carousel>
                  </div>
                </>
              )}
              {alliancesOnSale && alliancesOnSale.length > 0 && (
                <>
                  <Typography className={classes.font20}>
                    Alliance Cards On Sale:
                  </Typography>
                  <div className={classes.carousel}>
                    <Carousel
                      responsive={responsive}
                      // showDots={true}
                      dotListClass="custom-dot-list-style"
                      removeArrowOnDeviceType={["tablet", "mobile"]}
                    >
                      {alliancesOnSale.map((prod) => (
                        <AllianceCard
                          key={prod.id}
                          prodId={prod.id}
                          nftId={prod.nftId}
                          onSale={true}
                          price={prod.price}
                          seller={prod.seller}
                          amount={prod.amount}
                          name={prod.name}
                          image={prod.image}
                          animation={prod.animation}
                          toggle={toggle}
                          setToggle={setToggle}
                        />
                      ))}
                    </Carousel>
                  </div>
                </>
              )}
              {planets.length === 0 && plLoading && (
                <>
                  <Typography
                    className={classes.font20}
                    style={{ paddingTop: 20 }}
                  >{`Planets:`}</Typography>
                  <div className={classes.carousel}>
                    <Carousel
                      responsive={responsive}
                      // showDots={true}
                      dotListClass="custom-dot-list-style"
                      removeArrowOnDeviceType={["tablet", "mobile"]}
                    >
                      <NftLoading />
                      <NftLoading />
                    </Carousel>
                  </div>
                </>
              )}
              {planets && planets.length > 0 && (
                <>
                  <Typography
                    className={classes.font20}
                    style={{ paddingTop: 20 }}
                  >{`Planets (${planets.length}) :`}</Typography>
                  <div className={classes.carousel}>
                    <Carousel
                      responsive={responsive}
                      // showDots={true}
                      dotListClass="custom-dot-list-style"
                      removeArrowOnDeviceType={["tablet", "mobile"]}
                    >
                      {planets
                        .sort((a, b) => a.id - b.id)
                        .map((planet) => (
                          <Planet
                            key={planet.id}
                            tokenId={planet.id}
                            uri={planet.uri}
                            name={planet.name}
                            cls={planet.class}
                            image={planet.image}
                          />
                        ))}
                    </Carousel>
                  </div>
                </>
              )}
              {planetsOnSale.length === 0 && plProdLoading && (
                <>
                  <Typography
                    className={classes.font20}
                    style={{ paddingTop: 20 }}
                  >{`Planets On Sale:`}</Typography>
                  <div className={classes.carousel}>
                    <Carousel
                      responsive={responsive}
                      // showDots={true}
                      dotListClass="custom-dot-list-style"
                      removeArrowOnDeviceType={["tablet", "mobile"]}
                    >
                      <NftLoading />
                      <NftLoading />
                    </Carousel>
                  </div>
                </>
              )}
              {planetsOnSale && planetsOnSale.length > 0 && (
                <>
                  <Typography
                    className={classes.font20}
                    style={{ paddingTop: 20 }}
                  >{`Planets On Sale (${planetsOnSale.length}) :`}</Typography>
                  <div className={classes.carousel}>
                    <Carousel
                      responsive={responsive}
                      // showDots={true}
                      dotListClass="custom-dot-list-style"
                      removeArrowOnDeviceType={["tablet", "mobile"]}
                    >
                      {planetsOnSale
                        .sort((a, b) => a.id - b.id)
                        .map((planet) => (
                          <Planet
                            key={planet.id}
                            tokenId={planet.id}
                            uri={planet.uri}
                            name={planet.name}
                            cls={planet.class}
                            image={planet.image}
                            price={planet.price}
                          />
                        ))}
                    </Carousel>
                  </div>
                </>
              )}
              {ships.length === 0 && spLoading && (
                <>
                  <Typography
                    className={classes.font20}
                    style={{ paddingTop: 20 }}
                  >{`Spaceships:`}</Typography>
                  <div className={classes.carousel}>
                    <Carousel
                      responsive={responsive}
                      // showDots={true}
                      dotListClass="custom-dot-list-style"
                      removeArrowOnDeviceType={["tablet", "mobile"]}
                    >
                      <NftLoading />
                      <NftLoading />
                    </Carousel>
                  </div>
                </>
              )}
              {ships.length > 0 && (
                <>
                  <Typography
                    className={classes.font20}
                    style={{ paddingTop: 20 }}
                  >{`Spaceships (${ships.length}) :`}</Typography>
                  <div className={classes.carousel}>
                    <Carousel
                      responsive={responsive}
                      // showDots={true}
                      dotListClass="custom-dot-list-style"
                      removeArrowOnDeviceType={["tablet", "mobile"]}
                    >
                      {ships
                        .sort((a, b) => a.id - b.id)
                        .map((ship) => (
                          <Spaceship
                            key={ship.id}
                            id={ship.id}
                            name={ship.name}
                            image={ship.image}
                            type={ship.type}
                            cls={ship.class}
                          />
                        ))}
                    </Carousel>
                  </div>
                </>
              )}
              {shipsOnSale.length === 0 && spProdLoading && (
                <>
                  <Typography
                    className={classes.font20}
                    style={{ paddingTop: 20 }}
                  >{`Spaceships On Sale:`}</Typography>
                  <div className={classes.carousel}>
                    <Carousel
                      responsive={responsive}
                      // showDots={true}
                      dotListClass="custom-dot-list-style"
                      removeArrowOnDeviceType={["tablet", "mobile"]}
                    >
                      <NftLoading />
                      <NftLoading />
                    </Carousel>
                  </div>
                </>
              )}
              {shipsOnSale.length > 0 && (
                <>
                  <Typography
                    className={classes.font20}
                    style={{ paddingTop: 20 }}
                  >{`Spaceships On Sale (${shipsOnSale.length}) :`}</Typography>
                  <div className={classes.carousel}>
                    <Carousel
                      responsive={responsive}
                      // showDots={true}
                      dotListClass="custom-dot-list-style"
                      removeArrowOnDeviceType={["tablet", "mobile"]}
                    >
                      {shipsOnSale
                        .sort((a, b) => a.id - b.id)
                        .map((ship) => (
                          <Spaceship
                            key={ship.id}
                            id={ship.id}
                            name={ship.name}
                            image={ship.image}
                            type={ship.type}
                            cls={ship.class}
                            price={ship.price}
                          />
                        ))}
                    </Carousel>
                  </div>
                </>
              )}
              <PlanetUpdater />
              <TokenUpdater />
              {toggle && <AllianceUpdater />}
              {!toggle && <AllianceUpdater />}
              <SpaceshipUpdater />
            </>
          ) : (
            <>
              <Reputation />
            </>
          )}
        </>
      ) : (
        <Grid
          container
          spacing={xsDown ? 2 : 10}
          className={classes.content}
          justify="center"
        >
          <Grid item>
            <PinkButton onClick={toggleWalletModal}>Connect Wallet</PinkButton>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default MyAssets;
