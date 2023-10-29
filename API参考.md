## 1. 权限按钮数据（临时设计，待完善）

### 概述

该API用于获取不同用户权限下的按钮数据。

- 路径：`/auth/buttons`
- 请求方法：GET
- 响应格式：JSON

### 请求头部

请求头部应包含以下信息：

- `x-access-token`（字符串）：用户令牌，用于标识不同用户的权限。

### 响应

成功时，该API返回一个JSON响应，其中包含以下字段：

- `code`（整数）：响应状态码（200表示成功）。

- ```
  data
  ```

  （对象）：包含权限按钮数据的对象。

  - `useProTable`（数组）：ProTable组件中可用的按钮权限。
  - `authButton`（数组）：通用权限按钮列表。

- `message`（字符串）：响应消息，表示操作是否成功。

### 示例响应

**用户令牌为** `'bqddxxwqmfncffacvbpkuxvwvqrhln'`：

```json
{
  "code": 200,
  "data": {
    "useProTable": ["add", "batchAdd", "export", "batchDelete", "status"],
    "authButton": ["add", "edit", "delete", "import", "export"]
  },
  "message": "成功"
}
```

**用户令牌为** `'unufvdotdqxuzfbdygovfmsbftlvbn'`：

```json
{
  "code": 200,
  "data": {
    "useProTable": ["add", "batchDelete"],
    "authButton": ["add", "edit", "delete", "import", "export"]
  },
  "message": "成功"
}
```



## 2. 菜单列表

### 概述

该API用于获取用户的菜单列表，根据不同的用户令牌返回相应的菜单项。

- 路径：`/menu/list`
- 请求方法：GET
- 响应格式：JSON

### 请求头部

请求头部应包含以下信息：

- `x-access-token`（字符串）：用户令牌，用于标识不同用户的权限。

### 响应

成功时，该API返回一个JSON响应，其中包含以下字段：

- `code`（整数）：响应状态码（200表示成功）。

- ```
  data
  ```

  （数组）：包含菜单项的数组，每个菜单项包含以下字段：

  - `path`（字符串）：菜单项的路径。

  - `name`（字符串）：菜单项的名称。

  - `component`（字符串）：菜单项对应的组件路径。

  - ```
    meta
    ```

    （对象）：菜单项的元信息，包含以下字段：

    - `icon`（字符串）：菜单项的图标。
    - `title`（字符串）：菜单项的标题。
    - `isLink`（字符串）：是否为链接菜单项。
    - `isHide`（布尔值）：是否隐藏菜单项。
    - `isFull`（布尔值）：是否全屏显示。
    - `isAffix`（布尔值）：是否固定在页面上。
    - `isKeepAlive`（布尔值）：是否保持页面状态。

**字段说明**：（未特别说明均为`string`）

1. `path`：*路由访问路径*。
2. `name`：*路由 name (对应页面组件 name, 可用作 KeepAlive 缓存标识 && 按钮权限筛选)*。
3. `redirect`：*路由重定向地址*
4. `component`：*视图文件路径*。
5. `meta`：{*路由元信息*
   1. `icon`：*菜单和面包屑对应的图标*。
   2. `title`：*路由标题 (用作 document.title || 菜单的名称)*。
   3. `activeMenu`：*是否在菜单中隐藏, 需要高亮的 path (通常用作详情页高亮父级菜单)* 
   4. `isLink`：*路由外链时填写的访问地址*。
   5. `isHide`：*是否在菜单中隐藏 (通常列表详情页需要隐藏)* 。<boolean>
   6. `isFull`：表示是否全屏显示菜单项*菜单是否全屏 (示例：数据大屏页面)*。<boolean>
   7. `isAffix`：*菜单是否固定在标签页中 (首页通常是固定项)* 。<boolean>
   8. `isKeepAlive`：*当前路由是否缓存*。<boolean>}
6. `children:[]`：*多级路由嵌套*。

### 示例响应

**用户令牌为** `'bqddxxwqmfncffacvbpkuxvwvqrhln'`：

```json
{
  "code": 200,
  "data": [
    {
      "path": "/home/index",
      "name": "home",
      "component": "/home/index",
      "meta": {
        "icon": "HomeFilled",
        "title": "首页",
        "isLink": "",
        "isHide": false,
        "isFull": false,
        "isAffix": true,
        "isKeepAlive": true
      }
    },
    {
      "path": "/dataScreen",
      "name": "dataScreen",
      "component": "/dataScreen/index",
      "meta": {
        "icon": "Histogram",
        "title": "数据大屏",
        "isLink": "",
        "isHide": false,
        "isFull": true,
        "isAffix": false,
        "isKeepAlive": true
      }
    },
    // 更多菜单项...
  ],
  "message": "成功"
}
```

**用户令牌为** `'unufvdotdqxuzfbdygovfmsbftlvbn'`：

