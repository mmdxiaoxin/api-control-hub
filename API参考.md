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

`/file/upload` - 上传文件(未做完)
### 概述

eg:该API用于获取用户的菜单列表，根据不同的用户令牌返回相应的菜单项。

- eg:请求方法：GET
- eg:响应格式：JSON

### 请求头部

请求头部应包含以下信息：

- eg: `x-access-token`（字符串）：用户令牌，用于标识不同用户的权限。

### 响应
- eg:成功注销后，API将返回以下JSON响应：

---
`/file/video` - 获取视频文件信息(未做完)
### 概述

该API用于获取用户的菜单列表，根据不同的用户令牌返回相应的菜单项。

- eg:请求方法：GET
- eg:响应格式：JSON

### 请求头部

请求头部应包含以下信息：

- eg:`x-access-token`（字符串）：用户令牌，用于标识不同用户的权限。

### 响应
eg:
## HTTP

- `/http/add` - 添加HTTP请求
- --
- `/http/change` - 修改HTTP请求
- --
- `/http/delete` - 删除HTTP请求

## HTTP Collection

`/http/collection/list` - 获取HTTP请求集合列表
### 概述
- 请求方法： GET 
- 响应格式： JSON
### 响应
  成功时，该API返回一个JSON响应，包含以下字段：
- code：响应状态码，成功时为200。
- data：包含HTTP请求集合的信息，是一个数组，每个元素代表一个集合。每个集合包含以下字段：
- msg：响应消息，成功时为"成功"。

- 该API的主要功能是HTTP请求集合列表。

## Menu
- --
### `/menu/list` - 获取菜单列表
### 概述
- 请求方法： GET
- 响应格式： JSON
###  请求参数
  - `x-access-token`（字符串）：用户令牌，用于标识不同用户的权限。

### 响应
成功时，该API返回一个JSON响应，包含以下字段：

- code：响应状态码，成功时为200。
- data：一个函数，该函数接收一个参数 _req（可能是请求对象），函数内部根据请求头中的 x-access-token 进行判断。如果 x-access-token 的值等于 'bqddxxwqmfncffacvbpkuxvwvqrhln'，则返回一个包含菜单项的数组。每个菜单项包含以下字段：
{ path：菜单项的路径。
name：菜单项的名称。
component：菜单项对应的组件路径。
meta：一个对象，包含菜单项的元数据信息，如图标、标题等。
}
- msg：响应消息，成功时为"成功"。

## Mock
- --
`/mock/change` - 修改Mock数据
### 概述
- 路径： /mock/list
  请求方法： POST
  响应格式： JSON
###  请求参数
  请求体（body）中可能包含以下参数：

- mockMethod（字符串）：模拟数据的HTTP请求方法（可选）。
- mockURL（字符串）：模拟数据的URL路径（可选）。
- mockDescription（字符串）：模拟数据的描述信息（可选）。
- mockStatus（整数）：模拟数据的状态（可选）。
- status（整数）：状态参数，可能用于过滤模拟数据（可选）。
- pageNum（整数）：请求的页数。
- pageSize（整数）：每页的数据条数。
### 响应
成功时，该API返回一个JSON响应，包含以下字段：

- code：响应状态码，成功时为200。
- data：一个函数，该函数接收两个参数 _req 和 Mock（可能是请求对象和Mock数据模块的实例）。函数内部根据请求体的参数生成模拟数据列表，并返回一个包含模拟数据的对象。每个模拟数据项包含以下字段：
- id：模拟数据项的唯一标识符，随机生成的18位数字字符串。
- mockMethod：模拟数据项的HTTP请求方法，如果未指定则随机选择GET、POST、DELETE或PUT。
- mockURL：模拟数据项的URL路径，如果未指定则随机生成一个5到18位的单词作为路径。
- mockDescription：模拟数据项的描述信息，随机生成的城市名。
- mockCreateTime：模拟数据项的创建时间，随机生成的日期和时间。
- mockStatus：模拟数据项的状态，如果未指定则随机生成0或1。
- pageNum：当前返回的页数，与请求参数中的 pageNum 相同。
- pageSize：当前返回的每页数据条数，与请求参数中的 pageSize 相同。
- total：模拟数据的总条数，固定为2000。
- msg：响应消息，成功时为"成功"。
- --
 `/mock/delete` - 删除Mock数据
- --
 `/mock/list` - 获取Mock数据列表
