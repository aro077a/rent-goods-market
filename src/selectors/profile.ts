import { IApplicationStore } from "@/store/rootReducer";
import { Profile } from "@/reducers/sessionReducer";

export const getProfile = ({ sessionReducer, profileReducer }: IApplicationStore): Profile => {
  return sessionReducer.profile && sessionReducer.profile.uid
    ? sessionReducer.profile
    : profileReducer.profile;
};

export const getProfileWishList = (profile?: Profile): string[] => {
  let wishList = [];
  if (profile) {
    const marketplaceWishList = profile.accountSettings.filter(
      (item) => item.name === "marketplaceWishList"
    )[0];
    if (marketplaceWishList && marketplaceWishList.value) {
      try {
        wishList = JSON.parse(marketplaceWishList.value);
      } catch (err) {
        console.error(err);
      }
    }
  }

  return wishList;
};
