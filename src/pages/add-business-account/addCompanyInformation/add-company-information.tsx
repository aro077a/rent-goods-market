import React, { ReactElement, useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Link,
  List,
  ListInput,
  Checkbox,
  Navbar,
  NavLeft,
  NavRight,
  Icon,
  Col,
  Page,
  Row,
  ListItem,
  Panel,
  f7,
} from "framework7-react";
import { Router } from "framework7/modules/router/router";
import { useDispatch } from "react-redux";
import cn from "classnames";

import { IcDelete, IcLocation } from "@/components-ui/icons";
import { SET_COMPANY_INFO } from "@/reducers/addCompanyReducer";
import { MapPopup } from "@/components/MapPopup";
import { CustomSelect } from "@/components/CustomSelect/CustomSelect";
import { AddStoreInformation } from "@/pages/add-business-account/addStoreInformation/add-store-information";
import { CountrySelectPopup } from "@/components/CountrySelectPopup";
import { CustomInput } from "@/components/CustomInput/CustomInput";
import { useAppSelector } from "@/hooks/store";
import { Address } from "@/types/commonapi";

import PopupSelectCompanyForm from "./popup-select-company-form/popup-select-company-form";
import { phoneCodes } from "./phone-codes";

import "../style.less";
import "./add-company-information.less";

