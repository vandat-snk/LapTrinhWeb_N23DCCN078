import { SessionProvider } from "next-auth/react";

// Wrap toàn bộ app với SessionProvider để useSession() hoạt động ở mọi trang
export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
