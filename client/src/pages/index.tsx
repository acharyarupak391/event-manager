// import { EventCalendar } from "@/components/EventCalendar";
import { Header } from "@/components/Header";
import dynamic from "next/dynamic";
import { Inter, Work_Sans } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });
const workSans = Work_Sans({ subsets: ["latin"] });

const EventCalendarDynamic = dynamic(
  () => import("@/components/EventCalendar").then((mod) => mod.EventCalendar),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <Head>
        <title>Simple Event Schedular</title>
        <meta
          name="description"
          content="A simple event calendar built with Next.js"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main
        className={`min-h-[120vh] py-12 lg:py-24 px-4 lg:px-8 max-w-[1080px] mx-auto ${inter.className} ${workSans.className}`}
      >
        <EventCalendarDynamic />
      </main>
    </>
  );
}
