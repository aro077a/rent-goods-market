import React, { useEffect, useRef, useState } from "react";
import {
  Sheet,
  BlockTitle,
  F7Sheet,
  List,
  ListItem,
  Icon,
  ListInput,
  Fab,
  Page,
} from "framework7-react";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";

type Props = Omit<F7Sheet.Props, "onSheetClosed"> & {
  onSheetClosed?(instance: any, value: { isFreeDelivery: boolean; price: number }): void;
  value?: { isFreeDelivery: boolean; price: number };
};

const initialState = { isFreeDelivery: false, price: 0 };

const DeliveryPriceSheet = ({
  t,
  onSheetOpen,
  opened,
  onSheetClosed,
  value,
  ...rest
}: Props & WithTranslation) => {
  const sheet = useRef(null);
  const [state, setState] = useState({ isFreeDelivery: false, price: 0 });

  useEffect(() => {
    setState(value ? value : { ...initialState });
  }, [opened]);

  const { isFreeDelivery, price } = state;

  const onSheetOpenHandle = (instance) => {
    if (onSheetOpen) onSheetOpen(instance);
  };
  const onSheetClosedHandle = (instance) => {
    if (onSheetClosed) onSheetClosed(instance, state);
  };

  const validate = () => {
    return isFreeDelivery || (!isFreeDelivery && price > 0);
  };
  const isValid = validate();
  const submitButtonStyles = { opacity: isValid ? 1 : 0.3 };

  return (
    <Sheet
      ref={(ref) => (sheet.current = ref)}
      id="delivery_price__sheet"
      backdrop
      {...rest}
      opened={opened}
      onSheetOpen={onSheetOpenHandle}
      onSheetClosed={onSheetClosedHandle}
    >
      <Page>
        <BlockTitle medium>{t("Delivery price")}</BlockTitle>
        <List noHairlines form>
          <ListItem
            name="freeDelivery"
            checkbox
            title={t("Free delivery").toString()}
            slot="list"
            onChange={(e) => {
              setState({
                ...state,
                isFreeDelivery: e.target.checked,
                price: e.target.checked ? 0 : price,
              });
            }}
            checked={isFreeDelivery}
          />
          <ListInput
            name="price"
            label={t("Price").toString()}
            floatingLabel
            type="number"
            placeholder=""
            clearButton
            slot="list"
            onChange={(e) => setState({ ...state, price: e.target.value })}
            value={price}
            disabled={isFreeDelivery}
            required
            min={0}
          />
        </List>
        <Fab
          position="right-bottom"
          onClick={() => {
            if (isValid && sheet.current) sheet.current.close();
          }}
          style={submitButtonStyles}
          slot="fixed"
        >
          <Icon ios={"f7:checkmark_alt"} md={"material:check"} />
        </Fab>
      </Page>
    </Sheet>
  );
};

export default compose(withTranslation())(DeliveryPriceSheet) as React.ComponentClass<Props>;