### 概述
- **请求方法：** POST
- **响应格式：** JSON

### 请求参数

请求体（body）中可能包含以下参数：

- `mockMethod`（字符串）：模拟数据的HTTP请求方法（可选）。
- `mockURL`（字符串）：模拟数据的URL路径（可选）。
- `mockDescription`（字符串）：模拟数据的描述信息（可选）。
- `mockStatus`（整数）：模拟数据的状态（可选）。
- `status`（整数）：状态参数，可能用于过滤模拟数据（可选）。
- `pageNum`（整数）：请求的页数。
- `pageSize`（整数）：每页的数据条数。

### 响应

成功时，该API返回一个JSON响应，包含以下字段：

- `code`：响应状态码，成功时为200。
- `data`：一个函数，该函数接收两个参数 `_req` 和 `Mock`（可能是请求对象和Mock数据模块的实例）。函数内部根据请求体的参数生成模拟数据列表，并返回一个包含模拟数据的对象。每个模拟数据项包含以下字段：
  - `id`：模拟数据项的唯一标识符，随机生成的18位数字字符串。
  - `mockMethod`：模拟数据项的HTTP请求方法，如果未指定则随机选择GET、POST、DELETE或PUT。
  - `mockURL`：模拟数据项的URL路径，如果未指定则随机生成一个5到18位的单词作为路径。
  - `mockDescription`：模拟数据项的描述信息，随机生成的城市名。
  - `mockCreateTime`：模拟数据项的创建时间，随机生成的日期和时间。
  - `mockStatus`：模拟数据项的状态，如果未指定则随机生成0或1。
  - `pageNum`：当前返回的页数，与请求参数中的 `pageNum` 相同。
  - `pageSize`：当前返回的每页数据条数，与请求参数中的 `pageSize` 相同。
  - `total`：模拟数据的总条数，固定为2000。
- `msg`：响应消息，成功时为"成功"。

需要注意的是，`data`字段的值是一个函数，而不是直接的JSON对象。这种设计可能是为了根据请求动态生成模拟数据，以便支持不同的查询和分页需求。根据请求参数中的`mockMethod`、`mockURL`、`mockDescription`、`mockStatus`等字段，API返回相应条件下的模拟数据列表。当`pageSize`为25、50或100时，每页返回相应数量的模拟数据。
- --
`/mock/status` - 获取Mock数据状态
### 概述
- **请求方法：** GET
- **响应格式：** JSON

### 响应

成功时，该API返回一个JSON响应，包含以下字段：

- `code`：响应状态码，成功时为200。
- `data`：一个数组，包含两个对象，每个对象代表一个模拟数据状态。每个状态对象包含以下字段：
  - `mockLabel`（字符串）：模拟数据状态的标签，可能是"启用"或"关闭"。
  - `mockStatus`（整数）：模拟数据状态的值，可能是1（代表启用）或0（代表关闭）。
  - `tagType`（字符串）：模拟数据状态标签的类型，可能是"success"（绿色，代表成功）或"danger"（红色，代表危险）。
- `msg`：响应消息，成功时为"成功"。

该API的主要功能是返回两种模拟数据状态的信息，包括状态标签、状态值和状态标签的类型。这样的信息通常用于前端界面的展示，以便用户能够清晰地看到模拟数据的状态。

## Mock Tree
- --
`/mock/tree/list` - 获取Mock树列表
- **请求方法：** POST
- **响应格式：** JSON

### 请求参数

- `mockMethod`（字符串）：模拟数据的HTTP请求方法（可选）。
- `mockURL`（字符串）：模拟数据的URL路径（可选）。
- `mockDescription`（字符串）：模拟数据的描述信息（可选）。
- `mockStatus`（整数）：模拟数据的状态（可选）。
- `status`（整数）：状态参数，可能用于过滤模拟数据（可选）。
- `pageNum`（整数）：请求的页数。
- `pageSize`（整数）：每页的数据条数。

### 响应

