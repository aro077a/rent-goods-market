import React, { useMemo } from "react";
import { Icon } from "framework7-react";

import { AnaliticDetailsProps } from "./AnaliticDetails.types";

import "./AnaliticDetails.less";

export const AnaliticDetails = React.memo(({ count, type }: AnaliticDetailsProps): JSX.Element => {
  const icon = useMemo(() => (type == "view" ? "ic-view" : "ic-wish-small"), [type]);

  return (
    <div className="analitic-details">
      <Icon className={icon} />
      <span>{count}</span>
    </div>
  );
});
AnaliticDetails.displayName = "AnaliticDetails";
