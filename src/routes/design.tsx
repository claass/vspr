import { Route } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'

import '@/styles/tokens.css'
import '@/styles/base.css'
import '@/styles/components.css'
import '@/styles/themes.css'

type ThemeMode = 'night' | 'dawn'

type TriadOption = {
  id: string
  label: string
  className: string
  swatches: [string, string, string]
}

type Filament = {
  id: string
  title: string
  description: string
  path: string
}

const triadOptions: TriadOption[] = [
  {
    id: 'cyan-coral-peach',
    label: 'Cyan · Coral · Peach',
    className: 'triad-cyan-coral-peach',
    swatches: ['#45E1D2', '#FF6F61', '#FFC7A6'],
  },
  {
    id: 'jade-ember-opal',
    label: 'Jade · Ember · Opal',
    className: 'triad-jade-ember-opal',
    swatches: ['#20C997', '#FF7A3D', '#B6E3E0'],
  },
  {
    id: 'azure-rose-softgold',
    label: 'Azure · Rose · Soft Gold',
    className: 'triad-azure-rose-softgold',
    swatches: ['#2F80ED', '#FF7AA2', '#E7C175'],
  },
]

const themeBackground: Record<ThemeMode, string> = {
  night: '#0A0E12',
  dawn: '#F2EDE7',
}

const filaments: Filament[] = [
  {
    id: 'intent',
    title: 'Clarify intent',
    description:
      'We summarize your request and surface the key symbols guiding the response.',
    path: 'M8 92 C 48 48, 92 76, 124 36',
  },
  {
    id: 'sources',
    title: 'Reveal sources',
    description: 'Threads of provenance highlight citations and upstream context.',
    path: 'M8 24 C 44 62, 80 18, 124 64',
  },
  {
    id: 'next',
    title: 'Offer next steps',
    description: 'A final strand suggests gentle next actions instead of absolutes.',
    path: 'M12 60 C 52 28, 96 104, 128 92',
  },
]

const chaliceFillStages = [28, 62, 96]

function toLinear(channel: number): number {
  const proportion = channel / 255
  return proportion <= 0.04045
    ? proportion / 12.92
    : Math.pow((proportion + 0.055) / 1.055, 2.4)
}

function luminance(hex: string): number {
  const sanitized = hex.replace('#', '')
  const r = parseInt(sanitized.slice(0, 2), 16)
  const g = parseInt(sanitized.slice(2, 4), 16)
  const b = parseInt(sanitized.slice(4, 6), 16)
  const [lr, lg, lb] = [toLinear(r), toLinear(g), toLinear(b)]
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb
}

function contrastRatio(foreground: string, background: string): number {
  const l1 = luminance(foreground) + 0.05
  const l2 = luminance(background) + 0.05
  return l1 > l2 ? l1 / l2 : l2 / l1
}

