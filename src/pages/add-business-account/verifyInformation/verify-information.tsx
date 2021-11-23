import React, { ReactElement, useEffect, useCallback } from "react";
import { Button, Navbar, NavLeft, Link, Col, Page, Row } from "framework7-react";
import { Router } from "framework7/modules/router/router";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { AccountWsControllerApi } from "@/types/commonapi";
import { updateProfile } from "@/actions/sessionActions";
import { StoreControllerApi } from "@/types/marketplaceapi";
import { useAppSelector } from "@/hooks/store";

import "../style.less";
import "./verify-information.less";

export const VerifyInformation = ({ f7router }: { f7router?: Router.Router }): ReactElement => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { companyInfo, storeInfo } = useAppSelector((state) => state.addCompanyReducer);
  const isSmallScreen = useAppSelector((state) => state.rootReducer.resizeEvent.width < 768);

  const sendAccountInfo = useCallback(async (): Promise<void> => {
    const request = {
      companyAddress: {
        countryCode: companyInfo.country,
        city: companyInfo.addressCity,
        firstAddressLine: companyInfo.address,
        postalCode: companyInfo.postcode,
      },
      companyType: Number(companyInfo.form),
      companyName: companyInfo.name,
      registrationNumber: companyInfo.regNumber,
      taxNumber: companyInfo.vatNumber,
      companyEmail: companyInfo.email,
      companyPhone: {
        fullNumber: companyInfo.phone,
        countryCode: companyInfo.phoneCode,
      },
      companyUrls: companyInfo.links,
    };
    await new AccountWsControllerApi().transformAccountUsingPOST(request, "business");
    await updateProfile(dispatch);
  }, [companyInfo, dispatch]);

  const addStoreInfo = useCallback(async (): Promise<void> => {
    const response = await new StoreControllerApi().checkAccountStoreUsingPOST({
      name: storeInfo.name,
    });
    if (response.body[0].nameAvailable) {
      await new StoreControllerApi().addStoreUsingPUT(storeInfo);
    } else {
      console.error("Store name is already taken. Please, choose another one.");
    }
  }, [storeInfo]);

  const editStoreInfo = useCallback(async (): Promise<void> => {
    await new StoreControllerApi().updateStoreUsingPOST(storeInfo);
  }, [storeInfo]);

  useEffect(() => {
    if (companyInfo) {
      void sendAccountInfo();
    }
    if (storeInfo.uid) {
      void editStoreInfo();
    } else if (storeInfo.name) {
      void addStoreInfo();
    }
  }, [addStoreInfo, companyInfo, editStoreInfo, sendAccountInfo, storeInfo]);

  return (
    <Page id="verify_business_account_page" name="verify_business_account_page">
      <Navbar>
        <NavLeft>
          {!isSmallScreen ? (
            <Link back iconF7="xmark" iconOnly />
          ) : (
            <Link href="/profile/seller-area/" iconF7="xmark" iconOnly panelClose />
          )}
        </NavLeft>
      </Navbar>

      <Row resizableFixed>
        <Col width="100">
          <div className="main-content">
            <h2>{t("Your data is being verified")}</h2>
            <p>
              {t(
                "Your data will be checked soon. Meanwhile, you can add products and set up your homepage."
              )}
            </p>
            <Button
              fill
              round
              onClick={(): Router.Router => f7router.navigate("/profile/seller-area/")}
            >
              {t("Seller Area")}
            </Button>
          </div>
        </Col>
      </Row>
    </Page>
  );
};
