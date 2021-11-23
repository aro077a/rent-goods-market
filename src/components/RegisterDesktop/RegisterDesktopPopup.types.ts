import { F7Popup } from "framework7-react";
import { WithTranslation } from "react-i18next";

import { CreateAccountRequest, ICreateAccountFormError } from "@/reducers/sessionReducer";
import { IClassificator } from "@/reducers/classificatorReducer";
import { CustomSelectValue } from "@/components/CustomSelect/CustomSelect.types";

export enum RegSteps {
  AUTH_DATA,
  PERSONAL_INFO,
}
export type RegisterDesktopPopupProps = Partial<F7Popup.Props>;

export type RegisterDesktopPopupMapProps = RegisterDesktopPopupProps &
  Pick<WithTranslation, "t"> & {
    countries: CustomSelectValue[];
    loading: boolean;
    registrationLoading: boolean;
    error: string;
    registered: boolean;
    request?: CreateAccountRequest;
    formErrors?: ICreateAccountFormError[];
    urls: IClassificator[];
    isSmallScreen: boolean;
    register: (request: CreateAccountRequest) => void;
    validateRequest: (request: CreateAccountRequest, fields: string[]) => void;
    changeRequest: (request: Partial<CreateAccountRequest>) => void;
  };

export type RegisterDesktopPopupState = {
  step: RegSteps;
  nextStep: RegSteps;
  country: CustomSelectValue | undefined;
  isCountrySelectPopupOpened: boolean;
  phoneCode: CustomSelectValue | undefined;
};
