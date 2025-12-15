import React, { FC, Fragment } from "react";
import Ad from "../Modules/Ad";
const Page3: FC<{}> = () => {
  return (
    <Fragment>
      <h3> horizontal stickies only </h3>
      <Ad placementName="horizontal_sticky" />
      <div id="content-container">
        <div className="grid-container">
          <div className="grid-item a">A</div>
          <div className="grid-item b">B</div>
          <div className="grid-item c">C</div>
          <div className="grid-item d">D</div>
          <div className="grid-item e">E</div>
        </div>
      </div>
      <div className="ad-container"></div>
    </Fragment>
  );
};

export default Page3;
