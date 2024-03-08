import Head from "next/head";
import Main from "@/app/componentes/Main";
import Footer from "@/app/componentes/Footer";
import Header from "@/app/componentes/Header";

export default function Home() {
  return (
    <div className="text-black">
      <Head>
        <title>FinTrac</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Main />
      <Footer />
    </div>
  );
}
