import React, { memo } from "react";
import { Popover, F7Popover, List, ListItem } from "framework7-react";
import { IcEdit, IcRemove } from "../../components-ui/icons";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { storeHomePageDelete } from "../../actions/storeHomePageActions";
import { StoreHomepage } from "../../types/marketplaceapi";

type Props = F7Popover.Props & {
  popoverClass: string;
  onClose?(): void;
  homepage: StoreHomepage;
};

const AccountStorePopover = ({
  popoverClass,
  onClose,
  homepage,
  ...rest
}: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleDeleteHomepage = () => {
    const { uid, storeUid } = homepage;
    dispatch(storeHomePageDelete(uid, storeUid));
    onClose();
  };

  return (
    <Popover
      className={popoverClass}
      onPopoverClose={onClose}
      backdrop={false}
      {...rest}
    >
      <List>
        <ListItem
          href="/profile/seller-area/add-business-account/store-info/?isEdit=true"
          title={t("Edit Store Information").toString()}
          popoverClose
        >
          <IcEdit slot="media" />
        </ListItem>
        <ListItem
          title={t("Delete Homepage").toString()}
          sheetClose
          onClick={handleDeleteHomepage}
          disabled={!homepage?.storeUid}
        >
          <IcRemove slot="media" />
        </ListItem>
      </List>
    </Popover>
  );
};

export default memo(AccountStorePopover);