- `code`：响应状态码，成功时为200。
- `data`：一个函数，该函数接收两个参数 `_req` 和 `Mock`（可能是请求对象和Mock数据模块的实例）。函数内部根据请求体的参数生成模拟数据列表，并返回一个包含模拟数据的对象。每个模拟数据项包含以下字段：
  - `id`：模拟数据项的唯一标识符，随机生成的18位数字字符串。
  - `mockMethod`：模拟数据项的HTTP请求方法，如果未指定则随机选择GET、POST、DELETE或PUT。
  - `mockURL`：模拟数据项的URL路径，如果未指定则随机生成一个5到18位的单词作为路径。
  - `mockDescription`：模拟数据项的描述信息，随机生成的城市名。
  - `mockCreateTime`：模拟数据项的创建时间，随机生成的日期和时间。
  - `mockStatus`：模拟数据项的状态，如果未指定则随机生成0或1。
  - `pageNum`：当前返回的页数，与请求参数中的 `pageNum` 相同。
  - `pageSize`：当前返回的每页数据条数，与请求参数中的 `pageSize` 相同。
  - `total`：模拟数据的总条数，固定为2000。
- `msg`：响应消息，成功时为"成功"。

需要注意的是，`data`字段的值是一个函数，而不是直接的JSON对象。这种设计可能是为了根据请求动态生成模拟数据，以便支持不同的查询和分页需求。根据请求参数中的`mockMethod`、`mockURL`、`mockDescription`、`mockStatus`等字段，API返回相应条件下的模拟数据列表。当`pageSize`为25、50或100时，每页返回相应数量的模拟数据。而且，该API被描述为返回带有树状结构的模拟数据列表，但是在提供的信息中并未包含树状结构的相关数据结构。如果树状结构的数据需要返回，API的响应应该包含父子关系的信息。
## User
- --
`/user/add` - 添加用户

- **请求方法：** POST
- **请求格式：** JSON

### 请求参数

- 请求体（body）中应该包含以下参数：

- `username`（字符串）：新用户的用户名。
- `password`（字符串）：新用户的密码的MD5哈希值。

### 响应

成功时，该API返回一个JSON响应，包含以下字段：

- `code`：响应状态码，成功时为200。
- `msg`：响应消息，成功时为"成功"。

该API的主要功能是接收客户端发送的新用户信息（用户名和密码的MD5哈希值），然后将该用户添加到系统中。成功时返回状态码200和消息"成功"，表示用户添加操作已成功执行。
- --
`/user/change` - 修改用户信息

- **请求方法：** POST
- **请求格式：** JSON

### 请求参数

请求体（body）中应该包含以下参数：

- `userId`（字符串或数字）：要修改的用户的唯一标识符。
- `newUsername`（字符串）：新的用户名。
- `newPassword`（字符串）：新的密码的MD5哈希值。

### 响应

成功时，该API返回一个JSON响应，包含以下字段：

- `code`：响应状态码，成功时为200。
- `msg`：响应消息，成功时为"成功"。

该API的主要功能是接收客户端发送的要修改的用户信息（用户ID、新用户名和新密码的MD5哈希值），然后将该用户的信息更新为新的用户名和密码。成功时返回状态码200和消息"成功"，表示用户信息修改操作已成功执行。
- --
`/user/delete` - 删除用户

- **请求方法：** POST
- **请求格式：** JSON

### 请求参数

请求体（body）中应该包含以下参数：

- `userId`（字符串或数字）：要删除的用户的唯一标识符。

### 响应

成功时，该API返回一个JSON响应，包含以下字段：

- `code`：响应状态码，成功时为200。
- `msg`：响应消息，成功时为"成功"。

该API的主要功能是接收客户端发送的要删除的用户的唯一标识符（用户ID），然后从系统中删除该用户。成功时返回状态码200和消息"成功"，表示用户删除成功。
- --
`/user/department` - 获取用户部门信息

- **请求方法：** GET
- **响应格式：** JSON

### 响应

成功时，该API返回一个JSON响应，包含以下字段：

- `code`：响应状态码，成功时为200。
- `data`：一个数组，每个元素代表一个部门。每个部门对象包含以下字段：
  - `id`（字符串）：部门的唯一标识符。
  - `name`（字符串）：部门的名称。
  - `children`（数组）：包含该部门下子部门的数组。每个子部门对象包含以下字段：
    - `id`（字符串）：子部门的唯一标识符。
    - `name`（字符串）：子部门的名称。
- `msg`：响应消息，成功时为"成功"。

该API的主要功能是返回公司的部门信息。公司分为不同的分部（例如：华东分部、华南分部、西北分部），每个分部下面有研发部、市场部、商务部、财务部等子部门。这种数据结构通常用于构建组织架构图或者部门选择的下拉列表等功能。
- --
`/user/edit` - 编辑用户信息

- **请求方法：** POST
- **请求格式：** JSON

### 请求参数

