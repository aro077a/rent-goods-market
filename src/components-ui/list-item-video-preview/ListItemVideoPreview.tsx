import React from "react";
import { ListItem } from "framework7-react";
import classNames from "classnames";

import "./style.less";

export default (
  props: {
    image?: string | React.ReactElement;
    icon: React.ReactElement;
    title: string;
    subtitle: string;
  } & ListItem.Props
) => {
  const {
    image = <div className="image" />,
    icon,
    title,
    subtitle,
    className,
    ...rest
  } = props;
  return (
    <ListItem
      mediaItem
      className={classNames("video-preview-item", className)}
      {...rest}
    >
      {typeof image === "string" ? <img slot="media" src={image} /> : image}
      <div slot="title">
        <div className="title">{title}</div>
        <div className="subtitle">
          {icon} {subtitle}
        </div>
      </div>
    </ListItem>
  );
};
