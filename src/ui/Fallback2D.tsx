import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  EDUCATION,
  EXPERIENCE,
  LANGUAGES,
  PROFILE,
  SECTIONS,
  SKILLS,
  SUMMARY,
} from '../content/cv'
import { useJourney } from '../store/journey'

const STARS: [number, number, number][] = [
  [4, 8, 1.2],
  [11, 18, 0.8],
  [18, 6, 1.4],
  [23, 22, 0.7],
  [29, 11, 1.1],
  [36, 4, 0.9],
  [42, 19, 1.3],
  [48, 9, 0.6],
  [55, 15, 1.0],
  [61, 5, 1.5],
  [67, 21, 0.8],
  [73, 7, 1.1],
  [79, 16, 0.7],
  [86, 3, 1.4],
  [92, 12, 0.9],
  [8, 28, 0.6],
  [15, 34, 1.0],
  [27, 31, 0.8],
  [39, 27, 1.2],
  [51, 33, 0.7],
  [64, 29, 1.1],
  [76, 35, 0.6],
  [88, 26, 1.3],
  [96, 32, 0.8],
  [6, 41, 0.9],
  [21, 38, 0.7],
  [33, 43, 1.0],
  [58, 40, 0.8],
  [71, 44, 1.2],
  [84, 39, 0.6],
  [13, 48, 0.7],
  [45, 46, 1.1],
  [69, 49, 0.8],
  [91, 47, 1.0],
]

const BUILDINGS = [
  { x: 0, w: 42, h: 38 },
  { x: 38, w: 28, h: 62 },
  { x: 64, w: 50, h: 44 },
  { x: 110, w: 22, h: 78 },
  { x: 130, w: 40, h: 52 },
  { x: 168, w: 18, h: 90 },
  { x: 186, w: 36, h: 48 },
  { x: 220, w: 54, h: 70 },
  { x: 272, w: 24, h: 40 },
  { x: 294, w: 46, h: 86 },
  { x: 338, w: 32, h: 56 },
  { x: 368, w: 20, h: 96 },
  { x: 386, w: 48, h: 42 },
  { x: 432, w: 30, h: 64 },
  { x: 460, w: 58, h: 50 },
  { x: 516, w: 16, h: 82 },
  { x: 532, w: 40, h: 46 },
  { x: 570, w: 26, h: 72 },
  { x: 594, w: 44, h: 58 },
  { x: 636, w: 22, h: 88 },
  { x: 656, w: 50, h: 40 },
  { x: 704, w: 34, h: 66 },
  { x: 736, w: 18, h: 94 },
  { x: 754, w: 42, h: 52 },
  { x: 794, w: 28, h: 74 },
  { x: 820, w: 56, h: 44 },
  { x: 874, w: 20, h: 80 },
  { x: 892, w: 38, h: 54 },
  { x: 928, w: 48, h: 68 },
  { x: 974, w: 24, h: 42 },
  { x: 996, w: 52, h: 60 },
  { x: 1046, w: 18, h: 92 },
  { x: 1062, w: 40, h: 48 },
  { x: 1100, w: 30, h: 76 },
  { x: 1128, w: 44, h: 50 },
  { x: 1170, w: 30, h: 64 },
]

function NightWorld() {
  return (
    <div className="sheet__world" aria-hidden="true">
      <div className="sheet__orb sheet__orb--a" />
      <div className="sheet__orb sheet__orb--b" />
      <div className="sheet__orb sheet__orb--c" />
      <div className="sheet__orb sheet__orb--d" />
      <svg className="sheet__stars" viewBox="0 0 100 50" preserveAspectRatio="xMidYMin slice">
        {STARS.map(([x, y, r], i) => (
          <circle
            key={`${x}-${y}`}
            className={i % 5 === 0 ? 'sheet__star sheet__star--twinkle' : 'sheet__star'}
            cx={x}
            cy={y}
            r={r * 0.12}
          />
        ))}
      </svg>
      <div className="sheet__sun">
        <div className="sheet__sun-core" />
        <div className="sheet__sun-stripes" />
      </div>
      <svg className="sheet__skyline" viewBox="0 0 1200 160" preserveAspectRatio="xMidYMax slice">
        {BUILDINGS.map((b) => (
          <rect key={b.x} x={b.x} y={160 - b.h} width={b.w} height={b.h} />
        ))}
      </svg>
      <div className="sheet__horizon" />
      <div className="sheet__grid" />
      <div className="sheet__road" />
      <div className="sheet__vignette" />
    </div>
  )
}