请求体（body）中应该包含以下参数：

- `userId`（字符串或数字）：要编辑的用户的唯一标识符。
- `newUsername`（字符串）：新的用户名。
- `newPassword`（字符串）：新的密码的MD5哈希值。

### 响应

成功时，该API返回一个JSON响应，包含以下字段：

- `code`：响应状态码，成功时为200。
- `msg`：响应消息，成功时为"成功"。

该API的主要功能是接收客户端发送的要编辑的用户信息（用户ID、新用户名和新密码的MD5哈希值），然后将该用户的信息更新为新的用户名和密码。成功时返回状态码200和消息"成功"，表示用户信息编辑操作已成功执行。
- --
`/user/export` - 导出用户信息

- **请求方法：** GET
- **响应格式：** JSON

### 响应

该API返回一个JSON响应，包含以下字段：

- `code`：响应状态码，成功时为200。
- `msg`：响应消息，表示操作结果的描述信息。在这个演示环境中，响应消息为"演示环境暂不能导出数据🙅"，表示暂时不支持在演示环境中导出数据。

这个API的主要功能是在正式环境中，允许用户导出数据，但在演示环境中，可能受到限制，暂时不支持导出数据。这种限制通常是为了保护数据的安全性，防止在演示环境中意外泄露敏感信息。
- --
`/user/gender` - 获取用户性别信息

- **请求方法：** GET
- **响应格式：** JSON

### 响应

该API返回一个JSON响应，包含以下字段：

- `code`：响应状态码，成功时为200。
- `data`：一个数组，包含用户性别选项。每个性别选项对象包含以下字段：
  - `genderLabel`（字符串）：性别的文本标签，例如"男"和"女"。
  - `genderValue`（整数）：性别的数值表示，通常使用1表示男性，2表示女性。
- `msg`：响应消息，表示操作结果的描述信息。在这个API中，消息为"成功"。

该API的主要功能是返回用户性别的选项，供前端界面使用。前端可以使用这些数据构建性别选择的下拉列表或者单选按钮等用户界面元素。这种设计可以让前端界面与后端数据保持一致，确保用户输入的数据符合系统的预期格式。
- --
`/user/import` - 导入用户信息

- --
`/user/list` - 获取用户列表

- **请求方法：** POST
- **请求格式：** JSON

### 请求参数

请求体（body）中应该包含以下参数：

- `pageNum`（数字）：要请求的页码。
- `pageSize`（数字）：每页的用户数量。
- `username`（字符串，可选）：用户名，用于筛选特定用户名的用户。
- `gender`（数字，可选）：性别，用于筛选特定性别的用户。1表示男性，2表示女性。
- `age`（数字，可选）：年龄，用于筛选特定年龄的用户。
- `idCard`（字符串，可选）：身份证号，用于筛选特定身份证号的用户。
- `email`（字符串，可选）：邮箱地址，用于筛选特定邮箱地址的用户。
- `status`（数字，可选）：用户状态，用于筛选特定状态的用户。0表示禁用，1表示启用。

### 响应

该API返回一个JSON响应，包含以下字段：

- `code`：响应状态码，成功时为200。
- `data`：一个数组，每个元素代表一个用户。每个用户对象包含以下字段：
  - `id`（字符串）：用户的唯一标识符。
  - `username`（字符串）：用户名。
  - `gender`（数字）：性别。1表示男性，2表示女性。
  - `user`（对象）：用户详细信息对象，包含以下字段：
    - `detail`（对象）：用户详细信息，包含以下字段：
      - `age`（数字）：年龄。
  - `idCard`（字符串）：身份证号。
  - `email`（字符串）：邮箱地址。
  - `address`（字符串）：地址。
  - `createTime`（字符串）：用户创建时间。
  - `status`（数字）：用户状态。0表示禁用，1表示启用。
  - `avatar`（字符串）：用户头像URL。
- `pageNum`：当前页码。
- `pageSize`：每页的用户数量。
- `total`：符合筛选条件的用户总数。

该API的主要功能是根据请求参数筛选用户列表，返回符合条件的用户信息列表，以及分页信息。前端可以使用这些数据展示用户列表，同时支持根据不同的条件进行筛选和分页操作。
- --
`/user/reset_password` - 重置用户密码

- **请求方法：** POST
- **请求格式：** JSON

### 请求参数

请求体（body）中应该包含以下参数：

- `userId`（字符串或数字）：要重置密码的用户的唯一标识符。

