import React, { useState, useMemo, useCallback } from "react";
import { AccordionContent, f7, Icon, List, ListItem } from "framework7-react";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "@/hooks/store";
import { getProfile } from "@/selectors/profile";
import { AccountStoreItem } from "@/pages/account-store-page/AccountStoreItem";

import { MenuListItem } from "./MenuListItem";
import { SellerAreaMenuProps } from "./SellerAreaMenu.types";
import { menu, ITEMS_WITH_ACCORDION } from "./constants";

import "./SellerAreaMenu.less";

export const SellerAreaMenu = ({ selected = "", accountStores = [] }: SellerAreaMenuProps) => {
  const { t } = useTranslation();

  const menuItems = useAppSelector((state) =>
    state.rootReducer.localConfig.profileMenuItems?.filter((i) => Object.keys(menu).includes(i))
  );
  const { type: profileType } = useAppSelector(getProfile);

  const isWithAccordion = useMemo(
    () =>
      menuItems
        ?.slice(ITEMS_WITH_ACCORDION)
        .filter((item) => !(profileType !== "S" && item === "Switch_To_Business")).length > 1,
    [menuItems, profileType]
  );

  const [accordionTitle, setAccordionTitle] = useState(t("More").toString());
  const [accordionOpened, setAccordionOpened] = useState(false);
  const [menuLoading, setMenuLoading] = useState("");

  const handleAccordionOpened = useCallback(() => {
    const more = t("More").toString();
    const less = t("Less").toString();
    setAccordionTitle(accordionTitle === more ? less : more);
    setAccordionOpened(!accordionOpened);
  }, [accordionOpened, accordionTitle, t]);

  const handleMenuClick = useCallback((name: string) => {
    setMenuLoading(name);
    f7.view.main.router.on("routeChange", () => {
      setMenuLoading("");
    });
    setTimeout(() => {
      f7.views.main.router.navigate(menu[name].link);
    });
  }, []);

  return (
    <List
      className="seller-area-menu"
      noHairlines
      noHairlinesBetween={typeof selected === "string"}
      accordionList
      accordionOpposite
    >
      {accountStores?.map((store, index) => (
        <AccountStoreItem key={`store-${index}`} store={store} />
      ))}
      {menuItems
        ?.slice(0, isWithAccordion ? ITEMS_WITH_ACCORDION : menuItems.length)
        .map((item, index) => (
          <MenuListItem
            key={item}
            name={item}
            index={index}
            menuLoading={menuLoading}
            profileType={profileType}
            onClick={handleMenuClick}
            selected={selected}
          />
        ))}
      {isWithAccordion && (
        <ListItem
          accordionItem
          onAccordionOpen={handleAccordionOpened}
          onAccordionClose={handleAccordionOpened}
          title={accordionTitle}
          noChevron
        >
          <Icon slot="media" f7={accordionOpened ? "chevron_up" : "chevron_down"} size="24" />
          <AccordionContent>
            <List>
              {menuItems.slice(ITEMS_WITH_ACCORDION).map((item, index) => (
                <MenuListItem
                  key={item}
                  name={item}
                  index={index}
                  menuLoading={menuLoading}
                  profileType={profileType}
                  onClick={handleMenuClick}
                  selected={selected}
                />
              ))}
            </List>
          </AccordionContent>
        </ListItem>
      )}
    </List>
  );
};
