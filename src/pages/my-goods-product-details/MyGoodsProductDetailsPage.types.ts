import { WithTranslation } from "react-i18next";

import { IProductStatusState } from "@/reducers/productStatusReducer";
import { Profile } from "@/reducers/sessionReducer";
import { IOrdersState } from "@/reducers/ordersReducer";
import { IProduct } from "@/reducers/productReducer";
import { ICategoryClassificator } from "@/reducers/categoryReducer";
import { ResizeEvent } from "@/store/rootReducer";
import { IChatProps } from "@/store/connectChat";
import { IShareProps } from "@/store/connectShare";
import { ActiveFeatureDetails, Product } from "@/types/marketplaceapi";
import { Country } from "@/types/commonapi";

export type Props = WithTranslation &
  IChatProps &
  IShareProps & {
    profile?: Profile;
    uid?: string;
    loading?: boolean;
    error?: unknown;
    item?: IProduct;
    categoriesClassificator?: ICategoryClassificator[];
    loadProductDetails?: (uid: string) => void;
    changeProductStatus?: (
      uid: string,
      oldStatus: Product.StatusEnum,
      newStatus: Product.StatusEnum,
      quantity?: number
    ) => void;
    updateProductExpirationDate?: (uid: string, expirationDate: Date) => void;
    productStatusReducer?: IProductStatusState;
    updateProductDraft?: (item: IProduct, reset?: boolean) => void;
    createPromotionOrder?: (featureUid: string, productUid: string) => void;
    ordersReducer?: IOrdersState;
    countryClassificator: Country[];
    resizeEvent?: ResizeEvent;
  };

export type State = {
  productActionsSheetOpened?: boolean;
  productActionsSheetSubmitted?: boolean;
  enterExtendPublicationDateSheetOpened?: boolean;
  contactSupportPopupOpened?: boolean;
  featureDetailsSheetOpened?: boolean;
  featureDetails?: ActiveFeatureDetails;
  /* TODO */
  expirationDate: string;
  formErrors?: any;
  formValidFields?: any;
  formValid: boolean;
  sliderZoom: boolean;
  playVideoSheetOpened?: boolean;
  videoId?: string;
  videoType?: string;
  activeSlideIndex: number;
  imageHoveredItemImageSwitcher?: number;
  userLatLng?: any;
};
