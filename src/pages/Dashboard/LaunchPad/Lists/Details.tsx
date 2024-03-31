import moment from "moment";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router";
import { Avatar } from "../../../../components/common/Avatar";
import { Badge } from "../../../../components/common/Badge";
import {
  PrimaryButton,
  SecondaryButton, ThirdButton, WhitePaperButton,
} from "../../../../components/common/Button";
import { Card, CardHeader } from "../../../../components/common/Card";
import { Countdown } from "../../../../components/common/CountdownTimer";
import { SocialIcons } from "../../../../components/common/Icons";
import {
  Input,
  InputContainer,
  InputHint,
  RowHeader,
  RowItem,
} from "../../../../components/common/Inputs";
import { Progress } from "../../../../components/common/Progress";
import { LaunchInfoText } from "../../../../components/layout/LaunchComponent";
import { ChartJs } from "../../../../components/layout/LaunchComponent/Chart";
import { Action, ListsType, raisedTokenOptions } from "./demo-data";
import {
  getNormalTokensLock,
  getLaunchpadInfoByAddress,
  checkTokenAllowance,
  getLaunchPadContribution,
  buyToken,
  finishTokenSale,
  claimTokenFund,
  claimTokenRefund,
  getConnectedWallet,
  checkClaimedLaunchpad,
  approveTokenLaunchpad,
  enableWhitelist,
  updateKycStatus,
  updateAuditStatus,
} from "../../../../services/blockchainService";
import { Spinner } from "../../../../components/common/Spinner";
import {ADMIN_WALLET_ID, LIST_SALE_STATUS} from "../../../../utils/define";
import {
  getTokenNumberFromBN,
  getSaleStatus,
  getValidYoutubeLink,
  formatTimeStamp,
  shortenAddress,
} from "../../../../utils";
import { Alert } from "../../../../components/common/Alerts";
import CopyIcon from "../../../../assets/images/copy.svg";
import AppSelect from "../../../../components/common/AppSelect";
import SalePublicModal from "./SalePublicModal";
import InputWhitelistModal from "./InputWhitelistModal";
import {Checkbox} from "../../../../components/common/Checkbox";
import {updateLaunchPad} from "../../../../api/common";
import {errorToast, successToast} from "../../../../components/common/NotificationToast";
import {useNavigate} from "react-router-dom";
import { ToggleButton } from "../../../../components/layout/Navbar/styles";
import toast from "react-hot-toast";
import EditPoolDetailModal from "./EditPoolDetailModal";

