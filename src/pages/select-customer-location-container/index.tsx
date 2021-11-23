import React, { useCallback } from "react";
import { useDispatch } from "react-redux";

import {
  changeCountry,
  toggleSelectCountryPopup,
} from "@/actions/customer-location/customerLocationActions";
import { CountrySelectPopup } from "@/components/CountrySelectPopup";
import { useAppSelector } from "@/hooks/store";
import { SelectCustomerLocationSheet } from "@/pages/select-customer-location__sheet";
import { Country } from "@/types/commonapi";

export const SelectCustomerLocationContainer = (): JSX.Element => {
  const { countrySelectPopupOpened } = useAppSelector((state) => state.customerLocationReducer);

  const dispatch = useDispatch();

  const onCountrySelect = useCallback(
    (country: Country) => {
      if (country) {
        dispatch(changeCountry(country.code, true));
      }
    },
    [dispatch]
  );

  const onPopupClosed = useCallback(() => dispatch(toggleSelectCountryPopup(false)), [dispatch]);

  return (
    <>
      <SelectCustomerLocationSheet />
      <CountrySelectPopup
        opened={countrySelectPopupOpened}
        onCountrySelect={onCountrySelect}
        onPopupClosed={onPopupClosed}
      />
    </>
  );
};
