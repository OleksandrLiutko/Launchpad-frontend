import React from 'react';
import { SocialIcons } from '../../common/Icons';

export const SocialIconsComponent = () => {
  return (
    <div className="flex space-x-5 w-full justify-center">
      <SocialIcons
        href="https://twitter.com/gas_pad_io"
        target="_blank"
        data-aos="fade-right"
        data-aos-delay="200"
      >
        <i className="lab la-twitter"></i>
      </SocialIcons>
      <SocialIcons
        href="https://medium.com/@gaspadd.io"
        target="_blank"
        data-aos="fade-right"
        data-aos-delay="300"
      >
        <i className="lab la-medium"></i>
      </SocialIcons>
      <SocialIcons
        href="https://t.me/gaspadbbc"
        target="_blank"
        data-aos="fade-right"
        data-aos-delay="500"
      >
        <i className="lab la-telegram"></i>
      </SocialIcons>
      <SocialIcons
        href="https://discord.gg/RukjxxCmE2"
        target="_blank"
        data-aos="fade-right"
        data-aos-delay="100"
      >
        <i className="lab la-discord"></i>
      </SocialIcons>
    </div>
  );
};
