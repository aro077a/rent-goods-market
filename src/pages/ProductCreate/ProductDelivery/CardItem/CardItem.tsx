import React, { FC, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Block, Link, List, ListItem, Popover } from "framework7-react";

import {
  IcDeliveryPurple,
  IcLocationGreen,
  IcMarker,
  IcMore,
  IcRemove,
} from "../../../../components-ui/icons";

import "./cardItem.less";

interface ICardItemProps {
  data: dataType[];
}

type dataType = {
  method: string;
};

const CardItem: FC<ICardItemProps> = ({ data }) => {
  const { t } = useTranslation();

  return (
    <Block className="card-item">
      {data.map((dataItem: any) => {
        return (
          <Fragment key={dataItem.id}>
            <div className="card-item__content">
              {dataItem.type === "delivery" ? <IcDeliveryPurple /> : <IcLocationGreen />}
              <ListItem title={dataItem.method}></ListItem>
              <Link popoverOpen=".card-item__popover-menu">
                <IcMore fill="#676767" className="card-item__more" />
              </Link>
              <Popover className="card-item__popover-menu">
                <List>
                  <div className="card-item__edit">
                    <IcMarker />
                    <ListItem link="#" popoverClose title={t("Edit") as string} />
                  </div>
                  <div className="card-item__remove">
                    <IcRemove />
                    <ListItem link="#" popoverClose title={t("Remove") as string} />
                  </div>
                </List>
              </Popover>
            </div>
            {dataItem.ship_to.map((item: any) => {
              const { countries, min_days, max_days, shipping_cost } = item;
              return (
                <div className="card-item__info" key={item.id}>
                  <p>{countries}</p>
                  <p>
                    {t("Delivery time")} {`${min_days}-${max_days} `} {t("days")}
                  </p>
                  <p>
                    {shipping_cost !== "Free Shipping"
                      ? `${t("Shipping cost")} $${shipping_cost} `
                      : `${shipping_cost} `}
                  </p>
                </div>
              );
            })}
          </Fragment>
        );
      })}
    </Block>
  );
};

export default CardItem;
