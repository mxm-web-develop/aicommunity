import { readJSONFile } from "@/lib/getdata"
import Header from "../(serverComponents)/Header"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const brandingData = await readJSONFile('web/home.json')

  const navs = brandingData['navs']
  return (
    <div className=' flex-col bg-theme-dark text-theme-white h-dvh w-full '>
      <Header data={navs} />
      <main className="pt-[45px] ">
        <section className="vedios py-3 w-full px-3 lg:w-10/12 mx-auto">
          {children}
        </section>
      </main>
      <footer className="px-5 py-3 w-full text-center text-theme-white/50">
        power by MxM_Ai
      </footer>
    </div>
  )
}

