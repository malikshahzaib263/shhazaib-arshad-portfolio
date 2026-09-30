import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowUpRight,
  Download,
  Terminal as TerminalIcon,
  Sliders,
  Pause,
  Play,
  FileCode2,
  Copy,
  Check,
} from 'lucide-react';
import {
  PERSONAL_INFO,
  KEY_METRICS,
  SKILL_GROUPS,
  PROJECTS,
  EXPERIENCE_TIMELINE,
  EDUCATION_LIST,
  CERTIFICATIONS_LIST,
  ProjectItem,
} from './data/portfolioData';
import {
  NeuralCanvas3D,
  SceneMode,
  AccentTone,
} from './components/NeuralCanvas3D';
import { CustomCursor } from './components/CustomCursor';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ResumeModal } from './components/ResumeModal';
import { CommandTerminal } from './components/CommandTerminal';
import {
  downloadFile,
  generateSingleFilePortfolioHtml,
} from './utils/standaloneHtmlExporter';

gsap.registerPlugin(ScrollTrigger);

type ProjectCategoryFilter = 'all' | 'ai-ml' | 'fullstack' | 'automation';

export default function App() {
  const [sceneMode, setSceneMode] = useState<SceneMode>('hybrid');
  const [accentTone, setAccentTone] = useState<AccentTone>('cyan');
  const [rippleSignal, setRippleSignal] = useState<number>(0);
  const [motionPaused, setMotionPaused] = useState<boolean>(false);

  const [projectFilter, setProjectFilter] =
    useState<ProjectCategoryFilter>('all');
  const [activeSkillGroup, setActiveSkillGroup] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null
  );
  const [isResumeOpen, setIsResumeOpen] = useState<boolean>(false);
  const [copiedQuick, setCopiedQuick] = useState<'none' | 'email' | 'phone' | 'html'>('none');

  const mainRef = useRef<HTMLElement | null>(null);

  const trigger3DRipple = (tone: AccentTone = 'cyan') => {
    setAccentTone(tone);
    setRippleSignal((prev) => prev + 1);
  };

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>('.gsap-section');
      sections.forEach((sec) => {
        gsap.fromTo(
          sec,
          { opacity: 0.85, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sec,
              start: 'top 86%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  const filteredProjects = PROJECTS.filter((proj) => {
    if (projectFilter === 'all') return true;
    return proj.category === projectFilter;
  });

  const filteredSkillGroups = SKILL_GROUPS.filter((group) => {
    if (activeSkillGroup === 'all') return true;
    return group.id === activeSkillGroup;
  });

  const handleQuickCopy = async (text: string, type: 'email' | 'phone') => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopiedQuick(type);
    trigger3DRipple('cyan');
    setTimeout(() => setCopiedQuick('none'), 2200);
  };

  const handleExportStandaloneHtml = () => {
    const html = generateSingleFilePortfolioHtml();
    downloadFile(html, 'index.html', 'text/html;charset=utf-8');
    setCopiedQuick('html');
    trigger3DRipple('violet');
    setTimeout(() => setCopiedQuick('none'), 2500);
  };

  return (
    <div id="top" className="relative min-h-screen bg-[#07090e] text-white">
      {/* 1. Fixed 3D WebGL Neural Space Background */}
      <NeuralCanvas3D
        sceneMode={sceneMode}
        accentTone={accentTone}
        rippleSignal={rippleSignal}
        motionPaused={motionPaused}
      />

      {/* Subtle Scanline Overlay */}
      <div
        aria-hidden="true"
        className="scanline-overlay pointer-events-none fixed inset-0 z-[1]"
      />

      {/* Custom Magnetic Cursor (Desktop Fine Pointer) */}
      <CustomCursor />

      {/* 2. Top Navigation Bar — Strictly 3 Zones per Top Bar Contract */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-5 sm:px-10 py-4 bg-[#07090e]/80 backdrop-blur-xl border-b border-white/[0.08]">
        {/* Zone 1: Brand Wordmark (Single Text Element) */}
        <a
          href="#top"
          onClick={() => trigger3DRipple('cyan')}
          className="font-display text-lg sm:text-xl font-bold tracking-tight text-white hover:text-[#00f5d4] transition-colors whitespace-nowrap"
        >
          {PERSONAL_INFO.name}
        </a>

        {/* Zone 2: 5 Single-Line Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#94a3b8]"
        >
          <a
            href="#capabilities"
            onClick={() => trigger3DRipple('cyan')}
            className="hover:text-white hover:underline underline-offset-8 decoration-[#00f5d4] transition-colors whitespace-nowrap"
          >
            Capabilities
          </a>
          <a
            href="#systems"
            onClick={() => trigger3DRipple('violet')}
            className="hover:text-white hover:underline underline-offset-8 decoration-[#00f5d4] transition-colors whitespace-nowrap"
          >
            Systems
          </a>
          <a
            href="#experience"
            onClick={() => trigger3DRipple('cyan')}
            className="hover:text-white hover:underline underline-offset-8 decoration-[#00f5d4] transition-colors whitespace-nowrap"
          >
            Experience
          </a>
          <a
            href="#credentials"
            onClick={() => trigger3DRipple('violet')}
            className="hover:text-white hover:underline underline-offset-8 decoration-[#00f5d4] transition-colors whitespace-nowrap"
          >
            Credentials
          </a>
          <a
            href="#contact"
            onClick={() => trigger3DRipple('cyan')}
            className="hover:text-white hover:underline underline-offset-8 decoration-[#00f5d4] transition-colors whitespace-nowrap"
          >
            Contact
          </a>
        </nav>

        {/* Zone 3: 2 Primary Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() => {
              trigger3DRipple('violet');
              setIsResumeOpen(true);
            }}
            className="px-3.5 py-2 rounded-lg border border-white/15 bg-white/[0.04] text-xs font-medium text-white hover:border-[#00f5d4]/60 hover:text-[#00f5d4] transition-colors cursor-pointer whitespace-nowrap"
          >
            Download Resume
          </button>
          <a
            href="#contact"
            onClick={() => trigger3DRipple('cyan')}
            className="px-4 py-2 rounded-lg bg-[#00f5d4] text-[#07090e] text-xs font-semibold hover:brightness-110 transition-all whitespace-nowrap"
          >
            Get in Touch
          </a>
        </div>
      </header>

      {/* Main Content Container */}
      <main
        ref={mainRef}
        className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-10"
      >
        {/* HERO SECTION */}
        <section className="pt-14 sm:pt-24 pb-20 sm:pb-28 border-b border-white/[0.07]">
          <div className="max-w-3xl">
            {/* Unboxed Metadata Line */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-sm font-mono text-[#94a3b8] mb-5">
              <span className="text-[#00f5d4]">{PERSONAL_INFO.location}</span>
              <span aria-hidden="true">·</span>
              <span>Software Engineer</span>
              <span aria-hidden="true">·</span>
              <span>AI & Machine Learning Specialist</span>
              <span aria-hidden="true">·</span>
              <span>Full-Stack & Flutter Developer</span>
            </div>

            {/* Dominant Display Headline */}
            <h1 className="font-display text-3xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-white leading-[1.08] mb-6">
              {PERSONAL_INFO.heroHeadline}
            </h1>

            {/* Refined Lead Subtext */}
            <p className="text-base sm:text-lg text-[#94a3b8] leading-relaxed max-w-[66ch] mb-9">
              {PERSONAL_INFO.heroSubtext}
            </p>

            {/* Primary Interactive CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 mb-12">
              <a
                href="#systems"
                onClick={() => trigger3DRipple('cyan')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#00f5d4] text-[#07090e] text-sm font-semibold hover:brightness-110 transition-all whitespace-nowrap shadow-[0_0_25px_rgba(0,245,212,0.22)]"
              >
                <span>Explore Systems</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>

              <a
                href="#contact"
                onClick={() => trigger3DRipple('violet')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg glass-panel text-sm font-medium text-white hover:border-[#00f5d4]/60 hover:text-[#00f5d4] transition-all whitespace-nowrap"
              >
                <TerminalIcon className="h-4 w-4 text-[#00f5d4]" />
                <span>Get in Touch</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  trigger3DRipple('violet');
                  setIsResumeOpen(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg glass-panel text-sm font-medium text-slate-200 hover:border-[#9d4edd]/60 hover:text-white transition-all cursor-pointer whitespace-nowrap"
              >
                <Download className="h-4 w-4 text-[#c77dff]" />
                <span>Download Resume</span>
              </button>
            </div>

            {/* Interactive Contact & 3D Viewport Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/[0.08]">
              {/* Direct Copy Coordinates */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#94a3b8]">
                <button
                  type="button"
                  onClick={() => handleQuickCopy(PERSONAL_INFO.email, 'email')}
                  className="inline-flex items-center gap-1.5 hover:text-[#00f5d4] transition-colors cursor-pointer"
                  title="Copy email address"
                >
                  {copiedQuick === 'email' ? (
                    <Check className="h-3.5 w-3.5 text-[#00f5d4]" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-[#00f5d4]" />
                  )}
                  <span>
                    {copiedQuick === 'email'
                      ? 'Email Copied'
                      : PERSONAL_INFO.email}
                  </span>
                </button>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => handleQuickCopy(PERSONAL_INFO.phone, 'phone')}
                  className="inline-flex items-center gap-1.5 hover:text-[#00f5d4] transition-colors cursor-pointer tabular-nums"
                  title="Copy phone number"
                >
                  {copiedQuick === 'phone' ? (
                    <Check className="h-3.5 w-3.5 text-[#00f5d4]" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-[#9d4edd]" />
                  )}
                  <span>
                    {copiedQuick === 'phone'
                      ? 'Phone Copied'
                      : PERSONAL_INFO.phone}
                  </span>
                </button>
                <span aria-hidden="true">·</span>
                <a
                  href={PERSONAL_INFO.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#00f5d4] transition-colors inline-flex items-center gap-1"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
                <span aria-hidden="true">·</span>
                <a
                  href={PERSONAL_INFO.vercelPortfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#00f5d4] transition-colors inline-flex items-center gap-1"
                >
                  <span>Vercel Portfolio</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>

              {/* Interactive 3D WebGL Geometry Mode Switcher */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-[#0d111a]/90 border border-white/10">
                <span className="inline-flex items-center gap-1 px-2 text-[11px] font-mono text-[#94a3b8]">
                  <Sliders className="h-3 w-3 text-[#00f5d4]" />
                  <span>3D Field:</span>
                </span>
                {(
                  [
                    { id: 'hybrid', label: 'Hybrid Core' },
                    { id: 'constellation', label: 'Constellation' },
                    { id: 'icosahedron', label: 'Icosahedron' },
                    { id: 'wave', label: 'Wave Grid' },
                  ] as { id: SceneMode; label: string }[]
                ).map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => {
                      setSceneMode(mode.id);
                      trigger3DRipple(
                        mode.id === 'wave' ? 'violet' : 'cyan'
                      );
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer whitespace-nowrap ${
                      sceneMode === mode.id
                        ? 'bg-[#00f5d4] text-[#07090e] font-semibold'
                        : 'text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setMotionPaused((prev) => !prev)}
                  aria-label={
                    motionPaused ? 'Resume 3D motion' : 'Pause 3D motion'
                  }
                  title={motionPaused ? 'Resume 3D motion' : 'Pause 3D motion'}
                  className="px-2 py-1 rounded text-xs font-mono text-[#94a3b8] hover:text-[#00f5d4] transition-colors cursor-pointer"
                >
                  {motionPaused ? (
                    <Play className="h-3.5 w-3.5" />
                  ) : (
                    <Pause className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quantitative Proof Metrics Grid (Claim-to-Proof Adjacency) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
            {KEY_METRICS.map((metric, idx) => (
              <div
                key={idx}
                onMouseEnter={() =>
                  trigger3DRipple(idx % 2 === 0 ? 'cyan' : 'violet')
                }
                className="glass-panel glass-panel-interactive rounded-2xl p-6"
              >
                <div className="font-mono text-2xl sm:text-3xl font-bold text-[#00f5d4] tabular-nums">
                  {metric.value}
                </div>
                <div className="font-semibold text-white text-sm mt-2">
                  {metric.label}
                </div>
                <div className="text-xs text-[#94a3b8] mt-1 leading-relaxed">
                  {metric.detail}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 01: SKILLS MATRIX & CAPABILITIES */}
        <section
          id="capabilities"
          className="gsap-section py-20 sm:py-24 border-b border-white/[0.07]"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                01. Neural Capabilities & Engineering Stack
              </h2>
              <p className="text-sm sm:text-base text-[#94a3b8] mt-2 max-w-[65ch]">
                Categorized technical architecture across Deep Learning, on-device TensorFlow Lite deployment, cross-platform Flutter apps, and Python backend systems.
              </p>
            </div>

            {/* Interactive Skill Domain Filter Controls */}
            <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[#0d111a]/90 border border-white/10 self-start">
              <button
                type="button"
                onClick={() => {
                  setActiveSkillGroup('all');
                  trigger3DRipple('cyan');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeSkillGroup === 'all'
                    ? 'bg-[#00f5d4] text-[#07090e] font-semibold'
                    : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                All Domains
              </button>
              {SKILL_GROUPS.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => {
                    setActiveSkillGroup(group.id);
                    trigger3DRipple(group.accent);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    activeSkillGroup === group.id
                      ? 'bg-[#00f5d4] text-[#07090e] font-semibold'
                      : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  {group.title}
                </button>
              ))}
            </div>
          </div>

          {/* Skills Matrix Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSkillGroups.map((group) => {
              const isCyan = group.accent === 'cyan';
              return (
                <div
                  key={group.id}
                  onMouseEnter={() => trigger3DRipple(group.accent)}
                  className={`glass-panel rounded-2xl p-6 sm:p-8 ${
                    isCyan ? 'glass-panel-interactive' : 'glass-panel-violet'
                  }`}
                >
                  {/* Unboxed Metadata Kicker */}
                  <div className="flex items-center gap-2 text-xs font-mono text-[#94a3b8] mb-2">
                    <span className={isCyan ? 'text-[#00f5d4]' : 'text-[#c77dff]'}>
                      Domain {group.index}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{group.skills.length} Core Competencies</span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-white">
                    {group.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#94a3b8] mt-1 mb-6">
                    {group.subtitle}
                  </p>

                  <div className="divide-y divide-white/[0.06]">
                    {group.skills.map((skill, sIdx) => (
                      <div
                        key={sIdx}
                        className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4"
                      >
                        <span className="text-sm font-semibold text-white shrink-0">
                          {skill.name}
                        </span>
                        <span className="text-xs text-[#94a3b8] sm:text-right">
                          {skill.context}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 02: FEATURED PROJECTS & SYSTEMS ARCHIVE */}
        <section
          id="systems"
          className="gsap-section py-20 sm:py-24 border-b border-white/[0.07]"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                02. Selected Engineering Systems & ML Pipelines
              </h2>
              <p className="text-sm sm:text-base text-[#94a3b8] mt-2 max-w-[65ch]">
                Hover over any system to pulse the 3D neural constellation. Click any card to inspect the full system architecture, problem statement, and verification outcomes.
              </p>
            </div>

            {/* Interactive Category Filter Buttons */}
            <div
              role="tablist"
              aria-label="Filter projects by domain"
              className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[#0d111a]/90 border border-white/10 self-start"
            >
              {(
                [
                  { id: 'all', label: `All Systems (${PROJECTS.length})` },
                  {
                    id: 'ai-ml',
                    label: `AI / ML (${
                      PROJECTS.filter((p) => p.category === 'ai-ml').length
                    })`,
                  },
                  {
                    id: 'fullstack',
                    label: `Full-Stack / Mobile (${
                      PROJECTS.filter((p) => p.category === 'fullstack').length
                    })`,
                  },
                  {
                    id: 'automation',
                    label: `Automation (${
                      PROJECTS.filter((p) => p.category === 'automation').length
                    })`,
                  },
                ] as { id: ProjectCategoryFilter; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={projectFilter === tab.id}
                  onClick={() => {
                    setProjectFilter(tab.id);
                    trigger3DRipple(tab.id === 'fullstack' ? 'violet' : 'cyan');
                  }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    projectFilter === tab.id
                      ? 'bg-[#00f5d4] text-[#07090e] font-semibold'
                      : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Asymmetric Bento / Editorial Grid of Projects */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {filteredProjects.map((project, index) => {
              // Make the flagship FYP (first item in 'all' or 'ai-ml') span 12 columns on desktop for focal anchor impact
              const isHeroFlagship = index === 0 && project.id === 'sttp-fyp';
              const colSpanClass = isHeroFlagship
                ? 'md:col-span-12'
                : 'md:col-span-6';
              const isCyan = project.accentColor === 'cyan';

              return (
                <article
                  key={project.id}
                  data-cursor="interactive"
                  onMouseEnter={() => trigger3DRipple(project.accentColor)}
                  onClick={() => {
                    trigger3DRipple(project.accentColor);
                    setSelectedProject(project);
                  }}
                  className={`${colSpanClass} glass-panel rounded-2xl p-6 sm:p-8 flex flex-col justify-between cursor-pointer group ${
                    isCyan ? 'glass-panel-interactive' : 'glass-panel-violet'
                  }`}
                >
                  <div>
                    {/* Clean Unboxed Metadata Line (Zero-Pill Compliance) */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#94a3b8] mb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={
                            isCyan ? 'text-[#00f5d4]' : 'text-[#c77dff]'
                          }
                        >
                          {project.index}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{project.categoryLabel}</span>
                        {project.organization && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{project.organization}</span>
                          </>
                        )}
                      </div>
                      <span className="tabular-nums">{project.timeframe}</span>
                    </div>

                    {/* Project Title & Subtitle */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3
                          className={`font-display font-bold text-white group-hover:text-[#00f5d4] transition-colors ${
                            isHeroFlagship
                              ? 'text-2xl sm:text-3xl'
                              : 'text-xl sm:text-2xl'
                          }`}
                        >
                          {project.title}
                        </h3>
                        <p
                          className={`text-xs sm:text-sm font-medium mt-1 ${
                            isCyan ? 'text-[#00f5d4]' : 'text-[#c77dff]'
                          }`}
                        >
                          {project.subtitle}
                        </p>
                      </div>

                      <span
                        aria-hidden="true"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-[#94a3b8] group-hover:border-[#00f5d4] group-hover:text-[#00f5d4] transition-colors"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>

                    {/* Summary */}
                    <p className="text-sm text-slate-300 leading-relaxed mt-4 max-w-[75ch]">
                      {project.summary}
                    </p>

                    {/* Architectural Highlights */}
                    <div className="mt-5 space-y-1.5 border-l-2 border-white/10 pl-4">
                      {project.architecture
                        .slice(0, isHeroFlagship ? 3 : 2)
                        .map((archLine, aIdx) => (
                          <p
                            key={aIdx}
                            className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed"
                          >
                            {archLine}
                          </p>
                        ))}
                    </div>
                  </div>

                  {/* Unboxed Tech Stack Footer */}
                  <div className="mt-6 pt-4 border-t border-white/[0.07] flex flex-wrap items-center justify-between gap-3">
                    <div className="font-mono text-xs text-[#00f5d4]">
                      {project.stack.join(' · ')}
                    </div>
                    <span className="text-xs font-mono text-white/70 group-hover:text-white transition-colors whitespace-nowrap">
                      Inspect Architecture →
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* SECTION 03: EXPERIENCE TIMELINE */}
        <section
          id="experience"
          className="gsap-section py-20 sm:py-24 border-b border-white/[0.07]"
        >
          <div className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              03. Professional Experience Timeline
            </h2>
            <p className="text-sm sm:text-base text-[#94a3b8] mt-2 max-w-[65ch]">
              Approximately 1 year of intensive hands-on experience across AI/Machine Learning, Deep Learning, Full-Stack Python (Flask/Django), and software engineering internships.
            </p>
          </div>

          <div className="relative pl-6 sm:pl-10 border-l border-white/15 space-y-8">
            {EXPERIENCE_TIMELINE.map((exp, idx) => {
              const isCyan = exp.accent === 'cyan';
              return (
                <div
                  key={exp.id}
                  onMouseEnter={() => trigger3DRipple(exp.accent)}
                  className={`relative glass-panel rounded-2xl p-6 sm:p-8 ${
                    isCyan ? 'glass-panel-interactive' : 'glass-panel-violet'
                  }`}
                >
                  {/* Timeline Node Marker */}
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[31px] sm:-left-[47px] top-8 h-3.5 w-3.5 rounded-full border-2 border-[#07090e] ${
                      isCyan
                        ? 'bg-[#00f5d4] shadow-[0_0_12px_#00f5d4]'
                        : 'bg-[#9d4edd] shadow-[0_0_12px_#9d4edd]'
                    }`}
                  />

                  {/* Unboxed Metadata Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#94a3b8] mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={
                          isCyan ? 'text-[#00f5d4]' : 'text-[#c77dff]'
                        }
                      >
                        0{idx + 1}. {exp.type}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{exp.location}</span>
                    </div>
                    <span className="tabular-nums text-white font-medium">
                      {exp.period}
                    </span>
                  </div>

                  {/* Role & Company */}
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                    {exp.role}{' '}
                    <span className="text-[#94a3b8] font-normal">—</span>{' '}
                    <span
                      className={isCyan ? 'text-[#00f5d4]' : 'text-[#c77dff]'}
                    >
                      {exp.companyFull}
                    </span>
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed mt-3">
                    {exp.summary}
                  </p>

                  {/* Key Engineering Deliverables */}
                  <ul className="mt-4 space-y-2 text-xs sm:text-sm text-[#94a3b8]">
                    {exp.deliverables.map((item, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2.5">
                        <span
                          className={`font-mono mt-0.5 ${
                            isCyan ? 'text-[#00f5d4]' : 'text-[#c77dff]'
                          }`}
                        >
                          ·
                        </span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Unboxed Stack Line */}
                  <div className="mt-5 pt-4 border-t border-white/[0.07] font-mono text-xs text-[#00f5d4]">
                    {exp.technologies.join(' · ')}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 04: EDUCATION & CERTIFICATIONS */}
        <section
          id="credentials"
          className="gsap-section py-20 sm:py-24 border-b border-white/[0.07]"
        >
          <div className="mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              04. Academic Credentials & Verified Certifications
            </h2>
            <p className="text-sm sm:text-base text-[#94a3b8] mt-2 max-w-[65ch]">
              Academic foundation in Software Engineering from Capital University of Science & Technology (CUST), Islamabad alongside international and industry certifications.
            </p>
          </div>

          {/* Education Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {EDUCATION_LIST.map((edu, idx) => (
              <div
                key={idx}
                onMouseEnter={() =>
                  trigger3DRipple(idx === 0 ? 'cyan' : 'violet')
                }
                className="glass-panel glass-panel-interactive rounded-2xl p-6 sm:p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#00f5d4] tabular-nums mb-3">
                    <span>{edu.period}</span>
                    <span aria-hidden="true">·</span>
                    <span>{edu.score}</span>
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                    {edu.degree}
                  </h3>
                  <p className="text-sm text-slate-300 font-medium mt-1">
                    {edu.institution}
                  </p>
                  <p className="text-xs font-mono text-[#94a3b8] mt-0.5">
                    {edu.location}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed mt-5 pt-4 border-t border-white/[0.07]">
                  {edu.details}
                </p>
              </div>
            ))}
          </div>

          {/* Certifications & Honors Matrix */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-4 pb-5 border-b border-white/10">
              <div>
                <h3 className="font-display text-xl font-bold text-white">
                  Certifications, Hackathons & Leadership
                </h3>
                <p className="text-xs sm:text-sm text-[#94a3b8] mt-1">
                  Verified credentials across Python engineering, international qualifications, and community service.
                </p>
              </div>
              <span className="font-mono text-xs text-[#00f5d4] tabular-nums">
                {CERTIFICATIONS_LIST.length} Verified Credentials
              </span>
            </div>

            <div className="divide-y divide-white/[0.06]">
              {CERTIFICATIONS_LIST.map((cert, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() =>
                    trigger3DRipple(idx % 2 === 0 ? 'cyan' : 'violet')
                  }
                  className="py-4 first:pt-5 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="text-sm sm:text-base font-semibold text-white">
                      {cert.title}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#94a3b8] mt-0.5">
                      <span>{cert.issuer}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-[#00f5d4]">
                        {cert.category}
                      </span>
                    </div>
                  </div>
                  <div className="font-mono text-xs text-[#94a3b8] tabular-nums shrink-0">
                    Issued {cert.year}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 05: INTERACTIVE COMMAND TERMINAL & DIRECT CONTACT */}
        <section id="contact" className="gsap-section py-20 sm:py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                05. Interactive Command Shell & Direct Contact
              </h2>
              <p className="text-sm sm:text-base text-[#94a3b8] mt-2 max-w-[65ch]">
                Query Shahzaib Arshad’s engineering background via the interactive terminal or use the direct contact drawer to copy coordinates and launch an email inquiry.
              </p>
            </div>

            <button
              type="button"
              onClick={handleExportStandaloneHtml}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#9d4edd]/50 bg-[#9d4edd]/15 text-xs font-mono text-white hover:bg-[#9d4edd]/25 transition-all cursor-pointer self-start whitespace-nowrap"
            >
              {copiedQuick === 'html' ? (
                <Check className="h-4 w-4 text-[#00f5d4]" />
              ) : (
                <FileCode2 className="h-4 w-4 text-[#c77dff]" />
              )}
              <span>
                {copiedQuick === 'html'
                  ? 'Downloaded Standalone index.html'
                  : 'Download Single-File HTML (index.html)'}
              </span>
            </button>
          </div>

          <CommandTerminal onOpenResume={() => setIsResumeOpen(true)} />
        </section>
      </main>

      {/* Clean Editorial Footer (No Fake Telemetry Tickers) */}
      <footer className="relative z-10 border-t border-white/[0.08] bg-[#07090e]/90 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-10 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94a3b8]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-white">
              {PERSONAL_INFO.name}
            </span>
            <span aria-hidden="true">·</span>
            <span>{PERSONAL_INFO.shortRole}</span>
            <span aria-hidden="true">·</span>
            <span>{PERSONAL_INFO.location}</span>
          </div>

          <div className="flex flex-wrap items-center gap-5 font-mono">
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              className="hover:text-[#00f5d4] transition-colors"
            >
              {PERSONAL_INFO.email}
            </a>
            <a
              href={PERSONAL_INFO.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#00f5d4] transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={PERSONAL_INFO.vercelPortfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#00f5d4] transition-colors"
            >
              Vercel
            </a>
            <a
              href={PERSONAL_INFO.replitPortfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#00f5d4] transition-colors"
            >
              Replit
            </a>
            <button
              type="button"
              onClick={() => setIsResumeOpen(true)}
              className="text-[#00f5d4] hover:underline cursor-pointer"
            >
              Full CV
            </button>
          </div>
        </div>
      </footer>

      {/* Project Architecture Lightbox Modal */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Full Resume / CV & Single-File HTML Export Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </div>
  );
}
