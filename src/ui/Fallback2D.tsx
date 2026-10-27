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

export function Fallback2D() {
  const reasonNote = useJourney((s) => s.quality)

  return (
    <main id="readable" className="sheet">
      <div className="sheet__sky" aria-hidden="true" />
      <header className="sheet__hero">
        <div className="sheet__topbar">
          <p className="sheet__kicker">Night circuit · Readable mode</p>
          <button type="button" className="hud__btn" onClick={() => useJourney.getState().setMode('3d')}>
            Enter 3D drive
          </button>
        </div>
        <p className="sheet__eyebrow">Software Developer</p>
        <h1>{PROFILE.name}</h1>
        <p className="sheet__place">{PROFILE.location}</p>
        <p className="sheet__lead">{SUMMARY}</p>
        <p className="sheet__mail">
          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
        </p>
        {reasonNote === 'low' ? (
          <p className="sheet__note">
            2D mode keeps the CV readable on mobile, low-power devices, and reduced-motion settings.
          </p>
        ) : null}
      </header>

      <section className="sheet__block" aria-labelledby="skills-title">
        <p className="sheet__mile">{SECTIONS[2].kicker}</p>
        <h2 id="skills-title">Key Skills</h2>
        <ul className="sheet__chips">
          {SKILLS.map((s) => (
            <li key={s.label} style={{ borderColor: s.color, color: s.color }}>
              {s.label}
            </li>
          ))}
        </ul>
      </section>

      <section className="sheet__block" aria-labelledby="exp-title">
        <p className="sheet__mile">Miles 03–06 · Timeline</p>
        <h2 id="exp-title">Professional Experience</h2>
        <ol className="sheet__timeline">
          {EXPERIENCE.map((job) => (
            <li key={job.id}>
              <div className="sheet__stop" />
              <div>
                <p className="sheet__role">{job.role}</p>
                <h3>{job.company}</h3>
                <p className="sheet__dates">{job.dates}</p>
                <p>{job.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="sheet__block" aria-labelledby="edu-title">
        <p className="sheet__mile">{SECTIONS[7].kicker}</p>
        <h2 id="edu-title">Education & Certifications</h2>
        <h3>{EDUCATION.degree}</h3>
        <p>{EDUCATION.school}</p>
        <h3 className="sheet__cert">{EDUCATION.certTitle}</h3>
        <p>{EDUCATION.certBody}</p>
      </section>

      <section className="sheet__block" aria-labelledby="lang-title">
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
      </section>

      <section className="sheet__block sheet__block--end" aria-labelledby="contact-title">
        <p className="sheet__mile">{SECTIONS[9].kicker}</p>
        <h2 id="contact-title">Contact</h2>
        <p>
          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
        </p>
        <p>{PROFILE.location}</p>
      </section>
    </main>
  )
}
