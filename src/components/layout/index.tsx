import Navbar from "@/components/Navbar";
import Head from "next/head";

type PropsLayout = {
  children: React.ReactNode;
  metaTitle?: string;
  metaDescription?: string;
};

export default function Layout({ metaTitle, metaDescription, children }: PropsLayout) {
  return (
    <>
      <Head>
        <title>
          {metaTitle}
        </title>
        <meta
          name="description"
          content={metaDescription}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className='px-10 pb-20 sm:px-20 md:px-40 bg-[#F8FAFC]'>
        {children}
      </main>
    </>
  );
}