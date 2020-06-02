import Head from "next/head";
import Header from "./header";
import { Container } from "react-bootstrap";

export default function AppLayout({ children }) {
  return (
    <div className="app">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="app_header">
          <Header />
        </div>
        <Container>{children}</Container>
      </main>

      <footer className="app_footer">
        <Container>
          <p>Powered by @sahel</p>
        </Container>
      </footer>

      <style jsx global>{`
        html,
        body {
          background: #e6e6e6;
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
