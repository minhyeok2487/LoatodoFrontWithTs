import React, { FC, Fragment } from "react";
import Ad from "../Modules/Ad";
const Page1: FC<{}> = () => {
  return (
    <Fragment>
      <h3>Page 1</h3>
      <div id="top-banner" className="ad-container hb-demo-2">
        <Ad placementName="desktop_takeover" alias="page1-desktop-takeover" />
      </div>
      <div id="content-container">
        <div className="grid-container">
          <div className="grid-item a">A</div>
          <div className="grid-item b">B</div>
          <div className="grid-item c">
            <Ad placementName="video" />
          </div>
          <div className="grid-item d">
            <div id="ad-slot-2" />
          </div>
          <div className="grid-item e"></div>
        </div>
      </div>
      <div className="ad-container"></div>
    </Fragment>
  );
};
export default Page1;
