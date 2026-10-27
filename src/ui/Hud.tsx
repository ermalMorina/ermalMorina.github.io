import { getActiveSectionIndex, PROFILE, SECTIONS, TRACK_LENGTH_M } from '../content/cv'
import { jumpToSection } from '../hooks/useJourneyControls'
import { useJourney } from '../store/journey'

export function Hud() {
  const progress = useJourney((s) => s.progress)
  const speed = useJourney((s) => s.speed)
  const quality = useJourney((s) => s.quality)
  const hintVisible = useJourney((s) => s.hintVisible)
  const idx = getActiveSectionIndex(progress)
  const section = SECTIONS[idx]
  const kmh = Math.round(Math.abs(speed) * TRACK_LENGTH_M * 3.6)
  const km = (progress * TRACK_LENGTH_M) / 100

  return (
    <div className="hud">
      <header className="hud__top">
        <div>
          <p className="hud__brand">{PROFILE.name}</p>
          <p className="hud__role">{PROFILE.title}</p>
        </div>
        <div className="hud__actions">
          <button
            type="button"
            className="hud__btn"
            onClick={() =>
              useJourney.getState().setQuality(quality === 'high' ? 'low' : 'high')
            }
          >
            {quality === 'high' ? 'High FX' : 'Low FX'}
          </button>
          <button type="button" className="hud__btn" onClick={() => useJourney.getState().setMode('2d')}>
            Readable 2D
          </button>
        </div>
      </header>

      <nav className="hud__rail" aria-label="CV stops">
        {SECTIONS.map((item, i) => (
          <button
            key={item.id}
            type="button"
            className={`hud__dot ${i === idx ? 'is-active' : ''}`}
            onClick={() => jumpToSection(i)}
            aria-current={i === idx ? 'true' : undefined}
            title={item.title}
          >
            <span />
            <em>{item.title}</em>
          </button>
        ))}
      </nav>

      <article className="hud__card" aria-live="polite">
        <p className="hud__kicker">{section.kicker}</p>
        <h2>{section.title}</h2>
        {section.body ? <p className="hud__body">{section.body}</p> : null}
        {section.bullets ? (
          <ul className="hud__chips">
            {section.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        ) : null}
        {section.id === 'contact' ? (
          <p className="hud__contact">
            <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
            <span>{PROFILE.location}</span>
          </p>
        ) : null}
      </article>

      <footer className="hud__bottom">
        <div className="hud__meters">
          <span>
            {km.toFixed(2)} <small>km</small>
          </span>
          <span>
            {kmh} <small>km/h</small>
          </span>
        </div>
        {hintVisible ? (
          <p className="hud__hint">
            Scroll to cruise · WASD / arrows to drive · Shift boost · Space next stop
          </p>
        ) : (
          <p className="hud__hint hud__hint--quiet">A / D to change lanes</p>
        )}
      </footer>
    </div>
  )
}
