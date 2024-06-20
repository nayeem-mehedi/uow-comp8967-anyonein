import React from 'react';
import landingContent from '../assets/landing-page/landing-content';
import Footer from './Footer';


function Navbar() {
  return (
    <div className="nav-div">
        <nav className="navbar">
            <div className="nav-links">
                <a href="./Landing.js">Home</a>
                <a href="#">About Us</a>
                <a href="#">Contact Us</a>
            </div>
            
            <a className="main-btn login-button">
                Log In
            </a>
        </nav>
    </div>
  );
}


function LandingStart(){
  return(
      <div className="landing-start-container">
          <div className="landing-start-text">
              <h1>AnyoneIn: Connect, Collaborate, Create</h1>
              <p>We are a community platform aiming to connect innovators with like-minded individuals, help them build their dream project with their dream team. Let’s ignite the power of collaboration!</p>
              <div className="landing-start-buttons">
                  <a className="main-btn get-started-btn" href="#">Get Started</a>
                  <a className="alt-btn learn-btn" href="#">Learn More</a>
              </div>
          </div>
      </div>
  );
}

//MAING LANDING PAGE CONTENT

function LandingSection(props){
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
                  <a className="main-btn landing-extra-btn" href="#">Join Us Today</a>
                </div>
              </div>
          </div>
      </div>
  );
}

function Landing() {
    return (
      <div className="landing">
        <div className="landing-start">
          <Navbar />
          <LandingStart />
        </div>
        <div className="landing-section2">
          <LandingSection
            key={landingContent[0].id}
            name={landingContent[0].name}
            heading={landingContent[0].heading}
            mainText={landingContent[0].mainText}
            extraHeading1="Have a Brilliant Idea?"
            extraHeading2="Looking to Gain Experience?"
            extraText1="Share your idea and we will connect you with the perfect collaborators to bring your vision to life."
            extraText2="Find collaboration opportunities, work on solid projects to gain experience and skills."
          />
        </div>
        <div className="landing-section3">
          <LandingSection
            key={landingContent[1].id}
            name={landingContent[1].name}
            heading={landingContent[1].heading}
            mainText={landingContent[1].mainText}
            extraHeading1=""
            extraHeading2=""
            extraText1=""
            extraText2=""
          />
        </div>
        <div className="landing-section4">
          <LandingSection
            key={landingContent[2].id}
            name={landingContent[2].name}
            heading={landingContent[2].heading}
            mainText={landingContent[2].mainText}
            extraHeading1=""
            extraHeading2=""
            extraText1=""
            extraText2=""
          />
        </div>
        <div className="landing-section5">
          <LandingSection
            key={landingContent[3].id}
            name={landingContent[3].name}
            heading={landingContent[3].heading}
            mainText={landingContent[3].mainText}
            extraHeading1=""
            extraHeading2=""
            extraText1=""
            extraText2=""
          />
        </div>
        <div className="landing-section-end">
          <LandingSection
            key={landingContent[4].id}
            name={landingContent[4].name}
            heading={landingContent[4].heading}
            mainText={landingContent[4].mainText}
            extraHeading1=""
            extraHeading2=""
            extraText1="By registering an account you agree to AnyoneIn's"
            extraText2="User Agreement, Privacy Policy and Cookie Policy"
          />
        </div>
        <div className="landing-section-footer">
          <Footer />
        </div>
      </div>
    );
  }
  
  export default Landing;