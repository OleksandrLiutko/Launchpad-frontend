import React, {useState, useEffect} from 'react';
import { date } from 'yup';
import { LaunchInfoText } from '.';
import { ListsType, raisedTokenOptions } from '../../../pages/Dashboard/LaunchPad/Lists/demo-data';
import { Avatar } from '../../common/Avatar';
import { Badge } from '../../common/Badge';
import {PrimaryButton, SecondaryButton} from '../../common/Button';
import { Checkbox } from '../../common/Checkbox';
import { Card, CardHeader, CardSubHeader, CardBody } from '../../common/Card';
import { Progress } from '../../common/Progress';
import Truncate from '../../common/Truncate';
import {ADMIN_WALLET_ID, LIST_SALE_STATUS} from '../../../utils/define'
import { getSaleStatus } from '../../../utils'
import {MenuRadioGroup} from "@szhsin/react-menu";
import {updateLaunchPad} from "../../../api/common";
import {errorToast, successToast} from "../../common/NotificationToast";
import {useNavigate} from "react-router-dom";

interface ILaunchPad {
  list: ListsType;
  walletId?: string;
}

export const LaunchPadCard = ({ list, walletId }: ILaunchPad) => {
  const [audit, setAudit] = useState(list.auditStatus)
  const [kyc, setKyc] = useState(list.kycStatus)
  const status = getSaleStatus(list)
  const navigate = useNavigate();

  const launchpadToken = window.localStorage.getItem("launchpadToken");

  const handleUpdateLaunchpad = async (launchpadAddr: string, type: string, status: boolean) => {
    if (type === 'audit') {
      setAudit(status)
    } else {
      setKyc(status)
    }
    const data = {
      kyc,
      audit,
      walletId: ADMIN_WALLET_ID
    }

    let result = await updateLaunchPad(launchpadToken, launchpadAddr, {
      ...data,
      [type]: status,
    })
    if (result.data.status) {
      successToast({message: `${list.name} changes [${type}] to ${status} succeed`, duration: 2000})
    } else {
      errorToast({message: `${list.name} changes [${type}] to ${status} failed`, duration: 2000})
    }
  }

  return (
    <Card className="launch-card">
      <div className="flex justify-between items-center">
        <Avatar src={list.logo} />
        <div>
        {audit && (<Badge color="audit" className="mr-1"><a href={list.auditLink} target="_blank">Audit</a></Badge>)}
        {kyc && (<Badge color="kyc" className="mr-1"><a href={list.kycLink} target="_blank">KYC</a></Badge>)}
        <Badge
          color={
            LIST_SALE_STATUS.find((el) => el.value === status)?.color || 'primary'
          }
        >
          {LIST_SALE_STATUS.find((el) => el.value === status)?.label}
        </Badge>
        </div>
      </div>
      <div className="mt-3">
        <CardHeader>{list.name}</CardHeader>
        <CardSubHeader>{list.symbol}</CardSubHeader>
        <CardBody>
          {/*<Truncate
            className="opacity-80"
            text={list.description || 'No description available'}
            length={150}
        />*/}
          <div className="mt-10 space-y-2">
            {list.launchpadType === 1 && <LaunchInfoText>
              <span>Fairlaunch</span>
            </LaunchInfoText>}
            <LaunchInfoText>
              Soft Cap: <span>{list.softCap} {raisedTokenOptions.find(option => option.value === list?.tokenPaymentAddr)?.label}</span>
            </LaunchInfoText>
            {list.launchpadType === 0 ? <LaunchInfoText>
              Hard Cap: <span>{list.hardCap} {raisedTokenOptions.find(option => option.value === list?.tokenPaymentAddr)?.label}</span>
            </LaunchInfoText> : <LaunchInfoText>
              Total Selling Amount: <span>{list.totalSellingAmount}</span>
            </LaunchInfoText>}
            {list.launchpadType === 0 && <LaunchInfoText>
              Price: <span>1BBC = {list.presaleRate} {list.symbol}</span>
            </LaunchInfoText>}
            {/*<LaunchInfoText>
              Unlocks In: <span>{list.lockTime}</span>
        </LaunchInfoText>*/}
            <LaunchInfoText>
              Raised Amount: <span>{list.progress.toFixed(2)}%</span>
            </LaunchInfoText>
            <div className="pb-5">
              <Progress
                type="line"
                percent={list.progress}
                strokeWidth={3}
                trailWidth={3}
              />
              <div className="flex justify-between font-bold opacity-80 mt-2">
                <p>{list.totalDeposits}</p>
                <p>{list.launchpadType === 0 ? list.hardCap : list.softCap}</p>
              </div>
            </div>
            <hr />
            <div className="pt-5 flex flex-row items-center justify-items-center">
              <SecondaryButton className="pointer-events-auto" size="small" style={{minWidth: 0}} onClick={() => navigate(`/app/launchpad/lists/${list?.launchpadAddr}`)}>
                View
              </SecondaryButton>
              <div style={{marginLeft: "auto"}}>
              { !list.auditStatus && walletId && walletId.toLowerCase() === list.owner.toLowerCase() && (
              <SecondaryButton className="pointer-events-auto" size="small" onClick={()=> window.open('https://t.me/MrDevWizard')}>
                Requires Audit
              </SecondaryButton>
              )}
              { !list.kycStatus && walletId && walletId.toLowerCase() === list.owner.toLowerCase() && (
              <SecondaryButton className="pointer-events-auto ml-3" size="small" onClick={()=> window.open('https://t.me/MrDevWizard')}>
                Requires KYC
              </SecondaryButton>
              )}
              {/* {walletId && walletId.toLowerCase() === list.adminWalletId?.toLowerCase() && (
                <>
                  <Checkbox key={`${list.launchpadAddr}_1`} checked={audit} onChange={(e: any) => handleUpdateLaunchpad(list.launchpadAddr, 'audit', e.target.checked)} labelWrap={true} label="Audit"/>
                  <Checkbox key={`${list.launchpadAddr}_2`} checked={kyc}  onChange={(e: any) => handleUpdateLaunchpad(list.launchpadAddr, 'kyc', e.target.checked)} labelWrap={true} label="KYC"/>
                </>
              )} */}
              </div>
            </div>
          </div>
        </CardBody>
      </div>
    </Card>
  );
};
