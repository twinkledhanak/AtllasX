export const success = (data: any, message = "Success") => ({
    status: "success",
    message,
    data,
  });
  
  export const failure = (message: string, errors?: any) => ({
    status: "error",
    message,
    errors: errors ?? null,
  });