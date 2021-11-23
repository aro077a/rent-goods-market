import { List, ListItem } from "framework7-react";
import React from "react";
import { dataObjectType } from "./models";
import "./styles.less";

export const AutocompleteListComponent = ({
  filteredData,
  onIListItemClick,
  checkbox,
  title,
}) => {
  return filteredData.length ? (
    <List className="autocomplete">
      {filteredData.map((item: dataObjectType) => {
        return (
          <ListItem
            key={item.id}
            onClick={onIListItemClick}
            title={title}
            checkbox={checkbox}
          >
            {item.name}
          </ListItem>
        );
      })}
    </List>
  ) : (
    <></>
  );
};
