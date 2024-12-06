/* eslint-disable @typescript-eslint/no-explicit-any */

import { TErrorSources, TGenericErrorResponse } from "../interfaces/error";

const handleForeignKeyError = (err: any): TGenericErrorResponse => {
  // Attempt to extract the field name from the error message
  const errorMessage = err.message;
  const startIndex = errorMessage.indexOf('`products_');
  const endIndex = errorMessage.indexOf('_fkey');
  const fieldName = errorMessage.substring(startIndex + 10, endIndex);
  const capitalizedFieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
  // Prepare the error response
  const errorSources: TErrorSources = [
    {
      path: "",
      message: `${capitalizedFieldName} does not exist`,
    },
  ];

  return {
    success: false,
    statusCode: 400,
    message: `The ${capitalizedFieldName} does not exist. Please choose a valid one.`,
    errorSources,
  };
};

export default handleForeignKeyError;