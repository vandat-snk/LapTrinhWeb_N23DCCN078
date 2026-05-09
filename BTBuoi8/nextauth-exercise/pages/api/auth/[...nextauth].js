import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// ============================================================
// GIẢ LẬP BACKEND: Danh sách người dùng
// ============================================================
const MOCK_USERS = {
  student: { password: "123456", role: "ROLE_STUDENT", name: "Sinh Viên" },
  advisor: { password: "123456", role: "ROLE_ADVISOR", name: "Cố Vấn" },
};

// ============================================================
// HÀM GIẢ LẬP REFRESH TOKEN TỪ BACKEND
// Trong production: gọi API backend để đổi refreshToken → accessToken mới
// ============================================================
async function refreshAccessToken(token) {
  try {
    console.log("🔄 Token hết hạn, đang refresh...");

    // Giả lập delay network
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Giả lập backend trả về token mới
    const newAccessToken = `access_token_${Date.now()}`;
    const newExpiresAt = Date.now() + 60 * 1000; // 60 giây

    console.log("✅ Refresh token thành công! Token mới:", newAccessToken.slice(0, 20) + "...");

    return {
      ...token,
      accessToken: newAccessToken,
      accessTokenExpires: newExpiresAt,
      // refreshToken vẫn giữ nguyên (hoặc backend trả về mới)
    };
  } catch (error) {
    console.error("❌ Refresh token thất bại:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

// ============================================================
// NEXTAUTH CONFIG
// ============================================================
export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // Hàm authorize: kiểm tra username/password
      async authorize(credentials) {
        const user = MOCK_USERS[credentials?.username];

        if (user && user.password === credentials?.password) {
          // Giả lập backend trả về 2 token
          const accessToken = `access_token_${Date.now()}`;
          const refreshToken = `refresh_token_${credentials.username}_${Date.now()}`;

          return {
            id: credentials.username,
            name: user.name,
            username: credentials.username,
            role: user.role,
            accessToken,
            refreshToken,
          };
        }

        // Sai thông tin → trả null (NextAuth sẽ báo lỗi)
        return null;
      },
    }),
  ],

  callbacks: {
    // ============================================================
    // JWT CALLBACK: Chạy mỗi khi tạo/cập nhật JWT
    // ============================================================
    async jwt({ token, user }) {
      // Lần đầu đăng nhập: user có dữ liệu từ authorize()
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          role: user.role,
          username: user.username,
          // Thời điểm accessToken hết hạn (60 giây từ bây giờ)
          accessTokenExpires: Date.now() + 60 * 1000,
        };
      }

      // Các lần sau: kiểm tra token còn hạn không
      if (Date.now() < token.accessTokenExpires) {
        // Token còn hạn → trả về bình thường
        return token;
      }

      // Token hết hạn → gọi hàm refresh
      return await refreshAccessToken(token);
    },

    // ============================================================
    // SESSION CALLBACK: Đưa dữ liệu từ JWT vào session
    // ============================================================
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.username = token.username;
      session.accessToken = token.accessToken;
      session.accessTokenExpires = token.accessTokenExpires;
      session.error = token.error;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET || "nextauth-secret-btbuoi8-2026",
});
