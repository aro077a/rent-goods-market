import { Country } from "@/types/commonapi";

export type CountrySelectPopupProps = {
  opened: boolean;
  onPopupClosed(): void;
  onCountrySelect(country: Country): void;
  closeOnChoose?: boolean;
};
