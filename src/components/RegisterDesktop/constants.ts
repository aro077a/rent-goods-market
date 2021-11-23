import { RequiredRegField } from "@/actions/sessionActions";

export const authDataFields: RequiredRegField[] = [
  "email",
  "phone",
  "password",
  "passwordRepeat",
  "accept",
];

export const personalInfoFields: RequiredRegField[] = ["firstName", "lastName", "referalCode"];

export const successMessage =
  "Your registration has been successful. <br> You will receive an activation e-mail shortly containing further instructions on how to complete your registration.";
