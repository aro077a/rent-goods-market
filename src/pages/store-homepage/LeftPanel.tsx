import { Block, BlockTitle, Button, Icon } from "framework7-react";
import React, { memo } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { compose } from "redux";
import {
  IcCategory,
  IcClose,
  IcDragDrop,
  IcEdit,
  IcImage,
  IcMarketspace,
  IcRemove,
} from "../../components-ui/icons";
import { Price } from "../../components/Price";
import connectCategories from "../../store/connectCategories";

const LeftPanel = ({
  widgets,
  banner,
  goBack,
  handleOpenWidgetPopup,
  storeHomepageProducts,
  handleOpenProductAddPopup,
  handleDeleteWidget,
  handleDeleteProduct,
  handleWidgetPopover,
  handleProductsPopover,
  handleOpenBannerPopup,
  handleActionBanner,
  isPanelShowMobile,
  categories,
}) => {
  const { t } = useTranslation();

  return createPortal(
    <Block
      id="add-store-panel"
      className={`${isPanelShowMobile ? "active" : ""}`}
    >
      <Block className="add-store-panel-close">
        <Button onClick={goBack}>
          <IcClose />
        </Button>
      </Block>
      <div className="add-store-panel-actions">
        {!banner ? (
          <Block className="add-store-panel-actions-banner panel-item">
            <Button onClick={handleOpenBannerPopup}>
              <IcImage /> {t("Add Banner")}
            </Button>
          </Block>
        ) : (
          <Block className="add-store-panel-actions-banner-append">
            <BlockTitle>{t("Banner")}</BlockTitle>
            <div className="add-store-panel-actions-banner-append-content">
              <img src={banner.desktopImageUrl} alt="" />
              <p>{banner.title}</p>
              <div className="add-store-panel-actions-banner-append-content-actions">
                <Button
                  className="add-store-panel-actions-banner-append-content-edit"
                  onClick={handleOpenBannerPopup}
                >
                  <IcEdit />
                </Button>
                <Button
                  className="add-store-panel-actions-banner-append-content-remove"
                  onClick={() => handleActionBanner("remove")}
                >
                  <IcRemove />
                </Button>
              </div>
            </div>
          </Block>
        )}
        {!widgets?.length ? (
          <Block className="add-store-panel-actions-widget panel-item">
            <Button onClick={handleOpenWidgetPopup}>
              <IcCategory /> {t("Add Widget")}
            </Button>
          </Block>
        ) : (
          <Block className="add-store-panel-actions-widget-append">
            <div className="add-store-panel-actions-widget-append-actions">
              <BlockTitle>{t("Widgets")}</BlockTitle>
              <div className="add-store-panel-actions-widget-append-actions-buttons">
                <Button onClick={handleOpenWidgetPopup}>
                  <Icon material="add" />
                </Button>
                <Button
                  popoverOpen={`.widget-popover`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWidgetPopover();
                  }}
                >
                  <Icon material="more_vertical" />
                </Button>
              </div>
            </div>
            <div className="add-store-panel-actions-widget-append-list">
              {widgets.map((widget) => {
                const categoryInfo = categories.find(
                  (elem) => elem.id === widget.rootCategoryCode
                );
                return (
                  <div
                    className="add-store-panel-actions-widget-append-list-item"
                    key={widget.category}
                  >
                    <div className="add-store-panel-actions-widget-append-list-item-content">
                      <span
                        slot="media"
                        className="add-store-panel-actions-widget-append-list-item-content-drag"
                      >
                        <IcDragDrop />
                      </span>
                      <span
                        slot="media"
                        className="add-store-panel-actions-widget-append-list-item-content-icon"
                        style={{ backgroundColor: categoryInfo?.color }}
                      >
                        <i className={`icon ${categoryInfo?.icon}`} />
                      </span>
                      <div className="add-store-panel-actions-widget-append-list-item-content-text">
                        <p>{widget.rootCategoryName}</p>
                        {widget.rootCategoryCode !== widget.category && (
                          <span>{widget.categoryName}</span>
                        )}
                      </div>
                    </div>
                    <Button
                      className="add-store-panel-actions-widget-append-list-item-remove"
                      onClick={() => handleDeleteWidget(widget)}
                    >
                      <IcRemove />
                    </Button>
                  </div>
                );
              })}
            </div>
          </Block>
        )}
        {!storeHomepageProducts?.length ? (
          <Block className="add-store-panel-actions-products panel-item">
            <Button onClick={handleOpenProductAddPopup}>
              <IcMarketspace fill="#676767" /> {t("Add Products")}
            </Button>
          </Block>
        ) : (
          <Block className="add-store-panel-actions-products-append">
            <div className="add-store-panel-actions-products-append-actions">
              <BlockTitle>{t("Products")}</BlockTitle>
              <div className="add-store-panel-actions-products-append-actions-buttons">
                <Button onClick={handleOpenProductAddPopup}>
                  <Icon material="add" />
                </Button>
                <Button
                  popoverOpen={`.products-popover`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProductsPopover();
                  }}
                >
                  <Icon material="more_vertical" />
                </Button>
              </div>
            </div>
            <div className="add-store-panel-actions-products-append-list">
              {storeHomepageProducts.map((product: any) => (
                <div
                  className="add-store-panel-actions-products-append-list-item"
                  key={product.productUid}
                >
                  <div className="add-store-panel-actions-products-append-list-item-content">
                    <span
                      slot="media"
                      className="add-store-panel-actions-products-append-list-item-content-drag"
                    >
                      <IcDragDrop />
                    </span>
                    <span
                      className="add-store-panel-actions-products-append-list-item-content-img"
                      style={
                        product.imageThumbnailUrl1
                          ? {
                              backgroundImage: `url(${product.imageThumbnailUrl1})`,
                            }
                          : null
                      }
                    />
                    <div className="add-store-panel-actions-products-append-list-item-content-info">
                      <p className="product-name">{product.productName}</p>
                      <Price
                        price={product.productPrice}
                        priceDiscount={product.productDiscountedPrice}
                        currencyCode={product.productCurrencyCode}
                      />
                    </div>
                  </div>
                  <Button
                    className="add-store-panel-actions-products-append-list-item-remove"
                    onClick={() => handleDeleteProduct(product)}
                  >
                    <IcRemove />
                  </Button>
                </div>
              ))}
            </div>
          </Block>
        )}
      </div>
    </Block>,
    document.getElementById("framework7-root")
  );
};

export default compose(connectCategories)(memo(LeftPanel));