function DesignGallery() {
  const [theme, setTheme] = useState<ThemeMode>('night')
  const [triad, setTriad] = useState<TriadOption>(triadOptions[0])
  const [candleLit, setCandleLit] = useState(true)
  const [chaliceStage, setChaliceStage] = useState(1)
  const [activeCoin, setActiveCoin] = useState('insight')
  const [orbThinking, setOrbThinking] = useState(true)
  const [activeFilament, setActiveFilament] = useState<Filament>(filaments[0])
  const [noiseEnabled, setNoiseEnabled] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [sansBody, setSansBody] = useState(false)
  const [supportsP3, setSupportsP3] = useState(false)

  useEffect(() => {
    const body = document.body
    const themeClasses = ['theme-night', 'theme-dawn']
    themeClasses.forEach((cls) => body.classList.remove(cls))
    body.classList.add(theme === 'night' ? 'theme-night' : 'theme-dawn')

    triadOptions.forEach((option) => body.classList.remove(option.className))
    body.classList.add(triad.className)

    body.classList.toggle('reduce-motion', reduceMotion)
    body.classList.toggle('hi-contrast', highContrast)
    body.classList.toggle('prefers-sans-body', sansBody)

    return () => {
      body.classList.remove(
        'theme-night',
        'theme-dawn',
        'reduce-motion',
        'hi-contrast',
        'prefers-sans-body',
        ...triadOptions.map((option) => option.className),
      )
    }
  }, [theme, triad, reduceMotion, highContrast, sansBody])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(media.matches)
    const listener = (event: MediaQueryListEvent) => {
      setReduceMotion(event.matches)
    }

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', listener)
    } else {
      media.addListener(listener)
    }

    return () => {
      if (typeof media.removeEventListener === 'function') {
        media.removeEventListener('change', listener)
      } else {
        media.removeListener(listener)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    if (typeof CSS !== 'undefined' && CSS.supports('color', 'color(display-p3 1 1 1)')) {
      setSupportsP3(true)
    }
  }, [])

  const chaliceFill = chaliceFillStages[chaliceStage] ?? chaliceFillStages[0]
  const contrast = useMemo(
    () => contrastRatio(triad.swatches[1], themeBackground[theme]),
    [triad, theme],
  )
  const passesAA = contrast >= 4.5

  return (
    <>
      <div
        className={`noise-overlay ${noiseEnabled ? 'is-active' : ''}`}
        aria-hidden="true"
      />
      <main className="app-shell" aria-label="Luminous Arcana gallery">
        <section className="control-panel" aria-labelledby="gallery-heading">
          <header>
            <p className="brand-heading" id="gallery-heading">
              Luminous Arcana Gallery
            </p>
            <p>
              A candle-lit altar of interface studies where every component carries a singular
              light source and material soul.
            </p>
          </header>

          <div className="control-panel__group" role="group" aria-labelledby="theme-toggle-label">
            <h2 id="theme-toggle-label">Theme</h2>
            {['night', 'dawn'].map((mode) => (
              <label key={mode} className="switch-option">
                <input
                  type="radio"
                  name="theme-mode"
                  value={mode}
                  checked={theme === mode as ThemeMode}
                  onChange={() => setTheme(mode as ThemeMode)}
                />
                <span>{mode === 'night' ? 'Night' : 'Dawn'}</span>
              </label>
            ))}
          </div>

          <div className="control-panel__group" role="group" aria-labelledby="triad-selector-label">
            <h2 id="triad-selector-label">Chromatic triad</h2>
            {triadOptions.map((option) => (
              <label key={option.id} className="switch-option">
                <input
                  type="radio"
                  name="triad"
                  value={option.id}
                  checked={triad.id === option.id}
                  onChange={() => setTriad(option)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>

          <div className="control-panel__group" aria-labelledby="preference-label">
            <h2 id="preference-label">Preferences</h2>
            <label className="switch-option">
              <input
                type="checkbox"
                checked={reduceMotion}
                onChange={() => setReduceMotion((value) => !value)}
              />
              <span>Reduce motion</span>
            </label>
            <label className="switch-option">
              <input
                type="checkbox"
                checked={highContrast}
                onChange={() => setHighContrast((value) => !value)}
              />
              <span>High contrast</span>
            </label>
            <label className="switch-option">
              <input
                type="checkbox"
                checked={sansBody}
                onChange={() => setSansBody((value) => !value)}
              />
              <span>Sans-serif body</span>
            </label>
          </div>
        </section>

        <div className="gallery">
          <section className="component-section" aria-labelledby="resin-button-heading">
            <div className="section-header">
              <h2 id="resin-button-heading">Resin slab button</h2>
              <p>Ember-lit resin slabs invite decisive actions without overwhelming the ritual.</p>
            </div>
            <div className="button-grid">
              <button className="btn-resin" data-variant="primary" type="button">
                Summon insight
              </button>
              <button className="btn-resin" data-variant="secondary" type="button">
                Gentle hold
              </button>
            </div>
          </section>

          <section className="component-section" aria-labelledby="candle-toggle-heading">
            <div className="section-header">
              <h2 id="candle-toggle-heading">Candle toggle</h2>
              <p>
                A waxen switch that breathes softly, keeping flame shimmer near the wick and far
                from distraction.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={candleLit}
              className="toggle-candle"
              onClick={() => setCandleLit((value) => !value)}
              data-motion={reduceMotion ? 'reduced' : 'full'}
            >
              <span className="toggle-candle__wick" aria-hidden="true" />
              <span className="toggle-candle__flame" aria-hidden="true" />
              <span className="toggle-candle__label">Guided glow</span>
              <span className="toggle-candle__description">
                {candleLit ? 'Illuminated' : 'At rest'}
              </span>
            </button>
          </section>

          <section className="component-section" aria-labelledby="chalice-heading">
            <div className="section-header">
              <h2 id="chalice-heading">Chalice progress</h2>
              <p>Light pools within an altar chalice, marking passage through the reading.</p>
            </div>
            <div className={`chalice ${chaliceFill >= 90 ? 'is-complete' : ''}`}>
              <div className="chalice__bowl" aria-hidden="true">
                <div className="chalice__liquid" style={{ height: `${chaliceFill}%` }} />
                <div className="chalice__ember" />
              </div>
              <div className="chalice__stem" aria-hidden="true" />
            </div>
            <p className="visually-hidden" role="status" aria-live="polite">
              Chalice fill at {chaliceFill}%.
            </p>
            <button
              type="button"
              className="btn-resin"
              data-variant="secondary"
              onClick={() => setChaliceStage((stage) => (stage + 1) % chaliceFillStages.length)}
            >
              Pour a little more light
            </button>
          </section>

          <section className="component-section" aria-labelledby="coin-tabs-heading">
            <div className="section-header">
              <h2 id="coin-tabs-heading">Coin tabs</h2>
              <p>Moonlit coins click into place for facet switching without breaking serenity.</p>
            </div>
            <div className="coins" role="tablist" aria-label="Reading facets">
              {[
                { id: 'insight', label: 'Insight', icon: 'M12 3l8 9-8 9-8-9 8-9z' },
                { id: 'ritual', label: 'Ritual', icon: 'M4 4h16v2H4zm2 4h12v2H6zm-2 4h16v2H4z' },
                { id: 'care', label: 'Care', icon: 'M12 21s-6-4.35-6-9a4 4 0 0 1 8 0 4 4 0 0 1 8 0c0 4.65-6 9-6 9z' },
              ].map((coin, index) => (
                <button
                  key={coin.id}
                  type="button"
                  role="tab"
                  aria-selected={activeCoin === coin.id}
                  aria-controls={`coin-panel-${coin.id}`}
                  id={`coin-${coin.id}`}
                  className={`coin ${activeCoin === coin.id ? 'is-active' : ''}`}
                  onClick={() => setActiveCoin(coin.id)}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d={coin.icon} />
                  </svg>
                  <span>{coin.label}</span>
                  <span className="coin__notch" aria-hidden="true" />
                  <span className="visually-hidden">{`Card ${index + 1} of 3`}</span>
                </button>
              ))}
            </div>
            {[
              {
                id: 'insight',
                text: 'The reading translates symbolism into calm, practical guidance.',
              },
              {
                id: 'ritual',
                text: 'Ritual view narrates how to prepare the space and intention.',
              },
              {
                id: 'care',
                text: 'Care mode focuses on emotional grounding and aftercare prompts.',
              },
            ].map((panel) => (
              <div
                key={panel.id}
                id={`coin-panel-${panel.id}`}
                role="tabpanel"
                className="coin-panel"
                hidden={activeCoin !== panel.id}
                aria-labelledby={`coin-${panel.id}`}
              >
                {panel.text}
              </div>
            ))}
          </section>

          <section className="component-section" aria-labelledby="tarot-heading">
            <div className="section-header">
              <h2 id="tarot-heading">Tarot cards</h2>
              <p>Glass tarot panels bend altar light differently when upright versus reversed.</p>
            </div>
            <div className="card-grid">
              <article className="card" aria-label="Tarot card 1 of 2 — The Seer, upright">
                <span className="card__inlay" aria-hidden="true" />
                <h3 className="card__title">The Seer</h3>
                <p className="card__body">Quiet perception sharpens your ability to notice unseen arcs.</p>
              </article>
              <article className="card is-reversed" aria-label="Tarot card 2 of 2 — The Seer, reversed">
                <span className="card__inlay" aria-hidden="true" />
                <h3 className="card__title">The Seer — reversed</h3>
                <p className="card__body">Too many signals at once may blur intent; pause before proceeding.</p>
              </article>
            </div>
          </section>

          <section className="component-section" aria-labelledby="orb-heading">
            <div className="section-header">
              <h2 id="orb-heading">Breathing orb</h2>
              <p>An opalescent orb pulses while the oracle communes, stilled on demand.</p>
            </div>
            <div
              className={`chat-orb ${orbThinking ? 'is-thinking' : ''}`}
              role="status"
              aria-live="polite"
            >
              <div className="chat-orb__pulse" aria-hidden="true" />
              <span>{orbThinking ? 'Listening' : 'Resting'}</span>
              <span className="visually-hidden">
                {orbThinking ? 'Oracle is composing' : 'Oracle is at rest'}
              </span>
            </div>
            <button
              type="button"
              className="btn-resin"
              data-variant="secondary"
              onClick={() => setOrbThinking((value) => !value)}
            >
              {orbThinking ? 'Pause the breath' : 'Resume the breath'}
            </button>
          </section>

          <section className="component-section" aria-labelledby="filaments-heading">
            <div className="section-header">
              <h2 id="filaments-heading">Explainability filaments</h2>
              <p>Each filament glows with a single light path to narrate why guidance emerged.</p>
            </div>
            <div className="explainability">
              <div className="explainability__text" role="tablist" aria-label="Explainability steps">
                {filaments.map((filament, index) => (
                  <button
                    key={filament.id}
                    type="button"
                    className={`explainability__sentence ${
                      activeFilament.id === filament.id ? 'is-active' : ''
                    }`}
                    onClick={() => setActiveFilament(filament)}
                    role="tab"
                    aria-selected={activeFilament.id === filament.id}
                    aria-controls={`filament-visual-${filament.id}`}
                    id={`filament-tab-${filament.id}`}
                  >
                    <strong>{filament.title}</strong>
                    <span>{filament.description}</span>
                    <span className="visually-hidden">{`Step ${index + 1} of ${filaments.length}`}</span>
                  </button>
                ))}
              </div>
              <svg
                className="explainability__filament"
                viewBox="0 0 140 120"
                role="img"
                aria-labelledby="filaments-heading"
              >
                {filaments.map((filament) => (
                  <path
                    key={filament.id}
                    id={`filament-visual-${filament.id}`}
                    d={filament.path}
                    className={`filament ${activeFilament.id === filament.id ? 'is-active' : ''}`}
                    stroke="var(--accent-b)"
                    strokeWidth={activeFilament.id === filament.id ? 2.5 : 1.2}
                    strokeLinecap="round"
                    fill="transparent"
                  >
                    <title>{filament.title}</title>
                  </path>
                ))}
              </svg>
            </div>
          </section>

          <section className="component-section" aria-labelledby="disclaimer-heading">
            <div className="section-header">
              <h2 id="disclaimer-heading">Guidance disclaimer</h2>
              <p>Even the softest glow should invite discernment over doctrine.</p>
            </div>
            <aside className="disclaimer" role="note">
              <span className="disclaimer__icon" aria-hidden="true">
                ✶
              </span>
              <div>
                <strong>Guidance, not gospel.</strong>
                <p>
                  Interpretations are luminous suggestions. Confirm choices with grounded context
                  and personal wisdom.
                </p>
              </div>
            </aside>
          </section>
        </div>

        <section className="qa-panel" aria-labelledby="qa-heading">
          <h2 id="qa-heading">Quality assurance</h2>
          <div className="qa-panel__row">
            <span>Gamut detection</span>
            <span>{supportsP3 ? 'P3 detected' : 'sRGB safeguards'}</span>
          </div>
          <div className="qa-panel__row">
            <span>Contrast (accent vs. background)</span>
            <span>{contrast.toFixed(2)} : 1 · {passesAA ? 'AA compliant' : 'Needs adjustment'}</span>
          </div>
          <div className="qa-panel__row qa-panel__noise">
            <label className="switch-option">
              <input
                type="checkbox"
                checked={noiseEnabled}
                onChange={() => setNoiseEnabled((value) => !value)}
              />
              <span>Micro-noise {noiseEnabled ? 'enabled' : 'disabled'}</span>
            </label>
          </div>
        </section>
      </main>
    </>
  )
}

export const Route = new Route({
  getParentRoute: () => import('./__root').then(m => m.Route),
  path: '/design',
  component: DesignGallery,
})

export default Route
