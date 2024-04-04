import { defineStore } from "pinia";
import {
  RequestData,
  ResponseData,
  ResponseStatus
} from "@/views/apiManagement/components/InterfaceConfiguration/interfaces/interfaces";
import piniaPersistConfigSession from "@/stores/helper/persist-session";
import { getHttpConfigApi } from "@/api/modules/http";
export const useHttpConfigStore = defineStore({
  id: "api-http-config",
  state(): {
    apiName: string;
    baseUrl: string;
    requestForm: RequestData;
    responsePanel: ResponseData;
    responseStatus: ResponseStatus;
    responseHeaders: ResponseData;
  } {
    return {
      apiName: "",
      baseUrl: "",
      requestForm: {
        requestMethod: "GET",
        apiUrl: "",
        authType: "noAuth",
        queryJsonBody: "",
        queryBodyForm: [],
        queryBodyFormX: [],
        queryHeaders: [],
        queryParams: [],
        queryXmlBody: "",
        queryRawBody: ""
      },
      responsePanel: {},
      responseStatus: {
        status: 0,
        time: "0ms",
        size: "0B"
      },
      responseHeaders: {}
    };
  },
  getters: {
    apiNameGet: state => state.apiName,
    baseUrlGet: state => state.baseUrl,
    requestFormGet: state => state.requestForm,
    responseStatusGet: state => state.responseStatus,
    responsePanelGet: state => state.responsePanel,
    responseHeadersGet: state => state.responseHeaders
  },
  actions: {
    setBaseUrl(url: string) {
      this.baseUrl = url;
    },
    setRequestForm(form: RequestData) {
      this.requestForm = form;
    },
    setApiName(name: string) {
      this.apiName = name;
    },
    setResponsePanel(response: ResponseData) {
      this.responsePanel = response;
    },
    setResponseStatus(status: ResponseStatus) {
      this.responseStatus = status;
    },
    setResponseHeaders(headers: ResponseData) {
      this.responseHeaders = headers;
    },
    async getHttpConfig(reqApi: string) {
      const { data } = await getHttpConfigApi({ apiId: reqApi });
      const resFormData: RequestData = {
        requestMethod: "GET",
        apiUrl: "",
        authType: "noAuth",
        queryJsonBody: "",
        queryBodyForm: [],
        queryBodyFormX: [],
        queryHeaders: [],
        queryParams: [],
        queryXmlBody: "",
        queryRawBody: ""
      };

      resFormData.requestMethod = data.requestMethod;
      resFormData.apiUrl = data.apiUrl;
      resFormData.authType = data.authType;
      resFormData.queryParams = data.queryParams;
      resFormData.queryHeaders = data.queryHeaders;
      resFormData.queryBodyForm = data.queryBodyForm;
      resFormData.queryBodyFormX = data.queryBodyFormX;
      resFormData.queryJsonBody = data.queryJsonBody;
      resFormData.queryXmlBody = data.queryXmlBody;
      resFormData.queryRawBody = data.queryRawBody;

      this.setApiName(data.name);
      this.setRequestForm(resFormData);
    }
  },
  persist: piniaPersistConfigSession("api-http-config")
});
