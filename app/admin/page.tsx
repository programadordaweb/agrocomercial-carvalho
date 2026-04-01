"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface CompanyData {
  name: string;
  slogan: string;
  address: string;
  phone: string;
  phoneRaw: string;
  whatsappLink: string;
  whatsappMessage?: string;
  rating: number;
  reviewCount: number;
  mapsEmbed: string;
  mapsLink: string;
}

interface Review {
  name: string;
  text: string;
  stars: number;
}

interface Schedule {
  day: string;
  hours: string;
  open: boolean;
}

interface ChartPoint {
  date: string;
  label: string;
  visits: number;
  whatsapp: number;
}

interface DayDetail {
  date: string;
  visits: number;
  whatsappClicks: number;
  visitsList: { time: string; page: string; referrer: string }[];
  clicksList: { time: string; page: string }[];
}

interface AnalyticsData {
  totalVisits: number;
  totalClicks: number;
  todayVisits: number;
  todayClicks: number;
  last30Visits: number;
  last30Clicks: number;
  chartData: ChartPoint[];
  recentWhatsApp: { timestamp: string; page: string }[];
  dayDetail: DayDetail | null;
  daysWithData: Record<string, { visits: number; clicks: number }>;
}

type Tab = "analytics" | "empresa" | "horarios" | "avaliacoes";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("analytics");
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const ADMIN_PASS = "agro2024";

  const loadData = useCallback((date?: string | null) => {
    const url = date ? `/api/analytics?date=${date}` : "/api/analytics";
    Promise.all([
      fetch("/api/admin").then((r) => r.json()),
      fetch(url).then((r) => r.json()),
    ]).then(([adminData, analyticsData]) => {
      setCompany(adminData.companyData);
      setReviews(adminData.reviews || []);
      setSchedule(adminData.schedule || []);
      setAnalytics(analyticsData);
      setLoading(false);
    });
  }, []);

  const selectDate = (date: string) => {
    setSelectedDate(date);
    fetch(`/api/analytics?date=${date}`)
      .then((r) => r.json())
      .then((d) => setAnalytics(d));
  };

  useEffect(() => {
    if (authenticated) loadData();
  }, [authenticated, loadData]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASS) {
      setAuthenticated(true);
    } else {
      setMessage("Senha incorreta");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const save = async (section: string, data: Record<string, unknown>) => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) setMessage(`${section} salvo com sucesso!`);
      else setMessage("Erro ao salvar.");
    } catch {
      setMessage("Erro de conexão.");
    }
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  };

  // ── Login screen ──
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <form
          onSubmit={handleLogin}
          className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm relative"
        >
          <a
            href="/"
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            title="Voltar ao site"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </a>
          <div className="flex justify-center mb-6">
            <Image src="/logo.jpg" alt="Logo" width={64} height={64} className="rounded-xl" />
          </div>
          <h1 className="text-xl font-bold text-center text-gray-800 mb-1">Painel Admin</h1>
          <p className="text-sm text-gray-500 text-center mb-6">Agrocomercial Carvalho</p>
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha de acesso"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Entrar
          </button>
          {message && <p className="text-red-500 text-sm text-center mt-3">{message}</p>}
        </form>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-green-200 border-t-green-700 rounded-full animate-spin" />
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "analytics", label: "Analytics", icon: "📊" },
    { key: "empresa", label: "Empresa", icon: "🏪" },
    { key: "horarios", label: "Horários", icon: "🕐" },
    { key: "avaliacoes", label: "Avaliações", icon: "⭐" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.jpg" alt="Logo" width={36} height={36} className="rounded-lg" />
            <div>
              <h1 className="text-sm font-bold text-gray-800">Painel Admin</h1>
              <p className="text-xs text-gray-400">Agrocomercial Carvalho</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-xs text-gray-500 hover:text-gray-800 transition-colors">Ver site</a>
            <button onClick={() => setAuthenticated(false)} className="text-xs text-red-500 hover:text-red-700 transition-colors">Sair</button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Toast */}
        {message && (
          <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium ${message.includes("sucesso") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-green-700 text-white shadow-lg shadow-green-700/20"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Analytics Tab ── */}
        {activeTab === "analytics" && analytics && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Visitas hoje" value={analytics.todayVisits} icon="👁" color="blue" />
              <StatCard label="WhatsApp hoje" value={analytics.todayClicks} icon="💬" color="green" />
              <StatCard label="Visitas (30d)" value={analytics.last30Visits} icon="📈" color="purple" />
              <StatCard label="WhatsApp (30d)" value={analytics.last30Clicks} icon="📱" color="yellow" />
            </div>

            {/* Line Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800">Visitantes e Contatos</h2>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-blue-500" />
                    Visitas
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                    WhatsApp
                  </span>
                </div>
              </div>
              <LineChart data={analytics.chartData} onSelectDate={selectDate} />
            </div>

            {/* Calendar + Day Detail */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Calendario</h2>
                <Calendar
                  month={calendarMonth.month}
                  year={calendarMonth.year}
                  onChangeMonth={(y, m) => setCalendarMonth({ year: y, month: m })}
                  selectedDate={selectedDate}
                  onSelectDate={selectDate}
                  daysWithData={analytics.daysWithData || {}}
                />
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  {selectedDate
                    ? `Detalhes - ${new Date(selectedDate + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}`
                    : "Selecione um dia"}
                </h2>
                {analytics.dayDetail ? (
                  <div>
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold text-gray-800">{analytics.dayDetail.visits}</p>
                        <p className="text-xs text-gray-500">Visitas</p>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold text-gray-800">{analytics.dayDetail.whatsappClicks}</p>
                        <p className="text-xs text-gray-500">WhatsApp</p>
                      </div>
                    </div>
                    {analytics.dayDetail.visitsList.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Visitas</p>
                        <div className="space-y-1.5 max-h-40 overflow-y-auto">
                          {analytics.dayDetail.visitsList.map((v, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs p-2 bg-gray-50 rounded-lg">
                              <span className="text-blue-500 font-mono font-medium">{v.time}</span>
                              <span className="text-gray-600">{v.page}</span>
                              {v.referrer && <span className="text-gray-400 truncate max-w-[120px]">via {v.referrer}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {analytics.dayDetail.clicksList.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Cliques WhatsApp</p>
                        <div className="space-y-1.5 max-h-40 overflow-y-auto">
                          {analytics.dayDetail.clicksList.map((c, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs p-2 bg-green-50 rounded-lg">
                              <span className="text-green-600 font-mono font-medium">{c.time}</span>
                              <span className="text-gray-600">{c.page}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {analytics.dayDetail.visitsList.length === 0 && analytics.dayDetail.clicksList.length === 0 && (
                      <p className="text-gray-400 text-sm text-center py-4">Nenhum acesso neste dia.</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm text-center py-10">Clique em um dia no calendario ou no grafico para ver os detalhes.</p>
                )}
              </div>
            </div>

            {/* Recent WhatsApp contacts */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Contatos recentes via WhatsApp</h2>
              {analytics.recentWhatsApp.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-6">Nenhum contato registrado ainda.</p>
              ) : (
                <div className="space-y-2">
                  {analytics.recentWhatsApp.map((item, i) => {
                    const d = new Date(item.timestamp);
                    return (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm">💬</span>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Clicou no WhatsApp</p>
                            <p className="text-xs text-gray-400">Pagina: {item.page}</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">
                          {d.toLocaleDateString("pt-BR")} {d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Empresa Tab ── */}
        {activeTab === "empresa" && company && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Dados da Empresa</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Nome da empresa" value={company.name} onChange={(v) => setCompany({ ...company, name: v })} />
              <Field label="Slogan" value={company.slogan} onChange={(v) => setCompany({ ...company, slogan: v })} />
              <Field label="Endereço" value={company.address} onChange={(v) => setCompany({ ...company, address: v })} className="md:col-span-2" />
              <Field label="Telefone (exibição)" value={company.phone} onChange={(v) => setCompany({ ...company, phone: v })} />
              <Field label="Telefone (número puro)" value={company.phoneRaw} onChange={(v) => setCompany({ ...company, phoneRaw: v })} />
              <Field label="Nota Google" value={String(company.rating)} onChange={(v) => setCompany({ ...company, rating: parseFloat(v) || 0 })} />
              <Field label="Total de avaliações" value={String(company.reviewCount)} onChange={(v) => setCompany({ ...company, reviewCount: parseInt(v) || 0 })} />
              <Field
                label="Mensagem WhatsApp"
                value={company.whatsappMessage || decodeURIComponent(company.whatsappLink.split("?text=")[1] || "")}
                onChange={(v) => setCompany({ ...company, whatsappMessage: v })}
                className="md:col-span-2"
              />
            </div>
            <button onClick={() => save("Dados da empresa", { companyData: company })} disabled={saving} className="mt-6 bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors">
              {saving ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        )}

        {/* ── Horarios Tab ── */}
        {activeTab === "horarios" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Horários de Funcionamento</h2>
            <div className="space-y-3">
              {schedule.map((item, i) => (
                <div key={item.day} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50">
                  <span className="w-36 text-sm font-medium text-gray-700">{item.day}</span>
                  <input
                    type="text"
                    value={item.hours}
                    onChange={(e) => { const u = [...schedule]; u[i] = { ...item, hours: e.target.value }; setSchedule(u); }}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                  />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.open}
                      onChange={(e) => { const u = [...schedule]; u[i] = { ...item, open: e.target.checked }; setSchedule(u); }}
                      className="w-4 h-4 accent-green-700 cursor-pointer"
                    />
                    <span className="text-xs text-gray-500">Aberto</span>
                  </label>
                </div>
              ))}
            </div>
            <button onClick={() => save("Horários", { schedule })} disabled={saving} className="mt-6 bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors">
              {saving ? "Salvando..." : "Salvar horários"}
            </button>
          </div>
        )}

        {/* ── Avaliacoes Tab ── */}
        {activeTab === "avaliacoes" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">Avaliações</h2>
              <button onClick={() => setReviews([...reviews, { name: "", text: "", stars: 5 }])} className="text-sm bg-green-50 text-green-700 hover:bg-green-100 font-medium px-4 py-2 rounded-xl transition-colors border border-green-200">
                + Adicionar
              </button>
            </div>
            <div className="space-y-4">
              {reviews.map((review, i) => (
                <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Nome do cliente"
                      value={review.name}
                      onChange={(e) => { const u = [...reviews]; u[i] = { ...review, name: e.target.value }; setReviews(u); }}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                    />
                    <select
                      value={review.stars}
                      onChange={(e) => { const u = [...reviews]; u[i] = { ...review, stars: parseInt(e.target.value) }; setReviews(u); }}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                    >
                      {[5, 4, 3, 2, 1].map((s) => (
                        <option key={s} value={s}>{"★".repeat(s)}{"☆".repeat(5 - s)}</option>
                      ))}
                    </select>
                    <button onClick={() => setReviews(reviews.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 text-lg px-2 transition-colors" title="Remover">✕</button>
                  </div>
                  <textarea
                    placeholder="Texto da avaliação"
                    value={review.text}
                    onChange={(e) => { const u = [...reviews]; u[i] = { ...review, text: e.target.value }; setReviews(u); }}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-gray-800"
                  />
                </div>
              ))}
              {reviews.length === 0 && <p className="text-gray-400 text-sm text-center py-8">Nenhuma avaliação cadastrada.</p>}
            </div>
            <button onClick={() => save("Avaliações", { reviews })} disabled={saving} className="mt-6 bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors">
              {saving ? "Salvando..." : "Salvar avaliações"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Stat Card ──
function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    purple: "bg-purple-50 border-purple-200",
    yellow: "bg-yellow-50 border-yellow-200",
  };
  return (
    <div className={`rounded-2xl border p-4 ${colors[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}

// ── Line Chart (SVG) ──
function LineChart({ data, onSelectDate }: { data: ChartPoint[]; onSelectDate: (d: string) => void }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 700, H = 220, PAD_L = 40, PAD_R = 10, PAD_T = 15, PAD_B = 30;
  const cw = W - PAD_L - PAD_R;
  const ch = H - PAD_T - PAD_B;

  const maxVal = Math.max(...data.map((d) => Math.max(d.visits, d.whatsapp)), 1);
  const steps = 4;

  const x = (i: number) => PAD_L + (i / (data.length - 1)) * cw;
  const y = (v: number) => PAD_T + ch - (v / maxVal) * ch;

  const makePath = (key: "visits" | "whatsapp") => {
    if (data.length === 0) return "";
    return data
      .map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p[key]).toFixed(1)}`)
      .join(" ");
  };

  const makeArea = (key: "visits" | "whatsapp") => {
    if (data.length === 0) return "";
    const line = data.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p[key]).toFixed(1)}`).join(" ");
    return `${line} L${x(data.length - 1).toFixed(1)},${(PAD_T + ch).toFixed(1)} L${PAD_L},${(PAD_T + ch).toFixed(1)} Z`;
  };

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[500px]" style={{ height: 240 }}>
        {/* Grid */}
        {Array.from({ length: steps + 1 }).map((_, i) => {
          const val = Math.round((maxVal / steps) * (steps - i));
          const yy = PAD_T + (i / steps) * ch;
          return (
            <g key={i}>
              <line x1={PAD_L} y1={yy} x2={W - PAD_R} y2={yy} stroke="#e5e7eb" strokeDasharray="4 3" />
              <text x={PAD_L - 6} y={yy + 4} textAnchor="end" fontSize="10" fill="#9ca3af">{val}</text>
            </g>
          );
        })}

        {/* X labels */}
        {data.map((p, i) => {
          if (i % 5 !== 0 && i !== data.length - 1) return null;
          return (
            <text key={i} x={x(i)} y={H - 5} textAnchor="middle" fontSize="9" fill="#9ca3af">{p.label}</text>
          );
        })}

        {/* Area fills */}
        <path d={makeArea("visits")} fill="rgba(59,130,246,0.08)" />
        <path d={makeArea("whatsapp")} fill="rgba(34,197,94,0.08)" />

        {/* Lines */}
        <path d={makePath("visits")} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d={makePath("whatsapp")} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots */}
        {data.map((p, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(p.visits)} r={hover === i ? 5 : 3} fill="#3b82f6" className="transition-all duration-150" />
            <circle cx={x(i)} cy={y(p.whatsapp)} r={hover === i ? 5 : 3} fill="#22c55e" className="transition-all duration-150" />
          </g>
        ))}

        {/* Hover areas */}
        {data.map((p, i) => {
          const hw = cw / data.length;
          return (
            <rect
              key={`h${i}`}
              x={x(i) - hw / 2}
              y={PAD_T}
              width={hw}
              height={ch}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onSelectDate(p.date)}
            />
          );
        })}

        {/* Hover line + tooltip */}
        {hover !== null && data[hover] && (
          <>
            <line x1={x(hover)} y1={PAD_T} x2={x(hover)} y2={PAD_T + ch} stroke="#6b7280" strokeDasharray="3 3" strokeWidth="1" />
            <rect x={x(hover) - 60} y={2} width={120} height={38} rx={6} fill="#1f2937" />
            <text x={x(hover)} y={16} textAnchor="middle" fontSize="10" fill="#e5e7eb" fontWeight="600">{data[hover].label}</text>
            <text x={x(hover) - 30} y={32} fontSize="9" fill="#93c5fd">{data[hover].visits} visitas</text>
            <text x={x(hover) + 20} y={32} fontSize="9" fill="#86efac">{data[hover].whatsapp} wpp</text>
          </>
        )}
      </svg>
    </div>
  );
}

// ── Calendar ──
function Calendar({
  month, year, onChangeMonth, selectedDate, onSelectDate, daysWithData,
}: {
  month: number;
  year: number;
  onChangeMonth: (y: number, m: number) => void;
  selectedDate: string | null;
  onSelectDate: (d: string) => void;
  daysWithData: Record<string, { visits: number; clicks: number }>;
}) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date().toISOString().split("T")[0];
  const monthName = new Date(year, month).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  const prevMonth = () => {
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year - 1 : year;
    onChangeMonth(y, m);
  };
  const nextMonth = () => {
    const m = month === 11 ? 0 : month + 1;
    const y = month === 11 ? year + 1 : year;
    onChangeMonth(y, m);
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span className="text-sm font-semibold text-gray-700 capitalize">{monthName}</span>
        <button onClick={nextMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
          <div key={d} className="text-[10px] font-semibold text-gray-400 py-1">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`e${i}`} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const hasData = daysWithData[dateStr];
          const isSelected = selectedDate === dateStr;
          const isToday = dateStr === today;
          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={`relative p-1.5 text-xs rounded-lg transition-all ${
                isSelected
                  ? "bg-green-700 text-white font-bold"
                  : isToday
                  ? "bg-green-100 text-green-800 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {day}
              {hasData && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {hasData.visits > 0 && <span className="w-1 h-1 rounded-full bg-blue-400" />}
                  {hasData.clicks > 0 && <span className="w-1 h-1 rounded-full bg-green-400" />}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Field ──
function Field({ label, value, onChange, className = "" }: { label: string; value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
      />
    </div>
  );
}
