import Layout from "@/components/layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${poppins.className}`}>
      <Component {...pageProps} />
    </div>
  )
}
