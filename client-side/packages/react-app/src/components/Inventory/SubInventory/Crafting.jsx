import React from "react";
const style = { paddingTop: "8.33%", height: 0 };
const Crafting = () => {
  return (
    <div>
      <div className="container">
        <div className="row">
          {/* <div
            style={style}
            className="col-sm-1 bg-light border border-2 border-warning rounded"
          >
            foo bar
          </div> */}
          <div className="col-sm-8 row">
            <div className="col-sm-2 pt-2">
              <span
                tabIndex="0"
                data-bs-toggle="tooltip"
                title="Crafting Material (I)"
                data-bs-placement="top"
                style={{ cursor: "pointer" }}
              >
                <img
                  src={require("../../../media/inventory/material-1.png")}
                  alt=""
                  className="img-thumbnail bg-transparent"
                />
              </span>
              {/* <div class="tooltip bs-tooltip-top" role="tooltip">
                <div class="tooltip-arrow"></div>
                <div class="tooltip-inner">Crafting Material (I)</div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Crafting;
