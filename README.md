# Node.js Express MVC

- [Features](#features)
- [QuickStart](#quickstart)
- [API-Test](#api-test)
  - [API for User](#api-for-user)
  - [API for Admin Query](#api-for-admin-query)
  - [API for Admin Create、Update、Delete](#api-for-admin-createupdatedelete)

# Features
| Features |
|------|
| Routing |
| RESTful_API |
| Json Web Token |
| Refresh JWT / Logout |
| Data validator - Joi |
| Pagination |
| Mail Verify |

# QuickStart
### Development

```bash
npm i
npm run dev
open http://localhost:3000/
```

# API Test
## API for User
#### 1-1. 用戶註冊，暫時以名稱決定用戶權限 名字"admin"成為管理員 其他名字為普通user
```bash
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{"username":"admin","password":"123456"}'
```
#### 1-2. 用戶登入並取得 jwt token & refresh token
```
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"username": "admin","password":"123456"}'
```
#### 1-3. 使用 refresh token 重新獲得 jwt token (如果忘記jwt token)
```
curl -X POST http://localhost:3000/api/auth/refresh  -H "Content-Type: application/json" -d '{"token":<這邊放入refresh token>}'
```
#### 1-4. 用戶登出(輸入refresh token)
```
curl -X POST http://localhost:3000/api/auth/logout -s -i -H "Content-Type: application/json" -d '{"token":"<這邊放refresh token>"}'
```
## API for Admin Query 
#### 2-1. 查詢用戶資料(回傳所有用戶) (需要admin、jwt token)
```
curl "http://localhost:3000/api/users/" -s -i -H "authorization: Bearer <這邊放入token>"
```
#### 2-2. 查詢用戶資料(以ID查詢) (需要admin、jwt token)
```
curl "http://localhost:3000/api/users/id/<這邊放入要查詢的Id>" -s -i -H "authorization: Bearer <這邊放入token>"
```
#### 2-3. 查詢用戶資料(以用戶名字查詢) (需要admin、jwt token)
```
curl "http://localhost:3000/api/users/name/<這邊放入要查詢的Name>" -s -i -H "authorization: Bearer <這邊放入token>"
```
## API for Admin Create、Update、Delete
#### 3-1. 管理員手動新增帳戶 (需要admin、jwt token)
```
curl -X POST "http://localhost:3000/api/auth/" -s -i -H "Content-Type: application/json" -d '{"username": "tester","password":"456789", "role":"user", "email":"tester@gmail.com"}' -H "authorization: Bearer "
```
#### 3-2. 管理員手動更新帳戶資訊 (需要admin、jwt token)
```
curl -X PUT "http://localhost:3000/api/auth/" -s -i -H "Content-Type: application/json" -d '{"username": "tester","password":"456789","email":"tester_updated@gmail.com", "role": "admin"}' -H "authorization: Bearer <這邊放入token>"
```
#### 3-3. 管理員手動刪除帳戶 (需要admin、jwt token)
```
curl -X DELETE "http://localhost:3000/api/auth/" -s -i -H "Content-Type: application/json" -d '{"username": "tester"}' -H "authorization: Bearer <這邊放入token>"
```
