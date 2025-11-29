import { Fragment } from "react";
import "./styles/style.scss";

// Tabs Components
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Footer from "./Components/Footer";
import Navigation from "./Components/Navigation";

import Page1 from "./Components/Page1";
import Page2 from "./Components/Page2";
import Page3 from "./Components/Page3";
import Page4 from "./Components/Page4";
import ProsperNewSession from "./Modules/ProsperNewSession";

export default function App() {
  return (
    <Fragment>
      <ProsperNewSession />
      <div className="wrapper">
        <div className="desk-navbar">
          <div className="container navbar">
            <a href="https://venatus.com/" className="brand w-nav-brand">
              <img
                src="https://uploads-ssl.webflow.com/625ecf3842ad2419f8758d34/625fef1a502b2e5532c582d2_venus-logo.svg"
                loading="lazy"
                className="logo"
              ></img>
            </a>

            <nav role="navigation">
              <a
                href="https://showcase.venatusmedia.com/"
                className="navbar-link w-nav-link"
              >
                Home
              </a>
              <a
                href="https://www.venatus.com/contact"
                className="navbar-link w-nav-link"
              >
                Contact
              </a>
              <a
                href="https://docs.google.com/presentation/d/1Agilje40iN6MZVAtq6t-9yEyoAxRsTiYZDPwdhm6UwA/edit#slide=id.gb77e77b0e4_0_41"
                className="navbar-link w-nav-link"
              >
                Specs
              </a>
            </nav>
          </div>
        </div>

        <BrowserRouter>
          <Navigation />

          <Routes>
            <Route path="/" element={<Page1 />} />
            <Route path="Page1" element={<Page1 />} />
            <Route path="Page2" element={<Page2 />} />
            <Route path="Page3" element={<Page3 />} />
            <Route path="Page4" element={<Page4 />} />
          </Routes>
        </BrowserRouter>

        <Footer></Footer>
      </div>
    </Fragment>
  );
}
