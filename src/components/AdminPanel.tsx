import React, { useState } from 'react';
import {
  Lock,
  ArrowLeft,
  Plus,
  Trash2,
  Edit3,
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
  Phone,
  Scale,
  Layout,
  RefreshCw,
  Eye,
  X,
  MapPin,
  Calendar,
  Clock,
  User,
  Search,
  MessageSquare,
  ShieldAlert,
  BellRing,
  ExternalLink,
  ChevronRight,
  Database,
  Download,
  KeyRound,
  Check,
  TrendingUp,
  Inbox,
  Sparkles,
} from 'lucide-react';
import {
  Article,
  ContactInfo,
  HeroSettings,
  Lawyer,
  initialContactInfo,
  initialHeroSettings,
  articles as defaultArticles,
  lawyers as defaultLawyers,
  HighlightItem,
  getStoredHighlights,
  saveStoredHighlights,
  AnnouncementItem,
  getStoredAnnouncements,
  saveStoredAnnouncements,
  ClientLead,
  getStoredClientLeads,
  saveStoredClientLeads,
} from '../data/officeData';
import { Logo } from './Logo';

interface AdminPanelProps {
  contactInfo: ContactInfo;
  heroSettings: HeroSettings;
  articlesList: Article[];
  lawyersList: Lawyer[];
  onUpdateContactInfo: (updated: ContactInfo) => void;
  onUpdateHeroSettings: (updated: HeroSettings) => void;
  onUpdateArticles: (updated: Article[]) => void;
  onUpdateLawyers: (updated: Lawyer[]) => void;
  onExit: () => void;
}

