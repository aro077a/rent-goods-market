import React from "react";
import { ActiveFeatureDetails } from "../../types/marketplaceapi";
import { Row, Col, Link } from "framework7-react";

import "./style.less";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";
import ServicePackageDescription from "../ServicePackageList/ServicePackageDescription";
import { getDaysLeft } from "../../utils";

type Props = {
  items: ActiveFeatureDetails[];
  onClickItem?(uid: string): void;
};

class PromotionDetailsList extends React.Component<Props & WithTranslation> {
  render() {
    const { items, onClickItem, t } = this.props;
    return (
      <Row className="promotion-details-list">
        {items.map((item, i) => (
          <Col key={i.toString()} className="list-item" width="50">
            <Link onClick={() => onClickItem && onClickItem(item.typeCode)}>
              <ServicePackageDescription
                code={item.code}
                typeCode={item.typeCode}
                price={item.price}
                duration={`${getDaysLeft(item.expireDate)} ${t("days left")}`}
                title={item.typeName}
                description={""}
                full
                compact
              />
            </Link>
          </Col>
        ))}
      </Row>
    );
  }
}

export default compose(withTranslation())(PromotionDetailsList);
