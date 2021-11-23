import React from "react";
import {
  Block,
  BlockTitle,
  Button,
  Icon,
  List,
  ListItem,
  Popup,
} from "framework7-react";
import { getCategory } from "../../utils";
import { useTranslation } from "react-i18next";

const AddWidgetPopup = ({
  isOpenWidgetPopup,
  filteredCategories,
  selectedCategories,
  openedCategories,
  handleCloseWidgetPopup,
  handleChangeCategories,
  handleClickCategories,
  categoriesClassificator,
  handleAddWidget,
}) => {
  const { t } = useTranslation();

  return (
    <Popup
      backdrop
      slot="fixed"
      id="add-widget-popup"
      opened={isOpenWidgetPopup}
      onPopupClosed={handleCloseWidgetPopup}
      className="add-store-popup"
    >
      <section className="add-store-popup-container">
        <BlockTitle medium>
          <Button
            className="close"
            onClick={handleCloseWidgetPopup}
            iconMaterial="clear"
          />
          {t("Select Categories")}
        </BlockTitle>
        <p className="add-widget-popup-desc">
          {t(
            "Choose which categories you want to add to your store's home page"
          )}
        </p>
        <List>
          {filteredCategories.map((elem) => (
            <ListItem
              checked={selectedCategories.has(elem.id)}
              checkbox
              name={elem.name}
              value={elem.id}
              title={elem.name}
              onChange={() => handleChangeCategories(elem.id)}
              className={`${openedCategories.has(elem.id) ? "active" : ""}`}
            >
              <div
                className="list-icon-more"
                slot="root-start"
                onClick={() => handleClickCategories(elem.id)}
              >
                <Icon material="expand_more" />
              </div>
              {openedCategories.has(elem.id) && (
                <List slot="root-end">
                  {getCategory(categoriesClassificator, elem.id)?.children.map(
                    (item) => {
                      return (
                        <ListItem
                          checked={selectedCategories.has(item.categoryCode)}
                          checkbox
                          onChange={() =>
                            handleChangeCategories(item.categoryCode)
                          }
                          name={item.categoryName}
                          value={item.categoryCode}
                          title={item.categoryName}
                          className={`${
                            openedCategories.has(item.categoryCode)
                              ? "active"
                              : ""
                          }`}
                        >
                          <div
                            className="list-icon-more"
                            slot="root-start"
                            onClick={() =>
                              !!item.children.length &&
                              handleClickCategories(item.categoryCode)
                            }
                          >
                            {!!item.children.length && (
                              <Icon material="expand_more" />
                            )}
                          </div>
                          {openedCategories.has(item.categoryCode) && (
                            <List slot="root-end">
                              {getCategory(
                                categoriesClassificator,
                                item.categoryCode
                              )?.children.map((item) => {
                                return (
                                  <ListItem
                                    checked={selectedCategories.has(
                                      item.categoryCode
                                    )}
                                    checkbox
                                    onChange={() =>
                                      handleChangeCategories(item.categoryCode)
                                    }
                                    name={item.categoryName}
                                    value={item.categoryCode}
                                    title={item.categoryName}
                                  />
                                );
                              })}
                            </List>
                          )}
                        </ListItem>
                      );
                    }
                  )}
                </List>
              )}
            </ListItem>
          ))}
        </List>
        <Block className="add-store-popup-container-done">
          <Button
            fill
            round
            raised
            onClick={handleAddWidget}
            disabled={!selectedCategories.size}
          >
            {t("Done")}
          </Button>
        </Block>
      </section>
    </Popup>
  );
};

export default AddWidgetPopup;
