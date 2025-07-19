import { AxiosError } from "axios";

interface ZodValidationError {
  message: string;
  field?: string;
}

interface ErrorResponseData {
  message?: string;
  error?: string;
  field?: string;
  errors?: ZodValidationError[];
}

export const errorExtractMessage = (err: unknown): string | null => {
  if (!err) {
    return null;
  }

  const axiosError = err as AxiosError<ErrorResponseData>;

  if (axiosError.response?.data) {
    const data = axiosError.response.data;

    // Zod-like validation errors (array of messages)
    if (data.errors && Array.isArray(data.errors)) {
      return data.errors.map((e) => e?.message).join(", ");
    }

    // Handle single error message
    if (data.message) {
      return data.message;
    }

    // Handle error field
    if (data.error) {
      return data.error;
    }
  }

  // Network error: no response body
  if (axiosError.response && !axiosError.response.data) {
    return "Network Error, Please check your connection";
  }

  // Fallback to general error message
  if ((err as Error).message) {
    return (err as Error).message;
  }

  // Final fallback
  return "Something went wrong. Please try again.";
};
