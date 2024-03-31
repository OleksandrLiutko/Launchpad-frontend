import styled from 'styled-components';
import Pattern from "../../../assets/images/wave.png"

interface ICardTheme {
  className?: string;
}

export const Card = styled.div.attrs<ICardTheme>(() => ({
  className: `shadow-lg py-8 px-5 rounded-md`,
}))<ICardTheme>`
  background: ${(props) => props.theme.colors.secondaryBackground};
  background-image: url(${Pattern});
  border: 1px solid rgba(255, 255, 255, 0.125);
  box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  box-sizing: border-box;
  // background-blend-mode: color-dodge;

  &.launch-card {
    transition: all 0.3s ease;
    &:hover {
      box-shadow: -1px 0px 16px 8px rgba(251, 5, 5, 0.2);
      transform: scale(1.01);
    }
  }
`;

export const CardIcon = styled.div.attrs<ICardTheme>(() => ({
  className: `shadow flex py-8 px-5`,
}))<ICardTheme>`
  background: ${(props) => props.theme.colors.secondaryRed};
  color: ${(props) => props.theme.colors.primaryRed};
  border-radius: 10rem;
  font-size: 2rem;
  font-weight: bolder;
  width: 70px;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CardHeader = styled.h3.attrs<ICardTheme>(() => ({
  className: `font-bold text-2xl md:text-3xl`,
}))<ICardTheme>``;

export const CardSubHeader = styled.h3.attrs<ICardTheme>(() => ({
  className: `font-bold text-base md:text-xl`,
}))<ICardTheme>`
  color: ${(props) => props.theme.colors.primaryText}80;
`;

export const CardBody = styled.div.attrs<ICardTheme>(() => ({
  className: `text-base mt-8`,
}))<ICardTheme>``;
