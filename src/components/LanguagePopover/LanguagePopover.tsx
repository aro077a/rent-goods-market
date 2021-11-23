import React from "react";
import { Popover, List, ListItem, F7Popover } from "framework7-react";
import { connect } from "react-redux";
import { compose } from "redux";
import classNames from "classnames";
import { IApplicationStore, ILanguage } from "../../store/rootReducer";
import { i18n } from "i18next";
import { getI18n, withTranslation, WithTranslation } from "react-i18next";

import "./style.less";

type Props = F7Popover.Props &
  Pick<WithTranslation, "t"> & {
    languages?: ILanguage[];
    i18n?: i18n;
  };

const LanguagePopover = ({ className, t, ...props }: Props) => (
  <Popover {...props} className={classNames("language-popover", className)}>
    <List>
      {props.languages.map((language: ILanguage) => (
        <ListItem
          link="#"
          key={language.code}
          title={language.title}
          onClick={() => {
            props.i18n.changeLanguage(language.code);
          }}
          popoverClose
        />
      ))}
    </List>
  </Popover>
);

const mapStateToProps = (state: IApplicationStore) => ({
  languages: state.rootReducer.localConfig.languages,
  i18n: getI18n(),
});

export default compose<React.FC<Props>>(
  withTranslation(),
  connect(mapStateToProps, null)
)(LanguagePopover);
