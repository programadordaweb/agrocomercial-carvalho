"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

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

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [calMonth, setCalMonth] = useState(() => {
    const n = new Date();
    return { year: n.getFullYear(), month: n.getMonth() };
  });

  const ADMIN_PASS = "agro2024";

  const loadAnalytics = useCallback((date?: string | null) => {
    const url = date ? `/api/analytics?date=${date}` : "/api/analytics";
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          setError(d.error);
        } else {
          setAnalytics(d);
          setError("");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Erro de conexão");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (authenticated) loadAnalytics();
  }, [authenticated, loadAnalytics]);

  const selectDate = (date: string) => {
    setSelectedDate(date);
    loadAnalytics(date);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASS) setAuthenticated(true);
    else setError("Senha incorreta");
  };

  // ── Login ──
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm relative">
          <a href="/" className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors" title="Voltar ao site">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
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
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              )}
            </button>
          </div>
          <button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl transition-colors">Entrar</button>
          {error && <p className="text-red-500 text-sm text-center mt-3">{error}</p>}
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

  if (error && !analytics) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-sm">
          <p className="text-red-500 font-medium mb-4">{error}</p>
          <button onClick={() => { setLoading(true); loadAnalytics(); }} className="bg-green-700 text-white px-6 py-2 rounded-xl">Tentar novamente</button>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="min-h-screen bg-gray-100">
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
            <a href="/" className="text-xs text-gray-500 hover:text-gray-800">Ver site</a>
            <button onClick={() => setAuthenticated(false)} className="text-xs text-red-500 hover:text-red-700">Sair</button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Visitas hoje" value={analytics.todayVisits} color="bg-blue-50 border-blue-200" />
          <StatCard label="WhatsApp hoje" value={analytics.todayClicks} color="bg-green-50 border-green-200" />
          <StatCard label="Visitas (30d)" value={analytics.last30Visits} color="bg-purple-50 border-purple-200" />
          <StatCard label="WhatsApp (30d)" value={analytics.last30Clicks} color="bg-yellow-50 border-yellow-200" />
        </div>

        {/* Line Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800">Visitantes e Contatos</h2>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500" />Visitas</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500" />WhatsApp</span>
            </div>
          </div>
          <LineChart data={analytics.chartData} onSelectDate={selectDate} />
        </div>

        {/* Calendar + Day Detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Calendario</h2>
            <Calendar month={calMonth.month} year={calMonth.year} onChangeMonth={(y, m) => setCalMonth({ year: y, month: m })} selectedDate={selectedDate} onSelectDate={selectDate} daysWithData={analytics.daysWithData || {}} />
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {selectedDate ? `Detalhes - ${new Date(selectedDate + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}` : "Selecione um dia"}
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
                    <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Visitas</p>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {analytics.dayDetail.visitsList.map((v, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs p-2 bg-gray-50 rounded-lg">
                          <span className="text-blue-500 font-mono font-medium">{v.time}</span>
                          <span className="text-gray-600">{v.page}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {analytics.dayDetail.clicksList.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Cliques WhatsApp</p>
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
              <p className="text-gray-400 text-sm text-center py-10">Clique em um dia no calendario ou no grafico.</p>
            )}
          </div>
        </div>

        {/* Recent WhatsApp */}
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
                      <p className="text-sm font-medium text-gray-700">Clicou no WhatsApp</p>
                    </div>
                    <span className="text-xs text-gray-400">{d.toLocaleDateString("pt-BR")} {d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`rounded-2xl border p-4 ${color}`}>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function LineChart({ data, onSelectDate }: { data: ChartPoint[]; onSelectDate: (d: string) => void }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 700, H = 220, PL = 40, PR = 10, PT = 15, PB = 30;
  const cw = W - PL - PR, ch = H - PT - PB;
  const maxVal = Math.max(...data.map((d) => Math.max(d.visits, d.whatsapp)), 1);
  const x = (i: number) => PL + (i / (data.length - 1)) * cw;
  const y = (v: number) => PT + ch - (v / maxVal) * ch;
  const makePath = (key: "visits" | "whatsapp") => data.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p[key]).toFixed(1)}`).join(" ");
  const makeArea = (key: "visits" | "whatsapp") => `${makePath(key)} L${x(data.length - 1).toFixed(1)},${(PT + ch).toFixed(1)} L${PL},${(PT + ch).toFixed(1)} Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[500px]" style={{ height: 240 }}>
        {Array.from({ length: 5 }).map((_, i) => {
          const val = Math.round((maxVal / 4) * (4 - i));
          const yy = PT + (i / 4) * ch;
          return (<g key={i}><line x1={PL} y1={yy} x2={W - PR} y2={yy} stroke="#e5e7eb" strokeDasharray="4 3" /><text x={PL - 6} y={yy + 4} textAnchor="end" fontSize="10" fill="#9ca3af">{val}</text></g>);
        })}
        {data.map((p, i) => (i % 5 === 0 || i === data.length - 1) ? <text key={i} x={x(i)} y={H - 5} textAnchor="middle" fontSize="9" fill="#9ca3af">{p.label}</text> : null)}
        <path d={makeArea("visits")} fill="rgba(59,130,246,0.08)" />
        <path d={makeArea("whatsapp")} fill="rgba(34,197,94,0.08)" />
        <path d={makePath("visits")} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d={makePath("whatsapp")} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((p, i) => (<g key={i}><circle cx={x(i)} cy={y(p.visits)} r={hover === i ? 5 : 3} fill="#3b82f6" /><circle cx={x(i)} cy={y(p.whatsapp)} r={hover === i ? 5 : 3} fill="#22c55e" /></g>))}
        {data.map((p, i) => <rect key={`h${i}`} x={x(i) - cw / data.length / 2} y={PT} width={cw / data.length} height={ch} fill="transparent" className="cursor-pointer" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onClick={() => onSelectDate(p.date)} />)}
        {hover !== null && data[hover] && (<><line x1={x(hover)} y1={PT} x2={x(hover)} y2={PT + ch} stroke="#6b7280" strokeDasharray="3 3" /><rect x={x(hover) - 60} y={2} width={120} height={38} rx={6} fill="#1f2937" /><text x={x(hover)} y={16} textAnchor="middle" fontSize="10" fill="#e5e7eb" fontWeight="600">{data[hover].label}</text><text x={x(hover) - 30} y={32} fontSize="9" fill="#93c5fd">{data[hover].visits} visitas</text><text x={x(hover) + 20} y={32} fontSize="9" fill="#86efac">{data[hover].whatsapp} wpp</text></>)}
      </svg>
    </div>
  );
}

