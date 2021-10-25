import React, { useState, useEffect, useContext } from "react";
import useRarity from "../../hooks/useShip";
import useGold from "../../hooks/useGold";
import { Link } from "react-router-dom";
import { ContractContext } from "../Context/ContractContext.jsx";
import { CharacterContext } from "../Context/CharacterContext";

const Hero = ({ tokenID, animation }) => {
  const { contract } = useContext(ContractContext);
  const { heroes, setHeroes } = useContext(CharacterContext);
  //all functions related to rarity address
  const { embarkAdventure, pullHeroesData, levelUp, checkXpRequired } =
    useRarity();
  //all functions related to gold address
  const { getClaimableGold, getGoldBalance, claimGold } = useGold();

  const handleAdventure = async () => {
    // need to use tokenID.id || tokenID in case we use adv all and push for a re-render
    try {
      const response = await embarkAdventure(tokenID.id || tokenID);
      if (response.confirmations) {
        //got confirmed
        const today = new Date();
        let tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        setHeroes((prevState) => ({
          ...prevState,
          [tokenID.id]: {
            ...prevState[tokenID.id],
            nextAdventure: tomorrow,
          },
        }));
      }
    } catch (e) {}
  };
  const handleLevelUp = async (e) => {
    e.preventDefault();
    try {
      const response = await levelUp(tokenID.id);
      const newXpRequired = await checkXpRequired(
        parseInt(heroes[tokenID.id]?.level) + 1
      );
      const goldClaimable = await getClaimableGold(tokenID.id || tokenID);
      if (response && newXpRequired && goldClaimable) {
        setHeroes((prevState) => ({
          ...prevState,
          [tokenID.id]: {
            ...prevState[tokenID.id],
            level: parseInt(prevState[tokenID.id].level) + 1,
            xp: 0,
            xpRequired: newXpRequired,
            goldClaimable: parseFloat(goldClaimable),
          },
        }));
      }
    } catch (e) {
      console.log("level up error", e);
    }
  };
  const handleClaim = async (e) => {
    e.preventDefault();
    const response = await claimGold(tokenID.id || tokenID);
    if (response) {
      const goldBalance = await getGoldBalance(tokenID.id || tokenID);
      setHeroes((prevState) => ({
        ...prevState,
        [tokenID.id]: {
          ...prevState[tokenID.id],
          goldBalance: parseFloat(goldBalance),
          goldClaimable: 0,
        },
      }));
    }
  };

  useEffect(() => {
    const fetHeroData = async () => {
      try {
        const heroData = await pullHeroesData(tokenID.id || tokenID);
        const goldBalance = await getGoldBalance(tokenID.id || tokenID);
        const goldClaimable = await getClaimableGold(tokenID.id || tokenID);
        setHeroes((prevState) => ({
          ...prevState,
          [tokenID.id]: {
            ...heroData,
            goldBalance: parseFloat(goldBalance),
            goldClaimable: parseFloat(goldClaimable),
          },
        }));
      } catch (e) {
        // console.log("fetch hero data error", e);
      }
    };
    if (tokenID.id || tokenID) {
      fetHeroData();
    }
    return () => {};
  }, [contract]);

  return (
    <div className="row">
      <div className="col-sm-3">
        {heroes[tokenID.id]?.class ? (
          <Link
            className="link-primary"
            to={`/herocave/${heroes[tokenID.id]?.tokenID}`}
          >
            <img //gif version if in hero cave
              className="img-thumbnail bg-transparent border-0"
              src={require(`../../media/${
                animation ? "recruit" : "heroes"
              }-icon/${heroes[tokenID.id]?.class?.toLowerCase()}.${
                animation ? "gif" : "png"
              }`)}
              alt={heroes[tokenID.id].class}
            />
          </Link>
        ) : (
          //avatar if in main page
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        )}
      </div>
      <div className="col-sm-9">
        {heroes[tokenID.id]?.tokenID ? (
          <div className="hero-container">
            <p>
              <span className="fw-bolder">{heroes[tokenID.id].class} </span>
              <span className="fw-italic text-white-50">
                Level {heroes[tokenID.id].level}
              </span>
            </p>
            <p className="fw-bold text-white-50">
              {heroes[tokenID.id].tokenID} | XP: {heroes[tokenID.id].xp}{" "}
              {heroes[tokenID.id].xpRequired === "0" ? (
                <button
                  className="btn btn-danger btn-sm"
                  onClick={handleLevelUp}
                  type="button"
                >
                  Level Up
                </button>
              ) : (
                `(${heroes[tokenID.id].xpRequired} remaining)`
              )}
            </p>
            <div className="gold-section row">
              <p className="text-white-50 col-sm-8">
                Gold Balance: {heroes[tokenID.id].goldBalance}
              </p>
              {heroes[tokenID.id].goldClaimable ? (
                <button
                  className="btn btn-light col-sm-4 btn-sm"
                  onClick={handleClaim}
                  type="button"
                >
                  Claim Gold
                </button>
              ) : (
                ""
              )}
            </div>
            <button
              className="link-light btn btn-link"
              disabled={
                heroes[tokenID.id].nextAdventure?.getTime() >=
                new Date().getTime()
              }
              onClick={(e) => {
                e.preventDefault();
                handleAdventure();
              }}
            >
              {heroes[tokenID.id].nextAdventure?.getTime() >=
              new Date().getTime() ? (
                <p>
                  Next adventure in{" "}
                  {Math.floor(
                    Math.abs(
                      heroes[tokenID.id].nextAdventure?.getTime() -
                        new Date().getTime()
                    ) /
                      1000 /
                      3600
                  ) % 24}{" "}
                  hours
                </p>
              ) : (
                "Go to Adventure"
              )}
            </button>
          </div>
        ) : (
          <div className="progress">
            <div
              className="progress-bar progress-bar-striped progress-bar-animated bg-info"
              role="progressbar"
              aria-valuenow="100"
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ width: "100%" }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
