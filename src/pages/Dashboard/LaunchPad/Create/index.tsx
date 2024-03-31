import React, { useEffect, useState } from "react";
import { PrimaryButton } from "../../../../components/common/Button";
import { Card } from "../../../../components/common/Card";
import {
  Input,
  Label,
  InputContainer,
} from "../../../../components/common/Inputs";
import StepForm from "../../../../components/layout/StepForm";
import Step from "../../../../components/layout/StepForm/step";
import {
  AdditionalInfo,
  DetailsSummary,
  LaunchInfo,
  VerifyToken,
} from "./StepsForms";
import { SecondaryButton } from "../../../../components/common/Button";
import { Link } from "react-router-dom";
import {
  createTokenLaunchpad,
  signIn,
} from "../../../../services/blockchainService";
import { uploadInfoToIPFS } from "../../../../services/ipfsService";
import { Alert } from "../../../../components/common/Alerts";
import { shortenAddress, getValidYoutubeLink } from "../../../../utils";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { createCampaignAPI } from "../../../../api/common";
import {ADMIN_WALLET_ID} from "../../../../utils/define";

export interface FormInputType {
  tokenSaleAddr?: string;
  tokenPaymentAddr?: string;
  endDate?: Date;
  startDate?: Date;
  claimDate?: Date;
  hardCap?: number;
  softCap?: number;
  liquidityLockUp?: number;
  liquidityPercent?: string;
  listingRate?: string;
  maxBuy?: number;
  minBuy?: number;
  remainingTokenOption?: string;
  feeOption?: string;
  presaleRate?: number;
  targetExchange?: string;
  description?: string;
  discord?: string;
  youtube?: string;
  facebook?: string;
  github?: string;
  logoUrl?: string;
  reddit?: string;
  telegram?: string;
  twitter?: string;
  updates?: string;
  website?: string;
  totalSellingAmount?: number;
}

