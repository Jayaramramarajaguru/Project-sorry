import { useEffect, useMemo, useState } from 'react'
import { EMOJIS, QUOTES, PROMISES, PAGES } from './data.js'

const IDS = PAGES.map((p) => p[0])

function useHashPage() {
  const read = () => {
    const h = (location.hash || '#home').slice(1)
    return IDS.includes(h) ? h : 'home'
  }
  const [page, setPage] = useState(read)
  useEffect(() => {
    const on = () => { setPage(read()); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return page
}

function Sky() {
  const items = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        e: EMOJIS[i % EMOJIS.length],
        style: {
          left: Math.random() * 100 + '%',
          fontSize: 16 + Math.random() * 28 + 'px',
          animationDuration: 9 + Math.random() * 10 + 's',
          animationDelay: '-' + Math.random() * 14 + 's',
          '--dx': Math.random() * 160 - 80 + 'px',
          '--dz': Math.random() * 300 - 100 + 'px',
        },
      })),
    []
  )
  return (
    <div id="sky" aria-hidden="true">
      {items.map((it, i) => (
        <span key={i} className="fl" style={it.style}>{it.e}</span>
      ))}
    </div>
  )
}

function Heart3D({ size = 170 }) {
  const layers = Array.from({ length: 13 }, (_, i) => i - 6)
  return (
    <div className="stage" style={size < 170 ? { height: 180 } : undefined}>
      <div className="heart3d" style={{ width: size, height: size }}>
        {layers.map((i) => (
          <span
            key={i}
            style={{
              fontSize: size,
              lineHeight: size + 'px',
              transform: `translateZ(${i * 3}px)`,
              filter: `brightness(${0.75 + (i + 6) / 24})`,
            }}
          >
            ❤️
          </span>
        ))}
      </div>
    </div>
  )
}

function Nav({ page }) {
  return (
    <nav>
      {PAGES.map(([id, label]) => (
        <a key={id} href={'#' + id} className={page === id ? 'on' : ''}>{label}</a>
      ))}
    </nav>
  )
}

function Home({ name, setName }) {
  return (
    <>
      <Heart3D />
      <h1>I’m so sorry, <span>{name}</span> 🥺💕</h1>
      <p className="lead">
        I made this little world just for you ✨ Every star, every heart and every word here says what I couldn’t say
        well enough: I miss you, I’m sorry, and I love you 💗🌹
      </p>
      <input
        className="name"
        placeholder="Type her name here 💝"
        maxLength={30}
        aria-label="Her name"
        onChange={(e) => setName(e.target.value.trim() || 'My Love')}
      />
      <p><a className="btn" href="#sorry">Read my apology 💌</a></p>
    </>
  )
}

function Sorry({ name }) {
  return (
    <>
      <h2>My Apology 🥺💔➡️💖</h2>
      <div className="letter">
        <p>Dear <b>{name}</b> 💕,</p>
        <p>I hurt you, and I hate that more than anything 😢 You deserved patience, and I gave you excuses. You deserved my best, and I gave you my worst moment. I’m truly, deeply sorry 🥀</p>
        <p>You are my favourite person 🌸 My calm after a long day, my laughter, my home 🏡 Losing your smile is the one thing I can’t accept ☀️</p>
        <p>I promise to listen more, shout less, and choose kindness every time 🤝 I will show it with actions, not only with words 🌷</p>
        <p>Forever yours, and still hoping 💞<br />Your sorry-hearted one 🧸✨</p>
      </div>
      <p><a className="btn" href="#quotes">Read more sorries 💌</a></p>
    </>
  )
}

function FlipCard({ emoji, text }) {
  const [open, setOpen] = useState(false)
  const toggle = () => setOpen((o) => !o)
  return (
    <div
      className={'flip' + (open ? ' open' : '')}
      role="button"
      tabIndex={0}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle() }
      }}
    >
      <div className="face front">{emoji + emoji + emoji}<small>Tap to open 💞</small></div>
      <div className="face back">{text} 💖</div>
    </div>
  )
}

