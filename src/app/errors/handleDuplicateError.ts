/* eslint-disable @typescript-eslint/no-explicit-any */

import { TErrorSources, TGenericErrorResponse } from "../interfaces/error";

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  // Attempt to extract the field name within backticks
  const match = err.message.match(/\(\`(.*?)\`\)/);
  const extractedMessage = match?.[1]; // Optional chaining to safely access the value

  // If no field name is found, fall back to a generic message
  const fieldName = extractedMessage || "Unknown field";

  // Prepare the error response
  const errorSources: TErrorSources = [
    {
      path: "",
      message: `${fieldName} already exists`,
    },
  ];

  return {
    success: false,
    statusCode: 400,
    message: `The ${fieldName} is already in use. Please choose a different one.`,
    errorSources,
  };
};

export default handleDuplicateError;
