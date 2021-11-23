import React from "react";
import { List, ListItem } from "framework7-react";

import { compose } from "redux";
import connectCategories from "@/store/connectCategories";
import connectFilter from "@/store/connectFilter";
import { ICategory } from "@/store/rootReducer";
import { IProduct } from "@/reducers/productReducer";
import connectCategoriesClassificator from "@/store/connectCategoriesClassificator";
import { ICategoryClassificator } from "@/reducers/categoryReducer";
import { getSubcategoryNameBySubcategoryId } from "@/utils";
import Price from "@/components/PriceDetails";
import { AddWishButton } from "@/components/AddWishButton";
import { addToWishList } from "@/actions/productActions";
import { connect } from "react-redux";

import "./StoreCatalog.less";

type Props = {
  items?: IProduct[];
  categories?: ICategory[];
  chosenCategoryId?: string;
  chosenSubcategoryId?: string;
  categoriesClassificator?: ICategoryClassificator[];
  addToWish?(uid?: string): void;
};

const getItemBackgroundStyle = (url: string) => (url ? { backgroundImage: `url(${url})` } : null);

const StoreCatalog = ({ items, categoriesClassificator, addToWish }: Props) => (
  <List className="catalog" mediaList noChevron noHairlines>
    {items.map((item, index) => (
      <ListItem
        key={index}
        link={`/product-details/${item.uid || item.productUid}/`}
        title={item.name || item.productName}
        subtitle={getSubcategoryNameBySubcategoryId(
          item.category || item.productCategory,
          categoriesClassificator
        )}
        text={item.description || item.productDescription}
        noChevron
      >
        <div slot="inner-end">
          <Price
            price={item.price || item.productPrice}
            priceDiscount={item.discountedPrice || item.productdIscountedPrice}
            currencyCode={item.currencyCode || item.productCurrencyCode}
          />
        </div>
        <div slot="media" className="image" style={getItemBackgroundStyle(item.imageThumbnailUrl1)}>
          <AddWishButton
            onClick={() => addToWish(item.uid || item.productUid)}
            withShadow
            active={item.wish}
          />
        </div>
      </ListItem>
    ))}
  </List>
);

const mapDispatchToProps = (dispatch: any) => ({
  addToWish: (uid?: string) => dispatch(addToWishList(uid)),
});

export default compose<any>(
  connectFilter,
  connectCategories,
  connectCategoriesClassificator,
  connect(null, mapDispatchToProps)
)(StoreCatalog);