### 响应

成功时，该API返回一个JSON响应，包含以下字段：

- `code`：响应状态码，成功时为200。
- `msg`：响应消息，成功时为"成功"。

该API的主要功能是接收客户端发送的要重置密码的用户信息（用户ID），然后将该用户的密码重置为默认值或者一个随机生成的新密码。成功时返回状态码200和消息"成功"，表示用户密码重置操作已成功执行。
- --
`/user/role` - 获取用户角色信息

- **请求方法：** GET
- **响应格式：** JSON

### 响应

该API返回一个JSON响应，包含以下字段：

- `code`：响应状态码，成功时为200。
- `data`：一个数组，包含用户角色选项。每个角色选项对象包含以下字段：
  - `label`（字符串）：角色的文本标签，例如"全部"、"超级管理员"等。
  - `value`（字符串）：角色的数值表示，通常是一个唯一的标识符，用于识别该角色。
- `msg`：响应消息，表示操作结果的描述信息。在这个API中，消息为"成功"。

该API的主要功能是返回用户角色的选项，供前端界面使用。前端可以使用这些数据构建角色选择的下拉列表或者单选按钮等用户界面元素。这种设计可以让前端界面与后端数据保持一致，确保用户选择的角色在系统中能够被正确识别和处理。
- --
`/user/status` - 获取用户状态

- **请求方法：** GET
- **响应格式：** JSON

### 响应

该API返回一个JSON响应，包含以下字段：

- `code`：响应状态码，成功时为200。
- `data`：一个数组，包含用户状态选项。每个状态选项对象包含以下字段：
  - `userLabel`（字符串）：状态的文本标签，例如"启用"、"禁用"等。
  - `userStatus`（数字）：状态的数值表示，通常是一个整数，用于表示该状态。
  - `tagType`（字符串）：状态对应的标签类型，例如"success"表示成功状态，"danger"表示危险状态。这通常用于显示状态标签的颜色。
- `msg`：响应消息，表示操作结果的描述信息。在这个API中，消息为"成功"。

该API的主要功能是返回用户状态的选项，供前端界面使用。前端可以使用这些数据构建状态选择的下拉列表、标签或者按钮等用户界面元素。这种设计可以让前端界面与后端数据保持一致，确保用户选择的状态在系统中能够被正确识别和处理。


## User Tree
- --

- `/user/tree/list` - 获取用户树列表

- **请求方法：** POST
- **请求体参数：** JSON格式，包括以下字段：
  - `username`（可选）：用户姓名，用于筛选用户。
  - `gender`（可选）：用户性别，用于筛选用户。1表示男性，2表示女性。
  - `age`（可选）：用户年龄，用于筛选用户。指定年龄范围。
  - `idCard`（可选）：用户身份证号，用于筛选用户。
  - `email`（可选）：用户邮箱，用于筛选用户。
  - `status`（可选）：用户状态，用于筛选用户。0表示禁用，1表示启用。
  - `pageNum`：页码，表示当前请求的页数。
  - `pageSize`：每页显示的记录数。

### 响应

该API返回一个JSON响应，包含以下字段：

- `code`：响应状态码，成功时为200。
- `data`：一个数组，包含树形用户列表。每个用户对象包含以下字段：
  - `id`（字符串）：用户ID，唯一标识一个用户。
  - `username`（字符串）：用户姓名。
  - `gender`（数字）：用户性别，1表示男性，2表示女性。
  - `user`（对象）：包含用户详细信息的对象。
    - `detail`（对象）：包含用户详细信息的对象。
      - `age`（数字）：用户年龄。
  - `idCard`（字符串）：用户身份证号。
  - `email`（字符串）：用户邮箱。
  - `address`（字符串）：用户地址。
  - `createTime`（字符串）：用户创建时间，格式为日期和时间的字符串。
  - `status`（数字）：用户状态，0表示禁用，1表示启用。
  - `avatar`（数组）：用户头像的URL数组，包含1个URL。
  - `children`（数组）：该用户的子用户列表，每个子用户对象具有与父用户相同的字段结构。在这个API中，每个用户最多有3个子用户。
- `pageNum`：当前返回的页码。
- `pageSize`：每页显示的记录数。
- `total`：符合筛选条件的用户总数。

该API的主要功能是返回树形结构的用户列表，包括用户的基本信息以及子用户信息。前端可以使用这些数据构建树形用户列表，以展示用户之间的层级关系。