```json
{
  "code": 200,
  "data": [
    {
      "path": "/home/index",
      "name": "home",
      "component": "/home/index",
      "meta": {
        "icon": "HomeFilled",
        "title": "首页",
        "isLink": "",
        "isHide": false,
        "isFull": false,
        "isAffix": true,
        "isKeepAlive": true
      }
    },
    {
      "path": "/about/index",
      "name": "about",
      "component": "/about/index",
      "meta": {
        "icon": "InfoFilled",
        "title": "关于项目",
        "isLink": "",
        "isHide": false,
        "isFull": false,
        "isAffix": false,
        "isKeepAlive": true
      }
    },
    {
          "path": "/proTable",
          "name": "proTable",
          "redirect": "/proTable/useProTable",
          "meta": {
            "icon": "MessageBox",
            "title": "超级表格",
            "isLink": "",
            "isHide": false,
            "isFull": false,
            "isAffix": false,
            "isKeepAlive": true
          },
          "children": [{
              "path": "/proTable/useProTable",
              "name": "useProTable",
              "component": "/proTable/useProTable/index",
              "meta": {
                "icon": "Menu",
                "title": "使用 ProTable",
                "isLink": "",
                "isHide": false,
                "isFull": false,
                "isAffix": false,
                "isKeepAlive": true
              },
              "children": [{
                "path": "/proTable/useProTable/detail/:id",
                "name": "useProTableDetail",
                "component": "/proTable/useProTable/detail",
                "meta": {
                  "icon": "Menu",
                  "title": "ProTable 详情",
                  "isLink": "",
                  "isHide": true,
                  "isFull": false,
                  "isAffix": false,
                  "isKeepAlive": true,
                  "activeMenu": "/proTable/useProTable"
                }
              }]
            },  
    // 更多菜单项...
  ],
  "message": "成功"
}
```

**一级路由**：

```json
{
	path: "/home/index",
	name: "home",
	component: "/home/index",
	meta: {
		icon: "HomeFilled",
		title: "首页",
		isLink: "",
		isHide: false,
		isFull: false,
		isAffix: true,
		isKeepAlive: true,
	},
}
```

**二级路由**：

```json
{
	path: "/proTable",
	name: "proTable",
	redirect: "/proTable/useProTable",
	meta: {
		icon: "MessageBox",
		title: "超级表格",
		isLink: "",
		isHide: false,
		isFull: false,
		isAffix: false,
		isKeepAlive: true,
	},
	children: [
		{
			path: "/proTable/useProTable",
			name: "useProTable",
			component: "/proTable/useProTable/index",
			meta: {
				icon: "Menu",
				title: "使用 ProTable",
				isLink: "",
				isHide: false,
				isFull: false,
				isAffix: false,
				isKeepAlive: true,
			},
		},
	],
}
```

## 3. 用户身份验证

该API用于用户身份验证，根据提供的用户名和密码验证用户身份，然后返回访问令牌。

- 路径：`/login`
- 请求方法：POST
- 响应格式：JSON

### 请求参数

请求体（body）应包含以下参数：

- `username`（字符串）：用户名。
- `password`（字符串）：用户密码的MD5哈希值。

### 响应

成功时，该API返回一个JSON响应，其中包含以下字段：

- `code`（函数）：响应状态码，根据身份验证结果返回200或500。
- `data`（函数）：包含用户的访问令牌，根据用户名和密码的组合返回不同的令牌。
- `message`（函数）：响应消息，根据身份验证结果返回不同的消息。

### 示例响应

以下是不同身份验证结果的示例响应：

**用户名和密码正确**：

```json
{
  "code": 200,
  "data": {
    "access_token": "bqddxxwqmfncffacvbpkuxvwvqrhln"
  },
  "message": "成功"
}
```

**用户名或密码错误**：

```json
{
  "code": 500,
  "message": "用户名或密码错误"
}
```

在示例中，身份验证成功时会返回一个访问令牌，否则会返回错误消息。



## 4. 用户退出登录

该API用于用户退出登录，将用户从当前会话中注销。

- 路径：`/logout`
- 请求方法：POST（也可以使用GET）
- 响应格式：JSON

### 请求

此API无需请求体，仅需用户已经验证的会话或访问令牌，以识别用户。

### 响应

成功注销后，API将返回以下JSON响应：

- `code`（整数）：响应状态码，通常为200表示成功。
- `message`（字符串）：响应消息，通常为 "注销成功" 或类似的消息。

### 示例响应

以下是示例成功注销的响应：

```json
{
  "code": 200,
  "message": "注销成功"
}
```

## Auth

- `/auth/buttons` - 获取权限按钮列表

## File

- `/file/upload` - 上传文件
- `/file/video` - 获取视频文件信息

## HTTP

- `/http/add` - 添加HTTP请求
- `/http/change` - 修改HTTP请求
- `/http/delete` - 删除HTTP请求

## HTTP Collection

- `/http/collection/list` - 获取HTTP请求集合列表

## Menu

- `/menu/list` - 获取菜单列表

## Mock

- `/mock/change` - 修改Mock数据
- `/mock/delete` - 删除Mock数据
- `/mock/list` - 获取Mock数据列表
- `/mock/status` - 获取Mock数据状态

## Mock Tree

- `/mock/tree/list` - 获取Mock树列表

## User

- `/user/add` - 添加用户
- `/user/change` - 修改用户信息
- `/user/delete` - 删除用户
- `/user/department` - 获取用户部门信息
- `/user/edit` - 编辑用户信息
- `/user/export` - 导出用户信息
- `/user/gender` - 获取用户性别信息
- `/user/import` - 导入用户信息
- `/user/list` - 获取用户列表
- `/user/reset_password` - 重置用户密码
- `/user/role` - 获取用户角色信息
- `/user/status` - 获取用户状态

## User Tree

- `/user/tree/list` - 获取用户树列表