function GlassCard({
  tag = 'section',
  labelledBy,
  children,
  eager = false,
}: {
  tag?: 'section' | 'header' | 'article'
  labelledBy?: string
  children: ReactNode
  eager?: boolean
}) {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(eager)
  const Tag = tag

  useEffect(() => {
    if (eager) return
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [eager])

  return (
    <Tag ref={ref as never} className={`sheet__card${inView ? ' is-in' : ''}`} aria-labelledby={labelledBy}>
      {children}
    </Tag>
  )
}

export function Fallback2D() {
  const reasonNote = useJourney((s) => s.quality)

  return (
    <main id="readable" className="sheet">
      <NightWorld />

      <GlassCard tag="header" eager>
        <div className="sheet__topbar">
          <p className="sheet__kicker">Night circuit · Readable mode</p>
          <button type="button" className="hud__btn" onClick={() => useJourney.getState().setMode('3d')}>
            Enter 3D drive
          </button>
        </div>
        <p className="sheet__eyebrow">Software Developer</p>
        <h1>{PROFILE.name}</h1>
        <p className="sheet__place">{PROFILE.location}</p>
        {reasonNote === 'low' ? (
          <p className="sheet__note">
            2D mode keeps the CV readable on mobile, low-power devices, and reduced-motion settings.
          </p>
        ) : null}
      </GlassCard>

      <GlassCard labelledBy="summary-title">
        <p className="sheet__mile">{SECTIONS[1].kicker}</p>
        <h2 id="summary-title">Professional Summary</h2>
        <p className="sheet__lead">{SUMMARY}</p>
      </GlassCard>

      <GlassCard labelledBy="skills-title">
        <p className="sheet__mile">{SECTIONS[2].kicker}</p>
        <h2 id="skills-title">Key Skills</h2>
        <ul className="sheet__chips">
          {SKILLS.map((s) => (
            <li key={s.label} style={{ borderColor: s.color, color: s.color }}>
              {s.label}
            </li>
          ))}
        </ul>
      </GlassCard>

      {EXPERIENCE.map((job, i) => (
        <GlassCard key={job.id} labelledBy={`${job.id}-title`}>
          <p className="sheet__mile">{SECTIONS[3 + i]?.kicker ?? `Stop 0${i + 1}`}</p>
          <p className="sheet__role">{job.role}</p>
          <h2 id={`${job.id}-title`}>{job.company}</h2>
          <p className="sheet__dates">{job.dates}</p>
          <p className="sheet__copy">{job.description}</p>
        </GlassCard>
      ))}

      <GlassCard labelledBy="edu-title">
        <p className="sheet__mile">{SECTIONS[7].kicker}</p>
        <h2 id="edu-title">Education & Certifications</h2>
        <h3>{EDUCATION.degree}</h3>
        <p className="sheet__copy">{EDUCATION.school}</p>
        <h3 className="sheet__cert">{EDUCATION.certTitle}</h3>
        <p className="sheet__copy">{EDUCATION.certBody}</p>
      </GlassCard>

      <GlassCard labelledBy="lang-title">
        <p className="sheet__mile">{SECTIONS[8].kicker}</p>
        <h2 id="lang-title">Languages</h2>
        <ul className="sheet__langs">
          {LANGUAGES.map((l) => (
            <li key={l.name}>
              <strong>{l.name}</strong>
              <span>{l.level}</span>
            </li>
          ))}
        </ul>
      </GlassCard>

      <GlassCard labelledBy="contact-title">
        <p className="sheet__mile">{SECTIONS[9].kicker}</p>
        <h2 id="contact-title">Contact</h2>
        <p className="sheet__copy">
          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
        </p>
        <p className="sheet__copy">{PROFILE.location}</p>
      </GlassCard>
    </main>
  )
}
