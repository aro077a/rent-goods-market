import React, { PureComponent } from "react";
import { ListInput as F7Input, F7ListInput } from "framework7-react";
import classNames from "classnames";
import { F7CleaveListInput } from ".";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./style.less";

const qlmodules = {
  toolbar: [
    ["bold", "italic", { list: "ordered" }, { list: "bullet" }, "clean"],
  ],
};

const qlformats = ["header", "bold", "italic", "list", "bullet"];

type Props = F7ListInput.Props & {
  cleaveFormatInputOptions?: any;
  enableRichText?: boolean;
  isShortDescription?: boolean;
};

class ListInput extends PureComponent<Props> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.checkNamePropSet(props);
  }

  checkNamePropSet(props: Readonly<Props>) {
    if (!props.name) throw new Error("Name prop must be set!");
  }

  render() {
    const props = this.props;
    const {
      cleaveFormatInputOptions,
      enableRichText,
      isShortDescription = false,
    } = props;

    if (enableRichText) {
      return (
        <li>
          <div className="item-content item-input item-input-with-info">
            <div className="item-inner">
              <div className="item-title item-label">{props.label}</div>
              <div className="item-input-wrap">
                <ReactQuill
                  theme="snow"
                  modules={qlmodules}
                  formats={qlformats}
                  placeholder={props.placeholder}
                  defaultValue={props.defaultValue as any}
                  onChange={(_content, _delta, _source, editor) => {
                    if (props.onChange) props.onChange(editor.getHTML());
                  }}
                  onBlur={(_range, _source, editor) => {
                    if (props.onBlur) props.onBlur(editor.getHTML());
                  }}
                />
              </div>
            </div>
          </div>
        </li>
      );
    }

    const Component = cleaveFormatInputOptions ? F7CleaveListInput : F7Input;

    return (
      <>
        <Component
          {...props}
          className={classNames(props.className ? props.className : null)}
          options={cleaveFormatInputOptions}
        />
        {isShortDescription && (
          <div className="lenght-number">
            {this.props.value.length}/{this.props.maxlength}
          </div>
        )}
      </>
    );
  }
}

export default ListInput;
