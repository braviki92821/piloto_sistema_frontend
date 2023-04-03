import React from "react";
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'jquery/dist/jquery.slim.min.js'
import {history} from "../../store/history";

export const headerMain = ({}) => {

  return (
    <><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossOrigin="anonymous">
        </link>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" >
           <img src={require("../assets/logoPlataforma.png").default} width="300" height="75" className="d-inline-block align-top" alt=""/>
          </a>
          <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
          >
              <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav mr-auto ">
                  <li className="nav-item">
                      <a className="nav-link font-weight-bold text-primary" onClick={ () => redirectToRoute("/pdaveracruz")}>
                       Inicio <span className="sr-only">(current)</span>
                      </a>
                  </li>
                  <li className="nav-item">
                      <a className="nav-link font-weight-bold text-primary" href="#">
                        Acerca
                      </a>
                  </li>
                  <li className="nav-item">
                      <a className="nav-link font-weight-bold text-primary" href="#">
                        Blog
                      </a>
                  </li>
                  <li className="nav-item">
                      <a className="nav-link font-weight-bold text-primary" href="https://www.plataformadigitalnacional.org/">
                       Plataforma Digital Nacional
                      </a>
                  </li>
              </ul>
              <form className="form-inline my-2 my-lg-0">
                  <button
                      className="btn btn-outline-danger my-2 my-sm-0"
                      type="submit"
                      onClick={ () => redirectToRoute("/login")}
                  >
                      INGRESAR
                  </button>
              </form>
          </div>
        </nav>
      </>
  );
};

const redirectToRoute = (path) =>{
    history.push(path);
}

export const HeaderMain = headerMain;
