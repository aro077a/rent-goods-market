import React, { ReactElement, useEffect, useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  List,
  ListInput,
  Icon,
  Navbar,
  NavLeft,
  Link,
  NavTitle,
  NavRight,
  Col,
  Page,
  Row,
  ListItem,
  Preloader,
  f7,
} from "framework7-react";
import { Router } from "framework7/modules/router/router";
import { useDispatch } from "react-redux";
import cn from "classnames";

import { IcDelete } from "@/components-ui/icons";
import { SET_STORE_INFO } from "@/reducers/addCompanyReducer";
import { StoreControllerApi, StoreLink } from "@/types/marketplaceapi";
import { CustomInput } from "@/components/CustomInput";
import { getProfile } from "@/selectors/profile";
import { client, marketplaceapiURL } from "@/axios";
import { useAppSelector } from "@/hooks/store";

import "../style.less";
import "./add-store-information.less";

const URL_REGEX = /^http[s]?:\/\/.+$/;

export const AddStoreInformation = ({ $f7route }: { $f7route?: Router.Route }): ReactElement => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const inputFile = useRef(null);
  const { width: deviceWidth } = useAppSelector((state) => state.rootReducer.resizeEvent);
  const isSmallScreen = deviceWidth < 768;
  const profile = useAppSelector((state) => getProfile(state));
  const isEdit = $f7route && $f7route.query.isEdit;

  const [storeUid, setStoreUid] = useState("");
  const [storeStatus, setStoreStatus] = useState("");
  const [avatarImg, setAvatarImg] = useState("");
  const [isAvatarImgLoading, setIsAvatarImgLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [description, setDescription] = useState("");
  const [links, setLinks] = useState<StoreLink[]>([{ url: "" }]);
  const [linksErrorMessage, setLinksErrorMessage] = useState([""]);

  const getStore = useCallback(async () => {
    const response = await new StoreControllerApi().accountStoreListUsingGET();
    const store = response.body?.[0];
    if (store) {
      setStoreUid(store.uid);
      setStoreStatus(store.status);
      setAvatarImg(store.imageUrl);
      setName(store.name);
      setEmail(store.email);
      setPhone(store.phone);
      setDescription(store.description);
      setLinks(store.links);
    }
  }, []);

  useEffect(() => {
    if (isEdit) {
      void getStore();
    }
  }, [getStore, isEdit]);

  const [isDoneButtonEnabled, setIsDoneButtonEnabled] = useState(false);

  useEffect(() => {
    //need to check the use case when the page is just loaded: errors are empty and links too
    const isAllLinksNotEmpty = links.reduce(
      (accumulator, currentValue) => accumulator + currentValue.url,
      ""
    );
    const isAllLinksValid = !linksErrorMessage.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      ""
    );
    setIsDoneButtonEnabled(
      !!(name && !emailErrorMessage && isPhoneValid && isAllLinksNotEmpty && isAllLinksValid)
    );
  }, [emailErrorMessage, isPhoneValid, links, linksErrorMessage, name]);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
      const { value } = e.target;
      const mapSetFunctions = {
        name: setName,
        email: setEmail,
        phone: setPhone,
        description: setDescription,
      };
      mapSetFunctions[field](value);

      //validation
      if (field === "email") {
        let errorMessage = "";
        switch (true) {
          case !value:
            errorMessage = "";
            break;
          case !value.includes("@"):
            errorMessage = t('Please include an "@" in the email address.');
            break;
          case value.slice(-1) === "@":
            errorMessage = t('Please enter a part following "@".');
            break;
        }

        setEmailErrorMessage(errorMessage);
      }
    },
    [t]
  );

  const handleLinksChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const { value } = e.target;

      const newLinks = [...links];
      newLinks[index].url = value;
      setLinks(newLinks);

      //validation
      let errorMessage = "";
      if (!value) {
        errorMessage = t("Required field");
      } else if (value.search(URL_REGEX) === -1) {
        errorMessage = t("Please enter a URL.");
      }
      const newLinksErrorMessage = [...linksErrorMessage];
      newLinksErrorMessage[index] = errorMessage;
      setLinksErrorMessage(newLinksErrorMessage);
    },
    [links, linksErrorMessage, t]
  );

  const handleLinksRemove = useCallback(
    (index: number) => {
      const newLinks = [...links];
      if (newLinks.length > 1 && index !== -1) {
        newLinks.splice(index, 1);
        setLinks(newLinks);
      }

      const newLinksErrorMessage = [...linksErrorMessage];
      if (newLinksErrorMessage.length > 1 && index !== -1) {
        newLinksErrorMessage.splice(index, 1);
        setLinksErrorMessage(newLinksErrorMessage);
      }
    },
    [links, linksErrorMessage]
  );

  const handleLinksAdd = useCallback(() => {
    setLinks([...links, { url: "" }]);
    setLinksErrorMessage([...linksErrorMessage, ""]);
  }, [links, linksErrorMessage]);

  const handleClickDoneButton = useCallback(() => {
    dispatch({
      type: SET_STORE_INFO,
      storeInfo: {
        uid: storeUid || null,
        status: storeStatus,
        imageUrl: avatarImg,
        name,
        email,
        phone,
        description,
        links,
      },
    });
    f7.panel.close();
    f7.views.main.router.navigate("/profile/seller-area/add-business-account/verify-data/");
  }, [avatarImg, description, dispatch, email, links, name, phone, storeStatus, storeUid]);

  const onFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async (ev) => {
          const base64ImgNoHeader = ev.target.result.toString().replace(/^data:(.*,)?/, "");

          const params = new URLSearchParams();
          params.append("base64File", base64ImgNoHeader);
          params.append("fileName", file.name);
          params.append("bucket", "store");

          setIsAvatarImgLoading(true);
          const result = await client.post(
            `${marketplaceapiURL}/image/${profile.uid}/upload`,
            params,
            {
              headers: {
                "content-type": "application/x-www-form-urlencoded",
              },
            }
          );
          const avatar = result?.data?.body?.[0]?.url;
          if (avatar) {
            setAvatarImg(avatar);
          }
          setIsAvatarImgLoading(false);
        };
      }
    },
    [profile.uid]
  );

  return (
    <Page id="add_store_information_page" name="add_store_information_page">
      {!isSmallScreen && (
        <Navbar className="add-store-information-navbar">
          <NavLeft>
            <Link back iconF7="xmark" iconOnly />
          </NavLeft>
          <NavTitle>
            {t(!isEdit ? "Switch to Business Account" : "Edit Store Information")}
          </NavTitle>
          {!isSmallScreen && (
            <NavRight>
              <Button
                className="next-button"
                fill
                round
                disabled={!isDoneButtonEnabled}
                onClick={handleClickDoneButton}
              >
                {t("Done")}
              </Button>
            </NavRight>
          )}
        </Navbar>
      )}

      <Row resizableFixed>
        {!isEdit && (
          <Col width="15" className="menu-steps">
            <List noHairlines noHairlinesBetween>
              <ListItem>
                <Icon
                  f7="checkmark_alt_circle_fill"
                  color="red"
                  size="24"
                  className="step-passed-icon"
                />
                {t("Company Information").toString()}
              </ListItem>
              <ListItem title={t("Add Store").toString()} className="active" />
            </List>
          </Col>
        )}
        <Col width="100" medium={!isEdit ? 85 : 100}>
          <div className={cn("main-content", { edit: isEdit })}>
            <div className="close-button">
              {isSmallScreen && (
                <Link href="/profile/seller-area/" iconF7="xmark" iconOnly panelClose />
              )}
            </div>
            <h1>{t(!isEdit ? "Create Store" : "Edit Store Information")}</h1>
            <List noHairlinesMd>
              <div className="store-image-wrapper">
                <input
                  type="file"
                  name="file"
                  ref={inputFile}
                  onChange={onFileUpload}
                  style={{ display: "none" }}
                  accept="image/*"
                />
                {!avatarImg ? (
                  <div className="store-image" onClick={(): void => inputFile.current.click()}>
                    {isAvatarImgLoading ? <Preloader size="24" /> : <Icon f7="camera" />}
                  </div>
                ) : (
                  <img
                    className="store-image"
                    onClick={inputFile.current.click}
                    src={avatarImg}
                    alt="avatar"
                  />
                )}
              </div>
              <CustomInput
                slot="list"
                value={name}
                label={t("Store Name (required)").toString()}
                onChange={(e): void => handleInput(e, "name")}
                required
                validate
                maxlength="40"
              />
              <ListInput
                value={email}
                label={t("Store Email").toString()}
                floatingLabel
                type="email"
                className={cn("custom-input", { "safari-version": f7.device.ios })}
                onChange={(e): void => handleInput(e, "email")}
                onBlur={(e): void => handleInput(e, "email")}
                errorMessage={emailErrorMessage}
                errorMessageForce={!!emailErrorMessage}
              />
              <ListInput
                value={phone}
                label={t("Store Phone Number").toString()}
                floatingLabel
                type="tel"
                validate
                maxlength="20"
                pattern="[0-9]*"
                onValidate={setIsPhoneValid}
                errorMessage={t("only digits")}
                className={cn("custom-input", { "safari-version": f7.device.ios })}
                onChange={(e): void => handleInput(e, "phone")}
              />
            </List>

            <h2>{t("Description")}</h2>
            <p className="p-description">{t("Describe in 3-5 word what you sell in store.")}</p>
            <List noHairlinesMd>
              <ListInput
                label={t("Description").toString()}
                floatingLabel
                type="text"
                validate
                maxlength="60"
                className={cn("custom-input", { "safari-version": f7.device.ios })}
                value={description}
                onChange={(e): void => handleInput(e, "description")}
              />
            </List>

            <h2>{t("Links")}</h2>
            <p>
              {t(
                "Provide links to websites used to sell goods or services (website, instagram account, etc.). This won't be displayed on store profile."
              )}
            </p>
            <List className="list-links" noHairlinesMd>
              {links?.map((link, index) => (
                <div className="inputs-row" key={index}>
                  <ListInput
                    label={t("Link (required)").toString()}
                    floatingLabel
                    type="url"
                    className={cn("custom-input", { "safari-version": f7.device.ios })}
                    value={link?.url ?? ""}
                    onChange={(e) => handleLinksChange(e, index)}
                    onBlur={(e) => handleLinksChange(e, index)}
                    errorMessage={linksErrorMessage[index]}
                    errorMessageForce={!!linksErrorMessage[index]}
                  />
                  <Button
                    className="delete-link-button"
                    onClick={() => handleLinksRemove(index)}
                    disabled={links.length === 1}
                  >
                    <IcDelete fill="#CCCCCC" />
                  </Button>
                </div>
              ))}
              <Button onClick={handleLinksAdd} className="add-link-button" color="red">
                + {t("Add a Link")}
              </Button>
            </List>
            {isSmallScreen &&
              (!isEdit ? (
                <>
                  <Button className="prev-mobile" panelClose>
                    <Icon className="prev-icon" f7="chevron_left" size="16px" />
                    {t("Back")}
                  </Button>
                  <div className="pager-footer">
                    <div className="active" />
                    <div className="active" />
                  </div>
                  <Button
                    className="next-mobile"
                    panelClose="right"
                    disabled={!isDoneButtonEnabled}
                    onClick={handleClickDoneButton}
                  >
                    {t("Done")}
                    <Icon className="next-icon" f7="chevron_right" size="16px" />
                  </Button>
                </>
              ) : (
                <Button
                  className="save-edit-button"
                  fill
                  round
                  panelClose="right"
                  disabled={!isDoneButtonEnabled}
                  onClick={handleClickDoneButton}
                >
                  <Icon f7="checkmark_alt" size="24" />
                </Button>
              ))}
          </div>
        </Col>
      </Row>
    </Page>
  );
};
