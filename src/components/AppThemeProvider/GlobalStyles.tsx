import {
  createGlobalStyle,
  DefaultTheme,
  GlobalStyleComponent,
  ThemeProps,
} from 'styled-components';
import Pattern from "../../assets/images/Circle.png"

export const GlobalStyles: GlobalStyleComponent<
  ThemeProps<DefaultTheme>,
  DefaultTheme
> = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.colors.primaryBackground};
    background-image: url(${Pattern});
    background-repeat: no-repeat;
    background-size: cover;
    color: ${(props) => props.theme.colors.primaryText};
    font-family: 'Play', sans-serif;
    transition: all 0.20s linear;
  }
  hr {
    border: 1px solid ${(props) => props.theme.colors.primaryText}40;
  }
  `;
