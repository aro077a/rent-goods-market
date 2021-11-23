import React, { ReactElement, useEffect, useRef, useState } from "react";
import {
  Button,
  Navbar,
  NavRight,
  NavTitle,
  Popup,
  Page,
  List,
  ListItem,
  ListInput,
  Toggle,
  Preloader,
} from "framework7-react";
import { round } from "lodash";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { IcClose, IcDelete } from "@/components-ui/icons";
import { ProductSource, ProductSourceControllerApi } from "@/types/marketplaceapi";
import { IcDocumentStroke } from "@/components-ui/icons/index";
import { client, marketplaceapiURL } from "@/axios";
import { IApplicationStore } from "@/store/rootReducer";
import { getProfile } from "@/selectors/profile";
import { CustomSelect } from "@/components/CustomSelect/CustomSelect";

import "./configure-import-popup.less";

const fileExtensionsMap = {
  "yandex-xls": ".xls, .xlsx",
  excel: ".xls, .xlsx",
  yml: ".yml",
  csv: ".csv",
};

interface ImportConfigurePopupProps {
  isOpened: boolean;
  closePopup(): void;
  startImport(): void;
  source: ProductSource;
  setSource(SourceType): void;
}

const ImportConfigurePopup = ({
  isOpened,
  closePopup,
  startImport,
  source,
  setSource,
}: ImportConfigurePopupProps): ReactElement => {
  const { t } = useTranslation();
  const inputFileRef = useRef(null);
  const profile = useSelector((state: IApplicationStore) => getProfile(state));

  const [url, setUrl] = useState(source.contentType === "url" ? source.url : "");
  const [authorization, setAuthorization] = useState(source.authorization || false);
  const [username, setUsername] = useState(source.username || "");
  const [password, setPassword] = useState(source.password || "");
  const [skipNew, setSkipNew] = useState(source.skipNew || false);
  const [updateExisting, setUpdateExisting] = useState(source.updateExisting || false);

  const [file, setFile] = useState<File>(null);
  const [fileTitle, setFileTitle] = useState(source.title || "");
  const [isFileTypePopupOpened, setIsFileTypePopupOpened] = useState(false);
  const [isUrlValid, setIsUrlValid] = useState("");
  const [isStartEnabled, setIsStartEnabled] = useState(false);
  const [isSourceLoading, setIsSourceLoading] = useState(false);

  const [typeCodes, setTypeCodes] = useState([]);
  const getFileTypes = async (): Promise<void> => {
    const result = await new ProductSourceControllerApi().productSourceTypeListUsingGET();
    if (result.body) {
      setTypeCodes(result.body.map((item) => ({ value: item.code, label: item.name })));
    }
  };
  useEffect(() => {
    if (isOpened) {
      setFileTitle(source.title);
      if (!typeCodes.length) getFileTypes().then();
    }
  }, [isOpened]);

  useEffect(() => {
    const value = source.type.code && source.url;
    if (source.contentType === "file") {
      setIsStartEnabled(!!value);
    } else {
      setIsStartEnabled(!!(value && isUrlValid));
    }
  }, [source.type.code, source.url, isUrlValid]);

  const [isFileLoading, setIsFileLoading] = useState(false);
  const handleFileSelect = async (e): Promise<void> => {
    const file = e.target.files[0];
    if (file) {
      setIsFileLoading(true);

      const formData = new FormData();
      formData.append("bucket", "import");
      formData.append("file", file);
      const result = await client.post(`${marketplaceapiURL}/file/upload`, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });
      const url = result?.data?.body[0]?.url;
      if (url) {
        setFile(file);
        setSource({ ...source, url });
      }

      setIsFileLoading(false);
    }
  };

  const handleClickDeleteFile = (): void => {
    setFile(null);
    setFileTitle("");
    setSource({ ...source, url: "" });
  };

  const handleClickStart = async (): Promise<void> => {
    setIsSourceLoading(true);

    let data = {
      ...source,
      title: source.contentType === "file" ? file?.name || fileTitle : url,
      skipNew,
      updateExisting,
      accountUid: profile.uid,
    };

    if (data.contentType === "url") {
      data.url = url;
      if (authorization) data = { ...data, authorization, username, password };
    }

    const result = source.uid
      ? await new ProductSourceControllerApi().updateProductSourceUsingPOST1(data)
      : await new ProductSourceControllerApi().addProductSourceUsingPUT1(data);
    if (result?.body) setSource(result.body[0]);

    setIsSourceLoading(false);
    startImport();
  };

  return (
    <Popup id="configure-import-popup" opened={isOpened} onPopupClose={closePopup}>
      <Page>
        <Navbar noShadow>
          <NavTitle>{t("Configure Import")}</NavTitle>
          <NavRight>
            <Button onClick={closePopup}>
              <IcClose />
            </Button>
          </NavRight>
        </Navbar>
        <div>
          <p>{t("Use your template to import products from any platform into your store.")}</p>
          <List className="import-type-radio" noHairlines noHairlinesBetween>
            <ListItem
              radio
              name="import-method"
              checked={source.contentType === "file"}
              title={t("File").toString()}
              onChange={(): void => setSource({ ...source, contentType: "file" })}
            />
            <ListItem
              radio
              name="import-method"
              checked={source.contentType === "url"}
              title={t("Link").toString()}
              onChange={(): void => setSource({ ...source, contentType: "url" })}
            />
          </List>
          <List className="list-inputs" noHairlinesMd>
            <CustomSelect
              className="custom-dropdown"
              value={typeCodes.find((ft) => ft.value === source.type.code)}
              options={typeCodes}
              onChange={(code): void => setSource({ ...source, type: { code: code.value } })}
              openPopup={(): void => setIsFileTypePopupOpened(true)}
              label={t("File Type")}
            />
            {source.contentType === "file" ? (
              !file && !isFileLoading && !fileTitle ? (
                <>
                  <input
                    type="file"
                    name="file"
                    ref={inputFileRef}
                    style={{ display: "none" }}
                    onChange={handleFileSelect}
                    accept={fileExtensionsMap[source.type.code]}
                  />
                  <Button
                    className="add-file-button"
                    onClick={(): void => inputFileRef.current.click()}
                    disabled={!source.type.code}
                  >
                    <IcDocumentStroke className="icon-document" />
                    Add a File
                  </Button>
                </>
              ) : (
                <div className="file-info-wrapper">
                  {isFileLoading ? (
                    <div className="preloader-file-upload">
                      <Preloader />
                    </div>
                  ) : (
                    <>
                      <div className="file-info">
                        <IcDocumentStroke className="icon-document" size="28" />
                        <div>
                          <div className="file-name">{file?.name || fileTitle}</div>
                          {file && (
                            <div className="file-size">
                              {file.size / 1024 < 1000
                                ? `${round(file.size / 1024, 2)} KB`
                                : `${round(file.size / 1024 / 1024, 2)} MB`}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button className="delete-file-button" onClick={handleClickDeleteFile}>
                        <IcDelete fill="#676767" />
                      </Button>
                    </>
                  )}
                </div>
              )
            ) : (
              <ListInput
                value={url}
                label={t("File URL").toString()}
                floatingLabel
                type="url"
                required
                validate
                className="info-input"
                onChange={(e): void => setUrl(e.target.value)}
                onValidate={(isValid): void => setIsUrlValid(isValid)}
              />
            )}
          </List>
          <List className="list-toggles" noHairlines noHairlinesBetween>
            {source.contentType === "url" && (
              <ListItem>
                <span>{t("Authorization to access the link")}</span>
                <Toggle
                  checked={authorization}
                  onChange={(): void => setAuthorization(!authorization)}
                />
              </ListItem>
            )}
            {source.contentType === "url" && authorization && (
              <ListItem className="list-row">
                <List className="list-inputs">
                  <List className="inputs-row">
                    <ListInput
                      label={t("Username").toString()}
                      floatingLabel
                      type="text"
                      required
                      className="info-input"
                      value={username}
                      onChange={(e): void => setUsername(e.target.value)}
                    />
                    <ListInput
                      label={t("Password").toString()}
                      floatingLabel
                      type="password"
                      required
                      className="info-input"
                      value={password}
                      onChange={(e): void => setPassword(e.target.value)}
                    />
                  </List>
                </List>
              </ListItem>
            )}
            <ListItem>
              <span>{t("Skip New Product")}</span>
              <Toggle checked={skipNew} onChange={(): void => setSkipNew(!skipNew)} />
            </ListItem>
            <ListItem>
              <span>{t("Update Existing Products")}</span>
              <Toggle
                checked={updateExisting}
                onChange={(): void => setUpdateExisting(!updateExisting)}
              />
            </ListItem>
          </List>
        </div>
        <Button
          className="start-button"
          fill
          round
          large
          disabled={!isStartEnabled}
          onClick={handleClickStart}
        >
          {isSourceLoading ? (
            <div className="preloader-import">
              <Preloader color="white" size="25" />
            </div>
          ) : (
            t("Start Import")
          )}
        </Button>
      </Page>
    </Popup>
  );
};

export default ImportConfigurePopup;
