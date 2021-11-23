import React from "react";
import {
  IcBlack,
  IcBlue,
  IcPurple,
  IcRed,
  IcWhite,
  IcOrangeBrown,
  IcGreen,
  IcPink,
  IcMulticolor,
  IcGraySilver,
} from "../../../components-ui/icons";

type colorsType = {
  id: number;
  title: string;
  icon: JSX.Element;
};

export const colors: colorsType[] = [
  {
    id: 1,
    title: "Black",
    icon: <IcBlack />,
  },
  {
    id: 2,
    title: "White",
    icon: <IcWhite />,
  },
  {
    id: 3,
    title: "Blue",
    icon: <IcBlue />,
  },
  {
    id: 4,
    title: "Orange,Brown,Beige",
    icon: <IcOrangeBrown />,
  },
  {
    id: 5,
    title: "Green",
    icon: <IcGreen />,
  },
  {
    id: 6,
    title: "Pink",
    icon: <IcPink />,
  },
  {
    id: 7,
    title: "Purple",
    icon: <IcPurple />,
  },
  {
    id: 8,
    title: "Red",
    icon: <IcRed />,
  },
  {
    id: 9,
    title: "Gray,Silver",
    icon: <IcGraySilver />,
  },
  {
    id: 10,
    title: "Multicolor",
    icon: <IcMulticolor />,
  },
];
