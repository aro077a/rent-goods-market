import React from "react";
import { Popover, F7Popover, List, ListItem } from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";
import { IcEdit, IcRemove } from "../../components-ui/icons";

type Props = WithTranslation &
  F7Popover.Props & {
    onEditClick?(): void;
    onRemoveClick?(): void;
  };

const EditSettingsPopover = ({
  onEditClick,
  onRemoveClick,
  t,
  ...rest
}: Props) => (
  <Popover
    id="edit_settings_menu_popover"
    closeByBackdropClick
    closeByOutsideClick
    {...rest}
  >
    <List>
      <ListItem
        link
        title={t("Edit").toString()}
        onClick={onEditClick}
        popoverClose
      >
        <IcEdit slot="media" />
      </ListItem>
      <ListItem
        link
        title={t("Remove").toString()}
        onClick={onRemoveClick}
        popoverClose
      >
        <IcRemove slot="media" />
      </ListItem>
    </List>
  </Popover>
);

export default compose(withTranslation())(EditSettingsPopover);
