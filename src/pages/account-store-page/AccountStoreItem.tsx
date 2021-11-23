import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Block, Button, Icon } from "framework7-react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { ProductStatusBadge } from "@/components/Badges";
import { IcPhone, IcShareLarge } from "@/components-ui/icons";
import { useAppSelector } from "@/hooks/store";
import { analytics } from "@/Setup";
import { getProfile } from "@/selectors/profile";
import { getStoreHomePage } from "@/actions/storeHomePageActions";
import { share } from "@/actions/shareActions";
import { Store } from "@/types/marketplaceapi";
import { Product } from "@/types/marketplaceapi";

import AccountStorePopover from "./AccountStorePopover";

type AccountStoreItemProps = {
  store: Store;
};

let storeHomepage: Store = {};

export const AccountStoreItem = ({ store }: AccountStoreItemProps) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const handleShare = useCallback(
    (title: string, url: string) => dispatch(share(title, url)),
    [dispatch]
  );

  const profile = useAppSelector(getProfile);
  const { storeHomePage } = useAppSelector((state) => state.storeHomePageReducer);

  const handleShareStore = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      analytics.shareStore(profile, store);
      handleShare(store.name, store.homepage);
    },
    [profile, handleShare, store]
  );

  useEffect(() => {
    if (store.code !== storeHomepage.code) {
      dispatch(getStoreHomePage(store.uid));
      storeHomepage = store;
    }
  }, [dispatch, store]);

  const [popoverIsOpen, setPopoverIsOpen] = useState(false);
  const popoverClass = useMemo(() => `account-store${store.accountUid}`, [store.accountUid]);

  return (
    <div className="account-stores-item">
      <Block className="account-stores-item-content">
        <div
          className="account-stores-item-content-img"
          style={{ backgroundImage: `url(${store.imageUrl})` }}
        />
        <div className="account-stores-item-content-main">
          <div className="account-stores-item-content-main-head">
            <h2>{store.name}</h2>
            <div className="account-stores-item-content-main-head-actions">
              <div
                className="account-stores-item-content-main-head-actions-share store-share"
                onClick={handleShareStore}
              >
                <IcShareLarge />
              </div>
              <Button
                className="account-stores-item-content-main-head-actions-popover"
                popoverOpen={`.${popoverClass}`}
                disabled={profile.type !== "B"}
                onClick={(e) => {
                  e.stopPropagation();
                  setPopoverIsOpen(true);
                }}
              >
                <Icon material="more_vertical" />
              </Button>
            </div>
          </div>
          <div className="account-stores-item-content-main-status">
            {/* // ! Have to change type in store to Product.StatusEnum */}
            <ProductStatusBadge
              status={store.status as unknown as Product.StatusEnum}
              statusText={store.statusDescription}
            />
          </div>
          <div className="account-stores-item-content-main-link">
            <p>{store.homepage}</p>
          </div>
        </div>
      </Block>
      <div className="account-stores-item-bottom">
        <div className="account-stores-item-bottom-preview">
          <Button round href={`/store/${store.code}`}>
            {t("Preview")}
          </Button>
        </div>
        <div className="account-stores-item-bottom-homepage">
          <Button round fill href={`/store/edit/${store.uid}`}>
            <span>{t(`${storeHomePage?.storeUid ? "Edit Homepage" : "Add Homepage"}`)}</span>
          </Button>
        </div>
      </div>
      <div className="account-stores-item-bottom mobile">
        <Button href={`/store/edit/${store.uid}`}>
          <Icon material="add" />
          <span>{t(`${storeHomePage?.storeUid ? "Edit Homepage" : "Add Homepage"}`)}</span>
        </Button>
        <Button onClick={handleShareStore}>
          <IcShareLarge />
          <span>{t("Share")}</span>
        </Button>
        <Button href={`/store/${store.code}`}>
          <IcPhone />
          <span>{t("Preview")}</span>
        </Button>
      </div>
      {profile.type === "B" && (
        <AccountStorePopover
          popoverClass={popoverClass}
          opened={popoverIsOpen}
          onClose={() => setPopoverIsOpen(false)}
          homepage={storeHomePage}
        />
      )}
    </div>
  );
};
