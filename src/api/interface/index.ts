// 请求响应参数（不包含data）
export interface Result {
  code: string;
  msg: string;
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  data: T;
}

// 分页响应参数
export interface ResPage<T> {
  list: T[];
  pageNum: number;
  pageSize: number;
  total: number;
}

// 分页请求参数
export interface ReqPage {
  pageNum: number;
  pageSize: number;
}

// 文件上传模块
export namespace Upload {
  export interface ResFileUrl {
    fileUrl: string;
  }
}

// 登录模块
export namespace Login {
  export interface ReqLoginForm {
    username: string;
    password: string;
  }
  export interface ResLogin {
    access_token: string;
  }
  export interface ResAuthButtons {
    [key: string]: string[];
  }
}

//注册模块
export namespace Register {
  export interface ReqRegisterForm {
    username: string;
    password: string;
    confirm: string;
  }
}

// 用户管理模块
export namespace User {
  export interface ReqUserParams extends ReqPage {
    username: string;
    gender: number;
    idCard: string;
    email: string;
    address: string;
    createTime: string[];
    status: number;
  }
  export interface ResUserList {
    id: string;
    username: string;
    gender: number;
    user: { detail: { age: number } };
    idCard: string;
    email: string;
    address: string;
    createTime: string;
    status: number;
    avatar: string;
    photo: any[];
    children?: ResUserList[];
  }
  export interface ResStatus {
    userLabel: string;
    userValue: number;
  }
  export interface ResGender {
    genderLabel: string;
    genderValue: number;
  }
  export interface ResDepartment {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
  export interface ResRole {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
}

//Mock服务模块
export namespace MockServer {
  export interface ReqMockParams extends ReqPage {
    mockMethod: string;
    mockURL: string;
    mockDescription: string;
    mockStatus: number;
  }

  export interface ResMockList {
    id: string;
    mockMethod: string;
    mockURL: string;
    mockDescription: string;
    mockStatus: number;
    mockContent: string;
    mockCreator: string;
    mockCreateTime: string;
    mockUpdateTime: string;
  }

  export interface ResStatus {
    mockLabel: string;
    mockValue: number;
  }
}

//接口管理模块
export namespace HttpServer {
  export interface ResCollectionList {
    id: string;
    name: string;
    isProject?: Object;
    isDirectory?: Object;
    isApi?: HttpParams;
    children?: ResCollectionList[];
  }

  export interface HttpParams {
    httpUrl: string;
    httpMethod: string;
    httpDescription: string;
    headers?: Params[];
    params?: Params[];
    Authorization: string;
    httpBody?: string | Params[];
    creator: string;
    createTime: string;
    updateTime: string;
  }

  interface Params {
    Key: string;
    Value: string;
  }

  export interface ResHttpResult {
    httpBody?: string | Params[];
    httpCookies?: string;
    httpHeaders?: Params[];
  }
}

//项目管理模块
export namespace Project {
  export interface ResProjectList {
    id: string;
    name: string;
    description: string;
    creator: string;
    createTime: string;
    updateTime: string;
  }
}
