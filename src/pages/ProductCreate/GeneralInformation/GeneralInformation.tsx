import React, { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Field, Form, Formik } from "formik";
import {
  AccordionContent,
  AccordionItem,
  Block,
  BlockTitle,
  Button,
  Col,
  f7,
  Icon,
  Link,
  List,
  ListInput,
  ListItem,
  Navbar,
  NavRight,
  NavTitle,
  Row,
  TextEditor,
  Treeview,
  TreeviewItem,
} from "framework7-react";
import * as Yup from "yup";

import { CustomSelect } from "@/components/CustomSelect";
import Map from "@/components/Map";

import { IcLocation, IcMenu, IcVimeo, IcVk, IcYoutube } from "../../../components-ui/icons";
import { ListItemVideoPreview } from "../../../components-ui/list-item-video-preview";
import { ProductVideo } from "../../../types/marketplaceapi";
import {
  createThumbnailVideoURLLink,
  createUUID,
  createVideoURLLink,
  parseVideoURL,
} from "../../../utils";
import ImageUpload from "../ImageUpload/ImageUpload";
import { categoriesData, categoryType } from "../ProductCreateContainer/mockCategories";

import { IGenInfoProps, TImageType, TVideoLinkType } from "./GeneralInformation.types";

import "./generalInformation.less";
import { JsonNode } from "@/types/commonapi";