export const AddCompanyInformation = ({ f7router }: { f7router: Router.Router }): ReactElement => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [countries, termsAndPrivacy, companyForms] = useAppSelector((state) => [
    state.classificatorReducer.countryClassificator.map((c) => ({
      value: c.code,
      label: c.name,
    })),
    state.classificatorReducer.entitiesClassificators.Url_app,
    state.classificatorReducer.entitiesClassificators.Company_BusinessType.map((item) => ({
      value: item.code,
      label: item.value,
    })),
  ]);
  const isSmallScreen = useAppSelector((state) => state.rootReducer.resizeEvent.width < 768);
  const location = useAppSelector((state) => state.filterReducer.allFiltresLocation);

  const [country, setCountry] = useState(null);
  const [form, setForm] = useState(null);
  const [name, setName] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [email, setEmail] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [phoneCode, setPhoneCode] = useState(null);
  const [links, setLinks] = useState([""]);
  const [linksErrorMessage, setLinksErrorMessage] = useState([""]);
  const [addressCountry, setAddressCountry] = useState(null);
  const [addressCity, setAddressCity] = useState("");
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [isPostCodeValid, setIsPostCodeValid] = useState(true);
  const [isAgreeWithTerms, setIsAgreeWithTerms] = useState(false);

  const [isNextButtonEnabled, setIsNextButtonEnabled] = useState(false);
  useEffect(() => {
    //need to check the use case when the page is just loaded: errors are empty and links too
    const isAllLinksNotEmpty = links.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      ""
    );
    const isAllLinksValid = !linksErrorMessage.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      ""
    );
    setIsNextButtonEnabled(
      !!(
        country &&
        country.value &&
        form &&
        form.value &&
        name &&
        regNumber &&
        email &&
        !emailErrorMessage &&
        phoneCode &&
        phoneCode.value &&
        phone &&
        isPhoneValid &&
        isAllLinksNotEmpty &&
        isAllLinksValid &&
        addressCountry &&
        addressCountry.value &&
        addressCity &&
        address &&
        postcode &&
        isPostCodeValid &&
        isAgreeWithTerms
      )
    );
  }, [
    isPhoneValid,
    links,
    linksErrorMessage,
    isPostCodeValid,
    isAgreeWithTerms,
    country,
    form,
    name,
    regNumber,
    email,
    emailErrorMessage,
    phoneCode,
    phone,
    addressCountry,
    addressCity,
    address,
    postcode,
  ]);

  const [isCountrySelectPopupOpened, setIsCountrySelectPopupOpened] = useState(false);
  const [isAddressCountrySelectPopupOpened, setIsAddressCountrySelectPopupOpened] = useState(false);
  const [isCompanyFormPopupOpened, setIsCompanyFormPopupOpened] = useState(false);
  const [isMapPopupOpened, setIsMapPopupOpened] = useState(false);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
      const { value } = e.target;
      const mapSetFunctions = {
        name: setName,
        regNumber: setRegNumber,
        vatNumber: setVatNumber,
        email: setEmail,
        phone: setPhone,
        addressCity: setAddressCity,
        address: setAddress,
        postcode: setPostcode,
      };
      mapSetFunctions[field](value);

      //validation
      if (field === "email") {
        let errorMessage = "";
        if (!value) {
          errorMessage = t("Required field");
        } else if (!value.includes("@")) {
          errorMessage = t('Please include an "@" in the email address.');
        } else if (value.slice(-1) === "@") {
          errorMessage = t('Please enter a part following "@".');
        }
        setEmailErrorMessage(errorMessage);
      }
    },
    [t]
  );

  const handleLinksChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const { value } = e.target;

      const newLinks: string[] = [...links];
      newLinks[index] = value;
      setLinks(newLinks);

      //validation
      let errorMessage = "";
      if (!value) {
        errorMessage = t("Required field");
      } else if (value.search(/^http[s]?:\/\/.+$/) === -1) {
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
    setLinks([...links, ""]);
    setLinksErrorMessage([...linksErrorMessage, ""]);
  }, [links, linksErrorMessage]);

  const handleClickNextButton = useCallback(() => {
    const validPhoneCode = phoneCode?.label.replace("+", "");
    const companyInfo = {
      country: country?.value,
      form: form?.value,
      name,
      regNumber,
      vatNumber,
      email,
      phone: `${validPhoneCode}${phone}`,
      phoneCode: validPhoneCode,
      links,
      addressCountry: addressCountry.value,
      addressCity,
      address,
      postcode,
    };
    dispatch({ type: SET_COMPANY_INFO, companyInfo });
    if (!isSmallScreen) {
      f7router.navigate("/profile/seller-area/add-business-account/store-info/");
    }
  }, [
    address,
    addressCity,
    addressCountry?.value,
    country?.value,
    dispatch,
    email,
    f7router,
    form?.value,
    isSmallScreen,
    links,
    name,
    phone,
    phoneCode?.label,
    postcode,
    regNumber,
    vatNumber,
  ]);

  const setLocation = useCallback(
    // ! have to find real type
    (address: Address & { countryCode: string }) => {
      setAddressCountry(countries.find((c) => c.value === address.countryCode));
      setAddressCity(address.city);
      setAddress(address.firstAddressLine);
      if (address.postalCode) setPostcode(address.postalCode);
    },
    [countries]
  );

  const handleCountrySelect = useCallback(
    (country: { value: string; label: string }) => {
      if (isCountrySelectPopupOpened) {
        setCountry(country);
        setIsCountrySelectPopupOpened(false);
      } else if (isAddressCountrySelectPopupOpened) {
        setAddressCountry(country);
        setIsAddressCountrySelectPopupOpened(false);
      }
    },
    [isAddressCountrySelectPopupOpened, isCountrySelectPopupOpened]
  );

  return (
    <Page id="add_company_information_page" name="add_company_information_page">
      <Navbar className="add-company-information-navbar">
        <NavLeft>
          {!isSmallScreen ? (
            <Link back iconF7="xmark" iconOnly />
          ) : (
            <Link href="/profile/seller-area/" iconF7="xmark" iconOnly panelClose />
          )}
        </NavLeft>
        {!isSmallScreen && (
          <NavRight>
            <Button
              className="next-button"
              fill
              round
              disabled={!isNextButtonEnabled}
              onClick={handleClickNextButton}
            >
              {t("Next")}
              <Icon className="next-icon" f7="chevron_right" size="16px" />
            </Button>
          </NavRight>
        )}
      </Navbar>

      <Row resizableFixed>
        <Col width="15" className="menu-steps">
          <List noHairlines noHairlinesBetween>
            <ListItem className="active">{t("Company Information").toString()}</ListItem>
            <ListItem title={t("Add Store").toString()} />
          </List>
        </Col>
        <Col width="100" medium="85">
          <div className="main-content">
            <h1>{t("Add Company Information")}</h1>
            <p>
              {t("Add your company information and create your first store as business account")}
            </p>

            <div className="block-inputs">
              <h2>{t("General Information")}</h2>
              <CustomSelect
                className="custom-dropdown"
                value={country}
                options={countries}
                onChange={setCountry}
                validate
                openPopup={() => setIsCountrySelectPopupOpened(true)}
                label={t("Country")}
              />
              <CustomSelect
                className="custom-dropdown"
                value={form}
                options={companyForms}
                onChange={setForm}
                validate
                openPopup={() => setIsCompanyFormPopupOpened(true)}
                label={t("Company Legal Form")}
              />
              <List noHairlinesMd>
                <CustomInput
                  slot="list"
                  required
                  validate
                  value={name}
                  label={t("Company Name").toString()}
                  onChange={(e) => handleInput(e, "name")}
                />
                <CustomInput
                  slot="list"
                  required
                  validate
                  value={regNumber}
                  label={t("Registration Number").toString()}
                  onChange={(e) => handleInput(e, "regNumber")}
                />
                <CustomInput
                  slot="list"
                  value={vatNumber}
                  label={t("VAT Number (Optional)").toString()}
                  onChange={(e) => handleInput(e, "vatNumber")}
                />
              </List>
            </div>

            <div className="block-inputs">
              <h2 className="h2-contacts">{t("Contacts")}</h2>
              <p>
                {t(
                  "Contact information required for the verification process. It will not be shown to customers."
                )}
              </p>
              <List noHairlinesMd>
                <ListInput
                  value={email}
                  label={t("E-mail").toString()}
                  floatingLabel
                  type="email"
                  className={cn("custom-input", f7.device.ios && "safari-version")}
                  onChange={(e) => handleInput(e, "email")}
                  onBlur={(e) => handleInput(e, "email")}
                  errorMessage={emailErrorMessage}
                  errorMessageForce={!!emailErrorMessage}
                />
                <div className="inputs-row">
                  <CustomSelect
                    className="phone-code-select"
                    value={phoneCode}
                    options={phoneCodes}
                    onChange={setPhoneCode}
                    validate
                    label={t("Code")}
                  />
                  <ListInput
                    value={phone}
                    label={t("Phone Number").toString()}
                    floatingLabel
                    type="tel"
                    required
                    validate
                    pattern="[0-9]*"
                    onValidate={setIsPhoneValid}
                    errorMessage={t("only digits")}
                    className={cn("custom-input", f7.device.ios && "safari-version")}
                    onChange={(e) => handleInput(e, "phone")}
                  />
                </div>
                {links?.map((link, index) => (
                  <div className="inputs-row" key={index}>
                    <ListInput
                      label={t("Link").toString()}
                      floatingLabel
                      type="url"
                      className={cn("custom-input", f7.device.ios && "safari-version")}
                      value={link}
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
            </div>

            <div className="block-inputs">
              <h2>{t("Company Legal Address")}</h2>
              <Button className="select-map-button" onClick={() => setIsMapPopupOpened(true)}>
                <IcLocation fill="#EF5D54" />
                &nbsp;{t("Select on the Map")}
              </Button>
              <List noHairlinesMd>
                <div className="inputs-row md-column">
                  <CustomSelect
                    className="custom-dropdown-row"
                    value={addressCountry}
                    options={countries}
                    onChange={setAddressCountry}
                    validate
                    openPopup={() => setIsAddressCountrySelectPopupOpened(true)}
                    label={t("Country")}
                  />
                  <ListInput
                    label={t("City").toString()}
                    floatingLabel
                    type="text"
                    required
                    validate
                    className={cn("custom-input", f7.device.ios && "safari-version")}
                    value={addressCity}
                    errorMessage={t("Required field")}
                    onChange={(e) => handleInput(e, "addressCity")}
                  />
                </div>
                <CustomInput
                  slot="list"
                  value={address}
                  label={t("Address").toString()}
                  onChange={(e) => handleInput(e, "address")}
                  required
                  validate
                />
                <CustomInput
                  slot="list"
                  value={postcode}
                  label={t("Postcode").toString()}
                  onChange={(e) => handleInput(e, "postcode")}
                  required
                  validate
                  pattern="[0-9]*"
                  maxlength="10"
                  onValidate={setIsPostCodeValid}
                  errorMessage={t("only digits")}
                />
              </List>
              <div className="privacy">
                <Checkbox
                  checked={isAgreeWithTerms}
                  onChange={() => setIsAgreeWithTerms(!isAgreeWithTerms)}
                />
                <div>
                  {t("You Agree with our")}&nbsp;
                  <Link
                    external
                    target="_blank"
                    href={termsAndPrivacy.find((i) => i.code === "PrivacyPolicy")?.value}
                  >
                    {
                      t("Privacy Policy 2") //for russian ending
                    }
                  </Link>
                  &nbsp;
                  {t("and")}&nbsp;
                  <Link
                    external
                    target="_blank"
                    href={termsAndPrivacy.find((i) => i.code === "TermsAndConditions")?.value}
                  >
                    {t("Terms of Use")}
                  </Link>
                </div>
              </div>
            </div>
            {isSmallScreen && (
              <div className="footer-container">
                <div className="pager-footer">
                  <div className="active" />
                  <div />
                </div>
                <Button
                  className="next-mobile"
                  panelOpen="right"
                  disabled={!isNextButtonEnabled}
                  onClick={handleClickNextButton}
                >
                  {t("Next")}
                  <Icon className="next-icon" f7="chevron_right" size="16px" />
                </Button>
              </div>
            )}
          </div>
        </Col>
      </Row>

      <MapPopup
        backdrop={false}
        coordinates={location}
        initialized={isMapPopupOpened}
        opened={isMapPopupOpened}
        onPopupClosed={() => setIsMapPopupOpened(false)}
        onLocationSelect={(position, place, placeId, address) => setLocation(address)}
      />

      {isSmallScreen && (
        <>
          <Panel right cover swipe swipeOnlyClose>
            <AddStoreInformation />
          </Panel>
          <CountrySelectPopup
            opened={isCountrySelectPopupOpened || isAddressCountrySelectPopupOpened}
            onCountrySelect={(country) =>
              handleCountrySelect({ value: country.code, label: country.name })
            }
            onPopupClosed={() => {
              setIsCountrySelectPopupOpened(false);
              setIsAddressCountrySelectPopupOpened(false);
            }}
            closeOnChoose={false}
          />
          <PopupSelectCompanyForm
            isOpened={isCompanyFormPopupOpened}
            options={companyForms}
            onChange={setForm}
            closePopup={() => setIsCompanyFormPopupOpened(false)}
          />
        </>
      )}
    </Page>
  );
};
