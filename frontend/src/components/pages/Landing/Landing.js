import React from 'react';
import landingContent from '../../../assets/landing-page/landing-content';
import Footer from './Footer';
// import Navbar from '../../ui/Navbar';
import PublicNavbar from '../../ui/PublicNavBar'
import LandingStart from './LandingStart';
import LandingSections from './LandingSections';

function Landing() {

  return (
    <div className="landing">
      <div className="landing-start">
        <PublicNavbar/>
        <LandingStart />
      </div>
      <div className="landing-section2">
        <LandingSections
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
        <LandingSections
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
        <LandingSections
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
        <LandingSections
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
        <LandingSections
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