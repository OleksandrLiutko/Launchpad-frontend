import styled from 'styled-components';
import CoverImage from "../../../assets/images/button-cover.png"

interface IButton {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export const PrimaryButton = styled.button.attrs<IButton>(() => ({
  className: `flex justify-center items-center shadow-md`,
}))<IButton>`
  background: ${(props) => props.theme.colors.primaryBlue};
  background-image: url(${CoverImage});
  background-blend-mode: multiply;
  min-width: ${(props) =>
    props.size === 'small'
      ? '100px'
      : props.size === 'medium'
      ? '120px'
      : '150px'};
  color: #ffffff;
  border: 2px solid ${(props) => props.theme.colors.primaryBlue};
  border-radius: 7px;
  padding: ${(props) =>
    props.size === 'small'
      ? '8px 10px'
      : props.size === 'large'
      ? '12px 14px'
      : '10px 12px'};
  font-weight: bold;
  transition: all 0.3s ease;
  display: inline-block;
  outline: none;
  font-size: ${(props) =>
    props.size === 'small'
      ? '0.8rem'
      : props.size === 'large'
      ? '1.5rem'
      : '1rem'};

  &:disabled {
    cursor: default;
    opacity: 0.3;
    pointer-events: none;
  }
`;

export const SecondaryButton = styled(PrimaryButton)<IButton>`
  background: transparent;
  border: 2px solid ${(props) => props.theme.colors.primaryBlue};
  color: ${(props) => props.theme.colors.primaryBlue};

  &:hover {
    background: ${(props) => props.theme.colors.secondaryBlue};
  }

  &:disabled {
    cursor: default;
    opacity: 0.3;
    pointer-events: none;
  }
`;

export const ThirdButton = styled(PrimaryButton)<IButton>`
  background: transparent;
  border: 2px solid ${(props) => props.theme.colors.primaryRed};
  color: ${(props) => props.theme.colors.primaryRed};

  &:hover {
    background: ${(props) => props.theme.colors.secondaryRed};
  }

  &:disabled {
    cursor: default;
    opacity: 0.3;
    pointer-events: none;
  }
`;

export const WhitePaperButton = styled.a.attrs(() => ({
  className: `flex justify-center items-center shadow-md app-font`,
}))`
  background: ${(props) => props.theme.colors.primaryRed};
  min-width: 150px;
  color: #ffffff;
  border-radius: 7px;
  padding: 14px 20px;
  font-weight: bold;
  font-size: 1.3rem;
  cursor: pointer;
`;

export const IconButton = styled.button.attrs<IButton>(() => ({
  className: `flex justify-center items-center`,
}))<IButton>`
  font-size: 25px;
  border-radius: 50rem;
  width: 30px;
  height: 30px;
  background: ${(props) => props.theme.colors.primaryBackground}10;
  transition: background 0.3s ease;

  &:hover {
    background: ${(props) => props.theme.colors.primaryBackground}50;
  }

  &:disabled {
    cursor: default;
    opacity: 0.3;
    pointer-events: none;
  }
`;
