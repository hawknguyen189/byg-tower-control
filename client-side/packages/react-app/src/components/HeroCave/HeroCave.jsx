import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useRouter } from "../../hooks/useRouter";
import Hero from "../Heroes/Hero";
import Attribute from "./Attribute/Attribute";
import Character from "./Character/Character";
import Invetory from "../Inventory/Inventory";
import useRarity from "../../hooks/useShip";
import Foobar from "../Foobar";

const HeroCave = () => {
  const router = useRouter();
  const [heroID, setHeroID] = useState(router.query.tokenID);
  return (
    <div className="container py-3">
      <Foobar></Foobar>
      <p className="h1 text-uppercase fw-bold text-white py-3"> Hero Cave</p>
      <div className="row">
        <div className="col-sm-6 container">
          <Hero tokenID={{ id: heroID }} animation={true}></Hero>
        </div>
        <Invetory></Invetory>
      </div>
      <div className="row herocave-tabs pt-3">
        <ul className="nav nav-tabs nav-fill" id="myTab" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className="nav-link fw-bolder text-white bg-transparent"
              id="character-tab"
              data-bs-toggle="tab"
              data-bs-target="#character"
              type="button"
              role="tab"
              aria-controls="character"
              aria-selected="true"
            >
              Character
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link fw-bolder active text-white bg-transparent"
              id="attribute-tab"
              data-bs-toggle="tab"
              data-bs-target="#attribute"
              type="button"
              role="tab"
              aria-controls="attribute"
              aria-selected="true"
            >
              Attributes
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link fw-bolder text-white bg-transparent"
              id="skill-tab"
              data-bs-toggle="tab"
              data-bs-target="#skill"
              type="button"
              role="tab"
              aria-controls="skill"
              aria-selected="false"
            >
              Skills
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link fw-bolder text-white bg-transparent"
              id="crafting-tab"
              data-bs-toggle="tab"
              data-bs-target="#crafting"
              type="button"
              role="tab"
              aria-controls="crafting"
              aria-selected="false"
            >
              Crafting
            </button>
          </li>
        </ul>
        <div className="tab-content" id="myTabContent">
          <div
            className="tab-pane fade show"
            id="character"
            role="tabpanel"
            aria-labelledby="character-tab"
          >
            <Character heroID={heroID}></Character>
          </div>
          <div
            className="tab-pane fade show active"
            id="attribute"
            role="tabpanel"
            aria-labelledby="attribute-tab"
          >
            <Attribute heroID={heroID}></Attribute>
          </div>
          <div
            className="tab-pane fade"
            id="skill"
            role="tabpanel"
            aria-labelledby="skill-tab"
          >
            <h1 className="display-1 text-center">Coming Soon</h1>
          </div>
          <div
            className="tab-pane fade container"
            id="crafting"
            role="tabpanel"
            aria-labelledby="crafting-tab"
          >
            <div className="row">
              <h1 className="display-1 text-center">Coming Soon</h1>
            </div>
            <div className="row d-flex justify-content-center">
              <img //crafting gif
                className="img-thumbnail bg-transparent border-0 col-sm-6"
                src={require("../../media/crafting.gif")}
                alt="crafting"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCave;