const GeneralInformation: FC<IGenInfoProps> = ({ dealType, handleSelectDealType }) => {
  const [currentImage, setCurrentImage] = useState<File | TImageType>();
  const [images, setImages] = useState<File[] | []>([]);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const [type, setType] = useState<string>("Product");
  const [maxChars, setMaxChars] = useState<number>(0);
  const [videoLink, setVideoLink] = useState<TVideoLinkType>();
  const [formData, setFormData] = useState<any>({
    categoryName: "test-product",
    video: {},
    description: "",
    shortDescription: "",
    hashtags: "",
    name: "",
    quantity: "",
    dealType,
    type: "Product",
    inStock: null,
    returnAccepted: null,
  });
  const [error, setError] = useState<any>({
    video: "",
    category: "",
    name: "",
    summary: "",
  });

  const { t } = useTranslation();

  const videoSocialIcons = {
    YOUTUBE: <IcYoutube />,
    VIMEO: <IcVimeo />,
    VK: <IcVk />,
  };

  const containerStyle = {
    position: "relative",
    width: "100%",
    height: "526px",
    borderRadius: "16px",
  };

  useEffect(() => {
    const isLoaded = setTimeout(() => setIsImageLoaded(false), 3000);
    return () => {
      clearTimeout(isLoaded);
    };
  }, []);

  const handleSetCurrentImage = (id: number) => {
    const selectedImage = images.find((image: TImageType) => image?.id === id);
    setCurrentImage(selectedImage);
  };

  const handleImageChange = (e: FormEvent<HTMLInputElement>) => {
    const files = (e.target as HTMLInputElement).files;
    if (files.length !== 0) {
      setIsImageLoaded(true);
      const imageById = Array.from(files).map((file: File) => {
        return {
          id: createUUID(),
          file,
        };
      });
      setImages([...images, ...imageById]);
      setCurrentImage(imageById && imageById[0]);
      setTimeout(() => {
        setIsImageLoaded(false);
      }, 2000);
    }
  };

  const handleImageDelete = (imageId: number | string) => {
    const filteredImages = images?.filter((item: TImageType) => item?.id !== imageId);
    setImages([...filteredImages]);
    if (images.length !== 0) {
      setCurrentImage(filteredImages[filteredImages.length - 1]);
    }
  };

  const handleEditorChange = (value: string) => {
    setFormData({ ...formData, description: value });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e?.target;
    const { length } = value;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "summary") {
      setMaxChars(length);
    }
    if (name === "inStock") {
      setFormData({ ...formData, inStock: e.target.checked });
    }
    if (name === "returnAllowed") {
      setFormData({ ...formData, returnAccepted: e.target.checked });
    }

    let video;
    if (name === "video" && !!value && !!value.length) {
      const info = parseVideoURL(value) || {
        id: null,
        type: null,
      };
      video = {
        id: info.id,
        type: info.type ? ProductVideo.TypeEnum[info.type.toUpperCase()] : "",
        enabled: true,
      };
      setVideoLink(video);
      setFormData({ ...formData, video });
    } else {
      setError({ ...error, video: "Please fill correct URL" });
    }
  };

  // for testing
  const d = () => {
    f7.accordion.toggle("#accordion");
  };
  const selectType = (e: ChangeEvent<HTMLButtonElement>) => {
    setType(e.target.innerText);
    setFormData({ ...formData, type: e.target.innerText });
  };

  const initialValues = {
    name: "",
    shortDescription: "",
  };

  const validationSchema = Yup.object({
    productName: Yup.string().required("Required"),
    // summary: Yup.string().required("Required"),
  });

  const handleFormSubmit = (values) => console.log("Form data", values);

  return (
    <>
      <ImageUpload
        handleImageChange={handleImageChange}
        handleSetCurrentImage={handleSetCurrentImage}
        currentImage={currentImage}
        images={images}
        isImageLoaded={isImageLoaded}
        handleImageDelete={handleImageDelete}
      />
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          console.log(values);
          // dispatch(addNewProduct(values));
        }}
        validationSchema={validationSchema}
      >
        {({ values, errors, handleChange }) => (
          <Form>
            <List noHairlines form>
              <ListItem style={{ background: "blue" }}>
                <Field name="age">
                  {({ field }) => (
                    <ListInput name={field.name} value={field.value} onInput={field.onChange} />
                  )}
                </Field>
              </ListItem>
              {JSON.stringify(values, null, 2)}
              <ListInput
                name="video"
                type="url"
                floatingLabel
                label={t("Video link") as string}
                clearButton
                info={t("Youtube, Vkontakte or Vimeo") as string}
                className="custom-style"
                onChange={handleChange}
                onInput={(e) => handleInputChange(e)}
              />
              {/* {error?.video.length > 0 && <span className="error">{errors.video}</span>} */}
            </List>
            {videoLink?.id && (
              <ListItemVideoPreview
                title={videoLink.name}
                subtitle={createVideoURLLink(videoLink.id, videoLink.type.toString())}
                icon={videoLink.type ? videoSocialIcons[videoLink.type.toString()] : ""}
                image={createThumbnailVideoURLLink(videoLink.id, videoLink.type.toString())}
                slot="list"
              />
            )}
            <List>
              <div id="accordion-wrapper" className="accordion__wrapper">
                <ListInput
                  name="category"
                  type="text"
                  floatingLabel
                  label={`${t("Category")} ${t("(Required)")}`}
                  className="list-items"
                  onChange={(e) => handleChange(e)}
                ></ListInput>
                <IcMenu onClick={d} />
              </div>
              <ListItem accordionItem title="" id="accordion" className="accordion__wrapper__block">
                <AccordionContent>
                  <AccordionItem opened>
                    <Navbar noHairline noShadow>
                      <NavTitle>{t("Select Category")}</NavTitle>
                      <NavRight>
                        <Link iconOnly onClick={d}>
                          <Icon ios="f7:multiply" md="material:close" />
                        </Link>
                      </NavRight>
                    </Navbar>
                    <Treeview>
                      {categoriesData.map((item: categoryType) => {
                        return (
                          <TreeviewItem label={item.category} toggle={true} key={item.id}>
                            {item.subCategories.map((sub: any) => {
                              return (
                                <TreeviewItem key={sub.id} label={sub.subCategory} toggle={true}>
                                  <TreeviewItem
                                    label="item1"
                                    selectable
                                    selected
                                    iconF7="square_grid_2x2_fill"
                                  />
                                  <TreeviewItem
                                    label="item2"
                                    selectable
                                    iconF7="square_grid_2x2_fill"
                                  />
                                </TreeviewItem>
                              );
                            })}
                          </TreeviewItem>
                        );
                      })}
                    </Treeview>
                    <Row className="category-footer">
                      <Col width="80"></Col>
                      <Col width="20">
                        <Button className="done-button" fill round>
                          {t("Done")}
                        </Button>
                      </Col>
                    </Row>
                  </AccordionItem>
                </AccordionContent>
              </ListItem>
            </List>
            <BlockTitle className="type-block-title">{t("Type")}</BlockTitle>
            <Block className="type-block">
              <Button
                className={type === "Product" ? "button-active" : "type-button"}
                onClick={(e) => selectType(e)}
              >
                {t("Product")}
              </Button>
              <Button
                className={type === "Service" ? "button-active" : "type-button"}
                onClick={(e) => selectType(e)}
              >
                {t("Service")}
              </Button>
            </Block>
            <List noHairlines form>
              <BlockTitle className="type-block-title">
                {t("You can sell or rent a product")}
              </BlockTitle>
              <div>
                {/* <ListInput
                  label={t("Type of deal") as string}
                  type="select"
                  placeholder=""
                  className="list-items"
                  slot="list"
                  value={dealType}
                  onChange={handleSelectDealType}
                >
                  <option value="SELL">{t("Sell")}</option>
                  <option value="RENT">{t("Rent")}</option>
                </ListInput> */}
                <CustomSelect
                  label={t("Type of deal") as string}
                  onChange={handleSelectDealType}
                  value={{ value: dealType, label: "Sell" }}
                  options={[
                    { value: dealType, label: "Sell" },
                    { value: dealType, label: "Rent" },
                  ]}
                />
                <ListInput
                  name="name"
                  type="text"
                  floatingLabel
                  label={`${t("Name")} ${t("(Required)")}`}
                  clearButton
                  className="custom-style"
                  onChange={handleInputChange}
                  style={{ position: "relative" }}
                />
                {errors.name ? <div className="errors-block">{errors.name}</div> : null}

                <ListInput
                  name="shortDescription"
                  type="textarea"
                  floatingLabel
                  label={`${t("Summary")} ${t("(Required)")}`}
                  clearButton
                  maxlength={60}
                  className="list-items"
                  onChange={handleInputChange}
                  onInputClear={(e) => setMaxChars(e.target.value.length)}
                />
                <span className="letter-count">{maxChars}/60</span>
                {errors.shortDescription ? (
                  <div className="errors-block">{errors.shortDescription}</div>
                ) : null}
              </div>
            </List>
            <TextEditor
              placeholder={t("Description")}
              className="list-items"
              onTextEditorChange={(value) => handleEditorChange(value)}
              buttons={[
                ["bold"],
                ["orderedList", "unorderedList"],
                ["paragraph"],
                ["subscript", "superscript"],
              ]}
            />
            <List>
              <ListInput
                name="hashtags"
                type="text"
                placeholder=""
                clearButton
                floatingLabel
                label={t("Hashtags") as string}
                info={t("Add hashtags like #SummerSale")}
                className="custom-style"
                onInput={(e) => handleInputChange(e)}
              />
              {dealType === "RENT" || type === "Service" ? (
                <></>
              ) : (
                <div className="types-content">
                  <ListInput
                    name="quantity"
                    type="text"
                    placeholder=""
                    clearButton
                    floatingLabel
                    label={t("Count of Product") as string}
                    className="custom-style"
                    onChange={(e) => handleInputChange(e)}
                  />
                  <ListItem
                    checkbox
                    title={t("In Stock") as string}
                    name="inStock"
                    value="inStock"
                    onChange={(e) => handleInputChange(e)}
                  />
                  <ListItem
                    checkbox
                    title={t("Return allowed") as string}
                    name="returnAllowed"
                    value="returnAllowed"
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
              )}
            </List>
            <List>
              <BlockTitle large>{t("Location")}</BlockTitle>
              <Block className="location-block">
                <IcLocation fill="var(--danger-90)" slot="" /> {t("Select on the Map")}
              </Block>
              <div className="map__container">
                <Map
                  containerStyle={containerStyle}
                  zoom={12}
                  // center={toLatLgnLiteral(coordinates)}
                  zoomControl
                />
              </div>
            </List>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default GeneralInformation;
