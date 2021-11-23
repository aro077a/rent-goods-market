import Framework7 from "framework7";
import { Router } from "framework7/modules/router/router";

import NotFoundPage from "./pages/404";
import AboutPage from "./pages/about";
import AccountStorePage from "./pages/account-store-page/AccountStorePage";
import addBusinessAccount from "./pages/add-business-account/routes";
import AllFiltresPage from "./pages/all-filtres-popup";
import CardsPage from "./pages/cards";
import { routes as cartRoutes } from "./pages/cart";
import CategoriesPage from "./pages/categories";
import { CheckoutPage } from "./pages/checkout";
import { routes as currencyRoutes } from "./pages/currencies";
import DynamicRoutePage from "./pages/dynamic-route";
import FormPage from "./pages/form";
import HomePage from "./pages/home";
import ImportProducts from "./pages/import-products/import-products";
import LocationPage from "./pages/location";
import MyGoodsPage from "./pages/my-goods";
import { MyGoodsProductDetailsPage } from "./pages/my-goods-product-details";
import { routes as ordersRoutes } from "./pages/orders";
import { routes as payoutSettings } from "./pages/payout-settings";
import ProductDetailsPage from "./pages/product-details";
import ProductEditPage from "./pages/product-edit";
import PromoteProductPage from "./pages/product-promotion/promote-product";
import { SelectCategorySubcategorySheetPage } from "./pages/ProductCreate";
import ProductCreateContainer from "./pages/ProductCreate/ProductCreateContainer/ProductCreateContainer";
import NewDelivery from "./pages/ProductCreate/ProductDelivery/NewDelivery/NewDelivery";
import NewPickUp from "./pages/ProductCreate/ProductDelivery/NewPickUp/NewPickUp";
import ProfilePage from "./pages/profile";
import RequestAndLoad from "./pages/request-and-load";
import SeeAllPage from "./pages/see-all";
import SelectLocationSheet from "./pages/select-location-sheet";
import SellerAreaPage from "./pages/seller-area";
import { routes as sellersOrders } from "./pages/sellers-orders";
import StoreHomepage from "./pages/store-homepage/StoreHomepage";
import StorePage from "./pages/store-page/StorePage";
import SubcategoriesPage from "./pages/subcategories";
import { routes as transactionsRoutes } from "./pages/transactions";
import WalletPage from "./pages/wallet";
import WishListPage from "./pages/wish-list";

export interface RouteParameters extends Router.RouteParameters {
  app?: Framework7;
}

const routes: RouteParameters[] = [
  {
    name: "HomePage",
    path: "/",
    component: HomePage,
  },
  {
    name: "HomePage_Category",
    path: "/category/:catid/subcategory/:subcatid/",
    component: HomePage,
  },
  {
    path: "/store/:storeId",
    component: StorePage,
  },
  {
    path: "/store/edit/:storeId",
    component: StoreHomepage,
  },
  {
    path: "/all-filtres/",
    component: AllFiltresPage,
  },
  {
    path: "/all-filtres/categories/",
    component: CategoriesPage,
  },
  {
    path: "/all-filtres/categories/subcategories/:catid/",
    component: SubcategoriesPage,
  },
  {
    path: "/all-filtres/categories/subcategories/:catid/(.*)/",
    component: SubcategoriesPage,
  },
  {
    path: "/all-filtres/location/",
    component: LocationPage,
  },
  {
    path: "/product-details/:uid/",
    component: ProductDetailsPage,
  },
  {
    path: "/checkout/",
    component: CheckoutPage,
  },
  {
    path: "/profile/",
    component: ProfilePage,
    routes: [
      {
        path: "/wallet/",
        component: WalletPage,
        routes: [
          {
            path: "/cards/",
            component: CardsPage,
          },
          ...currencyRoutes,
        ],
      },
      ...transactionsRoutes,
      ...ordersRoutes,
      {
        path: "/seller-area/",
        component: SellerAreaPage,
        routes: [
          {
            path: "/store/",
            component: AccountStorePage,
          },
          {
            path: "/my-goods/",
            component: MyGoodsPage,
            routes: [
              {
                path: "/add/",
                component: ProductCreateContainer,
                routes: [
                  {
                    path: "/new-delivery/",
                    component: NewDelivery,
                  },
                  {
                    path: "/new-pickup/",
                    component: NewPickUp,
                  },
                ],
              },

              {
                path: "/edit/:uid/",
                component: ProductCreateContainer,
              },
              {
                path: "/edit/:uid/:step/",
                component: ProductCreateContainer,
              },
              {
                path: "/product-details/:uid/",
                component: MyGoodsProductDetailsPage,
              },
              {
                path: "/product-details/:uid/promote/",
                component: PromoteProductPage,
              },
              {
                path: "/import-products/",
                component: ImportProducts,
              },
            ],
          },
          ...payoutSettings,
          ...sellersOrders,
          ...addBusinessAccount,
        ],
      },
    ],
  },
  {
    path: "/select-category-subcategory/",
    sheet: {
      component: SelectCategorySubcategorySheetPage,
    },
  },
  {
    path: "/wish-list/",
    component: WishListPage,
  },
  {
    path: "/see-all/:catid/",
    component: SeeAllPage,
  },
  {
    path: "/product-edit/",
    component: ProductEditPage,
  },
  {
    path: "/select-location-sheet/",
    component: SelectLocationSheet,
  },
  ...cartRoutes,
  {
    path: "/about/",
    component: AboutPage,
  },
  {
    path: "/form/",
    component: FormPage,
  },
  {
    path: "/dynamic-route/blog/:blogId/post/:postId/",
    component: DynamicRoutePage,
  },
  {
    path: "/request-and-load/user/:userId/",
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      const router = this;

      // App instance
      const app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      const userId = routeTo.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        const user = {
          firstName: "Vladimir",
          lastName: "Kharlampidi",
          about: "Hello, i am creator of Framework7! Hope you like it!",
          links: [
            {
              title: "Framework7 Website",
              url: "http://framework7.io",
            },
            {
              title: "Framework7 Forum",
              url: "http://forum.framework7.io",
            },
          ],
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            component: RequestAndLoad,
          },
          {
            context: {
              user: user,
            },
          }
        );
      }, 1000);
    },
  },
  {
    path: "(.*)",
    component: NotFoundPage,
  },
];

export default routes;
