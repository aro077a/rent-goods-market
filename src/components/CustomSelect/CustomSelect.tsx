import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Select, {
  components,
  GroupTypeBase,
  PlaceholderProps,
  ValueContainerProps,
} from "react-select";
import Flag from "react-world-flags";
import cn from "classnames";
import { f7 } from "framework7-react";
const { ValueContainer, Placeholder } = components;

import { IApplicationStore } from "@/store/rootReducer";

import { CustomSelectProps, CustomSelectValue } from "./CustomSelect.types";

import "./CustomSelect.less";

const formatOptionLabel = ({ value, label }: CustomSelectValue) => (
  <div className="custom-option">
    <Flag code={value} />
    {label}
  </div>
);

const CustomValueContainer = ({
  children,
  ...props
}: ValueContainerProps<CustomSelectValue, false, GroupTypeBase<CustomSelectValue>> &
  PlaceholderProps<CustomSelectValue, false, GroupTypeBase<CustomSelectValue>>) => (
  <ValueContainer {...props}>
    <Placeholder {...props}>{props.selectProps.placeholder}</Placeholder>
    {React.Children.map(children, (child) => (child && child?.type !== Placeholder ? child : null))}
  </ValueContainer>
);

export const CustomSelect = ({
  value,
  options,
  onChange,
  openPopup = () => undefined,
  label,
  className = "",
  validate = false,
  errorMessage = "Required field",
  defaultInputValue,
}: CustomSelectProps) => {
  const { t } = useTranslation();
  const isSmallScreen = useSelector(
    (state: IApplicationStore) => state.rootReducer.resizeEvent.width < 768
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [error, setError] = useState("");

  const wrapperRef = useRef(null);

  const handleClickOutsideCountry = useCallback(
    (event: MouseEvent) => {
      if (isMenuOpen && wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        if (!value) setError(t(errorMessage));
        setIsMenuOpen(false);
      }
    },
    [errorMessage, isMenuOpen, t, value]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideCountry);
    return () => document.removeEventListener("mousedown", handleClickOutsideCountry);
  }, [handleClickOutsideCountry]);

  const handleOnMenuOpen = useCallback(() => {
    setIsMenuOpen(!openPopup || !isSmallScreen);
    if (isSmallScreen && openPopup) {
      openPopup();
    }
  }, [isSmallScreen, openPopup]);

  const handleChange = useCallback(
    (newValue: CustomSelectValue) => {
      setIsMenuOpen(false);
      if (newValue.value) {
        setError("");
      }
      onChange(newValue);
    },
    [onChange]
  );

  const isError = useMemo(() => error && !isMenuOpen, [error, isMenuOpen]);

  return (
    <div
      id="custom-select"
      className={cn(className, { error: isError, "safari-version": f7.device.ios })}
      ref={wrapperRef}
    >
      <Select<CustomSelectValue, false, GroupTypeBase<CustomSelectValue>>
        classNamePrefix="custom-select"
        placeholder={label}
        isSearchable
        value={value}
        defaultInputValue={defaultInputValue}
        options={options}
        onChange={handleChange}
        components={{ ValueContainer: CustomValueContainer }}
        formatOptionLabel={formatOptionLabel}
        noOptionsMessage={() => t("Nothing found")}
        menuIsOpen={isMenuOpen}
        onMenuOpen={handleOnMenuOpen}
      />
      {validate && isError && <div className="error-message">{error}</div>}
    </div>
  );
};
