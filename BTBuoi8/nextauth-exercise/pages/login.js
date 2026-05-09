import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false, // Không redirect tự động, tự xử lý
    });

    setLoading(false);

    if (result?.error) {
      setError("❌ Sai tên đăng nhập hoặc mật khẩu!");
    } else {
      // Đăng nhập thành công → chuyển về Dashboard
      router.push("/");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.iconWrap}>🔐</div>
        <h2 style={styles.title}>Đăng Nhập</h2>

        <form onSubmit={handleLogin}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tên đăng nhập</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Nhập username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Mật khẩu</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Nhập password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div style={styles.errorBox}>{error}</div>}

          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? "⏳ Đang đăng nhập..." : "Đăng Nhập"}
          </button>
        </form>

        {/* Demo credentials */}
        <div style={styles.credsBox}>
          <p style={styles.credsTitle}>
            <strong>Demo Credentials:</strong>
          </p>
          <p style={styles.credsText}>
            👤 Student:{" "}
            <code style={styles.code}>student</code> /{" "}
            <code style={styles.code}>123456</code>{" "}
            <span style={styles.badgeStudent}>ROLE_STUDENT</span>
          </p>
          <p style={styles.credsText}>
            👨‍💼 Advisor:{" "}
            <code style={styles.code}>advisor</code> /{" "}
            <code style={styles.code}>123456</code>{" "}
            <span style={styles.badgeAdvisor}>ROLE_ADVISOR</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// Nếu đã đăng nhập thì redirect luôn về dashboard
export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (session) {
    return { redirect: { destination: "/", permanent: false } };
  }
  return { props: {} };
}

// ===================== STYLES =====================
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "20px",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    padding: "48px 40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    textAlign: "center",
  },
  iconWrap: {
    fontSize: "56px",
    marginBottom: "16px",
  },
  title: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#333",
    marginBottom: "32px",
  },
  formGroup: {
    marginBottom: "20px",
    textAlign: "left",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
    fontSize: "14px",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  btn: {
    width: "100%",
    padding: "13px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "8px",
    transition: "opacity 0.2s",
  },
  errorBox: {
    background: "#ffe8e8",
    color: "#d32f2f",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "14px",
    fontSize: "14px",
    textAlign: "left",
  },
  credsBox: {
    marginTop: "28px",
    background: "#f8f8f8",
    padding: "18px",
    borderRadius: "10px",
    textAlign: "left",
  },
  credsTitle: {
    marginBottom: "10px",
    color: "#667eea",
    fontSize: "13px",
  },
  credsText: {
    fontSize: "13px",
    color: "#444",
    margin: "6px 0",
    lineHeight: "1.6",
  },
  code: {
    background: "white",
    padding: "2px 6px",
    borderRadius: "4px",
    color: "#d63384",
    fontWeight: "600",
    fontFamily: "monospace",
    border: "1px solid #eee",
  },
  badgeStudent: {
    background: "#ff9800",
    color: "white",
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "700",
    marginLeft: "4px",
  },
  badgeAdvisor: {
    background: "#667eea",
    color: "white",
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "700",
    marginLeft: "4px",
  },
};
