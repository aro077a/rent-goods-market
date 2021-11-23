import React from "react";
import { ListItem } from "framework7-react";

import { LinkItemProps } from "./LinkItem.types";

export const LinkItem = React.memo(({ title, link, icon }: LinkItemProps) => (
  <ListItem link={link} title={title} popoverClose>
    {icon}
  </ListItem>
));
LinkItem.displayName = "LinkItem";
