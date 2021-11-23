import moment from "moment";

export const getDefaultBirthDateValue = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 18);
  return moment(date).format("YYYY-MM-DD");
};
