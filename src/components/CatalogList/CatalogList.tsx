import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { formatDate } from "@/utils";
import { Price } from "@/components/Price";
import { AnaliticDetails, ProductStatus } from "@/components/ProductDetails";

import { CatalogListProps } from "./CatalogList.types";

import "./CatalogList.less";

export const CatalogList = React.memo(
  ({ data, onClick, selectedProducts }: CatalogListProps): JSX.Element => {
    const { t } = useTranslation();

    const checkAll = useCallback(() => onClick("check_all"), [onClick]);

    return (
      <div className="catalog-list data-table data-table-init card">
        <table>
          <thead className="catalog-list-head">
            <tr>
              {selectedProducts && (
                <th className="checkbox-cell">
                  <label className="checkbox">
                    <input type="checkbox" onChange={checkAll} />
                    <i className="icon-checkbox" />
                  </label>
                </th>
              )}
              <th className="label-cell">{t("Product")}</th>
              <th className="label-cell catalog-list-head-price">{t("Cost")}</th>
              <th className="label-cell">{t("Views")}</th>
              <th className="label-cell">{t("Likes")}</th>
              <th className="label-cell">{t("Added")}</th>
              <th className="label-cell">{t("Status")}</th>
            </tr>
          </thead>
          <tbody className="catalog-list-body">
            {data.length &&
              data?.map((item) => (
                <tr className="catalog-list-row" key={item.uid}>
                  {selectedProducts && (
                    <td className="catalog-list-row-checkbox checkbox-cell">
                      <label className="checkbox" onChange={() => onClick(item.uid)}>
                        <input type="checkbox" checked={selectedProducts?.has(item.uid)} />
                        <i className="icon-checkbox" />
                      </label>
                    </td>
                  )}
                  <td
                    className="catalog-list-row-media label-cell"
                    onClick={() => onClick(item.uid)}
                  >
                    <div className="catalog-list-row-media-image">
                      {item.imageThumbnailUrl1 && (
                        <img src={item.imageThumbnailUrl1} alt={item.name} />
                      )}
                    </div>
                    <p className="catalog-list-row-media-name">{item.name}</p>
                    <div className="catalog-list-row-mob">
                      <p>{item.name}</p>
                      {item.statusValue && (
                        <ProductStatus text={item.statusValue} status={item.status} />
                      )}
                      <Price
                        size="small"
                        price={item.price}
                        discountedPrice={item.discountedPrice}
                        currencyCode={item.currencyCode}
                        period={item?.rentOptions?.period}
                      />
                      <div className="catalog-list-row-mob-view-wish">
                        <AnaliticDetails type="view" count={item.viewCount} />
                        <AnaliticDetails type="wish" count={item.wishCount} />
                      </div>
                    </div>
                  </td>
                  <td className="catalog-list-row-price label-cell">
                    <Price
                      size="small"
                      price={item.price}
                      discountedPrice={item.discountedPrice}
                      currencyCode={item.currencyCode}
                      period={item?.rentOptions?.period}
                    />
                  </td>
                  <td className="catalog-list-row-views label-cell">
                    <AnaliticDetails type="view" count={item.viewCount} />
                  </td>
                  <td className="catalog-list-row-wish label-cell">
                    <AnaliticDetails type="wish" count={item.wishCount} />
                  </td>
                  <td className="catalog-list-row-date label-cell">
                    {item.publishDate && formatDate(item.publishDate.toString())}
                  </td>
                  <td className="catalog-list-row-status label-cell">
                    {item.statusValue && (
                      <ProductStatus text={item.statusValue} status={item.status} />
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  }
);
CatalogList.displayName = "CatalogList";
