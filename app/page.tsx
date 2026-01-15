import { PoopSalaryApp } from "./components/poop-salary-app"
import { LanguageProvider } from "./context/language-context"

export default function Home() {
  return (
    <LanguageProvider>
      <main className="min-h-screen bg-background">
        <PoopSalaryApp />
      </main>
    </LanguageProvider>
  )
}
