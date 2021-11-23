import React from "react";
import { Link } from "framework7-react";
import cn from "classnames";

import { Avatar } from "@/components/Avatar";

import { ProfileLinkProps } from "./ProfileLink.types";

export const ProfileLink = React.memo(({ profile, className, ...props }: ProfileLinkProps) => (
  <Link
    href={profile && profile.uid ? "/profile/" : "#"}
    {...props}
    className={cn("profile-link", className)}
  >
    <Avatar className="small" profile={profile || {}} />
  </Link>
));
ProfileLink.displayName = "ProfileLink";
