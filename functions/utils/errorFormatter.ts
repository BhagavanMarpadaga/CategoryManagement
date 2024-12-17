import { ZodError, ZodIssue } from "zod";

const formatZodIssue = (issue: ZodIssue): string => {
  const { path, message } = issue;
  const pathString = path.join(".");

  return `${pathString}: ${message}`;
};

// Format the Zod error message with only the current error
export const formatZodError = (error: ZodError) => {
  const { issues } = error;
  if (issues.length) {
    const currentIssue = issues[0];
    return formatZodIssue(currentIssue);
  } else {
    return "something went wrong";
  }
};

export const handleError = (err:unknown) => {
  if (err instanceof ZodError) {
    return {
      statusCode: 400,
      error: formatZodError(err),
    };
  } else if (err instanceof Error) {
    return {
      statusCode: 400,
      error: err.message,
    };
  } else {
    return {
      statusCode: 500,
      error: `something went wrong : ${err}`,
    };
  }
};
