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
import { safeParseInt } from "../../utils";

type Props = Omit<F7Sheet.Props, "onSheetClosed"> & {
  onSheetClosed?(instance: any, value: { min: number; max: number }): void;
  value?: { min: number; max: number };
};

const initialState = { min: 0, max: 0 };

const DeliveryTimeSheet = ({
  t,
  onSheetOpen,
  opened,
  onSheetClosed,
  value,
  ...rest
}: Props & WithTranslation) => {
  const sheet = useRef(null);
  const [state, setState] = useState(initialState);

  useEffect(() => {
    setState(value ? value : initialState);
  }, [opened]);

  const { min, max } = state;

  const onSheetOpenHandle = (instance) => {
    if (onSheetOpen) onSheetOpen(instance);
  };
  const onSheetClosedHandle = (instance) => {
    if (onSheetClosed) onSheetClosed(instance, state);
  };

  let errorMessage = ""; // TODO ->>>>>>>>>>>>>
  const validate = () => {
    errorMessage = "";
    if (min > max) {
      errorMessage = t("The maximum period cannot be less than the minimum");
      return false;
    }
    return min !== null && max !== null && min > 0 && max > 0;
  };
  const isValid = validate();
  let errorMessageForce = errorMessage.length > 0;
  const submitButtonStyles = { opacity: isValid ? 1 : 0.3 };

  return (
    <Sheet
      ref={(ref) => (sheet.current = ref)}
      id="delivery_time__sheet"
      backdrop
      {...rest}
      opened={opened}
      onSheetOpen={onSheetOpenHandle}
      onSheetClosed={onSheetClosedHandle}
    >
      <Page>
        <BlockTitle medium>{t("Delivery period")}</BlockTitle>
        <List noHairlines form>
          <ListInput
            name="min"
            label={t("Days minimum").toString()}
            floatingLabel
            type="number"
            placeholder=""
            clearButton
            slot="list"
            onChange={(e) => setState({ ...state, min: safeParseInt(e.target.value) })}
            value={min}
            required
            min={0}
          />
          <ListInput
            name="max"
            label={t("Days maximum").toString()}
            floatingLabel
            type="number"
            placeholder=""
            clearButton
            slot="list"
            onChange={(e) => setState({ ...state, max: safeParseInt(e.target.value) })}
            value={max}
            required
            min={0}
            errorMessage={errorMessage}
            errorMessageForce={errorMessageForce}
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

export default compose(withTranslation())(DeliveryTimeSheet) as React.ComponentClass<Props>;
