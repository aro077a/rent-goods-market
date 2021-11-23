import React, { ReactNode } from "react";
import { F7Sheet } from "framework7-react";

import "./style.less";

type Props = F7Sheet.Props & Readonly<{ children?: ReactNode }>;

const Sheet = (props: Props) => <F7Sheet {...props} />;

export default Sheet;
