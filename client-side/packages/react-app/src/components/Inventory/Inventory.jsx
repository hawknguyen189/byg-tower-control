import React from "react";
import Crafting from "./SubInventory/Crafting";

const Invetory = () => {
  return (
    <div className="col-sm-6 container">
      <ul className="nav nav-tabs" id="myTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active fw-bold text-white bg-transparent"
            id="gears-tab"
            data-bs-toggle="tab"
            data-bs-target="#gears"
            type="button"
            role="tab"
            aria-controls="gears"
            aria-selected="true"
          >
            Gears
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link fw-bold text-white bg-transparent"
            id="material-tab"
            data-bs-toggle="tab"
            data-bs-target="#material"
            type="button"
            role="tab"
            aria-controls="material"
            aria-selected="false"
          >
            Crafting Materials
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link fw-bold text-white bg-transparent"
            id="quest-tab"
            data-bs-toggle="tab"
            data-bs-target="#quest"
            type="button"
            role="tab"
            aria-controls="quest"
            aria-selected="false"
          >
            Quest/Event
          </button>
        </li>
      </ul>
      <div className="tab-content" id="myTabContent">
        <div
          className="tab-pane fade show active"
          id="gears"
          role="tabpanel"
          aria-labelledby="gears-tab"
        >
          <Crafting></Crafting>
        </div>
        <div
          className="tab-pane fade"
          id="material"
          role="tabpanel"
          aria-labelledby="material-tab"
        >
          <Crafting></Crafting>
        </div>
        <div
          className="tab-pane fade"
          id="quest"
          role="tabpanel"
          aria-labelledby="quest-tab"
        >
          <h1 className="display-3">Coming Soon</h1>
        </div>
      </div>
    </div>
  );
};

export default Invetory;
