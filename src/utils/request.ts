import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse
} from "axios";
import axios from "axios";

type AuthType = "basic" | "bearer" | "apiKey" | "oauth";

export interface RequestConfig extends AxiosRequestConfig {
  authType?: AuthType;
  authData?: Record<string, string>;
}

export interface ResponseWithDetails<T = any> extends AxiosResponse<T> {
  requestTime: number;
  responseTime: number;
  duration: number;
  requestBodySize: number;
  responseBodySize: number;
  requestHeadersSize: number;
  responseHeadersSize: number;
}

export interface ResponseWithError<T = any> extends AxiosError<T> {
  requestTime: number;
  responseTime: number;
  duration: number;
  statusText: string;
  requestBodySize: number;
  requestHeadersSize: number;
}

class AxiosService {
  private instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      timeout: 10000
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      config => {
        this.applyAuth(config);
        (config as any).metadata = { startTime: new Date() };

        // Calculate request body size
        const requestBody = config.data ? JSON.stringify(config.data) : "";
        const requestHeaders = JSON.stringify(config.headers || {});
        (config as any).metadata.requestBodySize = new TextEncoder().encode(
          requestBody
        ).length;
        (config as any).metadata.requestHeadersSize = new TextEncoder().encode(
          requestHeaders
        ).length;

        return config;
      },
      error => {
        console.error("Request Error:", error);
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      response => {
        const metadata = (response.config as any).metadata;
        metadata.endTime = new Date();
        metadata.duration = metadata.endTime - metadata.startTime;

        // Calculate response body size
        const responseBody = response.data ? JSON.stringify(response.data) : "";
        const responseHeaders = JSON.stringify(response.headers || {});
        const responseBodySize = new TextEncoder().encode(responseBody).length;
        const responseHeadersSize = new TextEncoder().encode(
          responseHeaders
        ).length;

        const responseWithDetails: ResponseWithDetails = {
          ...response,
          requestTime: metadata.startTime,
          responseTime: metadata.endTime,
          duration: metadata.duration,
          requestBodySize: metadata.requestBodySize,
          responseBodySize: responseBodySize,
          requestHeadersSize: metadata.requestHeadersSize,
          responseHeadersSize: responseHeadersSize
        };

        return responseWithDetails;
      },
      (error: AxiosError) => {
        console.error("Response Error:", error);
        const metadata = (error.config as any).metadata;
        metadata.endTime = new Date();
        metadata.duration = metadata.endTime - metadata.startTime;

        const requestBody = error.config?.data
          ? JSON.stringify(error.config.data)
          : "";
        const requestHeaders = JSON.stringify(error.config?.headers || {});
        const requestBodySize = new TextEncoder().encode(requestBody).length;
        const requestHeadersSize = new TextEncoder().encode(
          requestHeaders
        ).length;

        const responseWithError: ResponseWithError = {
          ...error,
          requestTime: metadata.startTime,
          responseTime: metadata.endTime,
          duration: metadata.duration,
          statusText: error.response?.statusText || "Unknown",
          requestBodySize: requestBodySize,
          requestHeadersSize: requestHeadersSize
        };

        return Promise.reject(responseWithError);
      }
    );
  }

  private applyAuth(config: RequestConfig) {
    const { authType, authData } = config;

    switch (authType) {
      case "basic":
        if (authData) {
          config.auth = {
            username: authData.username,
            password: authData.password
          };
        }
        break;
      case "bearer":
        if (authData) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${authData.token}`
          };
        }
        break;
      case "apiKey":
        if (authData) {
          config.headers = {
            ...config.headers,
            "x-api-key": authData.apiKey
          };
        }
        break;
      case "oauth":
        if (authData) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${authData.accessToken}`
          };
        }
        break;
      default:
        break;
    }
  }

  public async sendRequest(config: RequestConfig) {
    this.applyAuth(config);
    try {
      return await this.instance.request(config);
    } catch (error) {
      // Handle error
      console.error("Error in sendRequest:", error);
      throw error;
    }
  }

  public get(url: string, config?: RequestConfig) {
    return this.sendRequest({ ...config, url, method: "GET" });
  }

  public post(url: string, data?: any, config?: RequestConfig) {
    return this.sendRequest({ ...config, url, method: "POST", data });
  }

  public put(url: string, data?: any, config?: RequestConfig) {
    return this.sendRequest({ ...config, url, method: "PUT", data });
  }

  public delete(url: string, config?: RequestConfig) {
    return this.sendRequest({ ...config, url, method: "DELETE" });
  }

  public patch(url: string, data?: any, config?: RequestConfig) {
    return this.sendRequest({ ...config, url, method: "PATCH", data });
  }

  public head(url: string, config?: RequestConfig) {
    return this.sendRequest({ ...config, url, method: "HEAD" });
  }

  public options(url: string, config?: RequestConfig) {
    return this.sendRequest({ ...config, url, method: "OPTIONS" });
  }

  public connect(url: string, config?: RequestConfig) {
    return this.sendRequest({ ...config, url, method: "CONNECT" });
  }

  public trace(url: string, config?: RequestConfig) {
    return this.sendRequest({ ...config, url, method: "TRACE" });
  }
}

export default AxiosService;
