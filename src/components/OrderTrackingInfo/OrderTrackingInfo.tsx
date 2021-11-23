import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";
import { F7List, Link, List, ListItem, Popup } from "framework7-react";
import { IcCopy, IcDelivery } from "../../components-ui/icons";

import "./style.less";
import classNames from "classnames";

type Props = Partial<WithTranslation> &
  F7List.Props & {
    trackingNumber?: string;
    trackingCarrier?: string;
    showCopyButton?: boolean;
    showEditButton?: boolean;
    onTrackingCopyClick?(): void;
    onTrackingEditClick?(): void;
    openPopover?: string;
  };

const OrderTrackingInfo = ({
  trackingNumber,
  trackingCarrier,
  showCopyButton,
  showEditButton,
  onTrackingCopyClick,
  onTrackingEditClick,
  openPopover,
  className,
  ...rest
}: Props) => (
  <List
    noHairlines
    noHairlinesBetween
    mediaList
    className={classNames("margin-vertical-half", "tracking-info", className)}
    {...rest}
  >
    <ListItem>
      <IcDelivery slot="media" fill="var(--addition-50)" />
      <div slot="title">
        {trackingNumber}
        <br />
        <span>{trackingCarrier}</span>
      </div>
      {showCopyButton && (
        <div slot="after-title">
          <Link
            className="tracking-info-copy"
            iconOnly
            onClick={onTrackingCopyClick}
          >
            <IcCopy />
          </Link>
        </div>
      )}
      {showEditButton && openPopover && (
        <div slot="after-title">
          <Link
            className="tracking-info-edit"
            iconMaterial="more_vert"
            iconOnly
            popoverOpen={openPopover}
            onClick={onTrackingEditClick}
          />
        </div>
      )}
      {showEditButton && !openPopover && (
        <div slot="after-title">
          <Link
            className="tracking-info-edit"
            iconMaterial="more_vert"
            iconOnly
            onClick={onTrackingEditClick}
          />
        </div>
      )}
    </ListItem>
  </List>
);
export default compose<React.FC<Props>>(withTranslation())(OrderTrackingInfo);
