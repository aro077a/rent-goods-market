import React, { Component } from "react";
import { PageContent, F7Sheet, List, ListItem, Block } from "framework7-react";
import { connect } from "react-redux";
import { compose } from "redux";
import { WithTranslation, withTranslation } from "react-i18next";
import { Sheet as SheetNamespace } from "framework7/components/sheet/sheet";

import { IApplicationStore, ResizeEvent } from "@/store/rootReducer";
import { Sheet } from "@/components/Sheet";
import { ThemedButton } from "@/components/ThemedButton";
import SmallModalHeader from "@/components-ui/small-modal-header";

import "./style.less";

type Props = Pick<WithTranslation, "t"> &
  F7Sheet.Props & {
    items: {
      title: string;
      description: string;
      uid: string;
    }[];
    selectedItemUid?: string;
    onChooseCountryClick?(): void;
    choosedCountry?: string;
    onApplyClick?(): void;
    resizeEvent: ResizeEvent;
  };

type State = {};

class DeliveryMethodsSheetPage extends Component<Props, State> {
  _sheet: SheetNamespace.Sheet = null;

  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.$f7ready(($f7) => {
      this._sheet = $f7.sheet.get("#delivery_methods__sheet");
    });
  }

  render() {
    const {
      t,
      onChooseCountryClick,
      choosedCountry,
      onApplyClick,
      items,
      selectedItemUid,
      resizeEvent,
      ...rest
    } = this.props;

    return (
      <Sheet
        id="delivery_methods__sheet"
        className="delivery-methods__sheet"
        swipeToClose
        backdrop
        {...rest}
      >
        <PageContent>
          <SmallModalHeader sheetClose title={t("Delivery methods")} />
          <List noHairlines>
            <ListItem
              link
              header={t("Location").toString()}
              title={choosedCountry}
              onClick={onChooseCountryClick}
            />
            {(resizeEvent.isLG || resizeEvent.isXL || resizeEvent.isMD) &&
              items.map((item) => {
                return (
                  <ListItem
                    key={item.uid}
                    radio
                    value={item.uid}
                    name="delivery-radio"
                    checked={selectedItemUid === item.uid}
                    title={item.title}
                    footer={item.description}
                  ></ListItem>
                );
              })}
          </List>
          <Block className="apply-btn-container">
            <ThemedButton round large fill onClick={onApplyClick}>
              {t("Apply")}
            </ThemedButton>
          </Block>
        </PageContent>
      </Sheet>
    );
  }
}

const mapStateToProps = (state: IApplicationStore) => {
  return {
    resizeEvent: state.rootReducer.resizeEvent,
  };
};

export default compose<
  React.ComponentClass<
    F7Sheet.Props & {
      onChooseCountryClick?(): void;
      choosedCountry?: string;
      onApplyClick?(): void;
      items: {
        title: string;
        description: string;
        uid: string;
      }[];
      selectedItemUid?: string;
    }
  >
>(
  withTranslation(),
  connect(mapStateToProps, null)
)(DeliveryMethodsSheetPage);
