import React from "react";
import { Popover, F7Popover, List, ListItem, Block } from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";
import { IcEdit, IcRemove } from "../../components-ui/icons";

type Props = WithTranslation &
  F7Popover.Props & {
    onEditClick?(): void;
    onRemoveClick?(): void;
  };

const EditTrackingInfoMenuPopover = ({
  onEditClick,
  onRemoveClick,
  t,
  ...rest
}: Props) => (
  <Popover
    id="edit_tracking_info_menu_popover"
    closeByBackdropClick
    closeByOutsideClick
    {...rest}
  >
    <List noHairlines>
      <ListItem
        link
        title={t("Edit").toString()}
        noChevron
        onClick={onEditClick}
        popoverClose
      >
        <IcEdit slot="media" />
      </ListItem>
      <ListItem
        link
        title={t("Remove").toString()}
        noChevron
        onClick={onRemoveClick}
        popoverClose
      >
        <IcRemove slot="media" />
      </ListItem>
    </List>
  </Popover>
);

export default compose(withTranslation())(EditTrackingInfoMenuPopover);
