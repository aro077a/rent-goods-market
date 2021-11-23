import React, { useState } from "react";
import { Page, Block, BlockTitle, Popover, List, ListItem, Sheet } from "framework7-react";
import { LatLng } from "react-google-places-autocomplete/build/GooglePlacesAutocomplete.types";
import { AboutPopup } from "@/components/AboutPopup";
import { AgreementPopup } from "@/components/AgreementPopup";
import { ContactSupportPopup } from "@/components/ContactSupportPopup";
import { IApplicationStore, ILocalConfig, ResizeEvent } from "@/store/rootReducer";
import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";

import { Profile } from "@/reducers/sessionReducer";
import { getProfile } from "@/selectors/profile";
import { Slider, SliderType, SliderItem } from "@/components/Slider";
import CategoriesMenu from "@/components/CategoriesMenu";
import { CatalogBlockTitle } from "@/components/CatalogBlockTitle";
import { Catalog } from "@/components/Catalog";
import {
  chooseCategory,
  chooseSubcategory,
  allFiltresClear,
  chooseSortBy,
  chooseCategorySubcategory,
  chooseLocation,
  chooseLocationPlace,
  clearSortBy,
} from "@/actions/filterActions";
import { loadCategories } from "@/actions/categoryActions";
import {
  searchClear,
  ISearchParams,
  searchProducts,
  loadProductListType,
  loadProductListCategory,
  addToWishList,
  loadProductWishList,
} from "@/actions/productActions";
import { IProduct, IProductState, ProductListType } from "@/reducers/productReducer";
import { ICategoryClassificator } from "@/reducers/categoryReducer";
import connectCategoriesClassificator from "@/store/connectCategoriesClassificator";
import connectAllGoods from "@/store/connectAllGoods";
import { ProfileLink } from "@/components/ProfileLink";
import connectLocalConfig from "@/store/connectLocalConfig";
import connectChat, { IChatProps } from "@/store/connectChat";
import connectAllDeals from "@/store/connectAllDeals";
import { BigMarketingBannerSlider } from "@/components/BigMarketingBannerSlider";
import { CategoriesMenuDesktop } from "@/components/categories-menu-desktop";
import { goToMessenger, TC_AGREEMENT_SETTINGS_KEY } from "@/actions/profileActions";
import { ProfilePopover } from "@/components/ProfilePopover";
import { SortingButton } from "@/components/sorting-button";
import { sortByTypes } from "@/components/SortByButtonsGroup";
import { SortBy, IFilterState } from "@/reducers/filterReducer";
import connectFilter from "@/store/connectFilter";
import connectCart, { ICartProps } from "@/store/connectCart";
import connectSearch, { SearchConnectorProps } from "@/store/connectSearch";
import { Navbar } from "@/components/navbar";
import { analytics } from "@/Setup";
import { StartChat } from "@/components/StartChat";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { VerifyAccountPopup } from "@/components/VerifyAccountPopup";
import { productSearchByType } from "@/actions/publicActions";
import { LoginDesktopPopup } from "@/components/LoginDesktopPopUp";
import { useLoginScenary } from "@/hooks/useLoginScenary";
import { useAppSelector } from "@/hooks/store";
import { Product } from "@/types/commonapi";
import { ForgotPasswordPopUp } from "@/components/ForgotPasswordPopUp";
import { RegisterDesktopPopup } from "@/components/RegisterDesktop";

import SelectCategorySheet from "./select-category-sheet";
import { getSortByFields } from "./all-filtres-popup";

import "./home.less";

type Props = IChatProps &
  WithTranslation &
  ICartProps &
  IFilterState &
  SearchConnectorProps & {
    profile?: Profile;
    loadCategories?(): void;
    chosenCategoryId?: string | null;
    chosenSubcategoryId?: string | null;
    chosenLocation?: string | null;
    chosenLocationPlace?: string | null;
    chooseCategory?(catid?: string | null): void;
    chooseSubcategory?(catid?: string): void;
    clearSortBy?(): void;
    productState?: IProductState;
    loadProducts?(type: ProductListType): void;
    loadProductListCategory?(type: ProductListType): void;
    categoriesClassificator?: ICategoryClassificator[];
    allGoodsProducts?: IProduct[];
    loadAllGoods?(searchParams?: ISearchParams): void;
    allGoodsCount?: number;
    allGoodsOffset?: number;
    allGoodsLoading?: boolean;
    localConfig?: ILocalConfig;
    addToWish?(uid?: string): void;
    loadProductWishList?(): () => Promise<void>;
    resizeEvent?: ResizeEvent;
    goToMessenger?(): void;
    clearFilter?(): void;
    chooseSortBy?(sortBy: SortBy, refresh?: boolean): void;
    chooseCategorySubcategory?(catid?: string, subcatid?: string): void;
    chooseLocation?(location?: LatLng | null): void;
    chooseLocationPlace?(locationPlace?: string | null): void;
    loadAllDeals?(searchParams: ISearchParams): void;
    reloadAllDeals?(): void;
    allDealsCount?: number;
    allDealsOffset?: number;
    allDealsLoading?: boolean;
    allDealsProducts?: IProduct[];
    // popularProducts(type): void;
    productSearchByType?: (type: string) => Promise<Product[]>;
    loggedIn?: boolean;
  };

