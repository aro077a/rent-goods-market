// https://github.com/nosir/cleave.js/blob/master/src/Cleave.react.js

import React from "react";
import { ListInput as F7Input, F7ListInput } from "framework7-react";

import NumeralFormatter from "cleave.js/src/shortcuts/NumeralFormatter";
import DateFormatter from "cleave.js/src/shortcuts/DateFormatter";
import TimeFormatter from "cleave.js/src/shortcuts/TimeFormatter";
import PhoneFormatter from "cleave.js/src/shortcuts/PhoneFormatter";
import CreditCardDetector from "cleave.js/src/shortcuts/CreditCardDetector";
import Util from "cleave.js/src/utils/Util";
import DefaultProperties from "cleave.js/src/common/DefaultProperties";

type Props = {
  options?: any;
};

class F7CleaveListInput extends React.Component<
  Props & F7ListInput.Props,
  any
> {
  constructor(props: Readonly<F7Input.Props>) {
    super(props);
    this.initState(props);
  }

  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps) {
    let owner = this as any,
      phoneRegionCode = (owner.props.options || {}).phoneRegionCode,
      newValue = owner.props.value,
      pps = owner.properties;

    owner.updateRegisteredEvents(owner.props);
    if (
      prevProps.value !== newValue &&
      newValue !== undefined &&
      newValue !== null
    ) {
      newValue = newValue.toString();

      if (newValue !== owner.properties.result) {
        owner.properties.initValue = newValue;
        owner.onInput(newValue, true);
      }
    }

    // update phone region code
    const prevPhoneRegionCode = (prevProps.options || {}).phoneRegionCode;
    if (
      prevPhoneRegionCode !== phoneRegionCode &&
      phoneRegionCode &&
      phoneRegionCode !== owner.properties.phoneRegionCode
    ) {
      owner.properties.phoneRegionCode = phoneRegionCode;
      owner.initPhoneFormatter();
      owner.onInput(owner.properties.result);
    }

    Util.setSelection(owner.element, owner.state.cursorPosition, pps.document);
  }

  updateRegisteredEvents(props) {
    let owner = this as any,
      { onKeyDown, onChange, onFocus, onBlur, onInit } = owner.registeredEvents;

    if (props.onInit && props.onInit !== onInit)
      owner.registeredEvents.onInit = props.onInit;
    if (props.onChange && props.onChange !== onChange)
      owner.registeredEvents.onChange = props.onChange;
    if (props.onFocus && props.onFocus !== onFocus)
      owner.registeredEvents.onFocus = props.onFocus;
    if (props.onBlur && props.onBlur !== onBlur)
      owner.registeredEvents.onBlur = props.onBlur;
    if (props.onKeyDown && props.onKeyDown !== onKeyDown)
      owner.registeredEvents.onKeyDown = props.onKeyDown;
  }

  initState(props) {
    let owner = this as any,
      { value, options, onKeyDown, onChange, onFocus, onBlur, onInit } = props;

    owner.registeredEvents = {
      onInit: onInit || Util.noop,
      onChange: onChange || Util.noop,
      onFocus: onFocus || Util.noop,
      onBlur: onBlur || Util.noop,
      onKeyDown: onKeyDown || Util.noop,
    };

    if (!options) {
      options = {};
    }

    options.initValue = value;

    owner.properties = DefaultProperties.assign({}, options);

    this.state = {
      value: owner.properties.result,
      cursorPosition: 0,
    };
  }

  init() {
    let owner = this as any,
      pps = owner.properties;

    // so no need for this lib at all
    if (
      !pps.numeral &&
      !pps.phone &&
      !pps.creditCard &&
      !pps.time &&
      !pps.date &&
      pps.blocksLength === 0 &&
      !pps.prefix
    ) {
      owner.onInput(pps.initValue);
      owner.registeredEvents.onInit(owner);

      return;
    }

    pps.maxLength = Util.getMaxLength(pps.blocks);

    owner.isAndroid = Util.isAndroid();

    owner.initPhoneFormatter();
    owner.initDateFormatter();
    owner.initTimeFormatter();
    owner.initNumeralFormatter();

    // avoid touch input field if value is null
    // otherwise Firefox will add red box-shadow for <input required />
    if (pps.initValue || (pps.prefix && !pps.noImmediatePrefix)) {
      owner.onInput(pps.initValue);
    }

    owner.registeredEvents.onInit(owner);
  }

  initNumeralFormatter() {
    let owner = this as any,
      pps = owner.properties;

    if (!pps.numeral) {
      return;
    }

    pps.numeralFormatter = new NumeralFormatter(
      pps.numeralDecimalMark,
      pps.numeralIntegerScale,
      pps.numeralDecimalScale,
      pps.numeralThousandsGroupStyle,
      pps.numeralPositiveOnly,
      pps.stripLeadingZeroes,
      pps.prefix,
      pps.signBeforePrefix,
      pps.tailPrefix,
      pps.delimiter
    );
  }

  initTimeFormatter() {
    let owner = this as any,
      pps = owner.properties;

    if (!pps.time) {
      return;
    }

    pps.timeFormatter = new TimeFormatter(pps.timePattern, pps.timeFormat);
    pps.blocks = pps.timeFormatter.getBlocks();
    pps.blocksLength = pps.blocks.length;
    pps.maxLength = Util.getMaxLength(pps.blocks);
  }

  initDateFormatter() {
    let owner = this as any,
      pps = owner.properties;

    if (!pps.date) {
      return;
    }

    pps.dateFormatter = new DateFormatter(
      pps.datePattern,
      pps.dateMin,
      pps.dateMax
    );
    pps.blocks = pps.dateFormatter.getBlocks();
    pps.blocksLength = pps.blocks.length;
    pps.maxLength = Util.getMaxLength(pps.blocks);
  }

  initPhoneFormatter() {
    let owner = this as any,
      pps = owner.properties;

    if (!pps.phone) {
      return;
    }

    // Cleave.AsYouTypeFormatter should be provided by
    // external google closure lib
    try {
      pps.phoneFormatter = new PhoneFormatter(
        new pps.root.Cleave.AsYouTypeFormatter(pps.phoneRegionCode),
        pps.delimiter
      );
    } catch (ex) {
      throw new Error("Please include phone-type-formatter.{country}.js lib");
    }
  }

  setRawValue(value) {
    let owner = this as any,
      pps = owner.properties;

    value = value !== undefined && value !== null ? value.toString() : "";

    if (pps.numeral) {
      value = value.replace(".", pps.numeralDecimalMark);
    }

    pps.postDelimiterBackspace = false;

    owner.onChange({
      target: { value: value },

      // Methods to better resemble a SyntheticEvent
      stopPropagation: Util.noop,
      preventDefault: Util.noop,
      persist: Util.noop,
    });
  }

  getRawValue() {
    let owner = this as any,
      pps = owner.properties,
      rawValue = pps.result;

    if (pps.rawValueTrimPrefix) {
      rawValue = Util.getPrefixStrippedValue(
        rawValue,
        pps.prefix,
        pps.prefixLength,
        pps.result,
        pps.delimiter,
        pps.delimiters,
        pps.noImmediatePrefix,
        pps.tailPrefix,
        pps.signBeforePrefix
      );
    }

    if (pps.numeral) {
      rawValue = pps.numeralFormatter
        ? pps.numeralFormatter.getRawValue(rawValue)
        : "";
    } else {
      rawValue = Util.stripDelimiters(rawValue, pps.delimiter, pps.delimiters);
    }

    return rawValue;
  }

  getISOFormatDate() {
    let owner = this as any,
      pps = owner.properties;

    return pps.date ? pps.dateFormatter.getISOFormatDate() : "";
  }

  getISOFormatTime() {
    let owner = this as any,
      pps = owner.properties;

    return pps.time ? pps.timeFormatter.getISOFormatTime() : "";
  }

  onInit(owner) {
    return owner;
  }

  onKeyDown = (event) => {
    let owner = this as any,
      pps = owner.properties,
      charCode = event.which || event.keyCode;

    owner.lastInputValue = pps.result;
    owner.isBackward = charCode === 8;

    owner.registeredEvents.onKeyDown(event);
  };

  onFocus = (event) => {
    let owner = this as any,
      pps = owner.properties;

    if (pps.prefix && pps.noImmediatePrefix && !event.target.value) {
      owner.onInput(pps.prefix);
    }

    event.target.rawValue = owner.getRawValue();
    event.target.value = pps.result;

    owner.registeredEvents.onFocus(event);

    Util.fixPrefixCursor(
      owner.element,
      pps.prefix,
      pps.delimiter,
      pps.delimiters
    );
  };

  onBlur = (event) => {
    let owner = this as any,
      pps = owner.properties;

    event.target.rawValue = owner.getRawValue();
    event.target.value = pps.result;

    owner.registeredEvents.onBlur(event);
  };

  onChange = (event) => {
    let owner = this as any,
      pps = owner.properties;

    owner.isBackward =
      owner.isBackward || event.inputType === "deleteContentBackward";
    // hit backspace when last character is delimiter
    var postDelimiter = Util.getPostDelimiter(
      owner.lastInputValue,
      pps.delimiter,
      pps.delimiters
    );

    if (owner.isBackward && postDelimiter) {
      pps.postDelimiterBackspace = postDelimiter;
    } else {
      pps.postDelimiterBackspace = false;
    }

    owner.onInput(event.target.value);

    event.target.rawValue = owner.getRawValue();
    event.target.value = pps.result;

    owner.registeredEvents.onChange(event);
  };

  onInput = (value, fromProps) => {
    let owner = this as any,
      pps = owner.properties;

    // case 1: delete one more character "4"
    // 1234*| -> hit backspace -> 123|
    // case 2: last character is not delimiter which is:
    // 12|34* -> hit backspace -> 1|34*
    var postDelimiterAfter = Util.getPostDelimiter(
      value,
      pps.delimiter,
      pps.delimiters
    );
    if (
      !fromProps &&
      !pps.numeral &&
      pps.postDelimiterBackspace &&
      !postDelimiterAfter
    ) {
      value = Util.headStr(
        value,
        value.length - pps.postDelimiterBackspace.length
      );
    }

    // phone formatter
    if (pps.phone) {
      if (pps.prefix && (!pps.noImmediatePrefix || value.length)) {
        pps.result =
          pps.prefix +
          pps.phoneFormatter.format(value).slice(pps.prefix.length);
      } else {
        pps.result = pps.phoneFormatter.format(value);
      }
      owner.updateValueState();

      return;
    }

    // numeral formatter
    if (pps.numeral) {
      // Do not show prefix when noImmediatePrefix is specified
      // This mostly because we need to show user the native input placeholder
      if (pps.prefix && pps.noImmediatePrefix && value.length === 0) {
        pps.result = "";
      } else {
        pps.result = pps.numeralFormatter.format(value);
      }
      owner.updateValueState();

      return;
    }

    // date
    if (pps.date) {
      value = pps.dateFormatter.getValidatedDate(value);
    }

    // time
    if (pps.time) {
      value = pps.timeFormatter.getValidatedTime(value);
    }

    // strip delimiters
    value = Util.stripDelimiters(value, pps.delimiter, pps.delimiters);

    // strip prefix
    value = Util.getPrefixStrippedValue(
      value,
      pps.prefix,
      pps.prefixLength,
      pps.result,
      pps.delimiter,
      pps.delimiters,
      pps.noImmediatePrefix,
      pps.tailPrefix,
      pps.signBeforePrefix
    );

    // strip non-numeric characters
    value = pps.numericOnly ? Util.strip(value, /[^\d]/g) : value;

    // convert case
    value = pps.uppercase ? value.toUpperCase() : value;
    value = pps.lowercase ? value.toLowerCase() : value;

    // prevent from showing prefix when no immediate option enabled with empty input value
    if (pps.prefix) {
      if (pps.tailPrefix) {
        value = value + pps.prefix;
      } else {
        value = pps.prefix + value;
      }

      // no blocks specified, no need to do formatting
      if (pps.blocksLength === 0) {
        pps.result = value;
        owner.updateValueState();

        return;
      }
    }

    // update credit card props
    if (pps.creditCard) {
      owner.updateCreditCardPropsByValue(value);
    }

    // strip over length characters
    value = pps.maxLength > 0 ? Util.headStr(value, pps.maxLength) : value;

    // apply blocks
    pps.result = Util.getFormattedValue(
      value,
      pps.blocks,
      pps.blocksLength,
      pps.delimiter,
      pps.delimiters,
      pps.delimiterLazyShow
    );

    owner.updateValueState();
  };

  updateCreditCardPropsByValue(value) {
    let owner = this as any,
      pps = owner.properties,
      creditCardInfo;

    // At least one of the first 4 characters has changed
    if (Util.headStr(pps.result, 4) === Util.headStr(value, 4)) {
      return;
    }

    creditCardInfo = CreditCardDetector.getInfo(
      value,
      pps.creditCardStrictMode
    );

    pps.blocks = creditCardInfo.blocks;
    pps.blocksLength = pps.blocks.length;
    pps.maxLength = Util.getMaxLength(pps.blocks);

    // credit card type changed
    if (pps.creditCardType !== creditCardInfo.type) {
      pps.creditCardType = creditCardInfo.type;

      pps.onCreditCardTypeChanged.call(owner, pps.creditCardType);
    }
  }

  updateValueState() {
    let owner = this as any,
      pps = owner.properties;

    if (!owner.element) {
      owner.setState({ value: pps.result });
      return;
    }

    var endPos = owner.element.selectionEnd;
    var oldValue = owner.element.value;
    var newValue = pps.result;

    owner.lastInputValue = newValue;

    endPos = Util.getNextCursorPosition(
      endPos,
      oldValue,
      newValue,
      pps.delimiter,
      pps.delimiters
    );

    if (owner.isAndroid) {
      window.setTimeout(function () {
        owner.setState({ value: newValue, cursorPosition: endPos });
      }, 1);

      return;
    }

    owner.setState({ value: newValue, cursorPosition: endPos });
  }

  onInputClear = () => this.onInput("", null);

  render() {
    let owner = this as any;
    // eslint-disable-next-line
    var {
      value,
      options,
      onKeyDown,
      onFocus,
      onBlur,
      onChange,
      onInit,
      htmlRef,
      ...propsToTransfer
    } = owner.props;

    return (
      <F7Input
        type="text"
        ref={(ref) => {
          if (!ref) return;

          const { inputEl } = ref.refs;
          if (inputEl) {
            owner.element = inputEl;
            (inputEl as HTMLInputElement).addEventListener(
              "keydown",
              this.onKeyDown
            );
          }

          if (!htmlRef) {
            return;
          }

          htmlRef.apply(this, arguments);
        }}
        {...propsToTransfer}
        value={owner.state.value}
        onChange={owner.onChange}
        onFocus={owner.onFocus}
        onBlur={owner.onBlur}
        onInputClear={this.onInputClear}
      />
    );
  }
}

export default F7CleaveListInput;
