import parsePhoneNumber from "libphonenumber-js";
import { TestFunction } from "yup";

const phoneValidator: TestFunction<string | undefined, any> = (value) => {
  if (typeof value !== "string") {
    return false;
  }

  try {
    const parsedPhoneNumber = parsePhoneNumber(`+47${value}`);
    return parsedPhoneNumber !== undefined && parsedPhoneNumber.isValid();
  } catch (error) {
    return false;
  }
};

export default phoneValidator;
