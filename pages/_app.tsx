import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Exo } from "@next/font/google";

const exo = Exo({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --exo-font: ${exo.style.fontFamily};
          }
        `}
      </style>
      <Component {...pageProps} />
    </>
  );
}
