import React, { FC } from "react";

export const IcMulticolor: FC = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="10" cy="10" r="10" fill="url(#paint0_angular)" />
      <defs>
        <radialGradient
          id="paint0_angular"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(10 10) rotate(90) scale(10)"
        >
          <stop stopColor="#FA3159" />
          <stop offset="0.194091" stopColor="#FF5684" />
          <stop offset="0.328211" stopColor="#FF7B5C" />
          <stop offset="0.496767" stopColor="#5571FE" />
          <stop offset="0.700684" stopColor="#BCF258" />
          <stop offset="0.888849" stopColor="#FFDC5B" />
          <stop offset="1" stopColor="#FF9C20" />
        </radialGradient>
      </defs>
    </svg>
  );
};
