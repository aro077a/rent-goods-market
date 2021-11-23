import React from "react";

import "./style.less";
import { IcWip, IcMarker, IcUp } from "../../components-ui/icons";

const CODE_ICONS = {
  higlight_bold: <IcMarker />,
  top_daily: <IcUp />,
  vip: <IcWip />,
};

const HeaderIcon = ({ typeCode = "top_daily" }) => (
  <div className={`header-icon ${typeCode}`}>{CODE_ICONS[typeCode]}</div>
);

type Props = {
  code: string;
  typeCode: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  full?: boolean;
  compact?: boolean;
};

export default ({
  code,
  typeCode,
  title,
  description,
  duration,
  full = false,
  compact = false,
}: Props) => {
  return (
    <div className="service-package-description">
      {compact ? (
        <div className="title compact">
          <div className="media-container">
            <HeaderIcon typeCode={typeCode} />
          </div>
          <div className="title-container">
            {title}
            {full && <div className="duration">{duration}</div>}
          </div>
        </div>
      ) : (
        <>
          <div className="title">
            <div className="media-container">
              <HeaderIcon typeCode={typeCode} />
            </div>
            <div>
              {title}
              {full && <div className="duration">{duration}</div>}
            </div>
          </div>
          <div className="description">{description}</div>
        </>
      )}
    </div>
  );
};
