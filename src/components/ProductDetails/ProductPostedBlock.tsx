import React from "react";
import { BlockTitle, Block } from "framework7-react";
import { formatDate } from "../../utils";

import "./style.less";

type Props = {
  date?: Date;
  postedBlockTitle?: string;
};

const ProductPostedBlock = ({ date, postedBlockTitle }: Props) => {
  if (!date) return null;
  return (
    <>
      <BlockTitle>{postedBlockTitle}</BlockTitle>
      <Block className="category posted">{formatDate(date.toString())}</Block>
    </>
  );
};

export default ProductPostedBlock;