type State = {
  searchBarEnable?: boolean;
  selectCategorySheetOpened?: boolean;
  categoriesMenuOpened?: boolean;
  profilePopoverOpened?: boolean;
  sortingMenuPopoverOpened?: boolean;
  aboutPopupOpened?: boolean;
  contactSupportPopupOpened?: boolean;
  seeAll?: boolean;
  seeAllLoaded?: boolean;
  allDeals?: boolean;
  showBadges?: boolean;
  agreementPopupOpened?: boolean;
  selectedProductUid?: string;
  startChatSheetOpened?: boolean;
  verifyAccountPopupOpened?: boolean;
  // popularProducts: (Product & { wish: boolean })[];
  searchableProducts: { 10159983: SliderItem[]; 20001: SliderItem[] };
  loginPopupOpened: boolean;
  forgotPasswordPopupOpened: boolean;
  registerPopupOpened: boolean;
};

type HomePopupsProps = {
  children?: (onLoginClick: () => void) => JSX.Element;
};

// ! maybe it will be usefull if we will refactor pages with Navbar component
const LoginPopups: React.FC<HomePopupsProps> = ({ children }) => {
  const [loginPopupOpened, setLoginPopupOpened] = useState(false);
  const [forgotPasswordPopupOpened, setForgotPasswordPopupOpened] = useState(false);
  const [profilePopoverOpened, setProfilePopoverOpened] = useState(false);
  const [aboutPopupOpened, setAboutPopupOpened] = useState(false);
  const [verifyAccountPopupOpened, setVerifyAccountPopupOpened] = useState(false);
  const [contactSupportPopupOpened, setContactSupportPopupOpened] = useState(false);
  const [agreementPopupOpened, setAgreementPopupOpened] = useState(false);
  const [registerPopupOpened, setRegisterPopupOpened] = useState(false);

  const { onRegister, onForgotPassword, onLoginClick } = useLoginScenary(
    setLoginPopupOpened,
    setForgotPasswordPopupOpened,
    setRegisterPopupOpened
  );

  const profile = useAppSelector(getProfile);

  return (
    <>
      {children(onLoginClick)}
      <LoginDesktopPopup
        opened={loginPopupOpened}
        setOpened={setLoginPopupOpened}
        onRegister={onRegister}
        onForgotPassword={onForgotPassword}
      />
      <ForgotPasswordPopUp
        opened={forgotPasswordPopupOpened}
        setOpened={setForgotPasswordPopupOpened}
      />
      {profile && (
        <ProfilePopover
          backdrop={false}
          opened={profilePopoverOpened}
          target=".profile-link"
          onPopoverOpen={() => setProfilePopoverOpened(true)}
          onPopoverClosed={() => setProfilePopoverOpened(false)}
          onAboutClick={() => setAboutPopupOpened(true)}
          onVerifyClick={() => setVerifyAccountPopupOpened(true)}
          slot="fixed"
        />
      )}

      <AboutPopup
        profile={profile}
        backdrop
        opened={aboutPopupOpened}
        onPopupClosed={() => setAboutPopupOpened(false)}
        onContactSupportClick={() => setContactSupportPopupOpened(true)}
      />

      <ContactSupportPopup
        profile={profile}
        category="Application"
        backdrop
        opened={contactSupportPopupOpened}
        onPopupClosed={() => setContactSupportPopupOpened(false)}
      />

      <AgreementPopup
        profile={profile}
        backdrop
        opened={agreementPopupOpened}
        onPopupClosed={() => setAgreementPopupOpened(false)}
      />

      <VerifyAccountPopup
        backdrop
        opened={verifyAccountPopupOpened}
        onPopupClosed={() => setVerifyAccountPopupOpened(false)}
      />
    </>
  );
};

