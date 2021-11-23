import React, { Component } from "react";
import { BlockTitle, F7Sheet, List, ListItem, Block, Icon } from "framework7-react";
import { connect } from "react-redux";
import { compose } from "redux";
import { WithTranslation, withTranslation } from "react-i18next";
import { Sheet as SheetNamespace } from "framework7/components/sheet/sheet";

import { IApplicationStore } from "@/store/rootReducer";
import { Sheet } from "@/components/Sheet";
import { ThemedButton } from "@/components/ThemedButton";
import { IProduct } from "@/reducers/productReducer";

import "./product-details.less";

type Props = F7Sheet.Props & {
  item: IProduct;
  onAddToCartClick?(count: number): void;
};

type State = {
  sheetOpen?: boolean;
  addToCartSheetItemCount?: number;
  formErrors?: any;
  formValidFields?: any;
  formValid: boolean;
  addToCartSheetInputValue: number;
};

class AddToCartSheetPage extends Component<Props & WithTranslation, State> {
  _sheet: SheetNamespace.Sheet = null;
  inputRef: any;

  constructor(props: Readonly<Props & WithTranslation>) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      addToCartSheetItemCount: 1,
      addToCartSheetInputValue: 1,
      formValidFields: {},
      formErrors: {},
      formValid: false,
    };
  }

  getInputName(index: number) {
    return `input_${index}`;
  }

  handleBlurInput = (e: any) => this.handleUserInput(e);

  handleUserInput = (e: any) => {
    let { name, value, rawValue = null } = e.target;
    value = rawValue !== null && name !== "expireDate" ? rawValue : value;
    // @ts-ignore
    this.setState({ [name]: value }, () => this.validateField(name, value));
  };

  handleInputClear = (e: any) => {
    let { name } = e.target;
    // @ts-ignore
    this.setState({ [name]: "" }, () => this.validateField(name, ""));
  };

  validateField = (fieldName: keyof State, value: string) => {
    const {
      t,
      item: { productParams },
    } = this.props;
    const param = productParams[parseInt(fieldName.replace("input_", ""))];
    let formValidFields = this.state.formValidFields;
    let fieldValidationErrors = this.state.formErrors;
    let errorText = "";
    let requiredFieldErrorText = t("Please fill out this field.");

    if (param) {
      errorText = param.mandatory && value.length ? errorText : requiredFieldErrorText;

      if (param.validationRegExp) {
        const regexp = new RegExp(param.validationRegExp);
        errorText = regexp.test(value) ? errorText : t("Please fill with correct format.");
      }

      fieldValidationErrors[fieldName] = errorText;
      formValidFields[fieldName] = !errorText.length;
    }

    this.setState(
      {
        formErrors: fieldValidationErrors,
        formValidFields,
      },
      this.validateForm
    );
  };

  validateForm = () => {
    this.setState({
      formValid: !this.formHasErrors(this.state.formValidFields),
    });
  };

  formHasErrors = (formValidFields: any) => {
    return Object.keys(formValidFields).some((key) => !formValidFields[key]);
  };

  getErrorMessagesProps = (fieldName: string) => {
    const { t } = this.props;
    return {
      errorMessage: t(this.state.formErrors[fieldName]),
      errorMessageForce: !!this.state.formErrors[fieldName],
    };
  };

  getItemCountList = (popoverQty, itemType) => {
    const data = [];
    if (popoverQty) {
      const isShowPlus = itemType === "P" || itemType === "I";

      for (let i = 0; i < popoverQty; i++) {
        if (popoverQty > 10 && i === 9) {
          data.push({
            value: isShowPlus ? Infinity : i + 1,
            title: `${i + 1}${isShowPlus ? "+" : ""}`,
          });
          break;
        }
        data.push({
          value: i + 1,
          title: i + 1,
        });
      }
    }
    return data;
  };

  handleChangeValue = (e) => {
    const value = e.target.value;
    const reg = /^[0-9]+$/;

    if ((value > 0 && value < 1000 && reg.test(value)) || value === "") {
      this.setState({ addToCartSheetInputValue: value });
    }
  };

  handleClickListItem = (value) => {
    const data: any = {
      addToCartSheetItemCount: value,
    };
    if (value !== Infinity) {
      data.addToCartSheetInputValue = value;
    }
    this.setState({ ...data });
  };

  handleSubmitInput = () => {
    const { item } = this.props;
    const { addToCartSheetInputValue } = this.state;

    document.querySelector("#add_to_cart__sheet").classList.remove("active");
    const count =
      +addToCartSheetInputValue > item.quantity ? item.quantity : addToCartSheetInputValue;

    this.setState({
      addToCartSheetItemCount: count,
      addToCartSheetInputValue: count,
    });
  };

  handleFocus = () => {
    document.querySelector("#add_to_cart__sheet").classList.toggle("active");
  };

  handleBlur = () => {
    setTimeout(() => {
      this.handleFocus();
      this.handleSubmitInput();
    }, 0);
  };

  handleAddToCart = () => {
    const {
      state: { addToCartSheetInputValue },
      props: { onAddToCartClick, item },
    } = this;

    const count =
      +addToCartSheetInputValue > item.quantity ? item.quantity : addToCartSheetInputValue;

    onAddToCartClick(+count);
  };

  componentDidUpdate(prevProps, prevState) {
    const { addToCartSheetItemCount } = this.state;

    if (
      addToCartSheetItemCount !== prevState.addToCartSheetItemCount &&
      addToCartSheetItemCount === Infinity
    ) {
      this.inputRef && this.inputRef.current.focus();
    }
  }

  render() {
    const { addToCartSheetItemCount, addToCartSheetInputValue } = this.state;
    const { t, item, onSheetOpen, onSheetClose, onSheetClosed, onAddToCartClick, ...rest } =
      this.props;

    if (!item) return null;

    const { quantity, type, price, currencyCode, discountedPrice } = item;
    const isInputType: boolean = addToCartSheetItemCount === Infinity;
    const isInfinityType: boolean = type === "I";
    const isServiceType: boolean = type === "S";
    const itemCount = isServiceType ? 10 : isInfinityType ? 999 : quantity;
    const popoverQtyData = this.getItemCountList(itemCount, type);
    const commonPrice = addToCartSheetInputValue * (discountedPrice || price);

    return (
      <Sheet
        id="add_to_cart__sheet"
        className="add-to-cart__sheet"
        swipeToClose={false}
        backdrop
        {...rest}
        onSheetOpen={(instance?: any) => {
          if (onSheetOpen) {
            onSheetOpen(instance);
          }
        }}
        onSheetClose={(instance?: any) => {
          if (onSheetClose) {
            onSheetClose(instance);
          }
        }}
        onSheetClosed={(instance?: any) => {
          if (onSheetClosed) {
            onSheetClosed(instance);
          }
        }}
      >
        <BlockTitle medium>
          {t("Choose Quantity")}
          <div className="add-to-cart__sheet-close-icon" onClick={onSheetClosed}>
            <Icon material="clear" />
          </div>
        </BlockTitle>
        <BlockTitle className="item-title">{`${t("Available")}: ${itemCount}`}</BlockTitle>

        {item && (
          <Block className="add-to-cart__sheet-list">
            <List>
              {popoverQtyData.map((elem, index) => (
                <ListItem
                  title={elem.title}
                  key={index}
                  onClick={() => this.handleClickListItem(elem.value)}
                >
                  {(elem.value === +addToCartSheetItemCount ||
                    (elem.value === Infinity && addToCartSheetItemCount > 9)) && (
                    <Icon material="done" className="selected-icon" />
                  )}
                </ListItem>
              ))}
            </List>
          </Block>
        )}
        <Block className="add-to-cart__sheet-confirmation">
          {isInputType && (
            <div
              className={`add-to-cart__sheet-confirmation-input ${
                addToCartSheetInputValue ? "active" : ""
              }`}
            >
              <form onSubmit={this.handleSubmitInput}>
                {addToCartSheetInputValue && <span>{t("Count of Product")}</span>}
                <input
                  type="number"
                  pattern="\d*"
                  inputMode="decimal"
                  ref={this.inputRef}
                  value={addToCartSheetInputValue}
                  onChange={this.handleChangeValue}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}
                  placeholder={t("Count of Product")}
                />
              </form>
            </div>
          )}
          <ThemedButton
            className="add-to-cart__sheet-confirmation-button"
            disabled={!addToCartSheetInputValue}
            large
            fill
            round
            onClick={this.handleAddToCart}
          >
            <span>{`${commonPrice.toFixed(2)} ${currencyCode}`}</span>
            {t("Add to cart")}
          </ThemedButton>
        </Block>
      </Sheet>
    );
  }
}

const mapStateToProps = (state: IApplicationStore) => {
  return {};
};

export default compose<React.ComponentClass<Props>>(
  withTranslation(),
  connect(mapStateToProps, null)
)(AddToCartSheetPage);
