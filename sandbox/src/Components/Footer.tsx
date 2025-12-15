import React, { FC, Fragment } from "react";

const Footer: FC<{}> = () => {

  return (
    <Fragment>
      <footer id="footer">
      <div className="container">
        <div className="row justify-content-center">
  
          <div className="col-lg-5 col-sm-6 mb-5">
            <h6 className="mb-4">Contact Me</h6>
            <ul className="list-unstyled">
  
              <li className="mb-3"><a className="text-dark" href="tel:020%207404%208899"><i className="ti-mobile mr-3 text-primary"></i>+44 20 7404 8899</a></li>
  
  
              <li className="mb-3"><i className="ti-location-pin mr-3 text-primary"></i>Watchmaker Court, 31-35 St John's Lane, EC1M 4BJ</li>
  
  
              <li className="mb-3"><a className="text-dark" href="mailto:londonsales@venatus.com"><i className="ti-email mr-3 text-primary"></i>londonsales@venatus.com</a>
              </li>
            </ul>
          </div>
  
          <div className="col-lg-4 col-sm-6 mb-5">
            <h6 className="mb-4">Social Contacts</h6>
            <ul className="list-unstyled">
  
              <li className="mb-3"><a className="text-dark" href="https://www.linkedin.com/company/venatus-media/">linkedin</a>
              </li>
  
              <li className="mb-3"><a className="text-dark" href="https://twitter.com/venatusmedia">twitter</a></li>
  
              <li className="mb-3"><a className="text-dark" href="https://www.instagram.com/venatusmedia/">instagram</a></li>
  
            </ul>
          </div>
          <div className="col-lg-3 col-sm-6 mb-5">
            <h6 className="mb-4">Categories</h6>
            <ul className="list-unstyled">
              <li className="mb-3"><a className="text-dark" href="publisher.html">Publishers</a>
              </li>
              <li className="mb-3"><a className="text-dark" href="advertiser.html">Advertisers</a>
              </li>
             
            </ul>
          </div>
          <div className="col-12 border-top py-4 text-center">
            | copyright © 2023 <a href="https://venatus.com/">Venatus</a> All Rights Reserved |
          </div>
        </div>
      </div>
    </footer>
    </Fragment>
  );
};
export default Footer;
