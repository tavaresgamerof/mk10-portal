"use client";

import { useState } from "react";
import { Check, X, Eye, MessageSquare, Trash2 } from "lucide-react";

interface Proposal {
  id: number;
  empresa: string;
  responsavel: string;
  whatsapp: string;
  email: string;
  tipo: string;
  orcamento: string;
  mensagem: string;
  logo: string;
  status: string;
  date: string;
}

const statusColorMap: Record<string, string> = {
  pendente: "bg-yellow-500/10 text-yellow-400",
  aprovado: "bg-blue-500/10 text-blue-400",
  rejeitado: "bg-red-500/10 text-red-400",
};

const STORAGE_KEY = "mk10_proposals";

function loadProposals(): Proposal[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function saveProposals(proposals: Proposal[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(proposals));
  } catch {}
}

export default function AdminPropostasPage() {
  const [list, setList] = useState<Proposal[]>(() => loadProposals());
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const updateStatus = (id: number, status: string) => {
    const updated = list.map((p) => p.id === id ? { ...p, status } : p);
    setList(updated);
    saveProposals(updated);
  };

  const deleteProposal = (id: number) => {
    const updated = list.filter((p) => p.id !== id);
    setList(updated);
    saveProposals(updated);
    if (selected === id) setSelected(null);
    setConfirmDelete(null);
  };

  const selectedProposal = list.find((p) => p.id === selected);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Propostas Comerciais</h1>
        <p className="text-text-muted">Gerencie as propostas recebidas de empresas</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Pendentes", value: list.filter((p) => p.status === "pendente").length, color: "text-yellow-400" },
          { label: "Aprovadas", value: list.filter((p) => p.status === "aprovado").length, color: "text-blue-400" },
          { label: "Rejeitadas", value: list.filter((p) => p.status === "rejeitado").length, color: "text-red-400" },
        ].map((s, i) => (
          <div key={i} className="bg-dark-card border border-dark-border rounded-2xl p-5 text-center">
            <p className={"text-3xl font-bold " + s.color}>{s.value}</p>
            <p className="text-text-muted text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="space-y-3">
            {list.map((proposal) => (
              <div
                key={proposal.id}
                onClick={() => setSelected(proposal.id)}
                className={"bg-dark-card border rounded-2xl p-5 cursor-pointer transition-all " + (selected === proposal.id ? "border-primary/50 ring-1 ring-primary/20" : "border-dark-border hover:border-dark-border/80")}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {proposal.logo ? (
                      <img src={proposal.logo} alt={proposal.empresa} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-dark-surface border border-dark-border flex items-center justify-center flex-shrink-0 text-text-muted text-xs font-bold">
                        {proposal.empresa.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-bold truncate">{proposal.empresa}</h3>
                        <span className={"text-xs px-2 py-0.5 rounded-lg font-medium flex-shrink-0 " + statusColorMap[proposal.status]}>
                          {proposal.status}
                        </span>
                      </div>
                      <p className="text-text-muted text-sm truncate">{proposal.responsavel} - {proposal.tipo}</p>
                      <p className="text-text-muted text-xs mt-1">{proposal.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {confirmDelete === proposal.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteProposal(proposal.id); }}
                          className="px-2 py-1 bg-red-500/20 border border-red-500/40 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30 transition-all"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setConfirmDelete(null); }}
                          className="px-2 py-1 bg-dark-surface border border-dark-border text-text-muted rounded-lg text-xs font-medium hover:text-foreground transition-all"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmDelete(proposal.id); }}
                        className="w-8 h-8 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 rounded-lg flex items-center justify-center text-red-400 transition-all"
                        title="Excluir proposta"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                    <Eye size={16} className="text-text-muted flex-shrink-0" />
                  </div>
                </div>
              </div>
            ))}
            {list.length === 0 && (
              <div className="bg-dark-card border border-dark-border rounded-2xl p-8 text-center">
                <MessageSquare size={48} className="text-text-muted mx-auto mb-3" />
                <p className="text-text-muted">Nenhuma proposta encontrada</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          {selectedProposal ? (
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-4">
                {selectedProposal.logo ? (
                  <img src={selectedProposal.logo} alt={selectedProposal.empresa} className="w-12 h-12 rounded-xl object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-dark-surface border border-dark-border flex items-center justify-center text-text-muted font-bold">
                    {selectedProposal.empresa.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="text-white font-bold text-lg">{selectedProposal.empresa}</h3>
                  <span className={"text-xs px-2 py-0.5 rounded-lg font-medium " + statusColorMap[selectedProposal.status]}>
                    {selectedProposal.status}
                  </span>
                </div>
              </div>
              <div className="space-y-3 text-sm mb-6">
                <div>
                  <p className="text-text-muted text-xs mb-1">Responsavel</p>
                  <p className="text-foreground">{selectedProposal.responsavel}</p>
                </div>
                <div>
                  <p className="text-text-muted text-xs mb-1">WhatsApp</p>
                  <p className="text-foreground">{selectedProposal.whatsapp}</p>
                </div>
                <div>
                  <p className="text-text-muted text-xs mb-1">E-mail</p>
                  <p className="text-foreground">{selectedProposal.email}</p>
                </div>
                <div>
                  <p className="text-text-muted text-xs mb-1">Tipo de Parceria</p>
                  <p className="text-foreground">{selectedProposal.tipo}</p>
                </div>
                <div>
                  <p className="text-text-muted text-xs mb-1">Orcamento</p>
                  <p className="text-foreground">{selectedProposal.orcamento}</p>
                </div>
                <div>
                  <p className="text-text-muted text-xs mb-1">Mensagem</p>
                  <p className="text-foreground leading-relaxed">{selectedProposal.mensagem}</p>
                </div>
              </div>

              <div className="flex gap-3">
                {selectedProposal.status === "pendente" && (
                  <>
                    <button onClick={() => updateStatus(selectedProposal.id, "aprovado")} className="flex-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold py-2.5 rounded-xl text-sm transition-all hover:bg-blue-500/20 flex items-center justify-center gap-1">
                      <Check size={14} /> Aprovar
                    </button>
                    <button onClick={() => updateStatus(selectedProposal.id, "rejeitado")} className="flex-1 bg-red-500/10 border border-red-500/30 text-red-400 font-bold py-2.5 rounded-xl text-sm transition-all hover:bg-red-500/20 flex items-center justify-center gap-1">
                      <X size={14} /> Rejeitar
                    </button>
                  </>
                )}
                <button
                  onClick={() => { setConfirmDelete(selectedProposal.id); }}
                  className="px-4 bg-red-500/10 border border-red-500/30 text-red-400 font-bold py-2.5 rounded-xl text-sm transition-all hover:bg-red-500/20 flex items-center justify-center gap-1"
                >
                  <Trash2 size={14} /> Excluir
                </button>
              </div>

              {confirmDelete === selectedProposal.id && (
                <div className="mt-3 p-3 bg-red-500/5 border border-red-500/20 rounded-xl text-center">
                  <p className="text-red-400 text-sm font-medium mb-2">Excluir esta proposta?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => deleteProposal(selectedProposal.id)}
                      className="flex-1 bg-red-500/20 text-red-400 font-bold py-2 rounded-lg text-xs hover:bg-red-500/30 transition-all"
                    >
                      Sim, excluir
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="flex-1 bg-dark-surface text-text-muted font-bold py-2 rounded-lg text-xs hover:text-foreground transition-all"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6 text-center">
              <MessageSquare size={48} className="text-text-muted mx-auto mb-3" />
              <p className="text-text-muted">Selecione uma proposta para ver os detalhes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
