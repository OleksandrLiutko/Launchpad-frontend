import React from 'react';
import { PrimaryButton, SecondaryButton } from '../../common/Button';
import { AppContainer } from '../AppContainer';
import dashboardFrame from '../../../assets/images/Circle.png';
import { Link } from 'react-router-dom';
import { SocialIconsComponent } from './SocialIconsComponent';
import ScrollToHref from '../../common/ScrollToHref';
import TypeWriter from "typewriter-effect";
import Pattern from "../../../assets/images/Circle.png"
export const HeroSection = (): React.ReactElement => {
  return (
    <div
      id="hero"
      className="w-full"
      style={{
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '98px',
        backgroundImage:
          'linear-gradient(175deg, #0C0C0D 100%, #040710 calc(100% + 2px)) '
      }}
    >
      <div style={{
        top: '-270px',
        left: '-80px',
        width: '120%',
        height: '100%',
        background: 'linear-gradient(175deg, rgb(12, 12, 13) 56%, rgb(45, 6, 5))',
        position: 'absolute',
        transform: 'rotate(-5.81deg)'
      }}></div>
      <div style={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        background: `url(${Pattern})`
      }}></div>
      <AppContainer>
        <div className="flex flex-col lg:pt-16 pb-10 relative">
          <div className="flex flex-col">
            <div className="flex flex-col w-full pt-16 lg:m-0 text-center">
              <div className="max-w-5xl mx-auto">
                <h4
                  data-aos="fade-right"
                  data-aos-delay="500"
                  className="font-bold leading-tight mb-5 app-font"
                >
                  <span className="text-3xl md:text-6xl" style={{ textShadow: '0px -8px 11px #BD2A26' }}>
                      We Offer The Lowest Rates For Your Launch
                  </span>
                </h4>
              </div>
              <div className="max-w-3xl mx-auto">
                <h3
                  data-aos="fade-right"
                  data-aos-delay="700"
                  className="text-base md:text-xl font-medium mb-10 text-gray-400"
                >
                  <TypeWriter
                    options={{
                      loop: true,
                    }}
                    onInit={(typewriter) => {

                      typewriter
                        .changeDelay(20)
                        .typeString("We are the leading decentralized Butane-chain launchpad protocol in crypto. ")
                        .pauseFor(1000)
                        .deleteAll(10)
                        .typeString("A One-Stop platform to invest in a variety of diversified blockchain projects")
                        .pauseFor(1000)
                        .deleteAll(10)
                        .start();
                    }} />
                </h3>
              </div>
              <div className="mb-8">
                <SocialIconsComponent />
              </div>
              <div className="flex space-x-4 mb-8 justify-center">
                <ScrollToHref target="features">
                  <a href="#features" data-aos="fade-left" data-aos-delay="500">
                    <PrimaryButton>Features</PrimaryButton>
                  </a>
                </ScrollToHref>
                <Link to="/app/dashboard" data-aos="fade" data-aos-delay="800">
                  <SecondaryButton>Launch App</SecondaryButton>
                </Link>
              </div>
            </div>
            {/* <div>
              <div className="w-full pt-16">
                <img
                  src={dashboardFrame}
                  alt="snapshot showing dashboard on dotlaunch, a crypto launchpad on cronos-chain, best crypto launchpad"
                  // text="dashboard"
                  className="mx-auto w-full rounded-2xl"
                  style={{
                    boxShadow: '0px 2px 39px 16px rgba(131,3,249,0.1)',
                    border: '10px solid #201C37',
                  }}
                />
              </div>
            </div> */}
          </div>
        </div>
      </AppContainer>
    </div>
  );
};
