import React, { useCallback, useMemo } from "react";
import { Popover, Block, BlockTitle, List, ListItem, Icon } from "framework7-react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import cn from "classnames";

import { useAppSelector } from "@/hooks/store";
import { Avatar } from "@/components/Avatar";
import { ProfileStatus } from "@/components/ProfileStatus";
import { IcTransaction, IcOrders, IcSellerArea, IcPassport } from "@/components-ui/icons";
import { getProfile } from "@/selectors/profile";
import { logoutUser } from "@/actions/sessionActions";

import { ProfilePopoverProps } from "./ProfilePopover.types";
import { LinkItem } from "./LinkItem";

import "./ProfilePopover.less";

export const ProfilePopover = ({
  onAboutClick,
  onVerifyClick,
  className,
  ...props
}: ProfilePopoverProps) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const { profileMenuItems } = useAppSelector((state) => state.rootReducer.localConfig);
  const profile = useAppSelector(getProfile);

  const menuItemEnabled = useCallback(
    (item: string) => !!profileMenuItems?.includes?.(item),
    [profileMenuItems]
  );

  const profileVerified = useMemo(
    () => ["SF", "MF", "BF"].includes(profile.status),
    [profile.status]
  );

  const logout = useCallback(() => dispatch(logoutUser()), [dispatch]);

  return (
    <Popover
      {...props}
      className={cn("profile-popover", className)}
      closeByBackdropClick
      closeByOutsideClick
    >
      <Block className="avatar-container">
        <Avatar profile={profile} />
        <BlockTitle large className="profile-name">
          {profile.person?.name} {profile.person?.surname}
        </BlockTitle>
        {profile && <ProfileStatus profile={profile} />}
      </Block>
      <List noHairlines noHairlinesBetween noChevron>
        <ul>
          {menuItemEnabled("SellerArea") && (
            <ListItem
              link={`/profile/seller-area/${profile.type !== "S" ? "store" : "my-goods"}/`}
              title={t("Seller Area").toString()}
              popoverClose
            >
              <div
                slot="media"
                className="display-flex justify-content-center align-content-center"
              >
                <IcSellerArea />
              </div>
            </ListItem>
          )}
          {menuItemEnabled("MyWishList") && (
            <LinkItem
              link="/wish-list/"
              title={t("My wish list").toString()}
              icon={<Icon slot="media" material="favorite_border" />}
            />
          )}
          {menuItemEnabled("MyWallet") && (
            <LinkItem
              link="/profile/wallet/"
              title={t("My wallet").toString()}
              icon={<Icon slot="media" material="account_balance_wallet" />}
            />
          )}
          {menuItemEnabled("MyOrders") && (
            <ListItem link="/profile/orders/" title={t("My Orders").toString()} popoverClose>
              <div
                slot="media"
                className="display-flex justify-content-center align-content-center"
              >
                <IcOrders />
              </div>
            </ListItem>
          )}
          {menuItemEnabled("Transactions") && (
            <ListItem
              link="/profile/transactions/"
              title={t("Transactions").toString()}
              popoverClose
            >
              <div
                slot="media"
                className="display-flex justify-content-center align-content-center"
              >
                <IcTransaction />
              </div>
            </ListItem>
          )}
          {menuItemEnabled("Promotions") && (
            <ListItem link="product-promotion/" title={t("Product promotion").toString()}>
              <Icon slot="media" f7="star" />
            </ListItem>
          )}
        </ul>
      </List>
      <List noHairlines noHairlinesBetween noChevron className="additional-menus">
        <ul>
          {menuItemEnabled("Verify") && !profileVerified && (
            <ListItem
              link="#"
              title={t("Verify Your Account").toString()}
              popoverClose
              onClick={onVerifyClick}
            >
              <div
                slot="media"
                className="display-flex justify-content-center align-content-center"
              >
                <IcPassport />
              </div>
            </ListItem>
          )}
          {menuItemEnabled("About") && (
            <ListItem
              link="#"
              title={t("About app", { appName: "Qrent" }).toString()}
              popoverClose
              onClick={onAboutClick}
            >
              <Icon slot="media" f7="info_circle" />
            </ListItem>
          )}
          <ListItem link="#" title="Logout" popoverClose onClick={logout} />
        </ul>
      </List>
    </Popover>
  );
};
