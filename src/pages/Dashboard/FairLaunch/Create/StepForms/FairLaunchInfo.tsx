import React, { useState } from 'react';
import { Card } from '../../../../../components/common/Card';
import {
  Input,
  InputContainer,
  InputError,
  InputHint,
  Label,
} from '../../../../../components/common/Inputs';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { PrimaryButton } from '../../../../../components/common/Button';
import AppSelect, {
  IOptions,
} from '../../../../../components/common/AppSelect';
import { DateTimePicker } from '../../../../../components/common/DateTimePicker';
import { remainingTokenOptions, feeOptions, raisedTokenOptions } from '../../../LaunchPad/Lists/demo-data'
import { FormInputType } from '..';

const targetDexOptionsList: IOptions[] = [
  {
    label: 'BakerySwap',
    value: 'BakerySwap',
  },
  {
    label: 'PancakeSwap',
    value: 'PancakeSwap',
  },
];

export const FairLaunchInfo = ({
  creatorBalance,
  moveToNext,
  moveToPrevious,
  sendFormData,
}: {
  creatorBalance: string;
  moveToNext: () => void;
  moveToPrevious: () => void;
  sendFormData: (form: any) => void;
}) => {


  const validationSchema = Yup.object().shape({
    // totalSellingAmount: Yup.string().required('Total selling amount is required'),
    totalSellingAmount: Yup.number()
      .required('Total selling amount is required')
      .typeError('Total selling amount is required') 
      .test(
        "","*Insufficient Token Balance. Total selling amount must be less than your token balance / 2.",
        function(totalSellingAmount) {
          const _feeOption = this.parent.feeOption
          let adminTokenSaleFee = 0;
          if (_feeOption === "2") {
              adminTokenSaleFee = totalSellingAmount ? (totalSellingAmount * 2) / 100 : 0;
          }

          const requiredTokenAmount = totalSellingAmount ? totalSellingAmount * 2 + adminTokenSaleFee : 0
          if (totalSellingAmount && requiredTokenAmount <= Number(creatorBalance)) {
            return true;
          } else {
            return false;
          }
        }
      ),
    softCap: Yup.number()
      .required('Softcap is required')
      .typeError('Softcap is required')
      .min(1, 'Softcap must be greater than 1'),
    // targetExchange: Yup.string().required('Select an exchange.'),
    // liquidityPercent: Yup.string().required('Liquidity percentage is required.'),
    liquidityLockUp: Yup.number()
     .required('Lockup must be greater than 5 minutes.')
     .typeError('Lockup is required')
     .min(5, 'Lockup must be greater than 5 minutes'),
    startDate: Yup.date()
      .required('Start date is required.')
      .min(new Date(), 'Start time cannot be in the past'),
    endDate: Yup.date()
      .required('End date is required.')
      .min(Yup.ref('startDate'), "End date can't be before start date"),
    claimDate: Yup.date()
      .required('Claim date is required.')
      .min(Yup.ref('endDate'), "Claim date can't be before end date"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };
  


  const [selectedExchange, setSelectedExchange] = useState<IOptions>();
  const [selectedCurrency, setSelectedCurrency] = useState(raisedTokenOptions[0].value)

  const { register, handleSubmit, setError, formState, control } =
    useForm(formOptions);
  const { errors } = formState;

  const handleForm: SubmitHandler<any> = async (value) => {
    sendFormData(value);
    moveToNext();
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(handleForm)}>
        {/* <InputContainer>
          <Label htmlFor="presaleRate">Presale Rate</Label>
          <Input
            placeholder="Ex. 500"
            type="number"
            {...register('presaleRate')}
            name="presaleRate"
          />
          <InputError>{errors.presaleRate?.message}</InputError>
        </InputContainer> */}

        <InputContainer>
          <Label htmlFor="totalSellingAmount">
            <div className='flex justify-between'>
            Total Selling Amount
            <div className='text-white text-sm'>Your Balance: {creatorBalance}</div></div>
          </Label>
          
          <Input
            placeholder="Ex. 500"
            type="number"
            {...register('totalSellingAmount')}
            name="totalSellingAmount"
          />
          <InputError>{errors.totalSellingAmount?.message}</InputError>
        </InputContainer>

        <InputContainer>
          <Label htmlFor="softCap">Softcap</Label>
          <Input
            placeholder="Soft Cap Ex. 20"
            type="number"
            {...register('softCap')}
            name="softCap"
          />
          <InputError>{errors.softCap?.message}</InputError>
        </InputContainer>
        {/*
        <InputContainer>
          <Label htmlFor="targetExchange">Select Target Exchange</Label>
          <Controller
            control={control}
            name="targetExchange"
            render={({ field: { onChange, value, ref } }) => (
              <AppSelect
                inputRef={ref}
                options={targetDexOptionsList}
                value={targetDexOptionsList.find((c) => c.value === value)}
                onChange={(val) => {
                  setSelectedExchange(val.value);
                  onChange(val.value);
                }}
                placeholder="Select Exchange"
                isSearchable={false}
              />
            )}
          />
          <InputError>{errors.targetExchange?.message}</InputError>
        </InputContainer>*/}

        {/* <InputContainer>
          <Label htmlFor="liquidityPercent">
            {selectedExchange} Liquidity (%)
          </Label>
          <Input
            placeholder="Ex. 60"
            type="text"
            {...register('liquidityPercent')}
            name="liquidityPercent"
          />
          <InputError>{errors.liquidityPercent?.message}</InputError>
          <InputHint>
            Enter the percentage of raised funds that should be allocated to{' '}
            {selectedExchange}
            Liquidity on (Min 51%, Max 100%)
          </InputHint>
              </InputContainer>  */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InputContainer>
            <Label htmlFor="startDate">Start Date</Label>
            <Controller
              control={control}
              name="startDate"
              render={({ field: { onChange, value, ref } }) => (
                <DateTimePicker onChange={onChange} value={value} utc={false} />
              )}
            />
            <InputError>{errors.startDate?.message}</InputError>
          </InputContainer>
          <InputContainer>
            <Label htmlFor="endDate">End Date</Label>
            <Controller
              control={control}
              name="endDate"
              render={({ field: { onChange, value, ref } }) => (
                <DateTimePicker onChange={onChange} value={value} utc={false} />
              )}
            />
            <InputError>{errors.endDate?.message}</InputError>
          </InputContainer>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InputContainer>
            <Label htmlFor="claimDate">Claim Date</Label>
            <Controller
              control={control}
              name="claimDate"
              render={({ field: { onChange, value, ref } }) => (
                <DateTimePicker onChange={onChange} value={value} utc={false} />
              )}
            />
            <InputError>{errors.claimDate?.message}</InputError>
            <InputHint>
              User should claim token before this date.
            </InputHint>
          </InputContainer>
          <InputContainer>
            <Label htmlFor="remainingTokenOption">Unsold Tokens</Label>
            <Controller
              control={control}
              name="remainingTokenOption"
              defaultValue={remainingTokenOptions[0]?.value}
              render={({ field: { onChange, value, ref } }) => (
                <AppSelect
                  inputRef={ref}
                  options={remainingTokenOptions}
                  value={remainingTokenOptions.find((c) => c.value === value)}
                  onChange={(val) => {
                    // setTokenOption(val.value);
                    onChange(val.value);
                  }}
                  placeholder="Options for unsold tokens"
                  isSearchable={false}
                />
              )}
            />
            <InputError>{errors.remainingTokenOption?.message}</InputError>
            <InputHint>
              The unsold tokens are either refunded to the launchpad creator or being burned after sale finished.
            </InputHint>
          </InputContainer>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InputContainer>
            <Label htmlFor="tokenPaymentAddr">Currency Token</Label>
            <Controller
              control={control}
              name="tokenPaymentAddr"
              defaultValue={raisedTokenOptions[0]?.value}
              render={({ field: { onChange, value, ref } }) => (
                <AppSelect
                  inputRef={ref}
                  options={raisedTokenOptions}
                  value={raisedTokenOptions.find((c) => c.value === value)}
                  onChange={(val) => {
                    // setTokenOption(val.value);
                    setSelectedCurrency(val.value);
                    onChange(val.value);
                  }}
                  placeholder="Raised Token"
                  isSearchable={false}
                />
              )}
            />
            <InputError>{errors.raisedTokenOptions?.message}</InputError>
          </InputContainer>
          <InputContainer>
            <Label htmlFor="feeOption">Fee Options</Label>
            <Controller
              control={control}
              name="feeOption"
              defaultValue={feeOptions[0]?.value}
              render={({ field: { onChange, value, ref } }) => (
                <AppSelect
                  inputRef={ref}
                  options={feeOptions}
                  value={feeOptions.find((c) => c.value === value)}
                  onChange={(val) => {
                    // setTokenOption(val.value);
                    onChange(val.value);
                  }}
                  placeholder="Fee Options"
                  isSearchable={false}
                />
              )}
            />
            <InputError>{errors.feeOptions?.message}</InputError>
          </InputContainer>

        </div>
        
        <InputContainer>
          <Label htmlFor="liquidityLockUp">Liquidity Lockup</Label>
          <Input
            placeholder="Ex. 10"
            type="number"
            {...register('liquidityLockUp')}
            name="liquidityLockUp"
          />
          <InputError>{errors.liquidityLockUp?.message}</InputError>
        </InputContainer>
       

        <InputContainer className="flex justify-between">
          <PrimaryButton size="small" type="button" onClick={moveToPrevious}>
            Previous
          </PrimaryButton>
          <PrimaryButton size="small" type="submit">
            Next
          </PrimaryButton>
        </InputContainer>
      </form>
    </Card>
  );
};
