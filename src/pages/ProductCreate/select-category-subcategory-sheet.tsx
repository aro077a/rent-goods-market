import React, { Component } from "react";
import { PageContent, BlockTitle, F7Sheet, List, ListItem } from "framework7-react";
import { IApplicationStore, ICategory } from "../../store/rootReducer";
import { connect } from "react-redux";
import { ICategoryClassificator } from "../../reducers/categoryReducer";
import { compose } from "redux";
import { getItemStyles } from "../../components/CategoriesMenu";
import connectCategories from "../../store/connectCategories";
import { WithTranslation, withTranslation } from "react-i18next";
import { Sheet as SheetNamespace } from "framework7/components/sheet/sheet";
import { Sheet } from "../../components/Sheet";

import "./style.less";

type Props = WithTranslation &
  F7Sheet.Props & {
    catid?: string;
    subcatid?: string;
    categories?: ICategory[];
    category?: ICategory;
    subcategories?: ICategoryClassificator[];
  };

type State = {
  selectedId?: string;
  selectedSubcategories: ICategoryClassificator[];
};

class SelectCategorySubcategorySheetPage extends Component<Props, State> {
  _sheet: SheetNamespace.Sheet = null;

  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      selectedId: null,
      selectedSubcategories: [],
    };
  }

  componentDidMount() {
    this.$f7ready(($f7) => {
      this._sheet = $f7.sheet.get("#select_category_subcategory_sheet");
    });
  }

  selectHandle = (selectedId: string) => this.setState({ selectedId }, () => this.$f7router.back());
  sheetClosedHandle = () => this.props.onSheetClosed(this.state.selectedId);

  clickSubcategoryHandle = (item: ICategoryClassificator) => {
    const { selectedSubcategories } = this.state;

    if (!item.children.length) {
      this.selectHandle(item.categoryCode);
      return;
    }

    /* ??? */
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
      selectedSubcategories: selectedSubcategories.filter((_item) => _item !== item),
    });
  };

  renderBackLink = () => {
    const { t } = this.props;
    const { selectedSubcategories } = this.state;

    return (
      selectedSubcategories.length && (
        <List>
          <ListItem link="#" title={t("Back").toString()} onClick={this.clickBackHandle} />
        </List>
      )
    );
  };

  renderCategories = () => {
    const { categories, subcategories } = this.props;
    const { selectedSubcategories } = this.state;

    if (selectedSubcategories.length) {
      return (
        <List>
          {selectedSubcategories[selectedSubcategories.length - 1].children.map((item, i) => (
            <ListItem
              key={i}
              link
              title={item.categoryName}
              onClick={() => this.clickSubcategoryHandle(item)}
              noChevron={item.children.length === 0}
            />
          ))}
        </List>
      );
    }

    if (subcategories.length) {
      return (
        <List>
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
    }

    return (
      <List>
        {categories
          .filter((item) => item.id !== "all_filtres")
          .map((item, i) => (
            <ListItem key={i} link="#" title={item.name} onClick={() => this.selectHandle(item.id)}>
              <span slot="media" className="category-item" style={getItemStyles(item)}>
                <i className={`icon ${item.icon}`}></i>
              </span>
            </ListItem>
          ))}
      </List>
    );
  };

  render() {
    const { category, t } = this.props;

    return (
      <Sheet
        id="select_category_subcategory_sheet"
        className="select-category-subcategory-sheet"
        swipeToClose
        backdrop
        onSheetClosed={this.sheetClosedHandle}
      >
        <PageContent>
          <BlockTitle medium>{category ? category.name : t("Select a category")}</BlockTitle>
          {this.renderBackLink()}
          {this.renderCategories()}
        </PageContent>
      </Sheet>
    );
  }
}

const mapStateToProps = (state: IApplicationStore, { catid }: Props) => {
  const category = state.rootReducer.localConfig.categories.filter((item) => item.id === catid)[0];
  const categoryClassificator = state.categoryReducer.categories
    ? state.categoryReducer.categories.filter((item) => item.categoryCode === catid)[0]
    : null;
  const subcategories = categoryClassificator ? categoryClassificator.children : [];
  return {
    category,
    subcategories,
  };
};

export default compose(
  withTranslation(),
  connectCategories,
  connect(mapStateToProps, null)
)(SelectCategorySubcategorySheetPage);
