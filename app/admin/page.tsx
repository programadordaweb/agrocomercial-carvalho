"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { saveCompanyData, saveSchedule, saveReviews } from "@/lib/actions";

interface CompanyData { name: string; slogan: string; address: string; phone: string; phoneRaw: string; whatsappMessage: string; rating: number; reviewCount: number; mapsEmbed: string; mapsLink: string; }
interface Review { name: string; text: string; stars: number; }
interface Schedule { day: string; hours: string; open: boolean; }

type Tab = "empresa" | "horarios" | "avaliacoes";

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [tab, setTab] = useState<Tab>("empresa");
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) return;
    // Carrega dados atuais do site (que vem do banco via server component)
    fetch("/")
      .then((r) => r.text())
      .then((html) => {
        // Extrai dados do __NEXT_DATA__ ou usa fetch da API
        // Melhor: fazer um fetch direto para a API do admin
      });
    // Usar a API admin para carregar dados
    fetch("/api/admin-data")
      .then((r) => r.json())
      .then((d) => {
        if (d.companyData) setCompany(d.companyData);
        if (d.schedule) setSchedule(d.schedule);
        if (d.reviews) setReviews(d.reviews);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [auth]);

  const handleSave = async (section: string, fn: () => Promise<{ success?: boolean; error?: string }>) => {
    setSaving(true);
    const res = await fn();
    setMsg(res.success ? `${section} salvo! O site já foi atualizado.` : res.error || "Erro");
    setSaving(false);
    setTimeout(() => setMsg(""), 3000);
  };

  if (!auth) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <form onSubmit={(e) => { e.preventDefault(); if (pass === "agro2024") setAuth(true); else setMsg("Senha incorreta"); }} className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm relative">
          <a href="/" className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></a>
          <div className="flex justify-center mb-6"><Image src="/logo.jpg" alt="Logo" width={64} height={64} className="rounded-xl" /></div>
          <h1 className="text-xl font-bold text-center text-gray-800 mb-1">Painel Admin</h1>
          <p className="text-sm text-gray-500 text-center mb-6">Agrocomercial Carvalho</p>
          <div className="relative mb-4">
            <input type={showPass ? "text" : "password"} placeholder="Senha" value={pass} onChange={e => setPass(e.target.value)} className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800" />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPass ? <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
              : <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
            </button>
          </div>
          <button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl">Entrar</button>
          {msg && <p className="text-red-500 text-sm text-center mt-3">{msg}</p>}
        </form>
      </div>
    );
  }

  if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><div className="w-10 h-10 border-4 border-green-200 border-t-green-700 rounded-full animate-spin" /></div>;

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "empresa", label: "Empresa", icon: "🏪" },
    { key: "horarios", label: "Horários", icon: "🕐" },
    { key: "avaliacoes", label: "Avaliações", icon: "⭐" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3"><Image src="/logo.jpg" alt="Logo" width={36} height={36} className="rounded-lg" /><div><h1 className="text-sm font-bold text-gray-800">Painel Admin</h1><p className="text-xs text-gray-400">Agrocomercial Carvalho</p></div></div>
          <div className="flex items-center gap-3"><a href="/" className="text-xs text-gray-500 hover:text-gray-800">Ver site</a><button onClick={() => setAuth(false)} className="text-xs text-red-500 hover:text-red-700">Sair</button></div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {msg && <div className={`px-4 py-3 rounded-xl text-sm font-medium ${msg.includes("salvo") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>{msg}</div>}

        <div className="flex gap-2 overflow-x-auto">
          {tabs.map(t => <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap ${tab === t.key ? "bg-green-700 text-white shadow-lg shadow-green-700/20" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}><span>{t.icon}</span>{t.label}</button>)}
        </div>

        {tab === "empresa" && company && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Dados da Empresa</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Nome" value={company.name} onChange={v => setCompany({ ...company, name: v })} />
              <Field label="Slogan" value={company.slogan} onChange={v => setCompany({ ...company, slogan: v })} />
              <Field label="Endereço" value={company.address} onChange={v => setCompany({ ...company, address: v })} className="md:col-span-2" />
              <Field label="Telefone (exibição)" value={company.phone} onChange={v => setCompany({ ...company, phone: v })} />
              <Field label="Telefone (número)" value={company.phoneRaw} onChange={v => setCompany({ ...company, phoneRaw: v })} />
              <Field label="Nota Google" value={String(company.rating)} onChange={v => setCompany({ ...company, rating: parseFloat(v) || 0 })} />
              <Field label="Total avaliações" value={String(company.reviewCount)} onChange={v => setCompany({ ...company, reviewCount: parseInt(v) || 0 })} />
              <Field label="Mensagem WhatsApp" value={company.whatsappMessage} onChange={v => setCompany({ ...company, whatsappMessage: v })} className="md:col-span-2" />
            </div>
            <button disabled={saving} onClick={() => handleSave("Empresa", () => saveCompanyData(company))} className="mt-6 bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl">{saving ? "Salvando..." : "Salvar"}</button>
          </div>
        )}

        {tab === "horarios" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Horários</h2>
            <div className="space-y-3">
              {schedule.map((item, i) => (
                <div key={item.day} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50">
                  <span className="w-36 text-sm font-medium text-gray-700">{item.day}</span>
                  <input type="text" value={item.hours} onChange={e => { const u = [...schedule]; u[i] = { ...item, hours: e.target.value }; setSchedule(u); }} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800" />
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={item.open} onChange={e => { const u = [...schedule]; u[i] = { ...item, open: e.target.checked }; setSchedule(u); }} className="w-4 h-4 accent-green-700" /><span className="text-xs text-gray-500">Aberto</span></label>
                </div>
              ))}
            </div>
            <button disabled={saving} onClick={() => handleSave("Horários", () => saveSchedule(schedule))} className="mt-6 bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl">{saving ? "Salvando..." : "Salvar"}</button>
          </div>
        )}

        {tab === "avaliacoes" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">Avaliações</h2>
              <button onClick={() => setReviews([...reviews, { name: "", text: "", stars: 5 }])} className="text-sm bg-green-50 text-green-700 hover:bg-green-100 font-medium px-4 py-2 rounded-xl border border-green-200">+ Adicionar</button>
            </div>
            <div className="space-y-4">
              {reviews.map((r, i) => (
                <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <input type="text" placeholder="Nome" value={r.name} onChange={e => { const u = [...reviews]; u[i] = { ...r, name: e.target.value }; setReviews(u); }} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800" />
                    <select value={r.stars} onChange={e => { const u = [...reviews]; u[i] = { ...r, stars: parseInt(e.target.value) }; setReviews(u); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800">
                      {[5,4,3,2,1].map(s => <option key={s} value={s}>{"★".repeat(s)}{"☆".repeat(5-s)}</option>)}
                    </select>
                    <button onClick={() => setReviews(reviews.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 text-lg px-2">✕</button>
                  </div>
                  <textarea placeholder="Texto" value={r.text} onChange={e => { const u = [...reviews]; u[i] = { ...r, text: e.target.value }; setReviews(u); }} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none text-gray-800" />
                </div>
              ))}
            </div>
            <button disabled={saving} onClick={() => handleSave("Avaliações", () => saveReviews(reviews))} className="mt-6 bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl">{saving ? "Salvando..." : "Salvar"}</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, className = "" }: { label: string; value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800" />
    </div>
  );
}
