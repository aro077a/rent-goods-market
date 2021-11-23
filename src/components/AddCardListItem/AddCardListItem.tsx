import React from "react";
import { ListItem } from "framework7-react";

import "./style.less";

export default (props: ListItem.Props) => (
  <ListItem className="add-card-list-item" link {...props}>
    <span slot="media">
      <i className="icon ic-add-card"></i>
    </span>
  </ListItem>
);
