import { useState, useEffect } from "react";
import { signOut, getSession, useSession } from "next-auth/react";

// ============================================================
// DASHBOARD - Trang chính (chỉ ROLE_ADVISOR được truy cập)
// ============================================================
export default function Dashboard({ serverSession }) {
  const { data: session, update } = useSession();
  const activeSession = session || serverSession;

  const [countdown, setCountdown] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState([]);

  // ============================================================
  // COUNTDOWN: Đếm ngược thời gian accessToken hết hạn
  // ============================================================
  useEffect(() => {
    if (!activeSession?.accessTokenExpires) return;

    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((activeSession.accessTokenExpires - Date.now()) / 1000)
      );
      setCountdown(remaining);
    }, 500);

    return () => clearInterval(interval);
  }, [activeSession?.accessTokenExpires]);

  // ============================================================
  // NÚT "LẤY DANH SÁCH LỚP" - Demo token refresh
  // ============================================================
  const handleGetClasses = async () => {
    setLoading(true);
    addLog("📋 Đang gọi API lấy danh sách lớp...");

    const now = Date.now();
    const isExpired = now >= (activeSession?.accessTokenExpires || 0);

    if (isExpired) {
      addLog("⚠️ AccessToken đã hết hạn!");
      addLog("🔄 NextAuth phát hiện: Date.now() > accessTokenExpires");
      addLog("🔑 Đang gọi refreshAccessToken() với refreshToken...");

      // Gọi update() để trigger jwt callback → refresh token
      await update();

      addLog("✅ Refresh thành công! Token mới đã được cập nhật vào session");
      addLog("📡 Tiếp tục gọi API với accessToken mới...");
    } else {
      addLog(`✅ AccessToken còn hạn (${Math.floor((activeSession.accessTokenExpires - now) / 1000)}s nữa)`);
    }

    // Giả lập response API với token hiện tại
    const currentToken = activeSession?.accessToken || "unknown";
    const now2 = new Date();
    const expiresAt = new Date(activeSession?.accessTokenExpires || now2);

    const fakeResponse = {
      classes: [
        { id: 1, name: "Lớp A1", students: 30 },
        { id: 2, name: "Lớp A2", students: 28 },
        { id: 3, name: "Lớp A3", students: 32 },
      ],
      accessToken: currentToken.slice(0, 20) + "...",
      expiresAt: expiresAt.toLocaleTimeString("vi-VN"),
      timestamp: now2.toLocaleTimeString("vi-VN"),
    };

    setResult(fakeResponse);
    addLog("📦 Nhận dữ liệu thành công từ API!");
    setLoading(false);
  };

  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString("vi-VN");
    setLog((prev) => [...prev, `[${time}] ${msg}`]);
  };

  const clearLog = () => {
    setLog([]);
    setResult(null);
  };

  // ============================================================
  // PHÂN QUYỀN: Chỉ ROLE_ADVISOR mới vào được Dashboard
  // ============================================================
  if (activeSession?.user?.role !== "ROLE_ADVISOR") {
    return <AccessDenied session={activeSession} />;
  }

  const tokenExpired = countdown !== null && countdown === 0;
  const currentToken = activeSession?.accessToken || "";

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>📊 Dashboard Cố Vấn</h1>
          <button
            style={styles.logoutBtn}
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            🚪 Đăng Xuất
          </button>
        </div>

        {/* TOKEN INFO */}
        <div style={styles.tokenCard}>
          <h3 style={styles.sectionTitle}>🔑 Thông Tin Session</h3>
          <div style={styles.infoGrid}>
            <InfoRow icon="👤" label="Người dùng" value={activeSession?.user?.username} />
            <InfoRow icon="🏷️" label="Role" value={activeSession?.user?.role} highlight />
            <InfoRow
              icon="⏱️"
              label="Access Token hết hạn sau"
              value={
                countdown === null
                  ? "..."
                  : tokenExpired
                  ? "⚠️ ĐÃ HẾT HẠN"
                  : `${countdown}s`
              }
              danger={tokenExpired}
              success={!tokenExpired && countdown !== null}
            />
            <InfoRow
              icon="🎫"
              label="Token hiện tại"
              value={currentToken ? currentToken.slice(0, 25) + "..." : "N/A"}
              mono
            />
          </div>
        </div>

        {/* DEMO SECTION */}
        <div style={styles.demoCard}>
          <h3 style={styles.sectionTitle}>🧪 Kiểm Tra Token Refresh</h3>

          <div style={styles.guideBox}>
            <strong>Hướng dẫn demo:</strong>
            <ol style={styles.guideList}>
              <li>✅ Bấm <em>"Lấy danh sách lớp"</em> → Thành công (token còn hạn)</li>
              <li>⏳ Đợi <strong>60+ giây</strong> hoặc chờ countdown về 0s</li>
              <li>🔄 Bấm lại nút → NextAuth sẽ <strong>tự động refresh token</strong></li>
              <li>🔍 Xem log bên dưới để thấy quá trình refresh diễn ra</li>
              <li>💻 Mở <strong>F12 → Console</strong> để xem log chi tiết từ server</li>
            </ol>
          </div>

          <div style={styles.btnRow}>
            <button
              style={{ ...styles.primaryBtn, opacity: loading ? 0.7 : 1 }}
              onClick={handleGetClasses}
              disabled={loading}
            >
              {loading ? "⏳ Đang xử lý..." : "📋 Lấy danh sách lớp"}
            </button>
            <button style={styles.secondaryBtn} onClick={clearLog}>
              🗑️ Xóa log
            </button>
          </div>

          {/* LOG OUTPUT */}
          {log.length > 0 && (
            <div style={styles.logBox}>
              <h5 style={styles.logTitle}>📡 Console Log:</h5>
              {log.map((line, i) => (
                <div key={i} style={styles.logLine}>
                  {line}
                </div>
              ))}
            </div>
          )}

          {/* API RESULT */}
          {result && (
            <div style={styles.resultBox}>
              <h5 style={styles.resultTitle}>📚 Kết Quả API:</h5>
              <pre style={styles.pre}>{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* LƯU Ý QUAN TRỌNG */}
        <div style={styles.noteCard}>
          <h3 style={styles.noteTitle}>💡 Điểm Quan Trọng</h3>
          <p style={styles.noteText}>
            Người dùng hoàn toàn <strong>không biết</strong> việc refresh token đang xảy ra
            dưới nền! NextAuth xử lý toàn bộ tự động trong hàm{" "}
            <code style={styles.inlineCode}>jwt()</code> callback — đây là sức mạnh của NextAuth
            trong các ứng dụng production.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENT: Hiển thị khi bị từ chối truy cập (ROLE_STUDENT)
// ============================================================
function AccessDenied({ session }) {
  return (
    <div style={styles.page}>
      <div style={{ ...styles.container, maxWidth: "500px" }}>
        <div style={styles.deniedCard}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>❌</div>
          <h2 style={styles.deniedTitle}>Bị Từ Chối Truy Cập</h2>
          <p style={styles.deniedText}>
            Bạn không có quyền truy cập trang này.
            <br />
            Chỉ <strong>Cố Vấn (ROLE_ADVISOR)</strong> mới được phép.
          </p>
          {session?.user?.role && (
            <div style={styles.roleBadge}>
              Role của bạn: <strong>{session.user.role}</strong>
            </div>
          )}
          <button
            style={styles.dangerBtn}
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            🚪 Đăng Xuất
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENT: Hiển thị một dòng thông tin
// ============================================================
function InfoRow({ icon, label, value, highlight, danger, success, mono }) {
  return (
    <div style={styles.infoRow}>
      <span style={styles.infoIcon}>{icon}</span>
      <span style={styles.infoLabel}>{label}:</span>
      <span
        style={{
          ...styles.infoValue,
          ...(highlight && { color: "#667eea", fontWeight: "700" }),
          ...(danger && { color: "#d32f2f", fontWeight: "700" }),
          ...(success && { color: "#28a745", fontWeight: "700" }),
          ...(mono && { fontFamily: "monospace", fontSize: "12px" }),
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ============================================================
// getServerSideProps: Bảo vệ route phía server
// ============================================================
export async function getServerSideProps(context) {
  const session = await getSession(context);

  // Chưa đăng nhập → redirect về /login
  if (!session) {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }

  return {
    props: { serverSession: session },
  };
}

// ===================== STYLES =====================
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "30px 20px",
  },
  container: {
    maxWidth: "860px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: "white",
  },
  headerTitle: {
    fontSize: "26px",
    fontWeight: "700",
  },
  logoutBtn: {
    padding: "9px 20px",
    background: "rgba(255,255,255,0.2)",
    color: "white",
    border: "2px solid rgba(255,255,255,0.5)",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },
  tokenCard: {
    background: "white",
    borderRadius: "16px",
    padding: "28px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
  },
  demoCard: {
    background: "white",
    borderRadius: "16px",
    padding: "28px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
  },
  noteCard: {
    background: "rgba(255,255,255,0.15)",
    borderRadius: "16px",
    padding: "24px",
    border: "1px solid rgba(255,255,255,0.3)",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#333",
    marginBottom: "18px",
    paddingBottom: "10px",
    borderBottom: "2px solid #f0f0f0",
  },
  infoGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  infoRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 14px",
    background: "#f9f9f9",
    borderRadius: "8px",
    fontSize: "14px",
  },
  infoIcon: { fontSize: "18px" },
  infoLabel: { fontWeight: "600", color: "#667eea", minWidth: "180px" },
  infoValue: { color: "#444" },
  guideBox: {
    background: "#f0f4ff",
    borderLeft: "4px solid #667eea",
    padding: "16px 20px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "13px",
    lineHeight: "1.8",
    color: "#333",
  },
  guideList: {
    paddingLeft: "20px",
    marginTop: "8px",
  },
  btnRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
  },
  primaryBtn: {
    flex: 1,
    padding: "13px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "13px 20px",
    background: "#f0f0f0",
    color: "#555",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },
  logBox: {
    background: "#1a1a2e",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "16px",
    maxHeight: "200px",
    overflowY: "auto",
  },
  logTitle: {
    color: "#a0a0c0",
    marginBottom: "10px",
    fontSize: "12px",
    textTransform: "uppercase",
  },
  logLine: {
    color: "#c8e6c9",
    fontSize: "12px",
    fontFamily: "monospace",
    padding: "3px 0",
    lineHeight: "1.5",
  },
  resultBox: {
    background: "#e8f5e9",
    border: "1px solid #c8e6c9",
    borderRadius: "8px",
    padding: "16px",
  },
  resultTitle: {
    color: "#2e7d32",
    marginBottom: "10px",
    fontSize: "13px",
    fontWeight: "700",
  },
  pre: {
    background: "white",
    padding: "12px",
    borderRadius: "6px",
    fontSize: "12px",
    lineHeight: "1.5",
    overflowX: "auto",
    margin: 0,
  },
  noteTitle: {
    color: "white",
    fontSize: "16px",
    fontWeight: "700",
    marginBottom: "10px",
  },
  noteText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: "14px",
    lineHeight: "1.7",
  },
  inlineCode: {
    background: "rgba(255,255,255,0.2)",
    padding: "2px 6px",
    borderRadius: "4px",
    fontFamily: "monospace",
    fontSize: "13px",
  },
  // Access Denied styles
  deniedCard: {
    background: "white",
    borderRadius: "16px",
    padding: "48px 40px",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  deniedTitle: {
    fontSize: "24px",
    color: "#d32f2f",
    marginBottom: "14px",
    fontWeight: "700",
  },
  deniedText: {
    color: "#555",
    fontSize: "15px",
    lineHeight: "1.7",
    marginBottom: "20px",
  },
  roleBadge: {
    background: "#ffe8e8",
    color: "#d32f2f",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "600",
    marginBottom: "20px",
    fontSize: "14px",
  },
  dangerBtn: {
    width: "100%",
    padding: "13px",
    background: "#d32f2f",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
  },
};
