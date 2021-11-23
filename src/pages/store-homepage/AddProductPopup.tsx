import { Block, BlockTitle, Button, F7Searchbar, Popup } from "framework7-react";
import React from "react";
import { useTranslation } from "react-i18next";

import { IcFilter } from "@/components-ui/icons";
import { CatalogList } from "@/components/CatalogList";
import { IProduct } from "@/reducers/productReducer";

type AddProductPopupProps = {
  products: IProduct[];
  selectedProducts: Set<string>;
  isOpenProductsPopup: boolean;
  handleAddProducts: () => void;
  selectProductHandle: (id: string) => void;
  handleCloseProductsPopup: () => void;
};

const AddProductPopup = ({
  products,
  selectedProducts,
  isOpenProductsPopup,
  handleAddProducts,
  selectProductHandle,
  handleCloseProductsPopup,
}: AddProductPopupProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Popup
      backdrop
      slot="fixed"
      id="add-products-popup"
      className="add-store-popup"
      opened={isOpenProductsPopup}
      onPopupClosed={handleCloseProductsPopup}
      tabletFullscreen
    >
      <section className="add-store-popup-container">
        <BlockTitle medium>
          <Button className="close" onClick={handleCloseProductsPopup} iconMaterial="clear" />
          {t("Select Popular Products")}
        </BlockTitle>
        <Block className="block add-products-popup-head">
          <div className="add-products-popup-head-selected">
            <p>
              {t("Selected")} ({selectedProducts.size})
            </p>
          </div>
          {/* <div className="add-products-popup-head-filter">
            <Button round>
              <IcFilter />
              Filter
            </Button>
            <F7Searchbar
              className="search-bar"
              // onSearchbarEnable={this.onSearchbarEnableHandle}
              // onSearchbarDisable={this.onSearchbarDisableHandle}
              placeholder={t("Search")}
            ></F7Searchbar>
          </div> */}
        </Block>
        <Block>
          <CatalogList
            data={products}
            onClick={selectProductHandle}
            selectedProducts={selectedProducts}
          />
        </Block>
        <Block className="add-store-popup-container-done">
          <Button fill round raised onClick={handleAddProducts} disabled={!selectedProducts.size}>
            {t("Done")}
          </Button>
        </Block>
      </section>
    </Popup>
  );
};

export default AddProductPopup;
