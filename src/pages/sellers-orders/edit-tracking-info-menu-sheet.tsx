import React from "react";
import { Sheet, PageContent, F7Sheet, List, ListItem } from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";
import { IcEdit, IcRemove } from "../../components-ui/icons";

type Props = WithTranslation &
  F7Sheet.Props & {
    onEditClick?(): void;
    onRemoveClick?(): void;
  };

const EditTrackingInfoMenuSheet = ({
  onEditClick,
  onRemoveClick,
  t,
  ...rest
}: Props) => (
  <Sheet
    id="edit_tracking_info_menu_sheet"
    style={{ height: "auto" }}
    swipeToClose
    backdrop
    {...rest}
  >
    <PageContent>
      <List noHairlines>
        <ListItem
          link
          title={t("Edit").toString()}
          noChevron
          onClick={onEditClick}
        >
          <IcEdit slot="media" />
        </ListItem>
        <ListItem
          link
          title={t("Remove").toString()}
          noChevron
          onClick={onRemoveClick}
        >
          <IcRemove slot="media" />
        </ListItem>
      </List>
    </PageContent>
  </Sheet>
);

export default compose(withTranslation())(EditTrackingInfoMenuSheet);
