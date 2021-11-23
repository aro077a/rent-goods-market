import React, { memo, useState } from "react";
import { Link, Icon, Popover, ListItem, List } from "framework7-react";
import classNames from "classnames";
import { getI18n, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { IApplicationStore, LOCAL_CONFIG_LOADED } from "@/store/rootReducer";
import { changeLanguage, getAvailableLanguage } from "@/actions/classificatorActions";
import moment from "moment";
import { loadLocalConfig } from "@/utils";
import "./LanguageLink.less";

const LanguageLink = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [activeCode, setActiveCode] = useState("en");
  const i18n = getI18n();

  const {
    languageListReducer: { languageList },
  } = useSelector((state: IApplicationStore) => state);

  const handleChange = async (code: string) => {
    setActiveCode(code);
    const availableLanguage = await getAvailableLanguage(code);
    dispatch(changeLanguage(code));
    moment.locale(code);
    await i18n.changeLanguage(availableLanguage);
    const localConfig = await loadLocalConfig();
    dispatch({ type: LOCAL_CONFIG_LOADED, localConfig });
  };

  return (
    <div>
      <Link popoverOpen=".languages-popover" className={classNames("language-link")}>
        <span>{i18n.language.toUpperCase()}</span>
        <Icon material="expand_more" />
      </Link>

      <Popover className="languages-popover" backdrop opened>
        <div className="languages-popover-content">
          <div className="languages-popover-content-title">
            <p>{t("Languages list title")}</p>
          </div>
          <div className="languages-popover-content-list">
            <List>
              {languageList?.map((language) =>
                language.code === "id" ? null : (
                  <ListItem
                    onClick={() => handleChange(language.code)}
                    popoverClose
                    key={language.code}
                  >
                    {`${language.name} - ${language.code}`}

                    {language.code === activeCode && (
                      <Icon
                        className="languages-popover-content-list-icon_checked"
                        slot="root-end"
                        material="check"
                      />
                    )}
                  </ListItem>
                )
              )}
            </List>
          </div>
        </div>
      </Popover>
    </div>
  );
};

export default memo(LanguageLink);
