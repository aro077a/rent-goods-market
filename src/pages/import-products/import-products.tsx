import React, { ReactElement, useEffect, useState } from "react";
import {
  Button,
  Col,
  f7,
  Navbar,
  NavRight,
  NavTitle,
  Page,
  Preloader,
  Row,
} from "framework7-react";
import PopupConfigureImport from "./import-configure-popup";
import { useTranslation } from "react-i18next";
import { IcDelete, IcEdit, IcLoad } from "../../components-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import moment from "moment";
import {
  ProductSource,
  ProductSourceControllerApi,
} from "../../types/marketplaceapi";
import { Router } from "framework7/modules/router/router";
import { IApplicationStore } from "../../store/rootReducer";
import { getProfile } from "../../selectors/profile";
import FileSaver from "file-saver";
import { loadMyGoodsList } from "../../actions/myGoodsActions";
import "./import-products.less";

const ImportProducts = ({
  f7router,
}: {
  f7router: Router.Router;
}): ReactElement => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const profile = useSelector((state: IApplicationStore) => getProfile(state));

  const [source, setSource] = useState<ProductSource>({
    active: true,
    contentType: "file",
    languageCode: profile.language.code,
    title: "",
    type: { code: "" },
    url: "",
  });
  const stats = source.currentContent && {
    new: source.currentContent.newCount || 0,
    failed: source.currentContent.failedCount || 0,
    updated: source.currentContent.updatedCount || 0,
    skipped: source.currentContent.skippedCount || 0,
  };
  const totalProducts =
    stats && Object.keys(stats).reduce((sum, key) => sum + stats[key], 0);

  const [isPopupOpened, setIsPopupOpened] = useState(false);
  const [isSourceLoading, setIsSourceLoading] = useState(false);
  const [isRestartLoading, setIsRestartLoading] = useState(false);

  const getSourceData = async (): Promise<void> => {
    const result =
      await new ProductSourceControllerApi().productSourceListUsingGET1();
    if (result?.body && result?.body[0]) setSource(result.body[0]);
  };

  useEffect(() => {
    setIsSourceLoading(true);
    f7.preloader.show();
    getSourceData().then(() => {
      f7.preloader.hide();
      setIsSourceLoading(false);
    });
  }, []);

  const deleteSource = async (): Promise<void> => {
    const result =
      await new ProductSourceControllerApi().deleteProductSourceUsingDELETE1({
        uid: source.uid,
      });
    if (result.successful) f7router.navigate("/profile/seller-area/my-goods/");
  };

  const handleClickDownloadLog = async (): Promise<void> => {
    const result =
      await new ProductSourceControllerApi().productSourceHistoryUsingGET1(
        source.uid
      );
    if (result?.body) {
      const content = result.body[result.body.length - 1].errorMessage;
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      FileSaver.saveAs(blob, `import_log-${moment().format("MM-DD-YY")}.txt`);
    }
  };

  const startImport = async (): Promise<void> => {
    await getSourceData();
    dispatch(loadMyGoodsList());
    setIsPopupOpened(false);
  };

  const restartImport = async (): Promise<void> => {
    setIsRestartLoading(true);
    if (source.uid) {
      const result =
        await new ProductSourceControllerApi().updateProductSourceUsingPOST1(
          source
        );
      if (result?.body) setSource(result.body[0]);
    }
    setIsRestartLoading(false);
  };

  return (
    <Page id="import-products" name="import-products">
      <Navbar backLink>
        <NavTitle>{t("Import")}</NavTitle>
        {source.uid && (
          <NavRight>
            <Button
              className="delete-import-button"
              onClick={deleteSource}
              disabled={isRestartLoading}
            >
              <IcDelete fill="#1A1A1A" />
            </Button>
            <Button
              className="edit-import-button"
              onClick={(): void => setIsPopupOpened(true)}
              disabled={isRestartLoading}
            >
              <IcEdit fill="#1A1A1A" />
            </Button>
          </NavRight>
        )}
      </Navbar>

      <Row resizableFixed className={classNames(isSourceLoading && "loading")}>
        <Col width="100">
          <div
            className={classNames("main-content", source.uid && "start-import")}
          >
            {!source.uid ? (
              <>
                <h2>{t("Start importing your products")}</h2>
                <p>
                  {t(
                    "Use your template to import products from any platform into your store."
                  )}
                </p>
                <Button
                  fill
                  round
                  large
                  onClick={(): void => setIsPopupOpened(true)}
                >
                  {t("Configure Import")}
                </Button>
              </>
            ) : (
              <>
                <h2>{t("Import Log")}</h2>
                <div
                  className={classNames(
                    source.currentContent?.processed && "disabled"
                  )}
                >
                  <div className="log-item">
                    <div className="log-item__label">{t("Import date")}</div>
                    <div className="log-item__data">
                      {moment().format("LLL")}
                    </div>
                  </div>
                  <div className="log-item">
                    <div className="log-item__label">{t("File Type")}</div>
                    <div className="log-item__data">
                      {source.type.code || t("File not found")}
                    </div>
                  </div>
                  <div className="log-item">
                    <div className="log-item__label">{t("Source")}</div>
                    <div className="log-item__data">
                      {source.contentType === "file"
                        ? source.title || t("File not found")
                        : source.url || t("File not found")}
                    </div>
                  </div>
                  <div className="log-item">
                    <div className="log-item__label">{t("Statistics")}</div>
                    {source.currentContent?.processed ? (
                      <div className="stats">
                        <div className="stats-lines">
                          {Object.keys(stats).map((key, index) =>
                            stats[key] ? (
                              <div
                                key={index}
                                className={key}
                                style={{
                                  width: `${
                                    (stats[key] / totalProducts) * (464 - 16)
                                  }px`,
                                }}
                              />
                            ) : null
                          )}
                        </div>
                        <div className="stats-legend">
                          {Object.keys(stats).map((key, index) => (
                            <div key={index}>
                              <div className={`stats-legend-dot ${key}`} />
                              {key}&nbsp;{stats[key]}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="log-item__data">{t("Importing")}...</div>
                    )}
                  </div>
                </div>
                <Button
                  className="download-log-button"
                  onClick={handleClickDownloadLog}
                >
                  <IcLoad />
                  {t("Download Log File")}
                </Button>
                {!source.currentContent?.processed ? (
                  <Button className="pause-import-button" fill round large>
                    {t("Pause Import")}
                  </Button>
                ) : (
                  <Button
                    className="pause-import-button"
                    fill
                    round
                    large
                    onClick={restartImport}
                  >
                    {isRestartLoading ? (
                      <div className="preloader-restart">
                        <Preloader />
                      </div>
                    ) : (
                      t("Restart Import")
                    )}
                  </Button>
                )}
                {!source.currentContent?.processed ||
                  (isRestartLoading && (
                    <div className="notice">
                      {t(
                        "We're currently exporting your products into your store. This should take less than five minutes."
                      )}
                    </div>
                  ))}
              </>
            )}
          </div>
        </Col>
      </Row>

      <PopupConfigureImport
        isOpened={isPopupOpened}
        closePopup={(): void => setIsPopupOpened(false)}
        startImport={startImport}
        source={source}
        setSource={setSource}
      />
    </Page>
  );
};

export default ImportProducts;
