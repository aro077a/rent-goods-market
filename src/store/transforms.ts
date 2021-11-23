import { createTransform } from "redux-persist";
import { parse, stringify } from "flatted";

const SetTransform = createTransform(
  (inboundState: any, key: any) => stringify(inboundState),
  (outboundState: string, key: any) => parse(outboundState)
);

export default SetTransform;
