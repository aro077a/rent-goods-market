import React from "react";
import { Link, Chip } from "framework7-react";

import "./SortByButtonsGroup.less";
import { SortBy } from "../reducers/filterReducer";
import { withTranslation, WithTranslation } from "react-i18next";
import { compose } from "redux";

export type SortByButtonItem = {
  text: string;
  type: SortBy;
};

export const sortByTypes: SortByButtonItem[][] = [
  [
    { text: "Popular", type: SortBy.popular },
    { text: "Sales First", type: SortBy.sales_first },
  ],
  [
    { text: "Price (Low to High)", type: SortBy.price_low_to_high },
    { text: "Price (High to Low)", type: SortBy.price_high_to_low },
  ],
  [{ text: "What`s new", type: SortBy.what_s_new }],
];

type Props = WithTranslation & {
  selected: SortBy[];
  onClick(id: SortBy): void;
};

const SortByButtonsGroup = ({ selected = [], onClick, t }: Props) => (
  <div className="sort-by-buttons-groups">
    {sortByTypes.map((item, i) => (
      <div key={i}>
        {item.map((item) => (
          <Link key={item.type} onClick={() => onClick(item.type)}>
            <Chip
              text={t(item.text).toString()}
              className={selected.includes(item.type) ? "select" : ""}
            />
          </Link>
        ))}
      </div>
    ))}
  </div>
);

export default compose(withTranslation())(SortByButtonsGroup);
