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

export interface ApiFormData {
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
