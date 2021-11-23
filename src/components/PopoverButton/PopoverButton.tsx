import React, { createRef, PureComponent } from "react";
import { withTranslation } from "react-i18next";
import cn from "classnames";
import { Icon } from "framework7-react";
import { compose } from "redux";

import { ThemedButton } from "@/components/ThemedButton";

import {
  PopoverButtonMapProps,
  PopoverButtonProps,
  PopoverButtonState,
} from "./PopoverButton.types";

import "./PopoverButton.less";

class PopoverButton extends PureComponent<PopoverButtonMapProps, PopoverButtonState> {
  constructor(props: PopoverButtonMapProps) {
    super(props);
    this.state = {
      inputValue: "",
    };
  }

  inputRef = createRef<HTMLInputElement>();

  handleUpdate = () => {
    const {
      state: { inputValue },
      props: { onChange, quantity, itemType },
    } = this;

    const isInfinity = itemType === "I";
    const value = inputValue > quantity && !isInfinity ? quantity : !inputValue ? 1 : +inputValue;

    this.setState({ inputValue: value });
    onChange(value);
  };

  handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const reg = /^[0-9]+$/;

    if (
      (Number(value) > 0 &&
        Number(value) < 1000 &&
        reg.test(value) &&
        this.props.maxValue &&
        Number(value) <= this.props.maxValue) ||
      value === ""
    ) {
      this.setState({ inputValue: value === "input" ? value : Number(value) });
    }
  };

  componentDidUpdate(prevProps: PopoverButtonMapProps) {
    const { value } = this.props;

    if (value !== prevProps.value && value === "input") {
      prevProps.value && this.setState({ inputValue: prevProps.value });
      this.inputRef && this.inputRef.current.focus();
    }
  }

  render() {
    const { text, icon, className, value, popoverOpen, onClick, t, ...rest } = this.props;
    const { inputValue } = this.state;
    const popoverType = value === "input" ? false : popoverOpen;

    return (
      <ThemedButton
        {...rest}
        className={cn("popower-button", { "type-input": !popoverType }, className)}
        popoverOpen={popoverType}
        onClick={popoverType && onClick}
      >
        {icon && <Icon className="popower-button-left-icon" material={icon} />}
        {value === "input" ? (
          <>
            <span>{text}</span>
            <input
              ref={this.inputRef}
              type="number"
              value={inputValue}
              onChange={this.handleChangeValue}
            />
            <span onClick={this.handleUpdate}>{t("Update")}</span>
          </>
        ) : (
          <>
            <span className="popower-button-text">{`${text} ${value}`}</span>
            <Icon className="popower-button-right-icon" material="expand_more" />
          </>
        )}
      </ThemedButton>
    );
  }
}

export default compose<React.FC<PopoverButtonProps>>(withTranslation())(PopoverButton);
