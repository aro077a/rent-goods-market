import React, { ReactElement, useState } from "react";
import {
  Page,
  Navbar,
  NavRight,
  Icon,
  Sheet,
  List,
  ListItem,
  NavLeft,
  Link,
  NavTitle,
  Button,
} from "framework7-react";
import { useTranslation } from "react-i18next";
import { SellerAreaMenu } from "../components/SellerAreaMenu";
import { getAccountStores } from "../actions/accountStore";
import { useDispatch, useSelector } from "react-redux";
import { IApplicationStore } from "../store/rootReducer";
import { IcEdit, IcRemove } from "../components-ui/icons";
import { getProfile } from "../selectors/profile";
import { storeHomePageDelete } from "../actions/storeHomePageActions";

const SellerAreaPage = (): ReactElement => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { accountStores } = useSelector(
    (state: IApplicationStore) => state.accountStoresReducer
  );
  const { type } = useSelector((state: IApplicationStore) => getProfile(state));
  const { storeHomePage } = useSelector(
    (state: IApplicationStore) => state.storeHomePageReducer
  );
  const [accountStoreActionIsOpen, setAccountStoreActionIsOpen] =
    useState(false);

  const handleDeleteHomepage = () => {
    const { uid, storeUid } = storeHomePage;
    dispatch(storeHomePageDelete(uid, storeUid));
    setAccountStoreActionIsOpen(false);
  };

  return (
    <Page
      id="seller_area_page"
      name="seller-area-page"
      onPageInit={() => dispatch(getAccountStores())}
    >
      <Navbar noHairline noShadow>
        <NavLeft>
          <Link href="/profile/" iconOnly>
            <i className="icon icon-back" />
          </Link>
        </NavLeft>
        <NavTitle>{t("Seller Area")}</NavTitle>
        {type === "B" && (
          <NavRight>
            <Button
              className="seller-nav-store-option"
              onClick={(): void =>
                type === "B" &&
                setAccountStoreActionIsOpen(!accountStoreActionIsOpen)
              }
            >
              <Icon material="more_vertical" />
            </Button>
          </NavRight>
        )}
      </Navbar>
      <SellerAreaMenu accountStores={accountStores} />
      {type === "B" && (
        <Sheet
          id="account_store-action"
          swipeToClose
          backdrop
          opened={accountStoreActionIsOpen}
          slot="fixed"
          style={{ height: "auto" }}
        >
          <List>
            <ListItem
              title={t("Edit Store Information").toString()}
              link="/profile/seller-area/add-business-account/store-info/?isEdit=true"
              sheetClose
            >
              <IcEdit slot="media" />
            </ListItem>
            <ListItem
              title={t("Delete Homepage").toString()}
              sheetClose
              onClick={handleDeleteHomepage}
              disabled={!storeHomePage?.storeUid}
            >
              <IcRemove slot="media" />
            </ListItem>
          </List>
        </Sheet>
      )}
    </Page>
  );
};

export default SellerAreaPage;
