import { F7Link } from "framework7-react";

import { Profile } from "@/reducers/sessionReducer";

export type ProfileLinkProps = F7Link.Props & {
  profile?: Profile;
};