function Quotes() {
  return (
    <>
      <h2>Sorry, Said 12 Ways 💌🥺</h2>
      <p className="lead">Tap a card to flip it 💖</p>
      <div className="grid">
        {QUOTES.map(([e, t]) => <FlipCard key={t} emoji={e} text={t} />)}
      </div>
      <p><a className="btn" href="#promises">See my promises 🌹</a></p>
    </>
  )
}

function TiltCard({ emoji, text }) {
  const [t, setT] = useState('')
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    setT(`perspective(700px) rotateY(${px * 22}deg) rotateX(${-py * 22}deg) scale(1.04)`)
  }
  return (
    <div className="tilt" style={{ transform: t }} onMouseMove={move} onMouseLeave={() => setT('')}>
      <b>{emoji}</b>{text} 💕
    </div>
  )
}

function Promises() {
  return (
    <>
      <h2>My Promises to You 🌹✨</h2>
      <div className="cube-wrap">
        <div className="cube">
          {['💖', '🥺', '🌹', '💍', '🧸', '💫'].map((e) => <div key={e}>{e}</div>)}
        </div>
      </div>
      <div className="grid">
        {PROMISES.map(([e, t]) => <TiltCard key={t} emoji={e} text={t} />)}
      </div>
      <p><a className="btn" href="#love">One last question 💍</a></p>
    </>
  )
}

function Love({ name }) {
  const [yes, setYes] = useState(false)
  const [bursts, setBursts] = useState([])
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const burst = () => {
    const batch = Array.from({ length: 40 }, (_, k) => ({
      id: Math.random(),
      e: EMOJIS[k % EMOJIS.length],
      x: Math.random() * 120 - 60 + 'vw',
      y: Math.random() * -90 - 10 + 'vh',
    }))
    setBursts((b) => [...b, ...batch])
    setTimeout(() => setBursts((b) => b.filter((x) => !batch.includes(x))), 1700)
  }
  const onYes = () => { setYes(true); burst(); setTimeout(burst, 500) }
  const dodge = () => setPos({ x: Math.random() * 160 - 80, y: Math.random() * 120 - 60 })

  return (
    <>
      <h2 className="big">Can you love me back? 🥺💞</h2>
      <Heart3D size={120} />
      <p className="q">“Even on my worst day, you are still my favourite place to return to.” 💖</p>
      <button className="btn" onClick={onYes}>Yes, I love you too 💕</button>
      <button
        className="btn"
        style={{ background: '#8a8a99', boxShadow: '0 10px 0 #5f5f70', position: 'relative', left: pos.x, top: pos.y }}
        onMouseEnter={dodge}
        onTouchStart={(e) => { e.preventDefault(); dodge() }}
        onClick={dodge}
      >
        No 😢
      </button>
      {yes && (
        <div className="yes-msg on">
          <h2>You just made me the happiest person alive 🥹💖</h2>
          <p className="lead">
            Thank you for giving me another chance, <b>{name}</b> 🌹 I will love you louder, listen closer, and never
            take your heart for granted 💍✨ Forever starts now 💕🫶
          </p>
        </div>
      )}
      {bursts.map((b) => (
        <span key={b.id} className="burst" style={{ left: '50%', top: '55%', '--x': b.x, '--y': b.y }}>{b.e}</span>
      ))}
    </>
  )
}

export default function App() {
  const page = useHashPage()
  const [name, setName] = useState('My Love')
  return (
    <>
      <Sky />
      <Nav page={page} />
      <main>
        <section className="view on" key={page}>
          {page === 'home' && <Home name={name} setName={setName} />}
          {page === 'sorry' && <Sorry name={name} />}
          {page === 'quotes' && <Quotes />}
          {page === 'promises' && <Promises />}
          {page === 'love' && <Love name={name} />}
        </section>
      </main>
    </>
  )
}
