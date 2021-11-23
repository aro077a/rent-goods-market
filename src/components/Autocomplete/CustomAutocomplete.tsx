import React, { useState, ChangeEvent, FC } from "react";
import { ListInput } from "framework7-react";
import { AutocompleteListComponent } from "./AutocompleteListComponent";
import { dataObjectType, IAutocomplete } from "./models";

const CustomAutoComplete: FC<IAutocomplete> = ({
  data,
  className,
  floatingLabel,
  label,
  clearButton,
  checkbox,
  title,
}) => {
  const [filteredData, setFilteredData] = useState([]);
  const [showFilteredData, setShowFilteredData] = useState(false);
  const [input, setInput] = useState("");

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value;

    const filteredValues = data.filter(
      (items: dataObjectType) =>
        items.name.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );
    setInput(e.target.value);
    setFilteredData(filteredValues);
    setShowFilteredData(true);
  };

  const onIListItemClick = (e: ChangeEvent<HTMLInputElement>) => {
    setShowFilteredData(false);
    setInput(e.target.innerText);
  };

  return (
    <>
      <ListInput
        type="text"
        onChange={onChange}
        value={input}
        className={className}
        floatingLabel={floatingLabel}
        label={label}
        clearButton={clearButton}
      />
      {showFilteredData && input && (
        <AutocompleteListComponent
          filteredData={filteredData}
          onIListItemClick={onIListItemClick}
          checkbox={checkbox}
          title={title}
        />
      )}
    </>
  );
};

export default CustomAutoComplete;