const CreateLaunchpad = () => {
  const { id } = useParams();
  const [activeStep, setActiveStep] = useState(1);
  const [formInput, setFormInput] = useState<FormInputType>();
  const [creatorBalance, setCreatorBalance] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const moveToNext = () => setActiveStep(activeStep + 1);
  const moveToPrevious = () => setActiveStep(activeStep - 1);
  let infoUrl: string = "";
  const launchpadToken = window.localStorage.getItem("launchpadToken");

  const uploadInfo = async (token?: string) => {
    infoUrl = `${formInput?.logoUrl}$#$${formInput?.website}$#$${formInput?.facebook}$#$${formInput?.twitter}$#$${formInput?.youtube}$#$${formInput?.github}$#$${formInput?.telegram}$#$${formInput?.discord}$#$${formInput?.reddit}$#$${formInput?.description}$#$${formInput?.updates}`
    // const jsonObj: any = {
    //   logo: formInput?.logoUrl,
    //   website: formInput?.website,
    //   facebook: formInput?.facebook,
    //   twitter: formInput?.twitter,
    //   youtube: getValidYoutubeLink(formInput?.youtube || ""),
    //   github: formInput?.github,
    //   telegram: formInput?.telegram,
    //   discord: formInput?.discord,
    //   reddit: formInput?.reddit,
    //   description: formInput?.description,
    //   updates: formInput?.updates,
    // };

    // Object.keys(jsonObj).forEach((key) =>
    //   Boolean(jsonObj[key]) === false ? delete jsonObj[key] : {}
    // );

    // const config = {
    //   headers: { Authorization: `Bearer ${token ?? launchpadToken}` },
    // };

    // // Call api create launchpad info
    // try {
    //   const {
    //     data: { opcode },
    //   } = await createCampaignAPI(token ?? launchpadToken, jsonObj)
    //   if (opcode) {
    //     infoUrl = `${process.env.REACT_APP_ENDPOINT}/launchpads/campaign/get/${opcode}`;
    //   } else {
    //     window.localStorage.removeItem("launchpadToken");
    //   }
    // } catch (error) {
    //   window.localStorage.removeItem("launchpadToken");
    // }
  };

  // const handleSignIn = async () => {
  //   const signStatus = await signIn();
  //   if (signStatus) {
  //     const { address, network, nonce, signature } = signStatus;
  //     // Call api sign in
  //     try {
  //       const {
  //         data: { token },
  //       } = await axios.post(`${process.env.REACT_APP_ENDPOINT}/auth/sign-in`, {
  //         address,
  //         network,
  //         nonce,
  //         signature,
  //       });

  //       if (token) {
  //         window.localStorage.setItem("launchpadToken", token);
  //         setHasLogin(true);
  //       }
  //       return token;
  //     } catch (error) {
  //       window.localStorage.removeItem("launchpadToken");
  //     }
  //   } else {
  //     await Alert({
  //       title: "Failed to sign in",
  //       icon: "error",
  //       iconColor: "#f27474",
  //       confirmButtonText: "I got it",
  //     });
  //     window.localStorage.removeItem("launchpadToken");
  //   }
  // };

  const submitFormData = async () => {
    // Make Http Request With The Complete Form Input
    //This method is called from the details summary page.
    setIsLoading(true);
    await uploadInfo();
    await handleCreate();
    setIsLoading(false);
    console.log(formInput);
  };

  const handleCreate = async () => {
    console.log("create", infoUrl);
    setIsLoading(true);
    let receipt = await createTokenLaunchpad(
      {
        ...formInput,
        launchpadType: 0,
        adminWalletId: ADMIN_WALLET_ID,
        infoUrl,
      }
      //walletType,
      //walletProvider
    );

    if (receipt) {
      let address = receipt.events[0].address;
      let tx = receipt.transactionHash;
      const { isConfirmed } = await Alert({
        title: "Launchpad Created Successfully",
        iconHtml: '<i class="las la-check"></i>',
        message: (
          <div className="py-5 space-y-2">
            <p className="flex justify-between">
              Transaction Hash: <span>{shortenAddress(tx)}</span>
            </p>
            <p className="flex justify-between">
              Launchpad Address: <span>{shortenAddress(address)}</span>
            </p>
          </div>
        ),
        iconColor: "#00BA38",
        showConfirmButton: true
      });
      if (isConfirmed) {
        navigate(`/app/launchpad/lists/${address.toLowerCase()}`);
        return;
      }
    } else {
      await Alert({
        title: "Failed to Create Launchpad",
        icon: "error",
        iconColor: "#f27474",
        confirmButtonText: "I got it",
      });
    }
    setIsLoading(false);
  };

  // Write function check validate email address

  useEffect(() => {
    const launchpadToken = window.localStorage.getItem("launchpadToken");
    // setHasLogin(Boolean(launchpadToken));
  }, []);

  return (
    <div>
      <div className="py-10">
        <h3 className="font-bold text-3xl text-custom-dark-primaryBlue">Create Presale 🔥</h3>
      </div>
      <StepForm activeStep={activeStep}>
        <Step label="Verify Token" icon={<i className="las la-flag"></i>}>
          <VerifyToken
            moveToNext={moveToNext}
            setCreatorBalance={setCreatorBalance}
            sendFormData={(verifyData) =>
              setFormInput((prevState) => ({ ...prevState, ...verifyData }))
            }
            initTokenAddr={id || ""}
          />
        </Step>
        <Step
          label="Launchpad Information"
          icon={<i className="las la-rocket"></i>}
        >
          <LaunchInfo
            creatorBalance={creatorBalance}
            moveToNext={moveToNext}
            moveToPrevious={moveToPrevious}
            sendFormData={(launchData) =>
              setFormInput((prevState) => ({ ...prevState, ...launchData }))
            }
          />
        </Step>
        <Step
          label="Additional Information"
          icon={<i className="las la-building"></i>}
        >
          <AdditionalInfo
            moveToNext={moveToNext}
            moveToPrevious={moveToPrevious}
            sendFormData={(additionalData) =>
              setFormInput((prevState) => ({ ...prevState, ...additionalData }))
            }
          />
        </Step>
        <Step label="Review Details" icon={<i className="las la-check"></i>}>
          <DetailsSummary
            isLoading={isLoading}
            formInput={formInput}
            submitFormData={submitFormData}
            moveToPrevious={moveToPrevious}
            // hasLogin={hasLogin}
            // onSignIn={handleSignIn}
          />
        </Step>
      </StepForm>
    </div>
  );
};

export default CreateLaunchpad;
