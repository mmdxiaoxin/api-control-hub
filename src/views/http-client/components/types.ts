export interface QueryParam {
  key: string;
  value: string;
  description: string;
}

export interface QueryHeader {
  key: string;
  value: string;
  description: string;
}

export interface QueryBodyForm {
  key: string;
  value: string;
  description: string;
}

export interface QueryBodyFormX {
  key: string;
  value: string;
  description: string;
}

export interface RequestData {
  requestMethod: string;
  apiUrl: string;
  authType: string;
  queryParams: QueryParam[];
  queryHeaders: QueryHeader[];
  queryBodyForm: QueryBodyForm[];
  queryBodyFormX: QueryBodyFormX[];
  queryJsonBody: string;
  queryXmlBody: string;
  queryRawBody: string;
}

export interface ResponseData {
  [key: string]: unknown;
}

export interface ResponseStatus {
  status: number;
  time: string;
  size: string;
}
