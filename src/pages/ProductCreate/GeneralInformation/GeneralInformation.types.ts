import { ChangeEvent } from "react";

export type TImageType = {
  id?: string | number;
  image?: File;
};

export type TVideoLinkType = {
  id?: string;
  type?: string;
  name?: string;
  enabled?: boolean;
};

export interface IGenInfoProps {
  handleSelectDealType: any;
  dealType: string;
}
