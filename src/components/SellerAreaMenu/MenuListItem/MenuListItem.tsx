import React, { useMemo } from "react";
import { ListItem, Icon, Preloader } from "framework7-react";
import { useTranslation } from "react-i18next";
import cn from "classnames";

import { menu } from "@/components/SellerAreaMenu/constants";

import { MenuListItemProps } from "./MenuListItem.types";

export const MenuListItem = ({
  name,
  index,
  menuLoading,
  profileType,
  onClick,
  selected,
}: MenuListItemProps) => {
  const { t } = useTranslation();

  const itemData = menu[name];

  const content: JSX.Element = useMemo(() => {
    switch (true) {
      case menuLoading === name:
        return <Preloader size="24" slot="media" />;

      case typeof itemData.icon !== "string":
        return itemData.icon;

      default:
        return <Icon slot="media" size="24" f7={itemData.icon} />;
    }
  }, [itemData.icon, menuLoading, name]);

  if (
    (name === "Switch_To_Business" && profileType !== "S") ||
    (name === "SellerArea_Store" && profileType === "S")
  ) {
    return <div key={`menu-${index}`} />;
  }

  return (
    <ListItem
      key={`menu-${index}`}
      onClick={() => onClick(name)}
      title={t(itemData.title).toString()}
      className={cn({ active: selected === name }, name)}
    >
      {content}
    </ListItem>
  );
};
