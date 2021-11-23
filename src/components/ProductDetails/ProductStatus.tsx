import React from "react";

const ProductStatus = ({ text, status }) => {
  return (
    <div className={`product-status ${status}`}>
      <span>{text}</span>
    </div>
  );
};

export default ProductStatus;
