import React, { useState, useEffect } from 'react';
import {
  PrimaryButton,
  SecondaryButton,
} from '../../../components/common/Button';
import {
  Card,
  CardIcon,
  CardBody,
  CardHeader,
} from '../../../components/common/Card';
import MintCoin from '../../../assets/images/mint-coin.svg';
import LockCoin from '../../../assets/images/lock-coin.svg';
import LaunchCoin from '../../../assets/images/launch-coin.svg';
import { ListsType } from '../LaunchPad/Lists/demo-data';
import { Link } from 'react-router-dom';
import { LaunchPadCard } from '../../../components/layout/LaunchComponent/LaunchPadCard';
import { getDashboardDetail } from '../../../services/blockchainService';

interface DashboardInfo {
  liquidity: number,
  projects: number,
  participants: number,
  trendingPools: ListsType[],
}

const DashboardHome = () => {
  const [info, setInfo] = useState<DashboardInfo>({
    liquidity: 0,
    projects: 0,
    participants: 0,
    trendingPools: []
  })
  useEffect(() => {
    const fetchDashboardDetail = async () => {
      const _dashboard = await getDashboardDetail()
      setInfo(_dashboard)
    }
    fetchDashboardDetail()
  }, [])
  return (
    <div className="pt-28">
      <div className="pb-20 text-center">
        <h3 className="text-2xl md:text-4xl font-black mb-5 text-custom-dark-primaryBlue">
          The Leading Launchpad Protocol For Everyone
        </h3>
        <p>
          Gaspad, the All in one DeFi platform for your seamless trading and developing experience.
        </p>
        <div className="space-x-4 mt-10">
          <Link to="/app/launchpad/create">
            <PrimaryButton>Create Launchpad</PrimaryButton>
          </Link>
          <Link to="/app/launchpad/lists">
            <SecondaryButton>List of Sales</SecondaryButton>
          </Link>
        </div>
      </div>

      <div className="pt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 text-center gap-4">
        <Card className="text-left flex justify-between items-center" style={{background: 'radial-gradient(171.79% 171.79% at 49.92% -51.64%, #a11f1f69 0%, rgba(121, 26, 24, 0) 100%)'}}>
          <div>
            <h3>Total Liquidity</h3>
            <p className="font-bold text-3xl">{info.liquidity / 1e18} BBC</p>
          </div>
          <CardIcon>
            <i className="las la-dollar-sign"></i>
          </CardIcon>
        </Card>
        <Card className="text-left flex justify-between items-center" style={{background: 'radial-gradient(171.79% 171.79% at 49.92% -51.64%, #a11f1f69 0%, rgba(121, 26, 24, 0) 100%)'}}>
          <div>
            <h3>Total Projects</h3>
            <p className="font-bold text-3xl">{info.projects}</p>
          </div>
          <CardIcon>
            <i className="las la-rocket"></i>
          </CardIcon>
        </Card>
        <Card className="text-left flex justify-between items-center" style={{background: 'radial-gradient(171.79% 171.79% at 49.92% -51.64%, #a11f1f69 0%, rgba(121, 26, 24, 0) 100%)'}}>
          <div>
            <h3>Total Participants</h3>
            <p className="font-bold text-3xl">{info.participants}</p>
          </div>
          <CardIcon>
            <i className="las la-users"></i>
          </CardIcon>
        </Card>
      </div>

      <div className="py-20">
        <h3 className="font-bold text-3xl text-center text-custom-dark-primaryBlue">Trending PreSales</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-10 gap-5">
          {info.trendingPools.length > 0 && info.trendingPools.slice(0, 3).map((list) => (
            <Link to={`/app/launchpad/lists/${list?.launchpadAddr}`} key={list?.launchpadAddr}>
              <LaunchPadCard list={list} />
            </Link>
          ))}
        </div>
      </div>

      <div className="py-20 ">
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="font-bold text-3xl text-custom-dark-primaryBlue">
            The Right Ecosystem For A Successful Project.{' '}
          </h3>
          <p>
            We provide the most secured and advanced tools for the world of
            decentralized finance. Token locker, Launchpad, Fairlaunch and many
            more.
          </p>
        </div>
        <div className="pt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 text-center gap-4">
          <Card>
            <div className="text-center">
              <img className="mx-auto" width={100} src={MintCoin} alt="Mint" />
            </div>
            <div>
              <CardHeader className="my-5">Mint Token</CardHeader>
              <CardBody>
                We provide an easy and reliable way to mint your own token ,
                without the need for prior coding knowledge.
              </CardBody>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <img className="mx-auto" width={100} src={LockCoin} alt="Lock" />
            </div>
            <div>
              <CardHeader className="my-5">Lock Token</CardHeader>
              <CardBody>
                Lock your token on the exchange platform of your choice, to
                boost confidence on your project.
              </CardBody>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <img
                className="mx-auto"
                width={100}
                src={LaunchCoin}
                alt="Launch"
              />
            </div>
            <div>
              <CardHeader className="my-5">Token Launchpad</CardHeader>
              <CardBody>
                Launch your projects on the blockchain with just a few easy
                clicks.
              </CardBody>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default DashboardHome;
