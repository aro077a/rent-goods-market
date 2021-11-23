import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Block, BlockTitle, Col, List, ListInput } from "framework7-react";

import "./productAdditionalInfo.less";

const ProductAdditionalInfo = () => {
  const [date, setDate] = useState<any>({
    publication: "",
    expiration: "",
  });

  const { t } = useTranslation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const valueWithSlash = value.replace(/^(\d{2})(\d{2})/, "$1/$2/");
    setDate({ ...date, [name]: valueWithSlash });
  };

  return (
    <>
      <BlockTitle large className="type-block-title">
        {t("Additional Information")}
      </BlockTitle>
      <Block className="delivery"></Block>
      <Col className="additional__info">
        <List>
          <ListInput
            type="text"
            name="publication"
            className="custom-style"
            floatingLabel
            label={t("Publication Date") as string}
            value={date.publication}
            maxlength={10}
            onInput={handleInputChange}
          />
          <ListInput
            type="text"
            name="expiration"
            className="custom-style"
            floatingLabel
            label={t("Expiration Date") as string}
            value={date.expiration}
            maxlength={10}
            onInput={handleInputChange}
          />
        </List>
      </Col>
    </>
  );
};

export default ProductAdditionalInfo;
