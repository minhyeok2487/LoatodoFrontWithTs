import React, { FC, Fragment } from "react";
import { Link } from "react-router-dom";

interface ILinkButton {
  link: string;
  label: string;
}

const TButtons: ILinkButton[] = [
  { link: "Page1", label: "Page 1" },
  { link: "Page2", label: "Page 2" },
  { link: "Page3", label: "Page 3" },
  { link: "Page4", label: "Page 4" },
];

const btnContent = (prop: ILinkButton): JSX.Element => {
  return (
    <Link key={prop.label} to={prop.link} className="button">
      {prop.label}
    </Link>
  );
};

const Navigation: FC<{}> = () => {
  const btnGroup: JSX.Element[] = [];
  for (const element of TButtons) {
    const btn: JSX.Element = btnContent(element);
    btnGroup.push(btn);
  }

  return (
    <Fragment>
      <h2>Prosper SPA Demo</h2>
      <div className="tabs-component">
        <div role="tablist" className="container">
          {btnGroup}
        </div>
      </div>
    </Fragment>
  );
};

export default Navigation;
