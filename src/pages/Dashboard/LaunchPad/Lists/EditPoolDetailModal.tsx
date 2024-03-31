import { memo, useMemo, useState } from "react";
import { AppModal } from "../../../../components/common/AppModal";
import { ModalContent } from "../../../../components/common/AppModal/ModalContent";
import { ModalHeader } from "../../../../components/common/AppModal/ModalHeader";
import { PrimaryButton } from "../../../../components/common/Button";
import * as Yup from 'yup';
import { ListsType } from "./demo-data";
import { Input, InputContainer, InputError, InputHint, Label, TextArea } from "../../../../components/common/Inputs";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { updatePoolDetail } from "../../../../services/blockchainService";
import toast from "react-hot-toast";

const validationSchema = Yup.object().shape({
  logoUrl: Yup.string().required('Logo is required'),
  website: Yup.string().required('Website is required'),
  github: Yup.string(),
  twitter: Yup.string(),
  youtube: Yup.string(),
  facebook: Yup.string(),
  telegram: Yup.string(),
  reddit: Yup.string(),
  discord: Yup.string(),
  description: Yup.string().required('Description is required'),
  updates: Yup.string(),
});
const formOptions = { resolver: yupResolver(validationSchema) };

const EditPoolDetailModal = ({
  isOpen,
  onClose,
  pool,
}: EditPoolDetailModalProps) => {
  const [pendingTx, setPendingTx] = useState(false);
  const { register, handleSubmit, setError, formState, control } =
    useForm(formOptions);
  const { errors } = formState;

  const handleForm: SubmitHandler<any> = async (value) => {
    setPendingTx(true);
    const infoUrl = `${value?.logoUrl}$#$${value?.website}$#$${value?.facebook}$#$${value?.twitter}$#$${value?.youtube}$#$${value?.github}$#$${value?.telegram}$#$${value?.discord}$#$${value?.reddit}$#$${value?.description}$#$${value?.updates}`
    console.log("sniper: urls: ", pool?.launchpadAddr, infoUrl)
    let receipt = await updatePoolDetail(pool?.launchpadAddr, infoUrl);
    if(receipt) {
      toast.success("Transaction Success!")
    } else {
      toast.error("Something Went Wrong!")
    }
    setPendingTx(false);
  };
  
  return (
    <AppModal modalIsOpen={isOpen} closeModal={onClose}>
      <ModalHeader
        text="Edit Pool Details"
        onModalClose={onClose}
      />
      <ModalContent>
        <form onSubmit={handleSubmit(handleForm)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InputContainer>
              <Label htmlFor="logoUrl">Logo Url</Label>
              <Input
                placeholder="Ex. https://images.com/a5cx8cge.png"
                type="text"
                defaultValue={pool?.logo}
                {...register('logoUrl')}
                name="logoUrl"
              />
              <InputError>{errors.logoUrl?.message}</InputError>
              <InputHint>
                Must be a https URL and must end with a supported image extension
                .png .jpg .jpeg or .gif
              </InputHint>
            </InputContainer>
            <InputContainer>
              <Label htmlFor="website">Website</Label>
              <Input
                placeholder="Ex. https://www.coin.network"
                type="text"
                defaultValue={pool?.website}
                {...register('website')}
                name="website"
              />
              <InputError>{errors.website?.message}</InputError>
            </InputContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InputContainer>
              <Label htmlFor="youtube">Youtube</Label>
              <Input
                placeholder="Ex. https://www.youtube.com/watch?v=sUElgmH4VuE"
                type="text"
                defaultValue={pool?.youtube}
                {...register('youtube')}
                name="youtube"
              />
              <InputError>{errors.github?.message}</InputError>
            </InputContainer>
            <InputContainer>
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                placeholder="Ex. https://www.twitter.com/coin"
                type="text"
                defaultValue={pool?.twitter}
                {...register('twitter')}
                name="twitter"
              />
              <InputError>{errors.twitter?.message}</InputError>
            </InputContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InputContainer>
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                placeholder="Ex. https://www.facebook.com/coin"
                type="text"
                defaultValue={pool?.facebook}
                {...register('facebook')}
                name="facebook"
              />
              <InputError>{errors.facebook?.message}</InputError>
            </InputContainer>
            <InputContainer>
              <Label htmlFor="telegram">Telegram</Label>
              <Input
                placeholder="Ex. https://t.me/coin"
                type="text"
                defaultValue={pool?.telegram}
                {...register('telegram')}
                name="telegram"
              />
              <InputError>{errors.telegram?.message}</InputError>
            </InputContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InputContainer>
              <Label htmlFor="reddit">Reddit</Label>
              <Input
                placeholder="Ex. https://www.reddit.com/coin"
                type="text"
                defaultValue={pool?.reddit}
                {...register('reddit')}
                name="reddit"
              />
              <InputError>{errors.reddit?.message}</InputError>
            </InputContainer>
            <InputContainer>
              <Label htmlFor="discord">Discord</Label>
              <Input
                placeholder="Ex. https://t.me/..."
                type="text"
                defaultValue={pool?.discord}
                {...register('discord')}
                name="discord"
              />
              <InputError>{errors.discord?.message}</InputError>
            </InputContainer>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InputContainer>
              <Label htmlFor="github">Github</Label>
              <Input
                placeholder="Ex. https://www.github.com/coin"
                type="text"
                defaultValue={pool?.github}
                {...register('github')}
                name="github"
              />
              <InputError>{errors.github?.message}</InputError>
            </InputContainer>
          </div>

          <InputContainer>
            <Label htmlFor="description">Project Description</Label>
            <TextArea
              placeholder="Ex. Our project is a completely decentralized application..."
              {...register('description')}
              name="description"
              defaultValue={pool?.description}
              style={{boxShadow: "none"}}
            />
            <InputError>{errors.description?.message}</InputError>
          </InputContainer>
          <InputContainer>
            <Label htmlFor="updates">Additional Update About The Project</Label>
            <Input
              placeholder="Ex. Join us on twitter for our airdrop"
              type="text"
              {...register('updates')}
              name="updates"
            />
            <InputError>{errors.updates?.message}</InputError>
          </InputContainer>

          <InputContainer className="flex justify-between">
            <PrimaryButton
              disabled={pendingTx}
              className="mt-4 m-auto"
            >
              Submit
            </PrimaryButton>
          </InputContainer>
        </form>
      </ModalContent>
    </AppModal>
  );
};

export default memo(EditPoolDetailModal);

type EditPoolDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  pool: ListsType | null;
};
