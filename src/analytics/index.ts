import firebase from "firebase/app";

import { IProduct } from "@/reducers/productReducer";
import { Profile } from "@/reducers/sessionReducer";
import { formatPrice } from "@/utils";

import "firebase/analytics";

export type AnalyticsProvider = "firebase" | "console";

type AnalyticsCustomer = {
  customer_uid?: string;
  customer_name?: string;
};

type AnalyticsStore = {
  store_uid?: string;
  store_name?: string;
};

type AnalyticsProduct = AnalyticsCustomer & {
  product_uid?: string;
  product_name?: string;
  product_price?: string;
  product_quantity?: number;
};

type AnalyticsProductSeller = AnalyticsProduct & {
  seller_phone?: string;
};

type AnalyticsSearch = AnalyticsCustomer & {
  search_query?: string;
};

class Analytics {
  private readonly providers: AnalyticsProvider[];

  constructor(providers: AnalyticsProvider[]) {
    this.providers = providers;
  }

  public addProvider(provider: AnalyticsProvider) {
    this.providers.push(provider);
    console.log("Providers: " + JSON.stringify(this.providers));
  }

  public start(profile: Profile): void {
    const data: AnalyticsCustomer = Analytics.buildCustomerData(profile);
    this.logEvent("ms_open", data);
  }

  public register(profile: Profile): void {
    const data: AnalyticsCustomer = Analytics.buildCustomerData(profile);
    this.logEvent("ms_register", data);
  }

  public addToWishList(profile: Profile, product: IProduct): void {
    const data: AnalyticsProduct = {
      ...Analytics.buildCustomerData(profile),
      ...Analytics.buildProductData(product),
    };
    this.logEvent("ms_add_to_wishlist", data);
  }

  public addToCart(profile: Profile, product: IProduct, quantity: number): void {
    const data: AnalyticsProduct = {
      ...Analytics.buildCustomerData(profile),
      ...Analytics.buildProductData(product),
      product_quantity: quantity,
    };
    this.logEvent("ms_add_to_cart", data);
  }

  public startChatWithSeller(profile: Profile, product: IProduct): void {
    const data: AnalyticsProductSeller = {
      ...Analytics.buildCustomerData(profile),
      ...Analytics.buildProductData(product),
      seller_phone: product.sellerPhone,
    };
    this.logEvent("ms_start_chat_with_seller", data);
  }

  public shareProduct(profile: Profile, product: IProduct): void {
    const data: AnalyticsProduct = {
      ...Analytics.buildCustomerData(profile),
      ...Analytics.buildProductData(product),
    };
    this.logEvent("ms_share_product", data);
  }

  public shareStore(profile: Profile, store: any): void {
    const data: AnalyticsProduct = {
      ...Analytics.buildCustomerData(profile),
      ...Analytics.buildStoreData(store),
    };
    this.logEvent("ms_share_store", data);
  }

  public searchProduct(profile: Profile, query: string): void {
    const data: AnalyticsSearch = {
      ...Analytics.buildCustomerData(profile),
      search_query: query,
    };
    this.logEvent("ms_search", data);
  }

  public openCreateProduct(profile: Profile): void {
    const data: AnalyticsCustomer = Analytics.buildCustomerData(profile);
    this.logEvent("ms_open_create_product", data);
  }

  public createProduct(profile: Profile, product: IProduct): void {
    const data: AnalyticsProduct = {
      ...Analytics.buildCustomerData(profile),
      ...Analytics.buildProductData(product),
    };
    this.logEvent("ms_create_product", data);
  }

  public publishProduct(profile: Profile, product: IProduct): void {
    const data: AnalyticsProduct = {
      ...Analytics.buildCustomerData(profile),
      ...Analytics.buildProductData(product),
    };
    this.logEvent("ms_publish_product", data);
  }

  private static buildCustomerData(profile: Profile): AnalyticsCustomer {
    return {
      customer_uid: profile.uid,
      customer_name: profile.person?.name + " " + profile.person?.surname,
    };
  }

  private static buildStoreData(store: any): AnalyticsStore {
    return {
      store_uid: store.uid,
      store_name: store.name,
    };
  }

  private static buildProductData(product: IProduct): AnalyticsProduct {
    return {
      product_uid: product.uid,
      product_name: product.name,
      product_price: formatPrice(product.discountedPrice || product.price, product.currencyCode),
    };
  }

  private logEvent(event: string, data: any): void {
    this.providers.forEach((provider) => {
      switch (provider) {
        case "console":
          console.log("Event: " + event + ". Data: " + JSON.stringify(data));
          break;
        case "firebase":
          firebase.analytics().logEvent(event, data);
          break;
      }
    });
  }
}

export default Analytics;