class HomePage extends React.Component<Props, State> {
  // page: any; ! not used
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      searchBarEnable: false,
      selectCategorySheetOpened: false,
      seeAll: false,
      seeAllLoaded: false,
      allDeals: false,
      showBadges: false,
      agreementPopupOpened: false,
      startChatSheetOpened: false,
      selectedProductUid: null,
      verifyAccountPopupOpened: false,
      // popularProducts: [],
      searchableProducts: { "10159983": [], "20001": [] },
      forgotPasswordPopupOpened: false,
      loginPopupOpened: false,
      registerPopupOpened: false,
    };
  }

  async componentDidMount() {
    /* TODO */

    // setTimeout(() => {
    this.loadMainSlider();
    this.loadSliders();
    this.loadAllGoods();
    if (!this.props.loggedIn) {
      this.props.loadProductWishList();
    }
    // }, 1500);
  }

  componentDidUpdate(prevProps: Props) {
    this.handleAllLoading(prevProps);
    this.handleInfiniteLoading(prevProps);
    this.handleChatErrors(prevProps);
    this.handleSorting(prevProps);
    this.handleCategoryMenu(prevProps);

    if (
      prevProps.productState.productsWishList.length !==
      this.props.productState.productsWishList.length
    ) {
      this.getSearchableProducts();
    }

    if (
      prevProps.chosenCategoryId !== this.props.chosenCategoryId &&
      prevProps.chosenSubcategoryId !== this.props.chosenSubcategoryId &&
      !this.state.selectCategorySheetOpened
    ) {
      this.setState({ showBadges: !this.state.showBadges });
    }

    // ! useless because this.$f7router.navbarsEl is undefined
    // if (this.$f7router.url.indexOf("/profile/") !== -1) {
    //   this.$f7router.navbarsEl && this.$f7router.navbarsEl.classList.add("hide-nav-main");
    // } else {
    //   this.$f7router.navbarsEl && this.$f7router.navbarsEl.classList.remove("hide-nav-main");
    // }
  }

  loadMainSlider = () => {
    const { chosenCategoryId, chosenSubcategoryId } = this.props;
    if (!chosenCategoryId && !chosenSubcategoryId) {
      this.props.loadProducts("popular");
    }
  };

  loadSliders = () => {
    const { chosenCategoryId, chosenSubcategoryId } = this.props;
    if (chosenCategoryId || chosenSubcategoryId) {
      return;
    }

    if (this.$f7router.currentRoute.params) {
      const { catid, subcatid } = this.$f7router.currentRoute.params;
      if (catid || subcatid) {
        return;
      }
    }

    const sliderCategories = ["10159983", "900"];
    sliderCategories.forEach((category: string) => this.props.loadProductListCategory(category));
  };

  clearSearch = () => {
    const { resizeEvent } = this.props;
    const isMobile = resizeEvent.width < 567;
    if (isMobile) {
      this.setState({ seeAll: false, seeAllLoaded: false, allDeals: false });
    }
    this.props.clearSearch(!isMobile);
    this.props.clearSortBy();
  };

  getSearchableProducts = async () => {
    const { chosenSubcategoryId } = this.props;
    if (!chosenSubcategoryId) {
      // const popularProducts = await productSearchByType("popular");
      const res = [
        await this.searchProductsByParams({ category: "10159983" }),
        await this.searchProductsByParams({ category: "20001" }),
      ];

      this.setState({
        // popularProducts,
        searchableProducts: {
          10159983: res[0].map((item) => ({
            ...item,
            wish: this.props.productState.productsWishList.find(({ uid }) => uid === item.uid)
              ?.wish,
          })),
          20001: res[1].map((item) => ({
            ...item,
            wish: this.props.productState.productsWishList.find(({ uid }) => uid === item.uid)
              ?.wish,
          })),
        },
      });
    }
  };

  handlePageInit = async () => {
    if (this.$f7router.currentRoute.params) {
      this.clearSearch();
      const { catid, subcatid } = this.$f7router.currentRoute.params;
      if (catid && subcatid) {
        this.props.search({
          category: subcatid,
          count: 10,
          offset: 0,
          resetSearch: true,
          resetSorting: true,
          name: null,
        });
      }
    }

    this.setState({
      searchBarEnable: false,
      selectCategorySheetOpened: false,
      categoriesMenuOpened: false,
      profilePopoverOpened: false,
      sortingMenuPopoverOpened: false,
      aboutPopupOpened: false,
      contactSupportPopupOpened: false,
      seeAll: false,
      seeAllLoaded: false,
      allDeals: false,
    });

    await this.getSearchableProducts();
  };

  async handleAllLoading(prevProps: Props) {
    /* TODO */
    const { profile } = this.props;

    if (profile && profile.uid && profile.uid !== prevProps.profile.uid) {
      this.clearSearch();
      this.props.loadProductWishList();
      this.loadMainSlider();
      this.loadAllGoods();

      /* TODO Maybe, we will add on profile loaded event?! */
      if (this.$f7router.currentRoute.params) {
        const { catid, subcatid } = this.$f7router.currentRoute.params;
        if (catid && subcatid) {
          this.props.chooseCategory(catid);
          this.props.chooseSubcategory(subcatid);
          this.props.search({
            category: subcatid,
            count: 10,
            offset: 0,
            resetSearch: true,
            resetSorting: true,
          });
        } else if (catid) {
          this.setState({ seeAll: true }, () => {
            this.props.chooseCategory(catid);
            this.props.search({
              category: catid,
              count: 15,
              offset: 0,
              resetSearch: true,
              resetSorting: true,
            });
          });
        }
      }

      //this.checkUserAgreement();
    }
  }

  handleInfiniteLoading = (prevProps: Props) => {
    if (
      prevProps.productState.loading &&
      prevProps.productState.loading !== this.props.productState.loading
    ) {
      this._lock = false;
    }
    if (prevProps.allGoodsLoading && prevProps.allGoodsLoading !== this.props.allGoodsLoading) {
      this._lock = false;
    }
    if (prevProps.allDealsLoading && prevProps.allDealsLoading !== this.props.allDealsLoading) {
      this._lock = false;
    }
  };

  handleSelectCategorySheet(prevProps: Props) {
    const { chosenCategoryId, chosenSubcategoryId } = this.props;
    const { selectCategorySheetOpened, seeAll, seeAllLoaded } = this.state;
    const isSelectedAnotherCategory = prevProps.chosenCategoryId !== chosenCategoryId;
    const isSelectedOnlyCategory =
      chosenCategoryId &&
      isSelectedAnotherCategory &&
      prevProps.chosenCategoryId !== chosenCategoryId &&
      !this.props.chosenSubcategoryId;

    if (isSelectedOnlyCategory && !selectCategorySheetOpened && !seeAll) {
      this.toggleSelectCategorySheet(true);
    } else if (
      chosenCategoryId &&
      chosenSubcategoryId &&
      selectCategorySheetOpened &&
      !seeAll &&
      !this.props.productState.loading
    ) {
      /* TODO */
      this.toggleSelectCategorySheet(false);
    } else if (chosenCategoryId && seeAll && !seeAllLoaded && !this.props.productState.loading) {
      this.clearSearch();
      this.setState({ seeAllLoaded: true }, () => undefined);
    }
  }

  handleCategoryMenu = (prevProps: Props) => {
    const { chosenCategoryId, chosenSubcategoryId } = this.props;
    const { categoriesMenuOpened } = this.state;

    if (
      chosenCategoryId &&
      chosenSubcategoryId &&
      (prevProps.chosenCategoryId !== chosenCategoryId ||
        prevProps.chosenSubcategoryId !== chosenSubcategoryId) &&
      categoriesMenuOpened
    ) {
      this.setState({ categoriesMenuOpened: false }, () => {
        this.clearSearch();
      });
    }
  };

  handleSorting = (prevProps: Props) => {
    const { allDeals } = this.state;
    const { sortBy } = this.props;
    if (!allDeals && prevProps.sortBy !== sortBy) {
      const { chosenCategoryId, chosenSubcategoryId } = this.props;
      const { searchTerm } = this.props.productState;
      const params: ISearchParams = {
        category: chosenSubcategoryId || chosenCategoryId,
        name: searchTerm,
        count: 10,
        offset: 0,
        resetSorting: true,
      };

      if (sortBy.length) {
        params.sortBy = getSortByFields(sortBy);
      }

      this.props.search(params);
    }
  };

  toggleSelectCategorySheet(show = true) {
    this.setState({ selectCategorySheetOpened: show });
  }

  handleChatErrors = (prevProps: Props) => {
    if (this.$f7route.url === this.$f7router.currentRoute.url) {
      const { error } = this.props.chatReducer;
      if (error && error !== prevProps.chatReducer.error) {
        this.$f7?.dialog.alert(error);
      }
    }
  };

  handleOnSelectCategorySheetClosed = () => {
    this.toggleSelectCategorySheet(false);
    requestAnimationFrame(() => {
      this.clearFilter();

      if (this.props.chosenCategoryId && this.props.chosenSubcategoryId) {
        this.setState({ showBadges: true });
      }
    });
  };

  clearFilter = () => {
    const { chosenSubcategoryId } = this.props;

    if (!chosenSubcategoryId) {
      this.props.chooseCategory(null);
    }
  };

  seeAllHandle(catid: string) {
    if (catid) {
      this.setState({ seeAll: true, showBadges: true }, () => {
        this.props.chooseCategory(catid);
        this.props.search({});
      });
    }
  }

  categoryClickHandle = (catid: string) => {
    if (catid === "all_filtres") {
      this.$f7router.navigate("/all-filtres/");
      return;
    }

    this.props.clearFilter();
    this.props.chooseCategory(catid);

    this.setState({
      selectCategorySheetOpened: !this.state.selectCategorySheetOpened,
    });
  };

  clearFilterHandle = () => {
    this.props.chooseCategory(null);
    this.props.chooseLocation(null);
    this.props.chooseLocationPlace(null);
    this.clearSearch();
    this.setState({ showBadges: false });
  };

  searchbarEnableHandle = () => {
    this.setState({ searchBarEnable: true });
  };

  searchbarDisableHandle = () => {
    const { chosenCategoryId, chosenSubcategoryId } = this.props;
    this.setState({ searchBarEnable: false }, () => {
      this._lock = false;
    });
    this.clearSearch();
    if (chosenCategoryId || chosenSubcategoryId) {
      this.props.search({});
    }
  };

  checkUserAgreement = () => {
    const { profile } = this.props;
    if (profile && profile.uid && !this.state.agreementPopupOpened) {
      const termsSettings = (profile.accountSettings || []).filter((s) => {
        return s.name === TC_AGREEMENT_SETTINGS_KEY;
      });
      if (termsSettings.length === 0 || termsSettings[0]["value"] !== "true") {
        this.setState({ agreementPopupOpened: true });
        analytics.register(this.props.profile);
      }
    }
  };

  _lock = false;

  loadMore = () => {
    const { searchBarEnable } = this.state;
    const { searchLoading } = this.props;
    const { products, totalCount } = this.props.productState;
    const isFilterEnable = this.isFilterEnable();

    if (this._lock) return;
    this._lock = true;

    if ((searchBarEnable || isFilterEnable) && !searchLoading && products.length !== totalCount) {
      this.props.search({
        offset: this.props.productState.offset,
        count: this.props.productState.count,
      });
    }

    if (!searchBarEnable && !isFilterEnable && !this.props.allGoodsLoading) {
      this.loadAllGoods();
    }
  };

  searchbarClearHandle = () => {
    this.clearSearch();
  };

  isFilterEnable = () =>
    (this.state.searchBarEnable && this.props.resizeEvent.width < 567) ||
    this.props.chosenCategoryId ||
    this.props.chosenSubcategoryId ||
    this.props.chosenLocation;

  sliderItemClickHandle = (item: SliderItem) => {
    this.$f7router.navigate(item.href);
  };

  getSlidesItems = (items: IProduct[]): SliderItem[] =>
    items.map((item) => ({
      ...item,
      image: item.imageUrl1,
      priceDiscount: item.discountedPrice,
      href: `/product-details/${item.uid}/`,
      onClick: this.sliderItemClickHandle,
      description: item.shortDescription,
      wish: !!this.props.productState.productsWishList.find(({ uid }) => item.uid === uid),
    }));

  getSlidesPopularProducts = (): SliderItem[] => {
    const {
      productState: { productTypeGroups },
    } = this.props;

    if (productTypeGroups) {
      const popularType = productTypeGroups.find((item) => item.type === "popular");

      if (popularType) {
        return popularType.products ? this.getSlidesItems(popularType.products) : [];
      }
    }

    return [];
  };

  loadAllGoods = () => {
    const { allGoodsLoading, allGoodsCount, allGoodsOffset } = this.props;
    if (!allGoodsCount) return;

    if (!allGoodsLoading) {
      const params: ISearchParams = {
        count: allGoodsCount,
        offset: allGoodsOffset,
      };
      this.props.loadAllGoods(params);
    }
  };

  startChatHandle = (uid?: string, message?: string) => {
    if (!uid) {
      if (!this.state.selectedProductUid) return;
      uid = this.state.selectedProductUid;
    }
    const products = this.props.productState.productTypeGroups.filter(
      (item) => item.type === "popular"
    )[0];
    const item = products.products.filter((item) => item.uid == uid)[0];

    const { loading } = this.props.chatReducer;
    if (loading) return;

    this.props.startChatWithProduct(item, message);
    analytics.startChatWithSeller(this.props.profile, item);

    this.setState({
      startChatSheetOpened: false,
      selectedProductUid: null,
    });
  };

  renderCategoryTitleInSearchResultList() {
    const selectedCategory = this.props.categoriesClassificator.length
      ? this.props.categoriesClassificator.find(
          (item) =>
            item.categoryCode === (this.props.chosenSubcategoryId || this.props.chosenCategoryId)
        )
      : null;

    return selectedCategory ? (
      <div className="catalog-block-title block-title block-title-medium pure-hidden-xs">
        {selectedCategory.categoryName}
        {this.renderSortingMenu()}
      </div>
    ) : null;
  }

  renderSortingMenu() {
    const { t } = this.props;

    const sortTypes = sortByTypes.reduce((prev, cur) => {
      prev.push(...cur);
      return prev;
    }, []);
    const sortBy = this.props.sortBy[0] || SortBy.sales_first;
    const selectedSortType = sortTypes.filter((item) => item.type === sortBy)[0];

    return (
      <SortingButton
        text={t(selectedSortType.text)}
        onClick={() => {
          /* TODO */
          const inst = this.$f7.popover.get(".sorting-menu");
          if (inst) {
            this.$f7.popover.open(inst.el, ".sorting-button");
            this.setState({
              sortingMenuPopoverOpened: !this.state.sortingMenuPopoverOpened,
            });
          }
        }}
        opened={this.state.sortingMenuPopoverOpened}
      />
    );
  }

  renderProfileLink = () => {
    const { profile, resizeEvent } = this.props;
    const props = { profile };
    if (resizeEvent && resizeEvent.width > 567) {
      props["href"] = "#";
      props["onClick"] = this.handleClickProfileLink;
    }
    return <ProfileLink key="profile_link" {...props} />;
  };

  handleClickProfileLink = () => {
    this.setState({ profilePopoverOpened: true });
  };

  renderSortingMenuPopover() {
    const { t } = this.props;

    return (
      <Popover
        className="sorting-menu"
        opened={this.state.sortingMenuPopoverOpened}
        onPopoverClosed={() => this.setState({ sortingMenuPopoverOpened: false })}
        backdrop={false}
        slot="fixed"
      >
        <List noHairlines noChevron noHairlinesBetween>
          {sortByTypes
            .reduce((prev, cur) => {
              prev.push(...cur);
              return prev;
            }, [])
            .map((item, i) => (
              <ListItem
                key={i.toString()}
                link="#"
                popoverClose
                title={t(item.text).toString()}
                onClick={() => {
                  this.setState(
                    {
                      sortingMenuPopoverOpened: false,
                    },
                    () => this.props.chooseSortBy(item.type, true)
                  );
                }}
              />
            ))}
        </List>
      </Popover>
    );
  }

  onClickProfileLink = () => {
    const { profile, resizeEvent } = this.props;
    if (resizeEvent && resizeEvent.width > 567 && profile && profile.uid) {
      this.handleClickProfileLink();
    } else if (resizeEvent && resizeEvent.width > 567) {
      this.onLoginClick();
    }
  };

  onRegister = () => this.setState({ loginPopupOpened: false, registerPopupOpened: true });

  onForgotPassword = () =>
    this.setState({ loginPopupOpened: false, forgotPasswordPopupOpened: true });

  onLoginClick = () => this.setState({ loginPopupOpened: true });

  onClickLogoLink = () => {
    const { searchbar } = this.$f7;
    searchbar.disable(".search-bar");
    this.props.chooseCategory(null);
    this.clearSearch();
    this.setState({
      categoriesMenuOpened: false,
      searchBarEnable: false,
    });
    this.$f7router.navigate("/", {
      reloadAll: true,
    });
  };

  onClickOpenCategoriesMenu = () =>
    this.setState({
      categoriesMenuOpened: !this.state.categoriesMenuOpened,
    });

  searchProductsByParams = async (params: Partial<ISearchParams>) => {
    const { search } = this.props;

    const res = (await search({
      ...params,
      count: params.count || 10,
      returnBody: true,
      offset: 0,
    })) as unknown as IProduct[];

    return this.getSlidesItems(res);
  };

  getCategoryName = (categoryCode: "10159983" | "20001") =>
    this.props.categoriesClassificator.length
      ? this.props.categoriesClassificator.filter((item) => item.categoryCode === categoryCode)[0]
          .categoryName
      : null;

  render() {
    const { searchedProducts, searchLoading, allGoodsLoading, profile, resizeEvent, t } =
      this.props;
    const isFilterEnable = this.isFilterEnable();
    const { searchBarEnable, selectCategorySheetOpened, allDeals, searchableProducts } = this.state;
    const showOnSearch = !isFilterEnable; /* || !this.props.resizeEvent?.isXS */

    const popularProds = this.getSlidesPopularProducts();

    return (
      <Page
        id="home_page"
        name="home-page"
        infinite
        infiniteDistance={300}
        infinitePreloader={searchLoading || allGoodsLoading}
        onInfinite={this.loadMore}
        onPageInit={this.handlePageInit}
        subnavbar={resizeEvent.width < 769}
      >
        <Navbar
          profile={profile}
          showCartLink
          wishButtonShow
          showProfileLink
          onClickProfileLink={this.onClickProfileLink}
          onClickLogoLink={this.onClickLogoLink}
          onClickOpenCategoriesMenu={this.onClickOpenCategoriesMenu}
          openCategoriesMenuButton={this.state.categoriesMenuOpened}
          onSearchbarEnable={this.searchbarEnableHandle}
          onSearchbarDisable={this.searchbarDisableHandle}
          onSearchClickClear={this.searchbarClearHandle}
          showSearchbar
          findedProducts={this.props.searchProductsAutocomplete}
          findProductLoading={this.props.searchLoadingAutocomplete}
          onFindedProductItemClick={(uid) => this.$f7router.navigate(`/product-details/${uid}/`)}
          // onClickGoToMessenger={this.props.goToMessenger}
          slot="fixed"
          onLoginClick={this.onLoginClick}
        />

        {!searchBarEnable && (
          <CategoriesMenu
            className="pure-visible-xs"
            categoryOnClick={this.categoryClickHandle}
            clearFilterOnClick={this.clearFilterHandle}
            showBadges={this.state.showBadges}
          />
        )}

        {showOnSearch && !allDeals && (
          <>
            <Block className="no-padding">
              <BigMarketingBannerSlider />
            </Block>

            <BlockTitle medium>{t("Most Popular")}</BlockTitle>

            <Slider
              slides={popularProds}
              type={SliderType.big}
              startChat={(uid) => {
                this.setState(
                  {
                    selectedProductUid: uid,
                  },
                  () => {
                    this.setState({
                      startChatSheetOpened: true,
                    });
                  }
                );
              }}
              showIfEmpty
            />
            <CatalogBlockTitle medium onClick={() => this.seeAllHandle("10159983")}>
              {t(this.getCategoryName("10159983"))}
            </CatalogBlockTitle>
            <Slider
              slides={searchableProducts["10159983"]}
              type={SliderType.small}
              showIfEmpty
              showFeaturesHiglight
            />

            <CatalogBlockTitle medium onClick={() => this.seeAllHandle("20001")}>
              {t(this.getCategoryName("20001"))}
            </CatalogBlockTitle>
            <Slider
              slides={searchableProducts["20001"]}
              type={SliderType.small}
              showIfEmpty
              showFeaturesHiglight
            />

            <CatalogBlockTitle medium>{t("All goods")}</CatalogBlockTitle>
            <Catalog
              items={this.props.allGoodsProducts}
              addToWish={this.props.addToWish}
              showFeaturesHiglight
            />
          </>
        )}

        {isFilterEnable && !showOnSearch && !allDeals && (
          <>
            <Breadcrumbs
              categoryCode={this.props.chosenSubcategoryId || this.props.chosenCategoryId}
              handleBackToMain={this.onClickLogoLink}
              hideLast
            />
            {this.renderCategoryTitleInSearchResultList()}
            <Catalog
              items={searchedProducts}
              addToWish={this.props.addToWish}
              showFeaturesHiglight
            />
          </>
        )}

        <div slot="fixed">
          <CategoriesMenuDesktop
            className="pure-hidden-xs"
            opened={this.state.categoriesMenuOpened}
          />
        </div>

        <SelectCategorySheet
          opened={selectCategorySheetOpened}
          onSheetClosed={this.handleOnSelectCategorySheetClosed}
          onChooseSubcategoryClick={() => this.props.search({})}
          slot="fixed"
        />
        {profile && (
          <ProfilePopover
            backdrop={false}
            opened={this.state.profilePopoverOpened}
            target=".profile-link"
            onPopoverClosed={() => this.setState({ profilePopoverOpened: false })}
            onAboutClick={() => this.setState({ aboutPopupOpened: true })}
            onVerifyClick={() => this.setState({ verifyAccountPopupOpened: true })}
            slot="fixed"
          />
        )}

        <LoginDesktopPopup
          opened={this.state.loginPopupOpened}
          setOpened={(val: boolean) => this.setState({ loginPopupOpened: val })}
          onRegister={this.onRegister}
          onForgotPassword={this.onForgotPassword}
        />
        <ForgotPasswordPopUp
          opened={this.state.forgotPasswordPopupOpened}
          setOpened={(val: boolean) => this.setState({ forgotPasswordPopupOpened: val })}
        />
        <RegisterDesktopPopup
          opened={this.state.registerPopupOpened}
          onPopupClose={() => this.setState({ registerPopupOpened: false })}
        />

        <AboutPopup
          profile={profile}
          backdrop
          opened={this.state.aboutPopupOpened}
          onPopupClosed={() => this.setState({ aboutPopupOpened: false })}
          onContactSupportClick={() => this.setState({ contactSupportPopupOpened: true })}
        />

        <ContactSupportPopup
          profile={profile}
          category="Application"
          backdrop
          opened={this.state.contactSupportPopupOpened}
          onPopupClosed={() => this.setState({ contactSupportPopupOpened: false })}
        />

        <AgreementPopup
          profile={profile}
          backdrop
          opened={this.state.agreementPopupOpened}
          onPopupClosed={() => this.setState({ agreementPopupOpened: false })}
        />

        {this.renderSortingMenuPopover()}

        <Sheet
          id="start_chat_sheet"
          swipeToClose
          backdrop
          opened={this.state.startChatSheetOpened}
          slot="fixed"
          style={{ height: "auto" }}
        >
          <StartChat
            opened={this.state.startChatSheetOpened}
            productUid={this.state.selectedProductUid}
            onClose={() => {
              this.setState({
                startChatSheetOpened: false,
              });
            }}
            onStartChat={(message) => this.startChatHandle(null, message)}
          />
        </Sheet>

        <VerifyAccountPopup
          backdrop
          opened={this.state.verifyAccountPopupOpened}
          onPopupClosed={() => this.setState({ verifyAccountPopupOpened: false })}
        />
      </Page>
    );
  }
}

