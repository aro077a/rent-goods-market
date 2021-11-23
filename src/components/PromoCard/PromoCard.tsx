import React, { Component } from "react";

import "./style.less";
import { WithTranslation, withTranslation } from "react-i18next";
import { compose } from "redux";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Link,
} from "framework7-react";

type Props = WithTranslation & {};

const PromoCard = (props: Props) => {
  return (
    <Card className="demo-facebook-card">
      <CardHeader className="no-border">
        <div className="demo-facebook-avatar">
          <img
            src="https://cdn.framework7.io/placeholder/people-68x68-1.jpg"
            width="34"
            height="34"
          />
        </div>
        <div className="demo-facebook-name">John Doe</div>
        <div className="demo-facebook-date">Monday at 3:47 PM</div>
      </CardHeader>
      <CardContent padding={false}>
        <img
          src="https://cdn.framework7.io/placeholder/nature-1000x700-8.jpg"
          width="100%"
        />
      </CardContent>
      <CardFooter className="no-border">
        <Link>Like</Link>
        <Link>Comment</Link>
        <Link>Share</Link>
      </CardFooter>
    </Card>
  );
};

export default compose(withTranslation())(PromoCard);
