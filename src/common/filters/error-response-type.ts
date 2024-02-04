interface ErrorResponseType {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
}

export default ErrorResponseType;