const mapStateToProps = (state: IApplicationStore) => ({
  chosenCategoryId: state.filterReducer.chosenCategoryId,
  chosenSubcategoryId: state.filterReducer.chosenSubcategoryId,
  chosenLocation: state.filterReducer.location,
  chosenLocationPlace: state.filterReducer.locationPlace,
  profile: getProfile(state),
  searchLoading: state.productReducer.loading,
  searchedProducts: state.productReducer.products || [],
  productState: state.productReducer,
  resizeEvent: state.rootReducer.resizeEvent,
  sortBy: state.filterReducer.sortBy,
  loggedIn: state.sessionReducer.logged,
});

const mapDispatchToProps = (dispatch) => ({
  loadCategories: () => dispatch(loadCategories()),
  chooseCategory: (catid?: string) => dispatch(chooseCategory(catid)),
  chooseSubcategory: (catid?: string) => dispatch(chooseSubcategory(catid)),
  clearSearch: () => dispatch(searchClear()),
  clearSortBy: () => dispatch(clearSortBy()),
  search: (searchParams: ISearchParams) => dispatch(searchProducts(searchParams)),
  loadProducts: (type: ProductListType) => dispatch(loadProductListType(type)),
  loadProductListCategory: (type: ProductListType) => dispatch(loadProductListCategory(type)),
  addToWish: (uid?: string) => dispatch(addToWishList(uid)),
  loadProductWishList: () => dispatch(loadProductWishList()),
  goToMessenger: () => dispatch(goToMessenger()),
  clearFilter: () => dispatch(allFiltresClear()),
  chooseSortBy: (sortBy: SortBy, refresh?: boolean) => dispatch(chooseSortBy(sortBy, refresh)),
  chooseCategorySubcategory: (catid?: string, subcatid?: string) =>
    dispatch(chooseCategorySubcategory(catid, subcatid)),
  chooseLocation: (location?: LatLng) => dispatch(chooseLocation(location)),
  chooseLocationPlace: (locationPlace?: string) => dispatch(chooseLocationPlace(locationPlace)),
  productSearchByType: (type: string) => dispatch(productSearchByType(type)),
});

export default compose(
  connectLocalConfig,
  connectCategoriesClassificator,
  connectAllGoods,
  connectChat,
  connectFilter,
  connectCart,
  connectAllDeals,
  connect(mapStateToProps, mapDispatchToProps),
  connectSearch,
  withTranslation()
)(HomePage);
