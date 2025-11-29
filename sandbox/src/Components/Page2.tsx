import React, { FC, Fragment } from "react";
import Ad from "../Modules/Ad";
const Demo2: FC<{}> = () => {
  return (
    <Fragment>
      <Ad placementName="vertical_sticky" />
      <h3>with Vertical Sticky</h3>
      <div id="top-banner" className="ad-container hb-demo-2">
        <Ad placementName="desktop_takeover" />
      </div>

      <div id="content-container">
        <div className="grid-container">
          <div className="grid-item a">A</div>
          <div className="grid-item b">B</div>
          <div className="grid-item c">C</div>
          <div className="grid-item d"></div>
          <div className="grid-item e">
            <Ad placementName="mpu" />
          </div>
        </div>
      </div>
      <div className="ad-container"></div>
    </Fragment>
  );
};
export default Demo2;
