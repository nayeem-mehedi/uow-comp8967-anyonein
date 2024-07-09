import React from "react";
import { Link } from 'react-router-dom';

//MAING LANDING PAGE CONTENT

function LandingSections(props){
    return(
        <div className={props.name+"-container"}>
            <div className={`landing-sections-text ${props.name}-text`}>
                <h2>{props.heading}</h2>
                <p>{props.mainText}</p>
                <div className={props.name+"-extra-container"}>
                  <div className={props.name+"-extra"}>
                    <h3>{props.extraHeading1}</h3>
                    <p>{props.extraText1}</p>
                  </div>
                  <div className={props.name+"-extra"}>
                    <h3>{props.extraHeading2}</h3>
                    <p>{props.extraText2}</p>
                  </div>
                  <div className={props.name+"-extra-join"}>
                    <p>{props.extraText1}<br />{props.extraText2}</p>
                    <Link to="/signup" className="main-btn landing-extra-btn">Join Us Today</Link>
                  </div>
                </div>
            </div>
        </div>
    );
  }

  export default LandingSections;