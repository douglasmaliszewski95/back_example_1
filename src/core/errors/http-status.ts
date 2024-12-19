export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  NOT_ACCEPTABLE = 406,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}

export function getEnumValueOrDefault(defaultValue: HttpStatus, value?: number): HttpStatus {
  const values = Object.values(HttpStatus).filter(v => typeof v === "number");
  return value && values.includes(value) ? (value as HttpStatus) : defaultValue;
}
