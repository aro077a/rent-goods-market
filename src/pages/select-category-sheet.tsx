import React, { Component } from "react";
import {
  PageContent,
  BlockTitle,
  F7Sheet,
  List,
  ListItem,
  Link,
} from "framework7-react";
import { IApplicationStore, ICategory } from "../store/rootReducer";
import { connect } from "react-redux";
import { getCategory, getSubcategories } from "../selectors/category";
import { ICategoryClassificator } from "../reducers/categoryReducer";
import { Dispatch, compose } from "redux";
import { chooseSubcategory } from "../actions/filterActions";
import { WithTranslation, withTranslation } from "react-i18next";
import { Sheet as SheetNamespace } from "framework7/components/sheet/sheet";
import { Sheet } from "../components/Sheet";
import classNames from "classnames";

import "./select-category-sheet.less";

type Props = F7Sheet.Props & {
  category?: ICategory;
  subcategories?: ICategoryClassificator[];
  chooseSubcategory?(catid?: string): void;
  onChooseSubcategoryClick?(catid: string): void;
};

type State = {
  selectedId?: string;
  selectedSubcategories: ICategoryClassificator[];
};

class SelectCategorySheetPage extends Component<
  Props & WithTranslation,
  State
> {
  _sheet: SheetNamespace.Sheet;

  constructor(props: Readonly<Props & WithTranslation>) {
    super(props);
    this.state = {
      selectedId: null,
      selectedSubcategories: [],
    };
  }

  componentDidMount() {
    /* TODO */
    const sheetSelector = "#select_category_subcategory_sheet";
    if (!this._sheet) {
      this._sheet = this.$f7.sheet.get(sheetSelector);
    }
  }

  componentDidUpdate(prevProps: Props) {
    /* TODO */
    if (!prevProps.opened && prevProps.opened !== this.props.opened) {
      this.setState({ selectedId: null, selectedSubcategories: [] });
    }
  }

  componentWillUnmount() {
    try {
      if (this._sheet) {
        this._sheet.destroy();
      }
    } catch (err) {}
  }

  selectHandle = (selectedId: string) =>
    this.setState({ selectedId }, () => {
      this._sheet.close();
      this.props.chooseSubcategory(selectedId);
      if (this.props.onChooseSubcategoryClick) {
        this.props.onChooseSubcategoryClick(selectedId);
      }
    });

  clickSubcategoryHandle = (item: ICategoryClassificator) => {
    const { selectedSubcategories } = this.state;

    if (!item.children.length) {
      this.selectHandle(item.categoryCode);
      return;
    }

    /* TODO */
    const pageContent = this._sheet.$el.find(".page-content");
    if (pageContent.scrollTop() > 0) {
      this._sheet.$el.find(".page-content").scrollTop(0, 150, () => {
        setTimeout(
          () =>
            this.setState({
              selectedSubcategories: [...selectedSubcategories, item],
            }),
          150
        );
      });
    } else {
      this.setState({
        selectedSubcategories: [...selectedSubcategories, item],
      });
    }
  };

  clickBackHandle = () => {
    const { selectedSubcategories } = this.state;
    const item = selectedSubcategories[selectedSubcategories.length - 1];

    this.setState({
      selectedSubcategories: selectedSubcategories.filter(
        (_item) => _item !== item
      ),
    });
  };

  renderPageContent() {
    const { category } = this.props;
    const { selectedSubcategories } = this.state;
    return (
      category && (
        <>
          <BlockTitle medium>
            {this.renderBackLink()}{" "}
            {selectedSubcategories[selectedSubcategories.length - 1]
              ? selectedSubcategories[selectedSubcategories.length - 1]
                  .categoryName
              : category.name}
          </BlockTitle>
          {this.renderCategories()}
        </>
      )
    );
  }
  //old
  //   renderBackLink = () => {
  //     const { t } = this.props;
  //     const { selectedSubcategories } = this.state;
  //
  //     return (
  //       !!selectedSubcategories.length && (
  //         <List>
  //           <ListItem
  //             link="#"
  //             title={t("Back").toString()}
  //             onClick={this.clickBackHandle}
  //           />
  //         </List>
  //       )
  //     );
  //   };

  renderBackLink = () => {
    const { t } = this.props;
    const { selectedSubcategories } = this.state;

    return !!selectedSubcategories.length ? (
      <Link
        className="back-link"
        href="#"
        iconF7="arrow_left"
        onClick={this.clickBackHandle}
      />
    ) : (
      <Link
        className="back-link"
        href="#"
        iconF7="arrow_left"
        onClick={this.props.onSheetClosed}
      />
    );
  };

  renderCategories = () => {
    const { subcategories, category, t } = this.props;
    const { selectedSubcategories } = this.state;

    if (selectedSubcategories.length) {
      return (
        <List>
          <ListItem
            link="#"
            title="All products"
            onClick={() =>
              this.clickSubcategoryHandle({
                categoryCode:
                  selectedSubcategories[selectedSubcategories.length - 1]
                    .categoryCode,
                categoryName:
                  selectedSubcategories[selectedSubcategories.length - 1]
                    .categoryName,
                children: [],
              })
            }
            noChevron
          />
          {selectedSubcategories[selectedSubcategories.length - 1].children.map(
            (item, i) => (
              <ListItem
                key={i}
                link
                title={item.categoryName}
                onClick={() => this.clickSubcategoryHandle(item)}
                noChevron={item.children.length === 0}
              />
            )
          )}
        </List>
      );
    }

    return (
      <List>
        <ListItem
          link="#"
          title={t("All products").toString()}
          onClick={() =>
            this.clickSubcategoryHandle({
              categoryCode: category.id,
              categoryName: category.name,
              children: [],
            })
          }
          noChevron
        />
        {subcategories.map((item, i) => (
          <ListItem
            key={i}
            link="#"
            title={item.categoryName}
            onClick={() => this.clickSubcategoryHandle(item)}
            noChevron={item.children.length === 0}
          />
        ))}
      </List>
    );
  };

  render() {
    const { className, opened, onSheetClosed, ...rest } = this.props;

    return (
      <Sheet
        id="select_category_subcategory_sheet"
        className={classNames("select-category-sheet", className)}
        // swipeToClose
        backdrop
        opened={opened}
        onSheetClosed={onSheetClosed}
        {...rest}
      >
        {/*TODO */}
        <PageContent>{opened && this.renderPageContent()}</PageContent>
      </Sheet>
    );
  }
}

const mapStateToProps = (state: IApplicationStore) => ({
  category: getCategory(state),
  subcategories: getSubcategories(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  chooseSubcategory: (catid?: string) => dispatch(chooseSubcategory(catid)),
});

export default compose<React.ComponentClass<Props>>(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps)
)(SelectCategorySheetPage);
