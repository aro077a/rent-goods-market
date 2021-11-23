export type CustomSelectValue = {
  value: string;
  label: string;
};

export type CustomSelectProps = {
  value?: CustomSelectValue;
  defaultInputValue?: string;
  options: CustomSelectValue[];
  onChange: (value: CustomSelectValue) => void;
  openPopup?: () => void;
  label: string;
  className?: string;
  validate?: boolean;
  errorMessage?: string;
};
