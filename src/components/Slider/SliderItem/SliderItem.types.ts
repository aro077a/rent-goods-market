import { IProduct } from "@/reducers/productReducer";
import { SliderType } from "@/components/Slider/Slider.types";
import { ICategoryClassificator } from "@/reducers/categoryReducer";

export type SliderItem = Partial<IProduct> & {
  uid?: string;
  href?: string;
  name?: string;
  image?: string;
  promo?: string;
  description?: string;
  category?: string;
  categoryName?: string;
  price?: number;
  priceDiscount?: number;
  currencyCode?: string;
  onClick?(item: SliderItem): void;
  wish?: boolean;
  sellerPhone?: string;
  featureCodes?: string[];
  videoId?: string;
  videoType?: string;
  shortDescription?: string;
};

export type SliderItemProps = {
  item: SliderItem;
  type?: SliderType;
  empty?: boolean;
  classificator?: ICategoryClassificator[];
  onClickAddToWish?(uid: string): void;
  onClickStartChat?(uid: string): void;
  onClick?(item: SliderItem): void;
  showFeaturesHiglight?: boolean;
  videoPlayOnClick?(videoUrl: string, videoType: string): void;
};
