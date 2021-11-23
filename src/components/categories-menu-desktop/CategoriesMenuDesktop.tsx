import React from "react";
import { List, ListItem } from "framework7-react";
import { compose, Dispatch } from "redux";
import connectCategories from "../../store/connectCategories";
import { ICategory, IApplicationStore } from "../../store/rootReducer";
import connectFilter from "../../store/connectFilter";
import { ICategoryClassificator } from "../../reducers/categoryReducer";
import { connect } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";
import classNames from "classnames";

import "./style.less";
import { Dom7 } from "framework7";
import { chooseCategorySubcategory } from "../../actions/filterActions";

type Props = WithTranslation & {
  className?: string;
  categories?: ICategory[];
  chosenCategoryId?: string;
  chosenSubcategoryId?: string;
  chosenSubcategory?: ICategoryClassificator;
  categoryOnClick?(catid: string): void;
  clearFilterOnClick?(): void;
  opened?: boolean;
  subcategories?: ICategoryClassificator[];
  chooseCategorySubcategory?(catid?: string, subcatid?: string): void;
};

type State = {
  subCatHovered?: string;
};

class CategoriesMenuDesktop extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.state = { subCatHovered: null };
  }

  componentDidMount() {
    /* TODO */
    const $el = Dom7(".categories-menu-desktop-n");
    $el.on("mouseover", ".item-link", this.handleMouseOver);
  }

  handleMouseOver(ev) {
    const $el = Dom7(ev.target).closest("a");
    const id = $el.find(".item-title span").attr("data-id");

    this.setState((state) => {
      const { subCatHovered } = state;
      if (subCatHovered !== id) return { ...state, subCatHovered: id };
      return state;
    });
  }

  generateSubcategories(categories: ICategoryClassificator[]) {
    const result = [];
    const maxRowItems = 13;
    const { subCatHovered } = this.state;
    if (!subCatHovered) return null;

    const selectedCat = categories.find(
      (item) => item.categoryCode === subCatHovered
    );
    let subCats = selectedCat.children;
    const other = subCats.find((cat) => cat.seoText === "other");
    subCats = subCats.filter((cat) => cat.seoText !== "other");
    const itemsCount = subCats.reduce<number>(
      (count, cat) => count + cat.children.length + 1,
      0
    );
    let rowPerColumn = Math.ceil(itemsCount / 4);
    rowPerColumn = rowPerColumn >= maxRowItems ? rowPerColumn : maxRowItems;
    const sortedByCount = subCats.sort((a, b) => {
      if (a.children.length > b.children.length) {
        return 1;
      } else if (a.children.length < b.children.length) {
        return -1;
      } else {
        return 0;
      }
    });

    let subCatsHasChildren = sortedByCount.filter(
      (cat) => cat.children.length > 0
    );
    const subCatsNoChildren = sortedByCount.filter(
      (cat) => !cat.children || cat.children.length === 0
    );

    let rowFill = 0;
    let rowProcessed = 0;

    while (rowFill <= rowPerColumn && rowProcessed < 4) {
      if (subCatsHasChildren.length > 0) {
        if (rowFill === 0) {
          const last = subCatsHasChildren.pop();
          result.push(last);
          rowFill += last.children.length;
        }
        while (true) {
          if (rowFill >= rowPerColumn) break;
          const found = subCatsHasChildren.find(
            (cat) =>
              cat.children && cat.children.length <= rowPerColumn - rowFill
          );
          if (!found) break;
          subCatsHasChildren = subCatsHasChildren.filter(
            (cat) => cat.categoryCode !== found.categoryCode
          );
          result.push(found);
          rowFill += found.children.length;
        }
      }

      if (subCatsNoChildren.length > 0) {
        while (true) {
          if (rowFill >= rowPerColumn) break;
          const last = subCatsNoChildren.pop();
          if (!last) break;
          result.push(last);
          rowFill += 1;
        }
      }

      rowProcessed++;
      rowFill = 0;
    }

    if (subCatsHasChildren.length > 0) result.push([...subCatsHasChildren]);
    if (subCatsNoChildren.length > 0) result.push([...subCatsNoChildren]);
    if (other) result.push(other);

    return result.map((item) => {
      return (
        <li key={item.categoryCode} className="sub-item">
          <div className="category-title">
            <a
              onClick={() =>
                this.props.chooseCategorySubcategory(
                  subCatHovered,
                  item.categoryCode
                )
              }
            >
              {item.categoryName}
            </a>
          </div>
          <ul>
            {flattenDeep(item.children).map((_item) => (
              <div key={_item.categoryCode} className="sub-title">
                <a
                  onClick={() => {
                    this.props.chooseCategorySubcategory(
                      subCatHovered,
                      _item.categoryCode
                    );
                  }}
                >
                  {_item.categoryName}
                </a>
              </div>
            ))}
          </ul>
        </li>
      );
    });
  }

  render() {
    const {
      className,
      categories,
      chooseCategorySubcategory,
      opened,
      subcategories,
      t,
    } = this.props;
    this.generateSubcategories(subcategories);
    const { subCatHovered } = this.state;
    return (
      <>
        <div
          className={classNames(
            "popup-backdrop categories-menu-backdrop",
            opened && "backdrop-in"
          )}
        />
        <div
          className={classNames(
            "categories-menu-desktop-n",
            className,
            opened && "opened"
          )}
        >
          <div className="inner-container">
            <List className="categories" noHairlines noHairlinesBetween>
              {categories.map(
                (item) =>
                  item.id !== "all_filtres" && (
                    <ListItem
                      link="#"
                      key={item.id}
                      className={classNames(
                        "no-ripple",
                        subCatHovered === item.id && "hovered"
                      )}
                    >
                      <span
                        slot="media"
                        className="category-item"
                        style={getItemStyles(item)}
                      >
                        <i className={`icon ${item.icon}`} />
                      </span>

                      <span slot="title" data-id={item.id}>
                        {t(item.name)}
                      </span>

                      {/*
                  <ul className="subcategories">
                    {subcategories
                      .filter((_item) => _item.code === item.id)
                      .map((item) => {
                        return item.children.map((item) => {
                          return (
                            <li key={item.code} className="sub-item">
                              <div className="category-title">
                                <a>{item.value}</a>
                              </div>
                              <ul>
                                {flattenDeep(item.children).map((item) => (
                                  <div className="sub-title">
                                    <a>{item.value}</a>
                                  </div>
                                ))}
                              </ul>
                            </li>
                          );
                        });
                      })}
                  </ul>
                  */}
                    </ListItem>
                  )
              )}
            </List>

            <div className="subcategories-container">
              <ul className="subcategories">
                {this.generateSubcategories(subcategories)}
              </ul>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state: IApplicationStore) => {
  const { chosenSubcategoryId } = state.filterReducer;
  return {
    subcategories: state.categoryReducer.categories,
    chosenSubcategory: state.categoryReducer.flat
      ? state.categoryReducer.flat.filter(
          (item) => item.categoryCode === chosenSubcategoryId
        )[0]
      : null,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  chooseCategorySubcategory: (catid?: string, subcatid?: string) =>
    dispatch(chooseCategorySubcategory(catid, subcatid)),
});

const connectChosenSubcategory = connect(mapStateToProps, mapDispatchToProps);

export default compose<any>(
  withTranslation(),
  connectCategories,
  connectChosenSubcategory,
  connectFilter
)(CategoriesMenuDesktop);

// Helpers
// @ts-ignore
const getCategoriesClasses = (empty: boolean) =>
  `categories${empty ? " empty" : ""}`;
export const getItemStyles = (item: ICategory) => ({
  backgroundColor: item.color,
});

function flattenDeep(arr1: ICategoryClassificator[]): ICategoryClassificator[] {
  return arr1;
  /*
                    return arr1.reduce(
                      (acc, val) =>
                        val.children ? acc.concat(flattenDeep(val.children)) : acc.concat(val),
                      []
                    );
                    */
}
