import { ReactElement } from "react";

export interface IAutocomplete {
  data?: dataObjectType[] | dataStringType[];
  className?: string;
  floatingLabel?: boolean;
  label?: string;
  clearButton?: boolean;
  checkbox?: boolean;
  title?: any;
}

export type dataObjectType = {
  id?: string | number;
  name: string;
};

export type dataStringType = {
  name: string;
};
