import React from "react";
import {
  Popup,
  F7Popup,
  Page,
  Navbar,
  NavRight,
  Link,
  BlockTitle,
  BlockHeader,
  Block,
  Chip,
  List,
  ListInput,
  Icon,
  Fab,
  Button,
} from "framework7-react";
import { connect } from "react-redux";
import { compose } from "redux";
import classNames from "classnames";
import {
  attachFile,
  deleteFiles,
  detachFile,
  sendMessage,
} from "../../actions/contactSupportActions";
import { IClassificator } from "../../reducers/classificatorReducer";
import {
  IUploadedFileInfo,
  SupportMessage,
} from "../../reducers/contactSupportReducer";
import { IProduct } from "../../reducers/productReducer";
import { Profile } from "../../reducers/sessionReducer";
import { getProfile } from "../../selectors/profile";
import { IApplicationStore } from "../../store/rootReducer";
import { withTranslation, WithTranslation } from "react-i18next";

import "./style.less";
import { IcAddPhoto, IcClose, IcDelete } from "../../components-ui/icons";

type Props = F7Popup.Props &
  Pick<WithTranslation, "t"> & {
    profile?: Profile;
    loading?: boolean;
    error?: any;
    category?: string;
    product?: IProduct;
    subjects?: {
      Application: IClassificator[];
      Order: IClassificator[];
      Product: IClassificator[];
      MyProduct: IClassificator[];
    };
    fileAttaching?: boolean;
    fileAttachingError?: any;
    files?: IUploadedFileInfo[];
    sendMessage?(message: SupportMessage): void;
    attachFile?(file: File): void;
    detachFile?(index: number): void;
    deleteFiles?(): void;
  };

type State = {
  subject: string;
  email: string;
  message: string;
};

const ImageItem = ({
  index,
  image,
  onDelete,
}: {
  index: number;
  image: string;
  onDelete?(index: number): any;
}) => {
  return (
    <div className="chip" key={index}>
      <div className="chip-media">
        <img src={image} />
      </div>
      <div
        className="chip-delete"
        onClick={() => {
          onDelete(index);
        }}
      >
        <IcDelete />
      </div>
    </div>
  );
};

const EmptyImageItem = ({ onClick }: { onClick?(): any }) => {
  return (
    <div className="chip" onClick={onClick}>
      <div className="chip-media">
        <IcAddPhoto />
      </div>
    </div>
  );
};

class ContactSupportPopup extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      subject: null,
      email: null,
      message: null,
    };
  }

  componentDidMount() {
    this.props.deleteFiles();
  }

  componentDidUpdate(prevProps: Props) {
    const { loading, error } = this.props;

    if (!loading && prevProps.loading) {
      this.$f7.preloader.hide();
    }

    if (error && error != prevProps.error) {
      this.$f7.dialog.alert(error);
    }

    if (!loading && prevProps.loading && !error) {
      this.setState({
        subject: null,
        email: null,
        message: null,
      });
      this.props.deleteFiles();
      this.$f7.popup.close();
    }
  }

  sendMessageHandle = () => {
    const { product, t } = this.props;
    const { subject, email, message } = this.state;

    if (!subject) {
      this.$f7.dialog.alert(t("Please select message subject"));
      return;
    }

    if (!email || !message) {
      this.$f7.dialog.alert(t("Please fill out all fields"));
      return;
    }

    this.$f7.preloader.show();

    const parameters = {};
    if (product) {
      parameters["productUid"] = product.uid;
      parameters["productName"] = product.name;
    }

    const supportMessage: SupportMessage = {
      subject,
      email,
      message,
      parameters,
    };
    this.props.sendMessage(supportMessage);
  };

  onSelectFile = (file?: File) => {
    this.props.attachFile(file);
  };

  onDeleteFile = (index: number) => {
    this.props.detachFile(index);
  };

  render() {
    const { subjects, category, loading, className, files, t, ...props } =
      this.props;
    const { subject } = this.state;

    return (
      <Popup
        className={classNames("contact-support-popup", className)}
        onPopupClose={() => {
          this.props.deleteFiles();
        }}
        {...props}
      >
        <Page>
          <Navbar noShadow noHairline>
            <NavRight>
              <Link popupClose>
                <IcClose />
              </Link>
            </NavRight>
          </Navbar>
          <Block className="no-margin-top no-margin-bottom">
            <BlockTitle>{t("Contact Support")}</BlockTitle>
            <BlockHeader>
              {t(
                "Help us understand whats happening. How would you describe it?"
              )}
            </BlockHeader>
            <div className="contact-support-subject">
              {subjects[category].map((item: IClassificator) => (
                <Link
                  key={item.code}
                  onClick={() => {
                    this.setState({ subject: item.value });
                  }}
                >
                  <Chip
                    text={item.value}
                    className={subject == item.value ? "select" : ""}
                  />
                </Link>
              ))}
            </div>
          </Block>
          <List noHairlines form className={classNames("contact-support-form")}>
            <ListInput
              name="email"
              label={t("E-mail").toString()}
              type="email"
              placeholder=""
              slot="list"
              required
              clearButton
              floatingLabel
              validateOnBlur
              autofocus
              onInput={(e) => {
                this.setState({ email: e.target.value });
              }}
            />
            <ListInput
              name="comment"
              label={t("Your comment").toString()}
              type="textarea"
              placeholder=""
              slot="list"
              required
              clearButton
              floatingLabel
              validateOnBlur
              onInput={(e) => {
                this.setState({ message: e.target.value });
              }}
            />
          </List>
          <Block className="contact-support-images">
            {files.map((fileInfo, index) => (
              <ImageItem
                key={index}
                index={index}
                image={fileInfo.imageLink}
                onDelete={(selected) => {
                  this.onDeleteFile(selected);
                }}
              />
            ))}
            <EmptyImageItem
              onClick={() => {
                const input = document.createElement("input");
                document.body.appendChild(input);
                input.type = "file";
                input.accept = "image/*";
                input.style.visibility = "hidden";
                input.style.position = "absolute";
                input.style.top = "0";
                input.style.left = "-5000px";
                input.addEventListener("change", (ev) => {
                  this.onSelectFile((ev.target as any).files[0]);
                  input.remove();
                });
                input.click();
              }}
            />
          </Block>
          <Block>
            <Button
              fill
              large
              round
              raised
              disabled={loading}
              className="pure-hidden-xs"
              onClick={() => this.sendMessageHandle()}
            >
              {t("Send")}
            </Button>
          </Block>
          <Fab
            position="right-bottom"
            slot="fixed"
            className="pure-visible-xs"
            onClick={() => this.sendMessageHandle()}
          >
            <Icon ios="f7:checkmark_alt" md="material:check" />
          </Fab>
        </Page>
      </Popup>
    );
  }
}

const mapStateToProps = (state: IApplicationStore) => ({
  profile: getProfile(state),
  loading: state.contactSupportReducer.sending,
  error: state.contactSupportReducer.error,
  subjects: state.classificatorReducer.claimSubjectsClassificators,
  fileAttaching: state.contactSupportReducer.fileAttaching,
  fileAttachingError: state.contactSupportReducer.fileAttachingError,
  files: state.contactSupportReducer.files,
});

const mapDispatchToProps = (dispatch: any) => ({
  sendMessage: (message: SupportMessage) => dispatch(sendMessage(message)),
  attachFile: (file: File) => dispatch(attachFile(file)),
  detachFile: (index: number) => dispatch(detachFile(index)),
  deleteFiles: () => dispatch(deleteFiles()),
});

export default compose<any>(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps)
)(ContactSupportPopup);
