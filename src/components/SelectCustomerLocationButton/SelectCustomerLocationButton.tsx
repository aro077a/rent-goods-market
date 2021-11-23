import React from "react";
import { F7ListItem, List, ListItem } from "framework7-react";

import { IcLocation } from "@/components-ui/icons";

import "./SelectCustomerLocationButton.less";

export const SelectCustomerLocationButton = (props: F7ListItem.Props) => (
  <List className="select-customer-location-button" noHairlines noHairlinesBetween>
    <ListItem link {...props}>
      <IcLocation slot="media" />
    </ListItem>
  </List>
);
