import styled from 'styled-components';
import Pattern from "../../../assets/images/Circle.png"

export const AppContainer = styled.div.attrs(() => ({
  className: `antialiased mx-auto container mx-auto md:max-w-full lg:max-w-screen-xl px-5 md:px-12 lg:px-8`,
}))`
  color: #fff;
  // background-image: url(${Pattern});
  // background-repeat: no-repeat;
  // background-size: cover;
`;
