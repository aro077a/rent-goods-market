import React from "react";
import { Profile } from "../../reducers/sessionReducer";

import "./style.less";
import classNames from "classnames";

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  profile: Profile;
};

export default ({ profile, className, ...props }: Props) => (
  <div
    {...props}
    className={classNames(
      "avatar",
      className,
      profile.person && !profile.person?.profilePictureUrl && "with-initials"
    )}
    style={
      profile?.person?.profilePictureUrl
        ? {
            backgroundImage: `url(${profile.person.profilePictureUrl})`,
          }
        : {}
    }
  >
    {!profile?.person?.profilePictureUrl && (
      <span>
        {profile.person?.surname && profile.person?.surname[0]}
        {profile.person?.name && profile.person?.name[0]}
      </span>
    )}
  </div>
);
