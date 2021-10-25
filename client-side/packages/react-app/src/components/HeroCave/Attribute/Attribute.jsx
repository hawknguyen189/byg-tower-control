import React from "react";
// import PrimaryStats from "./PrimaryStats";
// import SecondaryStats from "./SecondaryStats";
import AttributeDetail from "./AttributeDetail";

const Attribute = ({ heroID }) => {
  return (
    <div className="row attribute-section pt-4 d-flex justify-content-between">
      <AttributeDetail></AttributeDetail>
      <div className="col-sm-4">
        {/* <div className="row">
          <PrimaryStats heroID={heroID}></PrimaryStats>
        </div>
        <div className="row">
          <SecondaryStats heroID={heroID}></SecondaryStats>
        </div> */}
      </div>
    </div>
  );
};

export default Attribute;
