# BTBuoi8 - NextAuth Token Refresh Demo

## Mô tả
Ứng dụng Next.js demo tính năng **tự động refresh token** theo cách NextAuth hoạt động trong production.

## Cấu trúc project
```
BTBuoi8/
├── pages/
│   ├── _app.js                    # SessionProvider wrapper
│   ├── login.js                   # Trang đăng nhập
│   ├── index.js                   # Dashboard (chỉ ROLE_ADVISOR)
│   └── api/auth/[...nextauth].js  # NextAuth config + callbacks
├── package.json
├── next.config.js
└── README.md
```

## Cài đặt & Chạy

```bash
# 1. Vào thư mục project
cd BTBuoi8

# 2. Cài dependencies
npm install

# 3. Chạy development server
npm run dev

# 4. Mở trình duyệt
# http://localhost:3000
```

## Tài khoản demo

| Username  | Password | Role         |
|-----------|----------|--------------|
| `student` | `123456` | ROLE_STUDENT |
| `advisor` | `123456` | ROLE_ADVISOR |

## Các tính năng đã implement

### Bước 1: Đăng nhập & Lưu trữ 2 token
- `CredentialsProvider` kiểm tra username/password
- Trả về `accessToken` (hết hạn sau 60 giây) và `refreshToken`
- `jwt()` callback lưu cả 2 token + `accessTokenExpires` vào JWT

### Bước 2: Phân quyền truy cập
- `/` (Dashboard) → chỉ `ROLE_ADVISOR` truy cập được
- `ROLE_STUDENT` → hiển thị trang "Bị Từ Chối Truy Cập"  
- Chưa đăng nhập → redirect về `/login`

### Bước 3: Demo Token Refresh (kịch tính nhất)
1. Đăng nhập bằng `advisor / 123456`
2. Bấm nút **"Lấy danh sách lớp"** → Thành công
3. Đợi countdown về **0s** (60 giây)
4. Bấm lại nút → NextAuth tự động refresh token dưới nền!
5. Xem log trong UI hoặc mở **F12 → Console** để thấy:
   ```
   🔄 Token hết hạn, đang refresh...
   ✅ Refresh token thành công! Token mới: access_token_...
   ```

## Điểm quan trọng
> Người dùng hoàn toàn **không biết** việc refresh token đang xảy ra dưới nền!
> NextAuth xử lý toàn bộ tự động trong hàm `jwt()` callback.
