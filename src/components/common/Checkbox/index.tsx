import React from "react";
import styled from "styled-components";

const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
`;

const Icon = styled.svg`
  fill: none;
  stroke: white;
  stroke-width: 2px;
`;

const HiddenCheckbox = styled.input.attrs({type: "checkbox", className: "flex justify-center items-center shadow-md"})`
  border-width: 1px;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const StyledCheckbox = styled.div<{ checked: boolean }>`
  display: inline-block;
  width: 27px;
  height: 27px;
  background: ${(props) => (props.checked ? "#BD2A26" : "#BD2A2620")}
  border-radius: 3px;
  border: 2px solid ${(props) => props.theme.colors.primaryBlue};
  border-radius: 7px;
  transition: all 150ms;
  color: #BD2A26;

  ${HiddenCheckbox}:focus + & {
    box-shadow: 0 0 0 2px #BD2A26;
  }

  ${Icon} {
    visibility: ${(props) => (props.checked ? "visible" : "hidden")}
  }
`;

interface IProps {
  className?: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  labelWrap?: boolean;
  label?: string
}

export const Checkbox: React.FC<IProps> = (
  {
    className,
    checked,
    labelWrap = true,
    label,
    ...props
  }) => {
  const content = (
    <CheckboxContainer className={className}>
      <HiddenCheckbox checked={checked} {...props} />
      <StyledCheckbox checked={checked}>
        <Icon viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" style={{fill: 'none', stroke:'#BD2A26', strokeWidth: 3}}/>
        </Icon>
      </StyledCheckbox>
    </CheckboxContainer>
  );

  return labelWrap ? <label className="mr-2">{content} {label}</label> : <>{content} {label}</>;
};
