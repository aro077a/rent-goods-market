import { ChangeEvent } from "react";
import { TFunction } from "react-i18next";

export interface IProductCreateContainer {
  t: TFunction<"translation">;
  f7router: any; //doesn't includes  or doesn't have type definition
}

export type imageType = {
  id: number;
  file?: File;
};

export interface IProductCharacteristics {
  handleSelectItems: (arg0: ChangeEvent<HTMLInputElement>) => void;
  text?: string[];
}

export type countryType = {
  name: string;
  code: string;
};
