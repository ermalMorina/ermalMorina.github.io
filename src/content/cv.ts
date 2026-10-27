export type SectionId =
  | 'hero'
  | 'summary'
  | 'skills'
  | 'bmw'
  | 'healthread'
  | 'pabau'
  | 'starlabs'
  | 'education'
  | 'languages'
  | 'contact'

export type Theme = {
  fog: string
  ambient: string
  sun: string
  neon: string
  accent: string
}

export type Skill = {
  label: string
  color: string
}

export type ExperienceStop = {
  id: SectionId
  role: string
  company: string
  dates: string
  description: string
}

export type Section = {
  id: SectionId
  t: number
  kicker: string
  title: string
  theme: Theme
  body?: string
  bullets?: string[]
}

export const TRACK_LENGTH_M = 684.98

export const PROFILE = {
  name: 'Ermal Morina',
  title: 'Software Developer',
  location: 'Prishtine, Kosovo',
  email: 'ermalmorina2000@gmail.com',
} as const

export const SUMMARY =
  'Full Stack Developer with professional experience building and maintaining high-traffic web and mobile applications. Strong background in React, Next.js, Node.js, NestJS, GraphQL, PostgreSQL and modern application tooling, with hands-on experience across product development, API design, data-heavy interfaces, and mobile delivery.'

export const SKILLS: Skill[] = [
  { label: 'JavaScript', color: '#f7df1e' },
  { label: 'TypeScript', color: '#5bb3ff' },
  { label: 'React', color: '#61dafb' },
  { label: 'React Native', color: '#88e1ff' },
  { label: 'Next.js', color: '#ffffff' },
  { label: 'Node.js', color: '#3ecf8e' },
  { label: 'NestJS', color: '#e0234e' },
  { label: 'GraphQL', color: '#e535ab' },
  { label: 'PostgreSQL', color: '#7db7ff' },
  { label: 'SQL', color: '#c5dcff' },
  { label: 'AG Grid', color: '#ff6b6b' },
  { label: 'Docker', color: '#3b9bff' },
  { label: 'Expo', color: '#d4d4d8' },
  { label: 'Java', color: '#f89820' },
  { label: 'C#', color: '#9b6dff' },
  { label: 'REST APIs', color: '#00f0ff' },
]

export const EXPERIENCE: ExperienceStop[] = [
  {
    id: 'bmw',
    role: 'Software Engineer',
    company: 'BMW Group',
    dates: '01 Mar 2025 – Sep 2026',
    description:
      'Built and maintained applications within BMW Group platforms using React, Node.js, GraphQL and AG Grid. Developed and supported complex application features, improved data-heavy user interfaces, and contributed to reliable, maintainable solutions across the platform.',
  },
  {
    id: 'healthread',
    role: 'Mobile Software Engineer',
    company: 'Healthread - USA',
    dates: '2025 – 2026 · 1 year',
    description:
      'Developed and maintained mobile application features using React Native, Expo, Node.js and GraphQL. Worked across frontend and backend services, integrated APIs, resolved application issues, and delivered production-ready functionality for a healthcare-focused product.',
  },
  {
    id: 'pabau',
    role: 'Software Developer',
    company: 'Pabau Clinic Software',
    dates: '01 Jun 2023 – 31 Oct 2024',
    description:
      'Developed and maintained a high-traffic CRM application, delivering complex features and resolving subtle production issues. Built RESTful APIs and contributed to secure, performant application architecture using modern JavaScript and backend technologies.',
  },
  {
    id: 'starlabs',
    role: 'Software Developer Intern',
    company: 'Starlabs LLC',
    dates: '3 months',
    description:
      'Built sophisticated web application features and RESTful APIs while applying security, performance, and maintainability best practices. Delivered effective solutions to application development challenges in a professional engineering environment.',
  },
]

export const EDUCATION = {
  degree: 'Computer Science and Engineering',
  school: 'University for Business and Technology - Prishtine, Kosovo',
  certTitle: 'ICK React JS Course Completion',
  certBody:
    'React fundamentals, component architecture, lifecycle, Hooks, Redux, APIs and third-party libraries.',
} as const

export const LANGUAGES = [
  { name: 'Albanian', level: 'Native' },
  { name: 'English', level: 'Professional working proficiency' },
] as const

const heroTheme: Theme = {
  fog: '#1a0524',
  ambient: '#ff4da3',
  sun: '#ff6b35',
  neon: '#ff2bd6',
  accent: '#ffd166',
}

