"use client"

import { useState, useEffect } from "react"
import { LogOut, Menu, X, LogIn } from "lucide-react"
import { useAuth } from "../context/auth-context"
import { useLanguage } from "../context/language-context"
import { currencies } from "../i18n"
import { getUserPoopSessions, PoopSession, updateCurrencyCode, updateAnnualSalary } from "../lib/supabase-client"
import { ForgotPassword } from "./forgot-password"

export function Sidebar() {
  const { user, profile, signUp, signIn, signOut, refreshProfile } = useAuth()
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthMode, setIsAuthMode] = useState<"login" | "signup" | "forgot">("login")
  const [activeTab, setActiveTab] = useState<"profile" | "history">("profile")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedCurrency, setSelectedCurrency] = useState("EUR")
  const [annualSalary, setAnnualSalary] = useState("")
  const [sessions, setSessions] = useState<PoopSession[]>([])
  const [loadingSessions, setLoadingSessions] = useState(false)
  const [editingCurrency, setEditingCurrency] = useState(false)
  const [editingAnnualSalary, setEditingAnnualSalary] = useState(false)
  const [tempCurrency, setTempCurrency] = useState("")
  const [tempAnnualSalary, setTempAnnualSalary] = useState("")
  const [savingChanges, setSavingChanges] = useState(false)

  // Inicializar valores temporales cuando cambia el perfil
  useEffect(() => {
    if (profile) {
      setTempCurrency(profile.currency_code || "EUR")
      setTempAnnualSalary((profile.annual_salary || 0).toString())
    }
  }, [profile])

  // Cargar sesiones cuando el usuario esté autenticado o cuando se abre el sidebar
  useEffect(() => {
    if (user && isOpen) {
      loadSessions()
    }
  }, [user, isOpen])

  // Recargar sesiones cuando el perfil cambia (después de crear una nueva sesión)
  useEffect(() => {
    if (user && isOpen && profile) {
      loadSessions()
    }
  }, [user, isOpen, profile?.total_earnings])

  const loadSessions = async () => {
    if (!user) return
    try {
      setLoadingSessions(true)
      const data = await getUserPoopSessions(user.id)
      setSessions(data)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : JSON.stringify(err)
      console.error("Error cargando sesiones:", errorMsg)
    } finally {
      setLoadingSessions(false)
    }
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`
    }
    return `${secs}s`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isAuthMode === "login") {
        await signIn(email, password)
      } else {
        await signUp(email, password, selectedCurrency, Number(annualSalary) || 0)
      }
      setEmail("")
      setPassword("")
      setAnnualSalary("")
      setIsOpen(false)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : JSON.stringify(err)
      console.error("Auth error details:", err)
      setError(errorMsg || "Error de autenticación")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      setIsOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cerrar sesión")
    }
  }

  const handleSaveCurrency = async () => {
    if (!user || !profile) return
    try {
      setSavingChanges(true)
      await updateCurrencyCode(user.id, tempCurrency)
      await refreshProfile()
      setEditingCurrency(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar moneda")
    } finally {
      setSavingChanges(false)
    }
  }

  const handleSaveAnnualSalary = async () => {
    if (!user || !profile) return
    try {
      setSavingChanges(true)
      await updateAnnualSalary(user.id, Number(tempAnnualSalary) || 0)
      await refreshProfile()
      setEditingAnnualSalary(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar salario")
    } finally {
      setSavingChanges(false)
    }
  }

  const handleCancelCurrency = () => {
    setTempCurrency(profile?.currency_code || "EUR")
    setEditingCurrency(false)
  }

  const handleCancelAnnualSalary = () => {
    setTempAnnualSalary((profile?.annual_salary || 0).toString())
    setEditingAnnualSalary(false)
  }

  return (
    <>
      {/* Botón de toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
        aria-label="Abrir menú"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay - Solo en móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 pointer-events-auto md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{ backgroundColor: "#fff8f0" }}
        className={`fixed left-0 top-0 h-screen w-72 md:w-80 border-r border-border p-6 shadow-xl transition-transform duration-300 z-40 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="mb-8 pt-12 md:pt-0">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            <span className="text-3xl mr-2">💩</span>Poop Salary
          </h2>
          <p className="text-sm text-muted-foreground">{t.subtitle}</p>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto">
          {user && profile ? (
            // Usuario autenticado
            <div className="space-y-4 flex flex-col h-full">
              {/* Perfil del usuario */}
              <div className="bg-muted rounded-2xl p-4 border border-border">
                <p className="text-xs text-muted-foreground uppercase mb-1">
                  {t.loggedInAs || "Conectado como"}
                </p>
                <p className="font-semibold text-foreground break-all">{user.email}</p>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 bg-muted rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex-1 py-2 px-3 rounded-md font-semibold transition-all duration-200 text-sm cursor-pointer ${
                    activeTab === "profile"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Perfil
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`flex-1 py-2 px-3 rounded-md font-semibold transition-all duration-200 text-sm cursor-pointer ${
                    activeTab === "history"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Historial
                </button>
              </div>

              {/* Contenido de los tabs */}
              <div className="flex-1 overflow-y-auto">
                {activeTab === "profile" ? (
                  // Tab Perfil
                  <div className="space-y-3">
                    <h3 className="font-bold text-foreground text-sm uppercase">{t.statistics || "Estadísticas"}</h3>

                    <div className="bg-muted rounded-2xl p-3 border border-border">
                      <p className="text-xs text-muted-foreground mb-1">{t.lifetimeTotal}</p>
                      <p className="text-xl font-bold text-accent">
                        {profile?.currency_code || "EUR"} {(profile?.total_earnings || 0).toFixed(4)}
                      </p>
                    </div>

                    <div className="bg-muted rounded-2xl p-3 border border-border">
                      <p className="text-xs text-muted-foreground mb-1">{t.currency}</p>
                      {editingCurrency ? (
                        <div className="space-y-2">
                          <select
                            value={tempCurrency}
                            onChange={(e) => setTempCurrency(e.target.value)}
                            className="w-full px-3 py-2 bg-background border-2 border-border rounded-lg focus:border-primary outline-none transition-colors duration-200 cursor-pointer text-sm"
                          >
                            {currencies.map((c) => (
                              <option key={c.code} value={c.code}>
                                {c.symbol} {c.code} - {c.name}
                              </option>
                            ))}
                          </select>
                          <div className="flex gap-2">
                            <button
                              onClick={handleSaveCurrency}
                              disabled={savingChanges}
                              className="flex-1 bg-primary text-primary-foreground font-semibold py-2 rounded-lg hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50 cursor-pointer text-sm"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={handleCancelCurrency}
                              disabled={savingChanges}
                              className="flex-1 bg-muted-foreground/20 text-foreground font-semibold py-2 rounded-lg hover:bg-muted-foreground/30 transition-colors duration-200 disabled:opacity-50 cursor-pointer text-sm"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="font-semibold text-foreground mb-2">{profile?.currency_code || "EUR"}</p>
                          <button
                            onClick={() => setEditingCurrency(true)}
                            className="text-xs text-primary hover:text-primary/80 font-semibold cursor-pointer transition-colors"
                          >
                            Editar
                          </button>
                        </>
                      )}
                    </div>

                    {profile?.annual_salary ? (
                      <div className="bg-muted rounded-2xl p-3 border border-border">
                        <p className="text-xs text-muted-foreground mb-1">Salario Anual Configurado</p>
                        {editingAnnualSalary ? (
                          <div className="space-y-2">
                            <input
                              type="number"
                              value={tempAnnualSalary}
                              onChange={(e) => setTempAnnualSalary(e.target.value)}
                              className="w-full px-3 py-2 bg-background border-2 border-border rounded-lg focus:border-primary outline-none transition-colors duration-200 text-sm"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={handleSaveAnnualSalary}
                                disabled={savingChanges}
                                className="flex-1 bg-primary text-primary-foreground font-semibold py-2 rounded-lg hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50 cursor-pointer text-sm"
                              >
                                Guardar
                              </button>
                              <button
                                onClick={handleCancelAnnualSalary}
                                disabled={savingChanges}
                                className="flex-1 bg-muted-foreground/20 text-foreground font-semibold py-2 rounded-lg hover:bg-muted-foreground/30 transition-colors duration-200 disabled:opacity-50 cursor-pointer text-sm"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="font-semibold text-foreground mb-2">
                              {profile?.currency_code || "EUR"} {(profile?.annual_salary || 0).toFixed(0)}
                            </p>
                            <button
                              onClick={() => setEditingAnnualSalary(true)}
                              className="text-xs text-primary hover:text-primary/80 font-semibold cursor-pointer transition-colors"
                            >
                              Editar
                            </button>
                          </>
                        )}
                      </div>
                    ) : null}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 font-semibold py-3 rounded-xl transition-colors duration-200 cursor-pointer mt-4"
                    >
                      <LogOut className="w-4 h-4" />
                      {t.logout || "Cerrar Sesión"}
                    </button>
                  </div>
                ) : (
                  // Tab Historial
                  <div className="space-y-2">
                    <h3 className="font-bold text-foreground text-sm uppercase">Historial de Sesiones</h3>

                    {loadingSessions ? (
                      <div className="text-center py-4 text-muted-foreground text-sm">Cargando...</div>
                    ) : sessions.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground text-sm">
                        No hay sesiones registradas aún
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {sessions.map((session) => (
                          <div key={session.id} className="bg-muted rounded-lg p-3 border border-border text-sm">
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-muted-foreground text-xs">{formatDate(session.created_at)}</span>
                              <span className="font-bold text-accent">
                                {session.currency_code} {session.earned_money.toFixed(4)}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Duración: {formatDuration(session.duration_seconds)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Usuario no autenticado
            <>
              {isAuthMode === "forgot" ? (
                <ForgotPassword onBack={() => setIsAuthMode("login")} />
              ) : (
                <div className="space-y-6">
                  {/* Toggle entre Login y Signup */}
                  <div className="flex gap-2 bg-muted rounded-lg p-1">
                    <button
                      onClick={() => {
                        setIsAuthMode("login")
                        setError("")
                      }}
                      className={`flex-1 py-2 px-3 rounded-md font-semibold transition-all duration-200 text-sm cursor-pointer ${
                        isAuthMode === "login"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t.login || "Iniciar Sesión"}
                    </button>
                    <button
                      onClick={() => {
                        setIsAuthMode("signup")
                        setError("")
                      }}
                      className={`flex-1 py-2 px-3 rounded-md font-semibold transition-all duration-200 text-sm cursor-pointer ${
                        isAuthMode === "signup"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t.signup || "Registrarse"}
                    </button>
                  </div>

                  {/* Formulario */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        required
                        className="w-full px-4 py-2 bg-muted border-2 border-border rounded-lg focus:border-primary outline-none transition-colors duration-200"
                      />
                    </div>

                    {/* Contraseña */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Contraseña</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full px-4 py-2 bg-muted border-2 border-border rounded-lg focus:border-primary outline-none transition-colors duration-200"
                      />
                    </div>

                    {/* Enlace olvidé contraseña (solo en login) */}
                    {isAuthMode === "login" && (
                      <button
                        type="button"
                        onClick={() => setIsAuthMode("forgot")}
                        className="text-xs text-primary hover:text-primary/80 font-semibold cursor-pointer transition-colors"
                      >
                        {t.forgotPassword}
                      </button>
                    )}

                    {/* Selector de moneda para signup */}
                    {isAuthMode === "signup" && (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-foreground">{t.currency}</label>
                          <select
                            value={selectedCurrency}
                            onChange={(e) => setSelectedCurrency(e.target.value)}
                            className="w-full px-4 py-2 bg-muted border-2 border-border rounded-lg focus:border-primary outline-none transition-colors duration-200 cursor-pointer"
                          >
                            {currencies.map((c) => (
                              <option key={c.code} value={c.code}>
                                {c.symbol} {c.code} - {c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-foreground">{t.salaryLabel}</label>
                          <input
                            type="number"
                            value={annualSalary}
                            onChange={(e) => setAnnualSalary(e.target.value)}
                            placeholder={t.salaryPlaceholder}
                            className="w-full px-4 py-2 bg-muted border-2 border-border rounded-lg focus:border-primary outline-none transition-colors duration-200"
                          />
                        </div>
                      </>
                    )}

                    {/* Mensaje de error */}
                    {error && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-600">
                        {error}
                      </div>
                    )}

                    {/* Botón submit */}
                    <button
                      type="submit"
                      disabled={loading || !email || !password}
                      className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <LogIn className="w-4 h-4" />
                      {loading
                        ? isAuthMode === "login"
                          ? t.signingIn || "Iniciando..."
                          : t.signingUp || "Registrando..."
                        : isAuthMode === "login"
                          ? t.login || "Iniciar Sesión"
                          : t.signup || "Registrarse"}
                    </button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-border text-xs text-muted-foreground">
          <p>Powered by Supabase 🚀</p>
        </div>
      </aside>
    </>
  )
}
