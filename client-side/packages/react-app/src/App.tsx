import React, { useState, useContext, useEffect } from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
// import { Web3Provider } from "@ethersproject/providers";
// import { ethers } from "ethers";
// import { Contract } from "@ethersproject/contracts";
import { Body, Header } from "./components/index.jsx";
import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";
import SpaceShip from "./components/SpaceShip/SpaceShip";
import { ShipContext } from "./components/Context/ShipContext";
import { ContractContext } from "./components/Context/ContractContext";
import { setupContracts } from "./components/utils/setupContracts";
import { BigNumber } from "@ethersproject/bignumber";
import { range } from "./components/utils";
// import { formatUnits } from "@ethersproject/units";
import { fetchShipDetails } from "./components/utils";

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

function App() {
  const [refresh, setRefresh] = useState(false);
  const { setShip } = useContext(ShipContext);
  const { contract, setContract } = useContext(ContractContext);
  const [loading, setLoading] = useState(false);
  const [myShips, setMyShips] = useState<Ship[]>([]);

  const initiateContract = async () => {
    try {
      if (window.ethereum) {
        const contracts = await setupContracts({
          onError: (message: string) => window.confirm(message),
          onRefresh: () => setRefresh(!refresh),
        });
        console.log("contract", contracts);
        if (contracts) {
          setContract(contracts);
        }
      } else {
        alert(
          "Please, try to use Metamask or some client to connect your wallet"
        );
      }
    } catch (ex) {
      console.log({ isError: true, stack: ex });
    }
  };
  React.useEffect(() => {
    // initiate data signer then account address
    const initiateData = async () => {
      // if (!loading && !error && data && data.transfers) {
      initiateContract();
      // }
    };
    initiateData();
  }, [refresh]);
  // }, [loading, error, data]);

  React.useEffect(() => {
    const getMyShips = async () => {
      let assets: Ship[] = [];
      let onSales: Ship[] = [];
      const account = contract?.accounts;
      console.log("updating all ships");
      setLoading(true);
      //fetching all ships from spaceship contract
      contract?.spaceShipContract
        .balanceOf(account)
        .then((balance: string[]) => {
          if (BigNumber.from(balance).toNumber() === 0) {
            setLoading(false);
          } else {
            var loaded = 0;
            range(0, BigNumber.from(balance).toNumber() - 1).forEach((i) => {
              contract?.spaceShipContract
                .tokenOfOwnerByIndex(account, i)
                .then((id: string) => {
                  contract?.spaceShipContract
                    .tokenURI(id)
                    .then(async (uri: string) => {
                      const res = await fetchShipDetails(uri);
                      loaded++;
                      assets.push({
                        id: res.data?.nft_id,
                        plt_id: res.data?.plt_id,
                        ast_id: res.data?.ast_id,
                        uri: String(uri),
                        name: res.data?.ssh_name,
                        image: res.data?.sshm_image,
                        class: res.data?.sshm_class,
                        type: res.data?.sshm_type,
                        status: "Available",
                      });
                    });
                });
            });
            // setShip(assets);
            // setLoading(false);
          }
        })
        .catch((e: Error) => {});

      //fetching all ships from cargo contract
      let stakedLoaded = 0;
      contract?.cargoStakingContract
        .getStakedTokenIds(account)
        .then((ids: string[]) => {
          if (ids.length === 0) {
            setLoading(false);
          }
          ids.forEach((id: string) => {
            contract?.spaceShipContract
              .tokenURI(id)
              .then(async (uri: string) => {
                const res = await fetchShipDetails(uri);
                stakedLoaded++;
                assets.push({
                  id: res.data?.nft_id,
                  plt_id: res.data?.plt_id,
                  ast_id: res.data?.ast_id,
                  uri: String(uri),
                  name: res.data?.ssh_name,
                  image: res.data?.sshm_image,
                  class: res.data?.sshm_class,
                  type: res.data?.sshm_type,
                  status: "Cargo Staking",
                });
              });
            // setShip(assets);
            // setLoading(false);
          });
        })
        .catch((e: Error) => {});

      //fetching all ships from discovery staking contract
      contract?.discoveryStakingContract
        .getStakedTokenIds(account)
        .then((ids: string[]) => {
          if (ids.length === 0) {
            setLoading(false);
          }
          var disLoaded = 0;
          ids.forEach((id: string) => {
            contract?.spaceShipContract
              .tokenURI(id)
              .then(async (uri: string) => {
                const res = await fetchShipDetails(uri);
                disLoaded++;
                assets.push({
                  id: res.data?.nft_id,
                  plt_id: res.data?.plt_id,
                  ast_id: res.data?.ast_id,
                  uri: String(uri),
                  name: res.data?.ssh_name,
                  image: res.data?.sshm_image,
                  class: res.data?.sshm_class,
                  type: res.data?.sshm_type,
                  status: "Discovery Staking",
                });
              });
            // setShip(assets);
            // setLoading(false);
          });
        })
        .catch((e: Error) => {});

      //fetching all ships from repair contract
      contract.repairContract
        .getStakedShipsOf(account)
        .then((ids: string[]) => {
          if (ids.length === 0) {
            setLoading(false);
          }
          var reLoaded = 0;
          ids.forEach((id) => {
            contract?.spaceShipContract
              .tokenURI(id)
              .then(async (uri: string) => {
                const res = await fetchShipDetails(uri);
                reLoaded++;
                assets.push({
                  id: res.data?.nft_id,
                  plt_id: res.data?.plt_id,
                  ast_id: res.data?.ast_id,
                  uri: String(uri),
                  name: res.data?.ssh_name,
                  image: res.data?.sshm_image,
                  class: res.data?.sshm_class,
                  type: res.data?.sshm_type,
                  status: "Need Repair",
                });
              });
            // setShip(assets);
            // setLoading(false);
          });
        })
        .catch((e: Error) => {});

      //fetching all ships from asteroid contract
      contract.asteroidContract
        .stakedShipsOf(account)
        .then(async (ids: string[]) => {
          for (let i = 0; i < ids.length; i++) {
            const uri = `https://be.blackeyegalaxy.space/spaceships/${ids[i]}`;
            const res = await fetchShipDetails(uri);
            assets.push({
              id: res.data?.nft_id,
              plt_id: res.data?.plt_id,
              ast_id: res.data?.ast_id,
              uri: String(uri),
              name: res.name,
              image: res.image,
              class: res.data?.sshm_class,
              type: res.data?.sshm_type,
              status: `Mining asteroid`,
            });
          }
          setShip([...assets]);
          setLoading(false);
          // setShip(assets);
          // setLoading(false);
        })
        .catch((e: Error) => {});

      //fetching all ships from flight contract

      contract.flightContract
        .getStakedTokensOf(account)
        .then(async (ids: string[]) => {
          for (let i = 0; i < ids.length; i++) {
            const uri = `https://be.blackeyegalaxy.space/spaceships/${ids[i]}`;
            const res = await fetchShipDetails(uri);
            assets.push({
              id: res.data?.nft_id,
              plt_id: res.data?.plt_id,
              ast_id: res.data?.ast_id,
              uri: String(uri),
              name: res.name,
              image: res.image,
              class: res.data?.sshm_class,
              type: res.data?.sshm_type,
              status: `In flight`,
            });
          }
          setShip([...assets]);
          setLoading(false);
        })
        .catch((e: Error) => {});

      // Promise.all(
      //   fetchingFlight()
      //     .then((arrayResponse: any) =>
      //       console.log("dowhatever", arrayResponse)
      //     )
      //     .catch((e: Error) => {
      //       console.log("error", e);
      //     })
      // );

      //fetching all ships from market contract
      // contract?.marketContract
      //   .getNftsOfSeller(account)
      //   .then((ids: string[]) => {
      //     var prodLoaded = 0;
      //     ids.forEach((id) => {
      //       contract?.marketContract.pricesOfNft(id).then((price: string) => {
      //         contract?.spaceShipContract
      //           .tokenURI(id)
      //           .then(async (uri: string) => {
      //             const res = await fetchShipDetails(uri);
      //             prodLoaded++;
      //             onSales.push({
      //               id: res.data?.nft_id,
      //               plt_id: res.data?.plt_id,
      //               ast_id: res.data?.ast_id,
      //               uri: String(uri),
      //               name: res.data?.ssh_name,
      //               image: res.data?.sshm_image,
      //               class: res.data?.sshm_class,
      //               type: res.data?.sshm_type,
      //               price: formatUnits(price),
      //             });
      //             // if (ids.length === prodLoaded) {
      //             //   setMyShipsOnSale(onSales);
      //             //   setProdLoading(false);
      //             // }
      //           });
      //       });
      //     });
      //   })
      //   .catch((e: Error) => {});
    };
    if (
      contract?.accounts &&
      contract?.spaceShipContract &&
      contract?.cargoStakingContract &&
      contract?.discoveryStakingContract &&
      contract?.marketContract &&
      contract?.asteroidContract &&
      contract?.flightContract &&
      contract?.repairContract
    ) {
      getMyShips();
    }
    return () => {};
  }, [contract?.accounts, contract?.signer]);

  return (
    <div className="App">
      <HashRouter>
        <Route path="/">
          <Header>
            <NavBar></NavBar>
          </Header>
        </Route>
        <Body>
          <SpaceShip></SpaceShip>
          {/* <Switch>
            <Route exact path="/">
              <Heroes></Heroes>
              <Tavern></Tavern>
            </Route>
            <Route path="/herocave/:tokenID">
              <HeroCave></HeroCave>
            </Route>
            <Route path="/goddesstower">
              <GoddessTower></GoddessTower>
            </Route>
          </Switch> */}
        </Body>
        <Route path="/">
          <Footer></Footer>
        </Route>
      </HashRouter>
    </div>
  );
}

export default App;
