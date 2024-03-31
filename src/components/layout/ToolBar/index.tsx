import React, { useContext, useState, useEffect } from 'react';
import { connectMetamask, disconnectMetamask, connectWalletConnect } from '../../../services/blockchainService'
import styled from 'styled-components';
import {
  SidebarContext,
  SideBarContextType,
} from '../../../context/sidebarcontext';
import { MenuItem } from '@szhsin/react-menu';
import { AppModal } from '../../common/AppModal';
import { ModalContent } from '../../common/AppModal/ModalContent';
import { ModalHeader } from '../../common/AppModal/ModalHeader';
import { IconButton, SecondaryButton } from '../../common/Button';
import { AppMenu, AppsMenu } from '../../common/Menu';
import Toggler from '../../common/Toggler';
import BinanceLogo from './images/binance-logo.svg';
import EthLogo from './images/eth-logo.svg';
import PolygonLogo from './images/polygon-logo.png';
import RopstenLogo from './images/ropsten-logo.png';
import MetamaskLogo from './images/metamask.svg';
import CoinbaseLogo from './images/coinbase-wallet.svg';
import ButaneLogo from './images/butane.png';
import GaspadLogo from './images/logo.svg'
import { shortenAddress } from '../../../utils';
import { getConnectedWallet } from '../../../services/blockchainService';
import Pattern from "../../../assets/images/wave.png";
interface IStyledToolbar {
  className?: string;
  isOpen?: boolean;
}

const ToolBarContainer = styled.div.attrs<IStyledToolbar>(() => ({
  className: `z-10 py-1 px-4 sm:pl-6 sm:pr-10 shadow flex justify-between items-center space-x-4`,
})) <IStyledToolbar>`
  background: ${(props) => props.theme.colors.secondaryBackground};
  background-image: url(${Pattern});
  // background-blend-mode: color-dodge;
  border-bottom: 1px solid #313131;
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
`;

const NetworkSelector = styled.button.attrs(() => ({
  className: `w-full flex items-center space-x-3 py-3 pl-3 my-2 rounded-lg font-bold`,
}))`
  transition: all 0.3s ease;
  border: 1px solid ${(props) => props.theme.colors.primaryText}50;

  &:hover {
    box-shadow: 0 10px 17px hsl(0deg 0% 39% / 10%);
    background: ${(props) => props.theme.colors.secondaryRed};
  }
`;

const ToolBar = () => {
  const { toggleSidebar } = useContext<SideBarContextType>(SidebarContext);
  const [modalIsOpen, setModalOpen] = useState(false);
  const onModalClose = () => setModalOpen(false);
  const [walletAddr, setWalletAddr] = useState('');

  const handleConnectMetaMask = async () => {
    const userAddress = await connectMetamask();
    setWalletAddr(userAddress)
  }

  const handleGetConnectedMetaMask = async () => {
    const wallet = await getConnectedWallet()
    if (wallet) {
      setWalletAddr(wallet)
    }
  }

  useEffect(() => {
    handleGetConnectedMetaMask()
  });

  const handleDisconnectMetaMask = () => {
    disconnectMetamask()
    setModalOpen(false)
    setWalletAddr('')

  }
  return (
    <ToolBarContainer>
      <div className="flex items-center w-1/2 space-x-3">
        <div className="justify-end">
          <button onClick={toggleSidebar}>
            <i className="las la-bars text-3xl"></i>
            {/* <img className="mx-auto" src={MetamaskLogo} height={100}/> */}
          </button>
        </div>
        {/* <h3 className="hidden sm:block font-black text-xl">SafeLaunch</h3> */}
        <a href='/'><img src={GaspadLogo} style={{height: "70px"}}/></a>
        
      </div>
      <div className="flex space-x-4 w-1/2 items-center justify-end">
        {/* <div>
          <IconButton>
            <i className="lab la-telegram-plane"></i>
          </IconButton>
        </div> */}
        {/* <div>
          <Toggler />
        </div> */}
        <div className="hidden md:block">
          <img src={ButaneLogo} alt="B" width={25} style={{ display: "inline-block", marginRight: "5px" }} />
          <span>Butane</span>
        </div>
        {/*<div className="hidden md:block">
          <SecondaryButton onClick={() => setModalOpen(true)} size="small">
            Networks
          </SecondaryButton>
        </div>*/}
        {/* <IconButton
          onClick={() => setModalOpen(true)}
          className="block md:hidden"
        >
          <i className="lab la-buffer"></i>
        </IconButton> */}
        {/* <SecondaryButton size="small">Connect</SecondaryButton> */}
        <AppMenu
          align="end"
          transition
          menuButton={<SecondaryButton size="small">{walletAddr
            ? `${shortenAddress(walletAddr)}`
            : "Connect Wallet"}</SecondaryButton>}
        >
          {walletAddr ? <MenuItem>
            <div className="flex space-x-3 items-center py-2" onClick={handleDisconnectMetaMask}>
              <img src={MetamaskLogo} width="30" /><span>Disconnect</span>
            </div>
          </MenuItem> : <div><MenuItem>
            <div className="flex space-x-3 items-center py-2" onClick={handleConnectMetaMask}>
              <img src={MetamaskLogo} width="30" /> <span>Metamask</span>
            </div>
          </MenuItem>
            <MenuItem>
              <div className="flex space-x-3 items-center py-2" onClick={connectWalletConnect}>
                <img src={CoinbaseLogo} width="30" />
                <span>Coinbase Wallet</span>
              </div>
            </MenuItem>
          </div>}
        </AppMenu>
      </div>
      {/* <div>
        <AppModal modalIsOpen={modalIsOpen} closeModal={onModalClose}>
          <ModalHeader text="Select Network" onModalClose={onModalClose} />
          <ModalContent>
            <NetworkSelector>
              <img src={BinanceLogo} alt="B" width={50} />
              <span>BSC Mainnet</span>
            </NetworkSelector>
            <NetworkSelector>
              <img src={EthLogo} alt="B" width={50} />
              <span>Ethereum Mainnet</span>
            </NetworkSelector>
            <NetworkSelector>
              <img src={PolygonLogo} alt="B" width={50} />
              <span>Matic/Polygon</span>
            </NetworkSelector>
            <div className="my-3 py-4 px-3 font-bold bg-custom-light-primaryBackground dark:bg-custom-dark-primaryBackground">
              <h3>Testnets</h3>
            </div>
            <NetworkSelector>
              <img src={RopstenLogo} alt="B" width={50} />
              <span>Ropsten</span>
            </NetworkSelector>
            <NetworkSelector>
              <img src={BinanceLogo} alt="B" width={50} />
              <span>BSC Testnet</span>
            </NetworkSelector>
          </ModalContent>
        </AppModal>
      </div> */}
    </ToolBarContainer>
  );
};

export default ToolBar;