function Calendar({ month, year, onChangeMonth, selectedDate, onSelectDate, daysWithData }: { month: number; year: number; onChangeMonth: (y: number, m: number) => void; selectedDate: string | null; onSelectDate: (d: string) => void; daysWithData: Record<string, { visits: number; clicks: number }> }) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date().toISOString().split("T")[0];
  const monthName = new Date(year, month).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const prev = () => onChangeMonth(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1);
  const next = () => onChangeMonth(month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1);
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={prev} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg></button>
        <span className="text-sm font-semibold text-gray-700 capitalize">{monthName}</span>
        <button onClick={next} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((d) => <div key={d} className="text-[10px] font-semibold text-gray-400 py-1">{d}</div>)}
        {cells.map((day, i) => {
          if (day === null) return <div key={`e${i}`} />;
          const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const has = daysWithData[ds];
          const sel = selectedDate === ds;
          const isTd = ds === today;
          return (
            <button key={ds} onClick={() => onSelectDate(ds)} className={`relative p-1.5 text-xs rounded-lg transition-all ${sel ? "bg-green-700 text-white font-bold" : isTd ? "bg-green-100 text-green-800 font-semibold" : "text-gray-700 hover:bg-gray-100"}`}>
              {day}
              {has && !sel && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">{has.visits > 0 && <span className="w-1 h-1 rounded-full bg-blue-400" />}{has.clicks > 0 && <span className="w-1 h-1 rounded-full bg-green-400" />}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
