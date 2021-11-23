import { AnyAction } from "redux";
import { StoreLink } from "../types/marketplaceapi";

export const SET_COMPANY_INFO = "SET_COMPANY_INFO";
export const SET_STORE_INFO = "SET_STORE_INFO";

export interface IAddCompanyState {
  companyInfo: {
    country: string;
    form: string;
    name: string;
    regNumber: string;
    vatNumber: string;
    email: string;
    phone: string;
    phoneCode: string;
    links: string[];
    addressCountry: string;
    addressCity: string;
    address: string;
    postcode: string;
  };
  storeInfo: {
    uid?: string;
    status: string;
    imageUrl: string;
    name: string;
    email: string;
    phone: string;
    description: string;
    links: StoreLink[];
  };
}

const initialState: IAddCompanyState = {
  companyInfo: {
    country: "",
    form: "",
    name: "",
    regNumber: "",
    vatNumber: "",
    email: "",
    phone: "",
    phoneCode: "",
    links: [""],
    addressCountry: "",
    addressCity: "",
    address: "",
    postcode: "",
  },
  storeInfo: {
    uid: "",
    status: "",
    imageUrl: "",
    name: "",
    email: "",
    phone: "",
    description: "",
    links: [],
  },
};

const addCompanyReducer = (
  state = initialState,
  action: AnyAction
): IAddCompanyState => {
  switch (action.type) {
    case SET_COMPANY_INFO:
      return {
        ...state,
        companyInfo: action.companyInfo,
      };
    case SET_STORE_INFO:
      return {
        ...state,
        storeInfo: action.storeInfo,
      };
    default:
      return state;
  }
};

export default addCompanyReducer;