const LaunchPadDetails = () => {
  const params = useParams();
  const [pool, setPool] = useState<ListsType | null>(null);
  const [poolAmount, setPoolAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [walletAddr, setWalletAddr] = useState("");
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [status, setStatus] = useState(0);
  const [isEnded, setIsEnded] = useState(false);
  const [amountToClaim, setAmountToClaim] = useState(0);
  const [showStartCountdown, setShowStartCountDown] = useState(true);
  const [userContribution, setUserContribution] = useState("0");
  const [totalContributor, setTotalContributor] = useState(0);
  const [tokenRate, setTokenRate] = useState(0);
  const [isPaymentTokenApproved, setIsPaymentTokenApproved] = useState(false);
  const [lockedInfo, setLockedInfo] = useState<any | null>(null);
  const [action, setAction] = useState(0);
  const [isShowSalePublicModal, setIsShowSalePublicModal] = useState(false);
  const [isShowEditPoolDetailModal, setIsShowEditPoolDetailModal] = useState(false);
  const [actionWhitelist, setActionWhitelist] = useState(
    ACTION_WHITELIST_OPTIONS.default
  );

  const launchpadToken = window.localStorage.getItem("launchpadToken");
  const [audit, setAudit] = useState(pool?.auditStatus || false)
  const [kyc, setKyc] = useState(pool?.kycStatus || false)

  const [auditLink, setAuditLink] = useState("")
  const [kycLink, setKycLink] = useState("")

  const [publishedAuditLink, setPublishedAuditLink] = useState(pool?.auditLink || "")
  const [publishedKycLink, setPublishedKycLink] = useState(pool?.kycLink || "")

  const timerRef = useRef(0);

  const handleFinishSale = async () => {
    if (pool) {
      setIsLoading(true);
      const type =
        pool.endDate > Date.now() || pool.softCap > pool.totalDeposits
          ? "CANCEL"
          : "FINISH";
      await finishTokenSale(type, pool?.launchpadAddr);
      await handleAddressUpdate();
      setIsLoading(false);
    }
  };

  const handleApproveAudit = async () => {
    if(auditLink.length <= 0) {
      toast.error("Invalid Audit Link")
      return
    }
    setIsLoading(true);
    const receipt = await updateAuditStatus(pool?.launchpadAddr, true, auditLink);
    setAudit(true)
    setPublishedAuditLink(auditLink)
    console.log(receipt);
    successToast({message: `Transaction success!`, duration: 2000})
    setIsLoading(false);
  }

  const handleApproveKyc = async () => {
    if(kycLink.length <= 0) {
      toast.error("Invalid Kyc Link")
      return
    }
    setIsLoading(true);
    const receipt = await updateKycStatus(pool?.launchpadAddr, true, kycLink);
    setKyc(true)
    setPublishedKycLink(kycLink)
    console.log(receipt);
    successToast({message: `Transaction success!`, duration: 2000})
    setIsLoading(false);
  }

  const handleClaimFund = async () => {
    setIsLoading(true);
    const receipt = await claimTokenFund(pool?.launchpadAddr);
    await handleUpdateClaimAmount(pool, tokenRate);
    console.log(receipt);
    setIsLoading(false);
  };

  const handleClaimRefund = async () => {
    setIsLoading(true);
    const receipt = await claimTokenRefund(pool?.launchpadAddr);
    console.log(receipt);
    setIsLoading(false);
  };

  const handleBuy = async () => {
    setIsLoading(true);
    if (!isPaymentTokenApproved) {
      const isTokenAllowed = await checkTokenAllowance(
        pool?.tokenPaymentAddr,
        pool?.launchpadAddr
      );
      setIsPaymentTokenApproved(isTokenAllowed || false);
      await approveTokenLaunchpad(pool?.tokenPaymentAddr, pool?.launchpadAddr);
      setIsPaymentTokenApproved(true);
    }

    const receipt = await buyToken(
      poolAmount,
      pool?.tokenPaymentAddr,
      pool?.launchpadAddr
    );
    // if (receipt) {
    //   window.location.reload();
    //   return;
    // }
    setIsLoading(false);
    if (receipt) {
      let tx = receipt.transactionHash;
      await Alert({
        title: "Deposited successfully",
        iconHtml: '<i class="las la-lock"></i>',
        message: (
          <div className="py-5 space-y-2">
            <p className="flex justify-between">
              Transaction Hash: <span>{shortenAddress(tx)}</span>
            </p>
          </div>
        ),
        iconColor: "#00BA38",
      });
      window.location.reload();
    } else {
      await Alert({
        title: "Failed to Deposit",
        icon: "error",
        iconColor: "#f27474",
        confirmButtonText: "I got it",
      });
    }
  };

  const handleUpdateClaimAmount = async (curPool: any, tokenRate: any) => {
    const amount = await checkClaimedLaunchpad(
      curPool?.launchpadAddr,
      tokenRate,
      curPool?.launchpadType,
      curPool?.decimals,
    );
    setAmountToClaim(Number(amount));
  };

  const handleStartedCountdown = () => {
    if (startTime && startTime * 1000 < Date.now()) {
      setShowStartCountDown(false);
      if (pool) setStatus(getSaleStatus(pool));
    } else {
      window.location.reload();
    }
  };

  const handleAddressUpdate = async () => {
    if (params && params.id) {
      const launchpadAddress = params.id;
      const currentPool = await getLaunchpadInfoByAddress(launchpadAddress);
      if (currentPool) {
        const isTokenAllowed = await checkTokenAllowance(
          currentPool?.tokenPaymentAddr,
          currentPool?.launchpadAddr
        );
        setIsPaymentTokenApproved(isTokenAllowed || false);
        const lockInfo = await getNormalTokensLock(currentPool?.tokenAddr);
        if (lockInfo && lockInfo[0]) {
          setLockedInfo(lockInfo[0]);
        }
        let rate;
        if (currentPool?.launchpadType) {
          if (Number(currentPool?.totalDeposits)) {
            rate =
              Number(currentPool?.tokenForPresale) /
              Number(currentPool?.totalDeposits);

            setTokenRate(rate);
          }
        } else {
          setTokenRate(Number(currentPool?.presaleRate));
        }
        console.log("sniper: pool: ", currentPool)
        setPool(currentPool);
        setAudit(currentPool.auditStatus);
        setKyc(currentPool.kycStatus);
        setPublishedAuditLink(currentPool.auditLink);
        setPublishedKycLink(currentPool.kycLink);
        setStatus(getSaleStatus(currentPool));
        setStartTime(Math.round(currentPool?.startDate));
        setEndTime(Math.round(currentPool?.endDate));
        setAction(currentPool?.action);
        let contributions = await getLaunchPadContribution(
          currentPool?.launchpadAddr
        );
        let contribute = "0";
        if (contributions) {
          setTotalContributor(contributions[0].length);
          const address = await getConnectedWallet();
          if (address) {
            const userIndex = contributions[0].findIndex(
              (addr: string) => addr.toLowerCase() === address.toLowerCase()
            );
            if (userIndex !== -1) {
              contribute = getTokenNumberFromBN(
                contributions[1][userIndex],
                18
              );
              setUserContribution(contribute);
            }
          }
        }
        await handleUpdateClaimAmount(currentPool, rate);
      }
    }
  };

  const handleEndedCountdown = async () => {
    if (endTime && endTime * 1000 >= Date.now()) {
      await handleAddressUpdate();
    }
    setIsEnded(true);
  };

  const handleSetWalletAddr = async () => {
    const addr = await getConnectedWallet();
    setWalletAddr(addr);
  };

  const handleChangeSaleType = async (saleType: number) => {
    if (saleType === Action.Whitelist) {
      setIsLoadingAction(true);
      await enableWhitelist(pool?.launchpadAddr);
      setAction(saleType);
      setIsLoadingAction(false);
    } else {
      setIsShowSalePublicModal(true);
    }
  };

  const handleChangeLoading = useCallback((isLoading: boolean) => {
    setIsLoading(isLoading);
  }, []);

  const handleChangeAction = useCallback((newAction: number) => {
    setAction(newAction);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsShowSalePublicModal(false);
  }, []);

  const handleCloseEditPoolDetailModal = useCallback(() => {
    setIsShowEditPoolDetailModal(false);
  }, []);

  const handleCloseInputWhitelistModal = useCallback(
    () => setActionWhitelist(ACTION_WHITELIST_OPTIONS.default),
    []
  );

  const handleCopyText = async (text: string) => {
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    handleSetWalletAddr();
    handleAddressUpdate();
  }, [params.id]);

  // const timerCallback = useCallback(async () => {
  //   await handleAddressUpdate();
  // }, []);

  // useEffect(() => {
  //   timerRef.current = window.setInterval(timerCallback, 500);

  //   return () => {
  //     clearInterval(timerRef.current);
  //   };
  // }, []);

  const saleStatus = (pool: ListsType): string => {

    const FINISH_SALE = "Finish Sale";
    const CANCEL_SALE = "Cancel Sale";

    if (Number(pool.totalDeposits) >= Number(pool.softCap)){
      return FINISH_SALE;
    }

    if (pool.launchpadType == 0) {
      if (Number(pool.totalDeposits) < Number(pool.softCap) || Number(pool.totalDeposits) < Number(pool.hardCap)) {
        if (Date.now() >= pool.endDate || Date.now() >= pool.claimDate) {
          return CANCEL_SALE;
        }
      } else if (Number(pool.totalDeposits) >= Number(pool.softCap) || Number(pool.totalDeposits) >= Number(pool.hardCap)) {
        if (Date.now() >= pool.claimDate) {
          return FINISH_SALE;
        }
      }
    } else if (pool.launchpadType == 1) {
      if (Number(pool.totalDeposits) < Number(pool.softCap) || Number(pool.totalDeposits) < Number(pool.hardCap)) {
        if (Date.now() >= pool.endDate || Date.now() >= pool.claimDate) {
          return CANCEL_SALE;
        }
      }

      if (Date.now() >= pool.claimDate && Number(pool.totalSupply) <= (Number(pool.tokenForPresale) * Number(pool.adminTokenSaleFee)) / 10000) {
        return FINISH_SALE;
      }
    }

    return "";
  }

  const handleEditPoolInfo = async () => {
    setIsShowEditPoolDetailModal(true)
  }

  if (!pool)
    return (
      <div className="mt-28 flex justify-center">
        <Spinner />
      </div>
    );
  return (
    <>
      <div className="flex flex-col md:flex-row space-y-5 md:space-y-0 space-x-0 md:space-x-5 pt-16 relative">
        <Card
          style={{ height: "fit-content" }}
          className="w-full md:w-1/3 md:sticky md:top-1"
        >
          <div className="flex justify-between items-center">
            <div className="pb-8">
              <Badge size="1.3rem" color="primary">
                {pool.symbol}
              </Badge>
            </div>
          </div>
          {pool.status === 0 && showStartCountdown && (
            <div className="text-center pb-5">
              Sale starts in{" "}
              <Countdown
                eventTime={startTime}
                onFinish={handleStartedCountdown}
              />
            </div>
          )}
          {pool.status === 0 && !showStartCountdown && !isEnded && (
            <div className="text-center pb-5">
              Sale ends in{" "}
              <Countdown
                eventTime={endTime}
                onFinish={handleEndedCountdown}
              />
            </div>
          )}
          {pool.status === 0 && !showStartCountdown && isEnded && (
            <div className="text-center pb-5">Sale ended</div>
          )}
          <div className="mb-8">
            <Progress type="line" percent={pool.progress} strokeWidth={2.5} trailWidth={2.5}/>
            <div className="flex justify-between">
              <p>{pool.totalDeposits}</p>
              <p>{pool.launchpadType === 0 ? pool.hardCap : pool.softCap}</p>
            </div>
          </div>
          <InputContainer>
            <Input
              name="poolAmount"
              type="number"
              onChange={(e) => setPoolAmount(e.target.value)}
              placeholder={
                pool?.launchpadType
                  ? `1 ${
                      raisedTokenOptions.find(
                        (option) => option.value === pool?.tokenPaymentAddr
                      )?.label
                    } = ${
                      Number(pool?.totalDeposits) ? tokenRate.toFixed(2) : "N/A"
                    } ${pool.symbol}`
                  : `1 ${
                      raisedTokenOptions.find(
                        (option) => option.value === pool?.tokenPaymentAddr
                      )?.label
                    } = ${pool.presaleRate} ${pool.symbol}`
              }
            />
            {pool?.launchpadType ? (
              <InputHint>Fairlaunch</InputHint>
            ) : (
              <InputHint>
                Min: {pool.minBuy} | Max: {pool.maxBuy}
              </InputHint>
            )}
            <InputHint>Total Contributors: {totalContributor}</InputHint>
          </InputContainer>
          <InputContainer className="text-center mb-5">
            {pool.status === 0 && walletAddr  && (
              <PrimaryButton
                disabled={
                  isLoading ||
                  pool.endDate < Date.now() / 1000 ||
                  pool.startDate > Date.now() / 1000
                }
                onClick={handleBuy}
              >
                {isPaymentTokenApproved
                  ? "Buy token"
                  : `Approve  ${
                      raisedTokenOptions.find(
                        (option) => option.value === pool?.tokenPaymentAddr
                      )?.label
                    }`}
              </PrimaryButton>
            )}
            {!walletAddr && (
              <ThirdButton disabled={true}>
                Connect Wallet
              </ThirdButton>
            )}
          </InputContainer>
          <div className="text-center pb-5 opacity-80">
            Sale type: <span className="text-red-400">{action === 0 ? "Public" : "Whitelist Only"}</span>
            <br />
            Your contributions: {userContribution}{" "}
            {
              raisedTokenOptions.find(
                (option) => option.value === pool?.tokenPaymentAddr
              )?.label
            }
            <br />
            Final date to claim: {new Date(pool.claimDate * 1000).toString()}
            <br />
            <br />
            {Number(amountToClaim) ? (
              <span>
                Your token amount to claim:{" "}
                {pool.status === 2 ? userContribution : amountToClaim}{" "}
                {pool.status === 2
                  ? raisedTokenOptions.find(
                      (option) => option.value === pool?.tokenPaymentAddr
                    )?.label
                  : pool.symbol}
              </span>
            ) : (
              <span>Nothing to claim</span>
            )}
          </div>
          <InputContainer className="text-center mb-5">
            {(pool.status === 0 || pool.status === 1) && status !== 5 && status !== 3 && (
              <PrimaryButton
                disabled={
                  (!isEnded && (isLoading || !Number(userContribution))) ||
                  !Number(amountToClaim)
                }
                onClick={handleClaimFund}
              >
                Claim Fund
              </PrimaryButton>
            )}
            {(pool.status === 2 || status === 5) && (
              <PrimaryButton
                disabled={isLoading || !Number(userContribution)}
                onClick={handleClaimRefund}
              >
                Claim Refund
              </PrimaryButton>
            )}
          </InputContainer>
          {pool.status !== 0 && (
            <div className="text-center pb-45 text-red-400">
              {pool.status === 1 ? "Finished" : "Cancelled"}
            </div>
          )}
          {walletAddr && pool.owner.toLowerCase() === walletAddr.toLowerCase() && (
            <div>
              <br />
              <hr />
              <br />
              <div className="text-center pb-5">Owner Zone</div>
              <div className="text-center">Sale type:</div>
              <div className="flex items-center justify-around mt-1 mb-4">
                <div className="cursor-pointer">
                  <input
                    checked={action === Action.Public}
                    id="sale_public"
                    type="radio"
                    onChange={() => handleChangeSaleType(Action.Public)}
                  />
                  <label className="ml-2 cursor-pointer " htmlFor="sale_public">
                    {isLoadingAction && action === Action.Whitelist
                      ? "Loading..."
                      : "Public"}
                  </label>
                </div>
                <div className="cursor-pointer">
                  <input
                    id="sale_whitelist"
                    checked={action === Action.Whitelist}
                    type="radio"
                    onChange={() => handleChangeSaleType(Action.Whitelist)}
                  />
                  <label
                    className="ml-2 cursor-pointer "
                    htmlFor="sale_whitelist"
                  >
                    {isLoadingAction && action === Action.Public
                      ? "Whitelisting..."
                      : "Whitelist"}
                  </label>
                </div>
              </div>
              {action === Action.Whitelist && (
                <>
                  <button
                    onClick={() =>
                      setActionWhitelist(ACTION_WHITELIST_OPTIONS.add)
                    }
                    className="h-8 p-4 w-full flex items-center justify-center rounded-md bg-custom-dark-primaryBlue text-sm text-white"
                  >
                    Add user to Whitelist
                  </button>
                  <button
                    onClick={() =>
                      setActionWhitelist(ACTION_WHITELIST_OPTIONS.remove)
                    }
                    className="h-8 p-4 w-full flex items-center justify-center rounded-md bg-custom-dark-primaryBlue text-sm my-4 text-white"
                  >
                    Remove user to Whitelist
                  </button>
                </>
              )}

              {pool.status === 0 && (
                <InputContainer className="text-center mb-5">
                  <SecondaryButton
                    disabled={isLoading || saleStatus(pool) == ""}
                    onClick={handleFinishSale}
                  >
                    {saleStatus(pool) || "Finish Sale"}
                  </SecondaryButton>
                </InputContainer>
              )}
            </div>
          )}
        </Card>
        <div className="w-full md:w-2/3">
          <Card>
            {/* Header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Avatar src={pool.logo} alt={pool.name} />
                <CardHeader>{pool.name}</CardHeader>
              </div>
              <div>
                {audit && (<Badge color="audit" className="mr-1"><a href={pool.auditLink} target="_blank">Audit</a></Badge>)}
                {kyc && (<Badge color="kyc" className="mr-1"><a href={pool.kycLink} target="_blank">KYC</a></Badge>)}
                <Badge
                  color={
                    LIST_SALE_STATUS.find((el) => el.value === status)?.color ||
                    "primary"
                  }
                >
                  {LIST_SALE_STATUS.find((el) => el.value === status)?.label}
                </Badge>
              </div>
            </div>
            {/* Description */}
            <div className="py-4">
              <p className="opacity-80 break-words">{pool.description}</p>
              <div className="flex space-x-2 pt-4">
                {pool.facebook && (<SocialIcons href={pool.facebook} target="_blank">
                  <i className="lab la-facebook"></i>
                </SocialIcons>)}
                {pool.twitter && (<SocialIcons href={pool.twitter}>
                  <i className="lab la-twitter"></i>
                </SocialIcons>)}
                {pool.telegram && (<SocialIcons href={pool.telegram}>
                  <i className="lab la-telegram"></i>
                </SocialIcons>)}
                {pool.website && (<SocialIcons href={pool.website}>
                  <i className="las la-globe-americas"></i>
                </SocialIcons>)}
                {pool.github && (<SocialIcons href={pool.github}>
                  <i className="lab la-github"></i>
                </SocialIcons>)}
                {pool.reddit && (<SocialIcons href={pool.reddit}>
                  <i className="lab la-reddit"></i>
                </SocialIcons>)}
              </div>
            </div>
            {pool.youtube && (
              <div style={{ position: "relative", paddingTop: "56.25%" }}>
                <iframe
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                  src={getValidYoutubeLink(pool.youtube)}
                ></iframe>
              </div>
            )}
            <div className="pt-8">
              <hr />
              <CardHeader className="py-2">Pool Details</CardHeader>
              <hr />
              <div className="space-y-5 pt-8">
                <LaunchInfoText>
                  Launchpad Address: <span>{pool.launchpadAddr}</span>
                </LaunchInfoText>
                <LaunchInfoText>
                  Token Address: <span>{pool.tokenAddr}</span>
                </LaunchInfoText>
                <LaunchInfoText>
                  Token Name: <span>{pool.name}</span>
                </LaunchInfoText>
                <LaunchInfoText>
                  Token Symbol: <span>{pool.symbol}</span>
                </LaunchInfoText>
                <LaunchInfoText>
                  Token Decimal: <span>{pool.decimals}</span>
                </LaunchInfoText>
                <LaunchInfoText>
                  Total Supply: <span>{pool.totalSupply}</span>
                </LaunchInfoText>
                {lockedInfo?.totalLockedAmount && (
                  <LaunchInfoText>
                    Locked Amount: <span>{lockedInfo?.totalLockedAmount}</span>
                  </LaunchInfoText>
                )}
                <LaunchInfoText>
                  Tokens For Sale: <span>{pool.tokenForPresale}</span>
                </LaunchInfoText>
                <LaunchInfoText>
                  Soft Cap: <span>{pool.softCap}</span>
                </LaunchInfoText>
                {pool?.launchpadType === 0 && (
                  <LaunchInfoText>
                    Hard Cap: <span>{pool.hardCap}</span>
                  </LaunchInfoText>
                )}
                {pool?.launchpadType === 0 && <LaunchInfoText>
                  Liquidity Percent: <span>{pool.liquidityPercent / 1000} %</span>
                </LaunchInfoText>}
                <LaunchInfoText>
                  Liquidity Lock Time: <span>{pool.liquidityLockTime / 60} mins</span>
                </LaunchInfoText>
                <LaunchInfoText>
                  Unsold Tokens:{" "}
                  <span>
                    {pool.refundWhenFinished ? "Refund To The Creator" : "Burn"}
                  </span>
                </LaunchInfoText>
                {pool?.whitelistUsers &&
                  pool?.whitelistUsers.length > 0 &&
                  action === Action.Whitelist && (
                    <>
                      <LaunchInfoText>User whitelist:</LaunchInfoText>
                      <div className="flex flex-col ">
                        <div className="flex">
                          <span className="block w-44">No.</span>
                          <span className="flex-1">Address</span>
                        </div>
                        <div className="flex gap-1 flex-col mt-4">
                          {pool?.whitelistUsers &&
                            pool?.whitelistUsers.map((item, index) => (
                              <div className="flex h-10" key={index}>
                                <span className="block w-44">{index + 1}</span>
                                <div className="flex-1 flex">
                                  <span>{item}</span>
                                  <img
                                    onClick={() => handleCopyText(item)}
                                    src={CopyIcon}
                                    className="ml-1 w-6 h-6 cursor-pointer"
                                  />
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </>
                  )}
                <hr></hr>
                <div className="">
                  <div className="flex flex-wrap justify-end md:justify-between mb-5">
                    {walletAddr?.toLowerCase() === pool.owner.toLowerCase() && <>
                      <SecondaryButton className="pointer-events-auto mr-3 mb-3" size="small" onClick={handleEditPoolInfo}>
                        Edit
                      </SecondaryButton>
                      <div>
                        { !pool.auditStatus && (
                          <SecondaryButton className="pointer-events-auto" size="small" onClick={()=> window.open('https://t.me/MrDevWizard')}>
                            Requires Audit
                          </SecondaryButton>
                        )}
                        { !pool.kycStatus && (
                          <SecondaryButton className="pointer-events-auto ml-3" size="small" onClick={()=> window.open('https://t.me/MrDevWizard')}>
                            Requires KYC
                          </SecondaryButton>
                        )}
                      </div>
                    </>}
                  </div>
                  <div style={{marginLeft: "auto"}}>
                    {walletAddr && walletAddr.toLowerCase() === pool.adminWalletId?.toLowerCase() && (
                      <>
                        <div>Admin Zoon</div>
                        <div className="text-sm">Audit</div>
                        <div className="flex">
                          <Input value={auditLink} onChange={(e: any) => setAuditLink(e.target.value)} placeholder="Audit Link"/>
                          <PrimaryButton onClick={handleApproveAudit} className="ml-2" size="small">Approve</PrimaryButton>
                          {/* <PrimaryButton onClick={handleCancelAudit} className="ml-2" size="small">Cancel</PrimaryButton> */}
                        </div>
                        <div className="text-sm">Kyc</div>
                        <div className="flex mt-2">
                          <Input value={kycLink} onChange={(e: any) => setKycLink(e.target.value)} placeholder="KYC Link"/>
                          <PrimaryButton onClick={handleApproveKyc} className="ml-2" size="small">Approve</PrimaryButton>
                          {/* <PrimaryButton onClick={handleCancelKyc} className="ml-2" size="small">Cancel</PrimaryButton> */}
                        </div>
                        {/* <Checkbox key={`${pool.launchpadAddr}_1`} checked={audit} onChange={(e: any) => handleUpdateLaunchpad(pool.launchpadAddr, 'audit', e.target.checked)} labelWrap={true} label="Audit"/>
                        <Checkbox key={`${pool.launchpadAddr}_2`} checked={kyc}  onChange={(e: any) => handleUpdateLaunchpad(pool.launchpadAddr, 'kyc', e.target.checked)} labelWrap={true} label="KYC"/> */}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
          {/* <Card className="mt-5">
            <CardHeader>Metrics</CardHeader>
            <div className="pt-8">
              <ChartJs poolDetails={pool} />
            </div>
          </Card> */}
          {lockedInfo?.lockedData.length && (
            <Card className="mt-5">
              <div className="mb-8">
                <h3 className="pb-3 font-bold">
                  Lock Records ({lockedInfo?.lockedData.length})
                </h3>
                <hr />
              </div>
              <div className="space-y-4">
                <RowHeader>Wallet Address</RowHeader>
                <RowHeader>Amount</RowHeader>
                <RowHeader>Lock Timer</RowHeader>
                {lockedInfo?.lockedData &&
                  lockedInfo?.lockedData.map((lock: any) => (
                    <div key={lock.id}>
                      <RowItem>{shortenAddress(lock.owner)}</RowItem>
                      <RowItem>{lock.lockedAmount}</RowItem>
                      <RowItem style={{ width: "50%" }}>
                        <Countdown
                          eventTime={formatTimeStamp(lock.unlockDate)}
                        />
                      </RowItem>
                    </div>
                  ))}
              </div>
            </Card>
          )}
        </div>
      </div>
      <SalePublicModal
        launchpadAddr={pool?.launchpadAddr}
        endOfWhitelistTime={pool?.endOfWhitelistTime}
        onChangeLoading={handleChangeLoading}
        isOpen={isShowSalePublicModal}
        onClose={handleCloseModal}
        onChangeAction={handleChangeAction}
      />
      <InputWhitelistModal
        isOpen={Boolean(actionWhitelist)}
        onClose={handleCloseInputWhitelistModal}
        type={actionWhitelist}
        launchpadAddr={pool?.launchpadAddr}
      />
      <EditPoolDetailModal
        isOpen={isShowEditPoolDetailModal}
        onClose={handleCloseEditPoolDetailModal}
        pool={pool}
      />
    </>
  );
};

export default LaunchPadDetails;

export const ACTION_WHITELIST_OPTIONS = {
  default: 0,
  add: 1,
  remove: 2,
};