export const SECTIONS: Section[] = [
  {
    id: 'hero',
    t: 0.02,
    kicker: 'Mile 00 · Ignition',
    title: PROFILE.name,
    theme: heroTheme,
    body: `${PROFILE.title} · ${PROFILE.location}`,
  },
  {
    id: 'summary',
    t: 0.13,
    kicker: 'Mile 01 · Briefing',
    title: 'Professional Summary',
    theme: {
      fog: '#10061f',
      ambient: '#c44dff',
      sun: '#ff2bd6',
      neon: '#d46bff',
      accent: '#f5d6ff',
    },
    body: SUMMARY,
  },
  {
    id: 'skills',
    t: 0.24,
    kicker: 'Mile 02 · Loadout',
    title: 'Key Skills',
    theme: {
      fog: '#050a18',
      ambient: '#00e5ff',
      sun: '#5ce1ff',
      neon: '#00f0ff',
      accent: '#ffffff',
    },
    bullets: SKILLS.map((s) => s.label),
  },
  {
    id: 'bmw',
    t: 0.38,
    kicker: 'Mile 03 · Stop 01',
    title: EXPERIENCE[0].company,
    theme: {
      fog: '#041018',
      ambient: '#3d9bff',
      sun: '#7ec8ff',
      neon: '#1e90ff',
      accent: '#d7ecff',
    },
    body: `${EXPERIENCE[0].role} · ${EXPERIENCE[0].dates}\n\n${EXPERIENCE[0].description}`,
  },
  {
    id: 'healthread',
    t: 0.5,
    kicker: 'Mile 04 · Stop 02',
    title: EXPERIENCE[1].company,
    theme: {
      fog: '#04140f',
      ambient: '#2ee6a6',
      sun: '#5cffc0',
      neon: '#2ee6a6',
      accent: '#e9fff7',
    },
    body: `${EXPERIENCE[1].role} · ${EXPERIENCE[1].dates}\n\n${EXPERIENCE[1].description}`,
  },
  {
    id: 'pabau',
    t: 0.62,
    kicker: 'Mile 05 · Stop 03',
    title: EXPERIENCE[2].company,
    theme: {
      fog: '#160814',
      ambient: '#ff5bb0',
      sun: '#ffd166',
      neon: '#ff5bb0',
      accent: '#ffe7a3',
    },
    body: `${EXPERIENCE[2].role} · ${EXPERIENCE[2].dates}\n\n${EXPERIENCE[2].description}`,
  },
  {
    id: 'starlabs',
    t: 0.73,
    kicker: 'Mile 06 · Stop 04',
    title: EXPERIENCE[3].company,
    theme: {
      fog: '#160d05',
      ambient: '#ff9f1c',
      sun: '#ff7b00',
      neon: '#ffb347',
      accent: '#ffe0b0',
    },
    body: `${EXPERIENCE[3].role} · ${EXPERIENCE[3].dates}\n\n${EXPERIENCE[3].description}`,
  },
  {
    id: 'education',
    t: 0.84,
    kicker: 'Mile 07 · Campus',
    title: 'Education & Certifications',
    theme: {
      fog: '#0c0620',
      ambient: '#9b5cff',
      sun: '#c77dff',
      neon: '#b388ff',
      accent: '#f0e6ff',
    },
    body: `${EDUCATION.degree}\n${EDUCATION.school}\n\n${EDUCATION.certTitle}\n${EDUCATION.certBody}`,
  },
  {
    id: 'languages',
    t: 0.91,
    kicker: 'Mile 08 · Signals',
    title: 'Languages',
    theme: {
      fog: '#08101c',
      ambient: '#7fdbff',
      sun: '#f4fbff',
      neon: '#9be7ff',
      accent: '#ffffff',
    },
    bullets: LANGUAGES.map((l) => `${l.name} — ${l.level}`),
  },
  {
    id: 'contact',
    t: 0.985,
    kicker: 'Mile 09 · Destination',
    title: 'Contact',
    theme: {
      fog: '#1a0614',
      ambient: '#ff2bd6',
      sun: '#ff9ecd',
      neon: '#ff2bd6',
      accent: '#00f0ff',
    },
  },
]

export function getActiveSectionIndex(progress: number): number {
  let idx = 0
  for (let i = 0; i < SECTIONS.length; i += 1) {
    if (progress + 0.03 >= SECTIONS[i].t) idx = i
  }
  return idx
}

export function getSectionBlend(progress: number): {
  from: Section
  to: Section
  mix: number
} {
  const last = SECTIONS.length - 1
  if (progress <= SECTIONS[0].t) {
    return { from: SECTIONS[0], to: SECTIONS[0], mix: 0 }
  }
  if (progress >= SECTIONS[last].t) {
    return { from: SECTIONS[last], to: SECTIONS[last], mix: 0 }
  }
  for (let i = 0; i < last; i += 1) {
    const a = SECTIONS[i]
    const b = SECTIONS[i + 1]
    if (progress >= a.t && progress <= b.t) {
      const span = Math.max(0.0001, b.t - a.t)
      return { from: a, to: b, mix: (progress - a.t) / span }
    }
  }
  return { from: SECTIONS[last], to: SECTIONS[last], mix: 0 }
}
