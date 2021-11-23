import React, { useState } from "react";
import { Block, Link } from "framework7-react";

import "./style.less";

type Props = {
  text: string;
  moreLinkText?: string;
  lessLinkText?: string;
  expanded?: boolean;
  textShow?: number;
};

const DescriptionDetails = (props: Props) => {
  const [expanded, moreClickHandle] = useState(props.expanded);
  const { text, moreLinkText, lessLinkText, textShow } = props;

  const textToShow = textShow || 150;

  const expandedText =
    text && text.length
      ? text.length > textToShow
        ? expanded
          ? text
          : text.substr(0, textToShow) + "..."
        : text
      : null;

  return (
    expandedText && (
      <p className="description">
        <span dangerouslySetInnerHTML={{ __html: expandedText }} />{" "}
        {text.length > textToShow && (
          <Link className="more" onClick={() => moreClickHandle(!expanded)}>
            {expanded ? lessLinkText || "Less" : moreLinkText || "More"}
          </Link>
        )}
      </p>
    )
  );
};

export default DescriptionDetails;