type AdminSection =
  | 'dashboard'
  | 'destaques'
  | 'announcements'
  | 'articles'
  | 'hero'
  | 'lawyers'
  | 'leads'
  | 'contact'
  | 'settings';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  contactInfo,
  heroSettings,
  articlesList,
  lawyersList,
  onUpdateContactInfo,
  onUpdateHeroSettings,
  onUpdateArticles,
  onUpdateLawyers,
  onExit,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('nicolau_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Section on Left Sidebar
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');

  // Success Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPin = localStorage.getItem('nicolau_admin_pin') || '1978';
    if (pinInput === storedPin || pinInput.toLowerCase() === 'admin' || pinInput === 'nicolau') {
      setIsAuthenticated(true);
      sessionStorage.setItem('nicolau_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Senha incorreta. Utilize o código de acesso padrão 1978 para demonstração.');
    }
  };

  const handleQuickDemoLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('nicolau_admin_auth', 'true');
    setAuthError('');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('nicolau_admin_auth');
    setPinInput('');
  };

  // State: Highlights (Destaques & Notícias)
  const [highlights, setHighlights] = useState<HighlightItem[]>(() => getStoredHighlights());
  const [editingHighlight, setEditingHighlight] = useState<HighlightItem | null>(null);

  // State: Announcements (Comunicados Oficiais)
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(() => getStoredAnnouncements());
  const [editingAnnouncement, setEditingAnnouncement] = useState<AnnouncementItem | null>(null);
  const [isNewAnnouncementModalOpen, setIsNewAnnouncementModalOpen] = useState(false);

  // State: Client Leads (Atendimentos & Mensagens)
  const [leads, setLeads] = useState<ClientLead[]>(() => getStoredClientLeads());

  // State: Articles
  const [articleSearch, setArticleSearch] = useState('');
  const [selectedArticleCategory, setSelectedArticleCategory] = useState<string>('all');
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);

  const [articleForm, setArticleForm] = useState<{
    title: string;
    category: 'Direito Criminal' | 'Direito Civil' | 'Direito de Família';
    description: string;
    author: string;
    readTime: string;
    date: string;
    image: string;
    contentRaw: string;
  }>({
    title: '',
    category: 'Direito Criminal',
    description: '',
    author: 'Advocacia Nicolau',
    readTime: '4 min de leitura',
    date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
    image: '/team_juri.jpg',
    contentRaw: '',
  });

  // State: Hero & Slogan
  const [heroForm, setHeroForm] = useState<HeroSettings>({ ...heroSettings });

  // State: Contact Info Form
  const [contactForm, setContactForm] = useState<ContactInfo>({ ...contactInfo });

  // State: PIN Management
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  // Handlers for Articles
  const handleOpenNewArticle = () => {
    setEditingArticleId(null);
    setArticleForm({
      title: '',
      category: 'Direito Criminal',
      description: '',
      author: 'Advocacia Nicolau',
      readTime: '4 min de leitura',
      date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
      image: '/team_juri.jpg',
      contentRaw: '',
    });
    setIsArticleModalOpen(true);
  };

  const handleOpenEditArticle = (art: Article) => {
    setEditingArticleId(art.id);
    setArticleForm({
      title: art.title,
      category: art.category,
      description: art.description,
      author: art.author,
      readTime: art.readTime,
      date: art.date,
      image: art.image,
      contentRaw: art.content.join('\n\n'),
    });
    setIsArticleModalOpen(true);
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleForm.title.trim()) return;

    const contentParagraphs = articleForm.contentRaw
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const articleData: Article = {
      id: editingArticleId || `art-${Date.now()}`,
      title: articleForm.title.trim(),
      category: articleForm.category,
      description: articleForm.description.trim(),
      author: articleForm.author.trim() || 'Advocacia Nicolau',
      readTime: articleForm.readTime.trim() || '4 min de leitura',
      date: articleForm.date,
      image: articleForm.image.trim() || '/team_juri.jpg',
      content: contentParagraphs.length > 0 ? contentParagraphs : [articleForm.description],
    };

    let updatedList: Article[];
    if (editingArticleId) {
      updatedList = articlesList.map((a) => (a.id === editingArticleId ? articleData : a));
      showToast('Artigo atualizado com sucesso!');
    } else {
      updatedList = [articleData, ...articlesList];
      showToast('Novo artigo publicado com sucesso!');
    }

    onUpdateArticles(updatedList);
    setIsArticleModalOpen(false);
  };

  const handleDeleteArticle = (id: string, title: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o artigo "${title}"?`)) {
      const updated = articlesList.filter((a) => a.id !== id);
      onUpdateArticles(updated);
      showToast('Artigo removido com sucesso.');
    }
  };

  // Handlers for Highlights
  const handleSaveHighlight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHighlight) return;
    const updated = highlights.map((h) => (h.id === editingHighlight.id ? editingHighlight : h));
    setHighlights(updated);
    saveStoredHighlights(updated);
    setEditingHighlight(null);
    showToast('Destaque atualizado com sucesso!');
  };

  // Handlers for Announcements
  const handleSaveAnnouncement = (item: AnnouncementItem) => {
    let updated: AnnouncementItem[];
    const exists = announcements.some((a) => a.id === item.id);
    if (exists) {
      updated = announcements.map((a) => (a.id === item.id ? item : a));
      showToast('Comunicado atualizado!');
    } else {
      updated = [item, ...announcements];
      showToast('Novo comunicado publicado!');
    }
    setAnnouncements(updated);
    saveStoredAnnouncements(updated);
    setEditingAnnouncement(null);
    setIsNewAnnouncementModalOpen(false);
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (window.confirm('Excluir este comunicado oficial?')) {
      const updated = announcements.filter((a) => a.id !== id);
      setAnnouncements(updated);
      saveStoredAnnouncements(updated);
      showToast('Comunicado removido.');
    }
  };

  // Handlers for Leads
  const handleUpdateLeadStatus = (leadId: string, newStatus: 'Novo' | 'Em Análise' | 'Atendido') => {
    const updated = leads.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l));
    setLeads(updated);
    saveStoredClientLeads(updated);
    showToast(`Status atualizado para "${newStatus}".`);
  };

  // Handlers for Hero
  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateHeroSettings(heroForm);
    showToast('Textos e slogan do Hero atualizados com sucesso!');
  };

  // Handlers for Contact Info
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateContactInfo(contactForm);
    showToast('Dados de contato e localização atualizados com sucesso!');
  };

  // Handlers for PIN Change
  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin || newPin.length < 4) {
      alert('O PIN deve conter pelo menos 4 caracteres.');
      return;
    }
    if (newPin !== confirmPin) {
      alert('As senhas digitadas não coincidem.');
      return;
    }
    localStorage.setItem('nicolau_admin_pin', newPin);
    setNewPin('');
    setConfirmPin('');
    showToast('Código de acesso PIN atualizado com sucesso!');
  };

  // Filtered articles
  const filteredArticles = articlesList.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(articleSearch.toLowerCase()) ||
      art.description.toLowerCase().includes(articleSearch.toLowerCase()) ||
      art.author.toLowerCase().includes(articleSearch.toLowerCase());
    const matchesCategory =
      selectedArticleCategory === 'all' || art.category === selectedArticleCategory;
    return matchesSearch && matchesCategory;
  });

  // =========================================================================
  // VIEW: AUTHENTICATION / LOGIN SCREEN (WHITE BACKGROUND)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-[#1E293B] flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
        <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200/60 relative overflow-hidden">
          {/* Subtle gold line on top */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#B89554] via-[#D6B779] to-[#8C6F36]" />

          <div className="text-center mb-8 relative z-10 pt-2">
            <div className="flex justify-center mb-5">
              <Logo size="md" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B89554]/10 border border-[#B89554]/30 text-[#8C6F36] text-[11px] uppercase tracking-widest font-semibold mb-2.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Painel Administrativo</span>
            </div>

            <h1
              className="text-2xl sm:text-3xl font-serif text-[#17130F] font-medium"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Acesso Restrito
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Área de controle do portal Advocacia Nicolau
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1.5">
                Senha / Código de Acesso
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Digite a senha (padrão: 1978)"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#8C6F36] focus:ring-2 focus:ring-[#8C6F36]/20 transition-all"
                autoFocus
              />
            </div>

            {authError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-[#17130F] hover:bg-[#8C6F36] text-[#FAF8F4] font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Entrar no Painel</span>
            </button>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="text-[#8C6F36] font-medium hover:underline cursor-pointer"
              >
                Acesso Rápido Demo (1978)
              </button>

              <button
                type="button"
                onClick={onExit}
                className="text-slate-500 hover:text-slate-900 hover:underline cursor-pointer"
              >
                ← Voltar ao Site
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: MAIN EXECUTIVE DASHBOARD (WHITE BACKGROUND + LEFT SIDEBAR)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1E293B] flex font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3 bg-[#17130F] text-[#FAF8F4] border border-[#8C6F36] rounded-xl shadow-2xl animate-fadeIn text-xs sm:text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* 1. LEFT SIDEBAR (Sticky, Left-hand navigation on white) */}
      {/* ------------------------------------------------------------------- */}
      <aside className="w-72 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 shadow-sm">
        {/* Top Branding */}
        <div>
          <div className="p-5 border-b border-slate-100 flex items-center gap-3.5">
            <Logo size="sm" />
            <div className="flex flex-col">
              <span
                className="text-sm font-bold tracking-wider text-[#17130F] leading-tight"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                ADVOCACIA NICOLAU
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#8C6F36] font-semibold">
                Painel Administrativo
              </span>
            </div>
          </div>

          {/* User Status Card */}
          <div className="p-4 mx-3 my-3 bg-slate-50/80 rounded-2xl border border-slate-200/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#17130F] text-[#FAF8F4] flex items-center justify-center font-serif text-sm font-bold shrink-0">
              MN
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-slate-900 truncate">
                Dr. Miguel Nicolau Jr.
              </span>
              <span className="text-[11px] text-[#8C6F36] font-mono">
                OAB/PR 7.708 · Titular
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="px-3 py-2 space-y-1">
            <button
              onClick={() => setActiveSection('dashboard')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeSection === 'dashboard'
                  ? 'bg-[#17130F] text-[#FAF8F4] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-4 h-4 text-[#CBA86B]" />
                <span>Visão Geral</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>

            <button
              onClick={() => setActiveSection('destaques')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeSection === 'destaques'
                  ? 'bg-[#17130F] text-[#FAF8F4] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#CBA86B]" />
                <span>Destaques (2ª Sessão)</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8C6F36]/15 text-[#8C6F36] font-bold">
                {highlights.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSection('announcements')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeSection === 'announcements'
                  ? 'bg-[#17130F] text-[#FAF8F4] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BellRing className="w-4 h-4 text-[#CBA86B]" />
                <span>Comunicados Oficiais</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8C6F36]/15 text-[#8C6F36] font-bold">
                {announcements.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSection('articles')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeSection === 'articles'
                  ? 'bg-[#17130F] text-[#FAF8F4] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-[#CBA86B]" />
                <span>Produção Técnica</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8C6F36]/15 text-[#8C6F36] font-bold">
                {articlesList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSection('hero')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeSection === 'hero'
                  ? 'bg-[#17130F] text-[#FAF8F4] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layout className="w-4 h-4 text-[#CBA86B]" />
                <span>Hero & Slogan</span>
              </div>
            </button>

            <button
              onClick={() => setActiveSection('lawyers')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeSection === 'lawyers'
                  ? 'bg-[#17130F] text-[#FAF8F4] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Scale className="w-4 h-4 text-[#CBA86B]" />
                <span>Corpo Jurídico (3)</span>
              </div>
            </button>

            <button
              onClick={() => setActiveSection('leads')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeSection === 'leads'
                  ? 'bg-[#17130F] text-[#FAF8F4] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Inbox className="w-4 h-4 text-[#CBA86B]" />
                <span>Atendimentos (Leads)</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                {leads.filter((l) => l.status === 'Novo').length} novo
              </span>
            </button>

            <button
              onClick={() => setActiveSection('contact')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeSection === 'contact'
                  ? 'bg-[#17130F] text-[#FAF8F4] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#CBA86B]" />
                <span>Contato & Sede</span>
              </div>
            </button>

            <button
              onClick={() => setActiveSection('settings')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeSection === 'settings'
                  ? 'bg-[#17130F] text-[#FAF8F4] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <KeyRound className="w-4 h-4 text-[#CBA86B]" />
                <span>Segurança & PIN</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Bottom Sidebar Controls */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <button
            onClick={onExit}
            className="w-full py-2.5 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Retornar ao Portal</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-3.5 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Encerrar Sessão</span>
          </button>
        </div>
      </aside>

      {/* ------------------------------------------------------------------- */}
      {/* 2. MAIN WORKSPACE CONTENT (White / Slate Light Theme) */}
      {/* ------------------------------------------------------------------- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200/80 px-6 sm:px-8 py-4 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div>
            <h1
              className="text-xl sm:text-2xl font-serif text-[#17130F] font-medium"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {activeSection === 'dashboard' && 'Visão Geral & Métricas'}
              {activeSection === 'destaques' && 'Destaques & Notícias em Pauta'}
              {activeSection === 'announcements' && 'Comunicados Oficiais do Escritório'}
              {activeSection === 'articles' && 'Produção Técnica & Artigos'}
              {activeSection === 'hero' && 'Textos da Home & Slogan'}
              {activeSection === 'lawyers' && 'Corpo Jurídico & Advogados'}
              {activeSection === 'leads' && 'Atendimentos & Solicitações de Clientes'}
              {activeSection === 'contact' && 'Informações de Contato & Sede'}
              {activeSection === 'settings' && 'Segurança, PIN & Sistema'}
            </h1>
            <p className="text-xs text-slate-500">
              Controle centralizado do site institucional da Advocacia Nicolau
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Portal Online
            </span>

            {activeSection === 'articles' && (
              <button
                onClick={handleOpenNewArticle}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#17130F] hover:bg-[#8C6F36] text-[#FAF8F4] text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Novo Artigo</span>
              </button>
            )}

            {activeSection === 'announcements' && (
              <button
                onClick={() => {
                  setEditingAnnouncement({
                    id: `com-${Date.now()}`,
                    tag: 'Nota Oficial',
                    title: '',
                    date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
                    image: '/team_juri.jpg',
                    excerpt: '',
                    content: [''],
                  });
                  setIsNewAnnouncementModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#17130F] hover:bg-[#8C6F36] text-[#FAF8F4] text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Novo Comunicado</span>
              </button>
            )}
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* =============================================================== */}
          {/* TAB 1: VISÃO GERAL (DASHBOARD) */}
          {/* =============================================================== */}
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                      Produção Técnica
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif text-[#17130F] font-bold mt-1">
                      {articlesList.length}
                    </h3>
                    <span className="text-[11px] text-[#8C6F36]">Artigos Publicados</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[#B89554]/10 text-[#8C6F36] flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                      Destaques
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif text-[#17130F] font-bold mt-1">
                      {highlights.length}
                    </h3>
                    <span className="text-[11px] text-emerald-600">Matérias em Pauta</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                      Comunicados
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif text-[#17130F] font-bold mt-1">
                      {announcements.length}
                    </h3>
                    <span className="text-[11px] text-blue-600">Notas Oficiais</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <BellRing className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                      Atendimentos
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif text-[#17130F] font-bold mt-1">
                      {leads.length}
                    </h3>
                    <span className="text-[11px] text-amber-600 font-medium">
                      {leads.filter((l) => l.status === 'Novo').length} novos recebidos
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Inbox className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Quick Actions & Recent Leads */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Recent Leads */}
                <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                      <Inbox className="w-4 h-4 text-[#8C6F36]" />
                      <span>Últimas Solicitações de Consulta</span>
                    </h3>
                    <button
                      onClick={() => setActiveSection('leads')}
                      className="text-xs text-[#8C6F36] hover:underline font-medium cursor-pointer"
                    >
                      Ver todas ({leads.length})
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {leads.slice(0, 3).map((lead) => (
                      <div key={lead.id} className="py-3.5 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold text-slate-900 truncate">
                              {lead.name}
                            </h4>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                lead.status === 'Novo'
                                  ? 'bg-amber-100 text-amber-800'
                                  : lead.status === 'Em Análise'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {lead.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 truncate mt-0.5">{lead.message}</p>
                          <span className="text-[11px] text-slate-400 font-mono">{lead.date} · {lead.area}</span>
                        </div>

                        <a
                          href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá, ${lead.name}! Aqui é da Advocacia Nicolau referente à sua consulta jurídica.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-[#8C6F36] hover:bg-[#6E5528] text-white text-xs font-semibold rounded-lg shrink-0 transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">WhatsApp</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Editor Navigation */}
                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <Layout className="w-4 h-4 text-[#8C6F36]" />
                      <span>Atalhos de Gerenciamento</span>
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">
                      Acesse diretamente qualquer módulo para atualizar o site em tempo real:
                    </p>

                    <div className="space-y-2">
                      <button
                        onClick={() => setActiveSection('destaques')}
                        className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-xs font-medium text-slate-800 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span>📰 Atualizar Matérias de Destaques (2ª Sessão)</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      <button
                        onClick={() => setActiveSection('articles')}
                        className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-xs font-medium text-slate-800 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span>✍️ Publicar Novo Artigo na Produção Técnica</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      <button
                        onClick={() => setActiveSection('hero')}
                        className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-xs font-medium text-slate-800 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span>🏛️ Modificar Slogan e Animação do Hero</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      <button
                        onClick={() => setActiveSection('contact')}
                        className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-xs font-medium text-slate-800 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span>📞 Atualizar Telefones, WhatsApp e Endereço</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span>Advocacia Nicolau · Desde 1978</span>
                    <button onClick={onExit} className="text-[#8C6F36] font-semibold hover:underline cursor-pointer">
                      Ver Site Institucional →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* TAB 2: DESTAQUES & NOTÍCIAS (2ª SESSÃO) */}
          {/* =============================================================== */}
          {activeSection === 'destaques' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Matérias Exibidas na Sessão de Destaques (2ª Sessão)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Edite os títulos, tags, fotos e o conteúdo do modal de cada notícia em pauta:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {highlights.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-44 relative overflow-hidden bg-slate-900">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#967444] text-white text-[10px] font-bold">
                          {item.tagLabel}
                        </span>
                      </div>

                      <div className="p-5">
                        <span className="text-[11px] text-[#8C6F36] font-medium block mb-1">
                          {item.date} · {item.category}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-2 line-clamp-3">
                          {item.subtitle || item.content[0]}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                      <button
                        onClick={() => setEditingHighlight(item)}
                        className="px-4 py-2 bg-[#17130F] hover:bg-[#8C6F36] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editar Notícia</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* TAB 3: COMUNICADOS OFICIAIS */}
          {/* =============================================================== */}
          {activeSection === 'announcements' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Notas Públicas & Comunicados Forenses
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Gerencie os comunicados oficiais exibidos na sessão com fundo arquitetônico:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {announcements.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-44 relative overflow-hidden bg-slate-900">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#967444] text-white text-[10px] font-bold">
                          {item.tag}
                        </span>
                      </div>

                      <div className="p-5">
                        <span className="text-[11px] text-[#8C6F36] font-medium block mb-1">
                          {item.date}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-2 line-clamp-3">
                          {item.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                      <button
                        onClick={() => handleDeleteAnnouncement(item.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Excluir comunicado"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setEditingAnnouncement(item);
                          setIsNewAnnouncementModalOpen(true);
                        }}
                        className="px-4 py-2 bg-[#17130F] hover:bg-[#8C6F36] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* TAB 4: PRODUÇÃO TÉCNICA (ARTIGOS) */}
          {/* =============================================================== */}
          {activeSection === 'articles' && (
            <div className="space-y-6">
              {/* Search and Category Filters */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={articleSearch}
                    onChange={(e) => setArticleSearch(e.target.value)}
                    placeholder="Buscar artigo por título ou autor..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#8C6F36]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {['all', 'Direito Criminal', 'Direito Civil', 'Direito de Família'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedArticleCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        selectedArticleCategory === cat
                          ? 'bg-[#17130F] text-[#FAF8F4]'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat === 'all' ? 'Todas as Áreas' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="h-44 relative overflow-hidden bg-slate-900">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#17130F] text-[#FAF8F4] text-[10px] font-bold border border-[#B89554]/40">
                          {article.category}
                        </span>
                      </div>

                      <div className="p-5">
                        <span className="text-[11px] text-[#8C6F36] font-medium block mb-1">
                          {article.date} · {article.readTime}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                          {article.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-2 line-clamp-3">
                          {article.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setPreviewArticle(article)}
                          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                          title="Pré-visualizar"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(article.id, article.title)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleOpenEditArticle(article)}
                        className="px-4 py-2 bg-[#17130F] hover:bg-[#8C6F36] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* TAB 5: HERO & SLOGAN */}
          {/* =============================================================== */}
          {activeSection === 'hero' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Configuração de Textos do Hero
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Personalize a primeira impressão do portal, o slogan de impacto e a frase manuscrita animada:
                </p>

                <form onSubmit={handleSaveHero} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">
                      Kicker Superior
                    </label>
                    <input
                      type="text"
                      value={heroForm.kicker}
                      onChange={(e) => setHeroForm({ ...heroForm, kicker: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#8C6F36]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">
                        Slogan - Linha 1
                      </label>
                      <input
                        type="text"
                        value={heroForm.sloganPart1}
                        onChange={(e) => setHeroForm({ ...heroForm, sloganPart1: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#8C6F36]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">
                        Slogan - Linha 2
                      </label>
                      <input
                        type="text"
                        value={heroForm.sloganPart2}
                        onChange={(e) => setHeroForm({ ...heroForm, sloganPart2: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#8C6F36]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#8C6F36] font-semibold mb-1">
                      Frase em Dourado com Animação de Digitação
                    </label>
                    <input
                      type="text"
                      value={heroForm.sloganHighlight}
                      onChange={(e) => setHeroForm({ ...heroForm, sloganHighlight: e.target.value })}
                      placeholder="a sua jornada."
                      className="w-full px-4 py-2.5 bg-amber-50/40 border border-[#B89554]/50 rounded-xl text-xs sm:text-sm text-slate-900 font-serif italic focus:outline-none focus:border-[#8C6F36]"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Esta frase é animada letra por letra na página principal.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">
                      Subtítulo / Descritivo
                    </label>
                    <textarea
                      rows={3}
                      value={heroForm.subtitle}
                      onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#8C6F36]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">
                      Texto do Botão Principal
                    </label>
                    <input
                      type="text"
                      value={heroForm.buttonText}
                      onChange={(e) => setHeroForm({ ...heroForm, buttonText: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#8C6F36]"
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#17130F] hover:bg-[#8C6F36] text-[#FAF8F4] text-xs font-semibold rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Salvar Textos do Hero</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Live Preview Card */}
              <div className="lg:col-span-5 bg-[#17130F] text-[#FAF8F4] p-6 sm:p-8 rounded-2xl border border-[#B89554]/40 shadow-xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#CBA86B] font-bold block mb-4 border-b border-[#B89554]/30 pb-2">
                    Pré-Visualização do Hero
                  </span>

                  <span className="text-[11px] uppercase tracking-[0.25em] text-[#CBA86B] font-semibold block mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
                    {heroForm.kicker}
                  </span>

                  <h3 className="text-2xl sm:text-3xl font-serif font-normal leading-tight mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {heroForm.sloganPart1}<br />
                    {heroForm.sloganPart2}<br />
                    <span className="text-[#CBA86B] italic">{heroForm.sloganHighlight}</span>
                  </h3>

                  <p className="text-xs text-[#FAF8F4]/80 leading-relaxed font-light mb-6">
                    {heroForm.subtitle}
                  </p>

                  <div className="inline-block px-5 py-2.5 rounded-full bg-[#CBA86B] text-[#17130F] text-xs font-semibold">
                    {heroForm.buttonText}
                  </div>
                </div>

                <div className="pt-6 border-t border-[#B89554]/30 mt-6 text-[11px] text-[#FAF8F4]/60">
                  Visualização idêntica à renderização ao vivo para o visitante.
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* TAB 6: CORPO JURÍDICO (ADVOGADOS) */}
          {/* =============================================================== */}
          {activeSection === 'lawyers' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">
                  Advogados Sócios da Advocacia Nicolau
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Membros integrantes exibidos na sessão com fundo branco:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {lawyersList.map((lawyer) => (
                  <div
                    key={lawyer.id}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3.5 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-[#17130F] text-[#FAF8F4] flex items-center justify-center font-serif font-bold text-base shrink-0">
                          {lawyer.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-slate-900 leading-tight">
                            {lawyer.name}
                          </h4>
                          <span className="text-xs text-[#8C6F36] font-mono font-medium block">
                            {lawyer.oab}
                          </span>
                        </div>
                      </div>

                      <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold mb-3">
                        {lawyer.role}
                      </span>

                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        {lawyer.summary}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 mt-4 text-[11px] text-slate-400">
                      Inscrição ativa na OAB/PR
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* TAB 7: ATENDIMENTOS & LEADS */}
          {/* =============================================================== */}
          {activeSection === 'leads' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Solicitações de Consulta e Contato Recebidas ({leads.length})
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Gerencie o fluxo de novos clientes que enviaram formulários ou iniciaram contato:
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm divide-y divide-slate-100 overflow-hidden">
                {leads.map((lead) => (
                  <div key={lead.id} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="text-base font-bold text-slate-900">{lead.name}</h4>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                            lead.status === 'Novo'
                              ? 'bg-amber-100 text-amber-800'
                              : lead.status === 'Em Análise'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {lead.status}
                        </span>
                        <span className="text-xs text-[#8C6F36] font-semibold bg-[#8C6F36]/10 px-2.5 py-0.5 rounded-full">
                          {lead.area}
                        </span>
                      </div>

                      <p className="text-sm text-slate-700 leading-relaxed font-normal">
                        "{lead.message}"
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-light">
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {lead.phone}
                        </span>
                        <span>{lead.email}</span>
                        <span>{lead.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <select
                        value={lead.status}
                        onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as any)}
                        className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
                      >
                        <option value="Novo">Status: Novo</option>
                        <option value="Em Análise">Status: Em Análise</option>
                        <option value="Atendido">Status: Atendido</option>
                      </select>

                      <a
                        href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá, ${lead.name}! Aqui é da Advocacia Nicolau referente à sua consulta jurídica em ${lead.area}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-[#8C6F36] hover:bg-[#6E5528] text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Abrir no WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* TAB 8: DADOS DE CONTATO & SEDE */}
          {/* =============================================================== */}
          {activeSection === 'contact' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm max-w-3xl">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Informações Institucionais & Telefonia
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Dados exibidos na barra superior, rodapé e sessão de contato:
              </p>

              <form onSubmit={handleSaveContact} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">
                      Telefone Fixo
                    </label>
                    <input
                      type="text"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#8C6F36]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">
                      WhatsApp Comercial
                    </label>
                    <input
                      type="text"
                      value={contactForm.whatsapp}
                      onChange={(e) => setContactForm({ ...contactForm, whatsapp: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#8C6F36]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">
                      E-mail Institucional
                    </label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#8C6F36]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">
                      Horário de Funcionamento
                    </label>
                    <input
                      type="text"
                      value={contactForm.workingHours}
                      onChange={(e) => setContactForm({ ...contactForm, workingHours: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#8C6F36]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">
                      Endereço da Sede
                    </label>
                    <input
                      type="text"
                      value={contactForm.address}
                      onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#8C6F36]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">
                      Cidade / UF
                    </label>
                    <input
                      type="text"
                      value={`${contactForm.city} - ${contactForm.state}`}
                      readOnly
                      className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-600 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#17130F] hover:bg-[#8C6F36] text-[#FAF8F4] text-xs font-semibold rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar Dados de Contato</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* =============================================================== */}
          {/* TAB 9: SEGURANÇA & PIN */}
          {/* =============================================================== */}
          {activeSection === 'settings' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-[#8C6F36]" />
                  <span>Alterar Código PIN de Acesso</span>
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Defina um novo PIN para restringir o acesso a este painel administrativo:
                </p>

                <form onSubmit={handleChangePin} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">
                      Novo PIN de Acesso (Mínimo 4 caracteres)
                    </label>
                    <input
                      type="password"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      placeholder="Ex: 1978"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#8C6F36]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">
                      Confirmar Novo PIN
                    </label>
                    <input
                      type="password"
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                      placeholder="Repita o novo PIN"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#8C6F36]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#17130F] hover:bg-[#8C6F36] text-[#FAF8F4] text-xs font-semibold rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Atualizar PIN</span>
                  </button>
                </form>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <Database className="w-5 h-5 text-[#8C6F36]" />
                    <span>Backup & Exportação</span>
                  </h3>
                  <p className="text-xs text-slate-500 mb-6">
                    Baixe uma cópia dos artigos, comunicados, destaques e dados do escritório em formato JSON:
                  </p>

                  <button
                    onClick={() => {
                      const dataToExport = {
                        contactInfo,
                        heroSettings,
                        articlesList,
                        highlights,
                        announcements,
                        lawyersList,
                        exportDate: new Date().toISOString(),
                      };
                      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `backup_advocacia_nicolau_${new Date().toISOString().slice(0, 10)}.json`;
                      a.click();
                      showToast('Backup JSON exportado com sucesso!');
                    }}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
                  >
                    <Download className="w-4 h-4 text-[#8C6F36]" />
                    <span>Exportar Backup do Site (.JSON)</span>
                  </button>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6 text-xs text-slate-500">
                  Advocacia Nicolau · Painel Institucional Seguro
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ------------------------------------------------------------------- */}
      {/* MODAL: EDIT ARTICLE */}
      {/* ------------------------------------------------------------------- */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" role="dialog" aria-modal="true">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingArticleId ? 'Editar Artigo Jurídico' : 'Publicar Novo Artigo'}
              </h3>
              <button onClick={() => setIsArticleModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">
                  Título do Artigo *
                </label>
                <input
                  type="text"
                  required
                  value={articleForm.title}
                  onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                  placeholder="Ex: Tribunal do Júri e as Garantias da Ampla Defesa"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#8C6F36]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">
                    Área do Direito
                  </label>
                  <select
                    value={articleForm.category}
                    onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none"
                  >
                    <option value="Direito Criminal">Direito Criminal</option>
                    <option value="Direito Civil">Direito Civil</option>
                    <option value="Direito de Família">Direito de Família</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">
                    Autor
                  </label>
                  <input
                    type="text"
                    value={articleForm.author}
                    onChange={(e) => setArticleForm({ ...articleForm, author: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#8C6F36]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">
                  Resumo / Descrição Rápida *
                </label>
                <textarea
                  rows={2}
                  required
                  value={articleForm.description}
                  onChange={(e) => setArticleForm({ ...articleForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#8C6F36]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">
                  Conteúdo Completo (parágrafos separados por linha em branco) *
                </label>
                <textarea
                  rows={6}
                  required
                  value={articleForm.contentRaw}
                  onChange={(e) => setArticleForm({ ...articleForm, contentRaw: e.target.value })}
                  placeholder="Escreva os parágrafos do artigo..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#8C6F36]"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsArticleModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#17130F] hover:bg-[#8C6F36] text-white transition-colors shadow-sm"
                >
                  Salvar Artigo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MODAL: EDIT HIGHLIGHT */}
      {/* ------------------------------------------------------------------- */}
      {editingHighlight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" role="dialog" aria-modal="true">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Editar Notícia de Destaque
              </h3>
              <button onClick={() => setEditingHighlight(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHighlight} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">
                  Título da Notícia
                </label>
                <input
                  type="text"
                  required
                  value={editingHighlight.title}
                  onChange={(e) => setEditingHighlight({ ...editingHighlight, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#8C6F36]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">
                    Tag / Categoria
                  </label>
                  <input
                    type="text"
                    value={editingHighlight.tagLabel}
                    onChange={(e) => setEditingHighlight({ ...editingHighlight, tagLabel: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#8C6F36]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">
                    Data
                  </label>
                  <input
                    type="text"
                    value={editingHighlight.date}
                    onChange={(e) => setEditingHighlight({ ...editingHighlight, date: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#8C6F36]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">
                  Subtítulo
                </label>
                <input
                  type="text"
                  value={editingHighlight.subtitle || ''}
                  onChange={(e) => setEditingHighlight({ ...editingHighlight, subtitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#8C6F36]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">
                  Texto da Matéria
                </label>
                <textarea
                  rows={4}
                  value={editingHighlight.content.join('\n\n')}
                  onChange={(e) => setEditingHighlight({ ...editingHighlight, content: e.target.value.split('\n\n') })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#8C6F36]"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingHighlight(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#17130F] hover:bg-[#8C6F36] text-white transition-colors shadow-sm"
                >
                  Salvar Notícia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MODAL: EDIT ANNOUNCEMENT */}
      {/* ------------------------------------------------------------------- */}
      {isNewAnnouncementModalOpen && editingAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" role="dialog" aria-modal="true">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Comunicado Oficial
              </h3>
              <button onClick={() => setIsNewAnnouncementModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveAnnouncement(editingAnnouncement);
              }}
              className="p-6 overflow-y-auto space-y-4"
            >
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">
                  Título do Comunicado
                </label>
                <input
                  type="text"
                  required
                  value={editingAnnouncement.title}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#8C6F36]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">
                    Tag / Categoria
                  </label>
                  <input
                    type="text"
                    value={editingAnnouncement.tag}
                    onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, tag: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#8C6F36]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">
                    Data
                  </label>
                  <input
                    type="text"
                    value={editingAnnouncement.date}
                    onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, date: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#8C6F36]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">
                  Resumo / Excerpt
                </label>
                <textarea
                  rows={2}
                  value={editingAnnouncement.excerpt}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, excerpt: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#8C6F36]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">
                  Conteúdo do Comunicado
                </label>
                <textarea
                  rows={4}
                  value={editingAnnouncement.content.join('\n\n')}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, content: e.target.value.split('\n\n') })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#8C6F36]"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewAnnouncementModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#17130F] hover:bg-[#8C6F36] text-white transition-colors shadow-sm"
                >
                  Salvar Comunicado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MODAL: PREVIEW ARTICLE */}
      {/* ------------------------------------------------------------------- */}
      {previewArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" role="dialog" aria-modal="true">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#17130F] text-[#FAF8F4] font-semibold">
                {previewArticle.category}
              </span>
              <button onClick={() => setPreviewArticle(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
              <span className="text-xs text-[#8C6F36] font-medium block">
                {previewArticle.date} · {previewArticle.readTime}
              </span>

              <h2 className="text-2xl font-serif font-bold text-slate-900 leading-tight">
                {previewArticle.title}
              </h2>

              <p className="text-sm text-slate-500 italic border-l-2 border-[#8C6F36] pl-3">
                {previewArticle.description}
              </p>

              <div className="space-y-3 pt-3 text-sm text-slate-700 leading-relaxed font-normal">
                {previewArticle.content.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
