import { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import { eras, mechanicalSystems, navItems, technicalSystems } from './data/siteData.js';

const fallbackDrivers = [
  ['lewis-hamilton', 'Lewis Hamilton', 'Record-Breaking Standard', "Hamilton redefined modern consistency and qualifying speed across multiple regulation eras. His seven titles, 106 wins, 206 podiums, and 104 poles place him at or near the top of Formula One's major all-time lists.", 7, 106, 206, 104, './assets/goat-hamilton-photo.jpg', 'Lewis Hamilton at the 2024 Chinese Grand Prix', 'crop-center', 'https://commons.wikimedia.org/wiki/File:Lewis_Hamilton_2024_Chinese_GP.jpg'],
  ['michael-schumacher', 'Michael Schumacher', 'Ferrari Dynasty Builder', "Schumacher turned Ferrari into the benchmark of the early 2000s, pairing relentless pace with technical feedback and physical preparation. His peak included five consecutive drivers' titles from 2000 to 2004.", 7, 91, 155, 68, './assets/goat-schumacher-photo.jpg', 'Michael Schumacher portrait at a Formula One event', 'crop-top', 'https://commons.wikimedia.org/wiki/File:Michael_Schumacher_01_(sk).jpg'],
  ['ayrton-senna', 'Ayrton Senna', 'Qualifying and Wet-Weather Genius', "Senna's raw speed, Monaco mastery, and intensity made him a defining figure of F1. His 65 pole positions and 41 wins came in an era where qualifying bravery and manual precision were brutally exposed.", 3, 41, 80, 65, './assets/goat-senna-photo.jpg', 'Ayrton Senna in Formula One racing gear', 'crop-center', 'https://commons.wikimedia.org/wiki/File:Ayrton_Senna_5.jpg'],
  ['juan-manuel-fangio', 'Juan Manuel Fangio', 'The Original Master', 'Fangio dominated the most dangerous early years of the championship. He won five titles with four different teams and took 24 victories from only 51 championship starts, an extraordinary strike rate.', 5, 24, 35, 29, './assets/goat-fangio-photo.jpg', 'Juan Manuel Fangio portrait from the early Formula One era', 'crop-top', 'https://commons.wikimedia.org/wiki/File:Juan_Manuel_Fangio_(circa_1952).jpg'],
  ['alain-prost', 'Alain Prost', 'The Professor', "Prost made race management a weapon. His calm, calculated style delivered four championships, 51 wins, and 106 podiums while shaping one of F1's greatest rivalries with Senna.", 4, 51, 106, 33, './assets/goat-prost-photo.jpg', 'Alain Prost at the 1991 United States Grand Prix', 'crop-center', 'https://commons.wikimedia.org/wiki/File:Alain_Prost_1991_United_States_GP.jpg'],
  ['max-verstappen', 'Max Verstappen', 'Modern Control and Attack', 'Verstappen became the reference of the current era through race pace, tyre control, and ruthless wheel-to-wheel execution. His 2023 season set new standards for sustained dominance.', 4, 71, 129, 48, './assets/goat-verstappen-photo.jpg', 'Max Verstappen driving at the 2022 Imola Grand Prix', 'crop-center', 'https://commons.wikimedia.org/wiki/File:Max_Verstappen_2022.jpg'],
  ['sebastian-vettel', 'Sebastian Vettel', 'The Red Bull Era Architect', "Vettel's four straight championships showed elite qualifying, tire-sensitive race control, and complete trust in high-downforce machinery. His 2013 run remains one of the sport's great domination streaks.", 4, 53, 122, 57, './assets/goat-vettel-photo.jpg', 'Sebastian Vettel during Formula One testing in 2019', 'crop-center', 'https://commons.wikimedia.org/wiki/File:Sebastian_Vettel-Ferrari-2019_(6).jpg']
].map(([slug, name, title, description, titles, wins, podiums, poles, image_path, image_alt, crop_class, source_url], index) => ({
  slug,
  name,
  title,
  description,
  titles,
  wins,
  podiums,
  poles,
  image_path,
  image_alt,
  crop_class,
  source_url,
  display_order: index + 1
}));

async function readApiJson(response) {
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    const text = await response.text();
    const message = text.slice(0, 120).replace(/\s+/g, ' ').trim();
    throw new Error(message || 'API route did not return JSON.');
  }

  return response.json();
}

function getRouteKey() {
  const route = window.location.hash.replace(/^#\/?/, '') || 'home';
  return ['home', 'evolution', 'mechanical', 'technical', 'goats'].includes(route) ? route : 'home';
}

function setPageMeta(routeKey) {
  const meta = {
    home: ['APEX-01 | Formula One Engineering Atelier', 'A premium Formula One engineering website presenting an F1 machine with studio lighting, materials, and exploded component details.'],
    evolution: ['F1 Evolution | APEX-01', 'A premium Formula One evolution archive showing how F1 cars changed across major engineering eras.'],
    mechanical: ['Mechanical Systems | APEX-01', 'A professional Formula One mechanical parts index covering chassis, suspension, brakes, cooling, gearbox, and aero assemblies.'],
    technical: ['Technical Systems | APEX-01', 'A professional Formula One technical systems page covering aerodynamics, hybrid recovery, thermal management, tyres, and vehicle dynamics.'],
    goats: ['F1 GOATs | APEX-01', 'A premium Formula One legends page covering seven of the greatest drivers in F1 history and their records.']
  }[routeKey] || ['APEX-01', 'Formula One engineering archive.'];

  document.title = meta[0];
  let description = document.querySelector('meta[name="description"]');
  if (!description) {
    description = document.createElement('meta');
    description.setAttribute('name', 'description');
    document.head.appendChild(description);
  }
  description.setAttribute('content', meta[1]);
  document.body.className = routeKey === 'home' ? '' : 'info-page';
}

function Header({ active, action, home }) {
  return (
    <header className="glass-header">
      <a className="header-logo" href="#/" aria-label="APEX-01 home">APEX<span>-01</span></a>
      <nav className="nav-links" aria-label="Primary navigation">
        {navItems.map((item) => (
          <a key={item.key} href={item.href} className={`nav-link ${active === item.key ? 'active' : ''}`}>{item.label}</a>
        ))}
      </nav>
      <div className="header-actions">{action}</div>
    </header>
  );
}

function InfoHero({ tagline, title, copy, image, alt }) {
  return (
    <section className="info-hero">
      <div className="info-hero-copy">
        <div className="tagline">{tagline}</div>
        <h1>{title}</h1>
        <p className="subheadline">{copy}</p>
      </div>
      <figure className="feature-visual">
        <img src={image} alt={alt} />
      </figure>
    </section>
  );
}

function EvolutionPage() {
  return (
    <>
      <Header active="evolution" action={<a className="cta-button primary" href="#/mechanical">Mechanical Index</a>} />
      <main className="info-shell">
        <InfoHero
          tagline="Formula One Evolution"
          title="Seven decades of pressure, speed, and rules."
          copy="A focused archive of the major design eras that turned simple racing machines into carbon, hybrid, ground-effect laboratories."
          image="./assets/f1-evolution-lineup.png"
          alt="Studio lineup showing Formula One car silhouettes evolving across decades"
        />
        <section className="era-timeline" aria-label="F1 car evolution timeline">
          {eras.map((era) => (
            <article className="era-card glass-card" key={era.year}>
              <img className="era-image" src={era.image} alt={era.alt} />
              <span className="era-year">{era.year}</span>
              <h2>{era.title}</h2>
              <p>{era.description}</p>
              <dl><dt>Signature idea</dt><dd>{era.signature}</dd></dl>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}

function MechanicalPage() {
  return (
    <>
      <Header active="mechanical" action={<a className="cta-button primary" href="#/technical">Technical Systems</a>} />
      <main className="info-shell">
        <InfoHero
          tagline="Mechanical Index"
          title="Every major assembly, explained cleanly."
          copy="A professional component view for the systems that define an F1 car: structure, suspension, braking, cooling, transmission, and aerodynamic hardware."
          image="./assets/f1-mechanical-exploded.png"
          alt="Exploded studio view of Formula One mechanical components"
        />
        <section className="systems-grid" aria-label="Formula One mechanical parts">
          {mechanicalSystems.map(([num, title, copy, image, alt]) => (
            <article className="system-card glass-card" key={title}>
              <img className="card-image" src={image} alt={alt} />
              <span>{num}</span>
              <h2>{title}</h2>
              <p>{copy}</p>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}

function TechnicalPage() {
  return (
    <>
      <Header active="technical" action={<a className="cta-button primary" href="#/evolution">Evolution Archive</a>} />
      <main className="info-shell">
        <InfoHero
          tagline="Technical Systems"
          title="The invisible work behind every lap."
          copy="Aerodynamics, energy recovery, tyre load, brake heat, and cooling behave as one connected technical system."
          image="./assets/f1-technical-flow.png"
          alt="Formula One car with technical airflow and energy visualization overlays"
        />
        <section className="technical-board" aria-label="Formula One technical systems">
          {technicalSystems.map(([title, copy, image, alt]) => (
            <article className="technical-row glass-card" key={title}>
              <img className="card-image" src={image} alt={alt} />
              <span>{title}</span>
              <p>{copy}</p>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}

function DriverCard({ driver }) {
  return (
    <article className="legend-card glass-card">
      <figure className="legend-photo">
        <img className={driver.crop_class || 'crop-center'} src={driver.image_path} alt={driver.image_alt} />
      </figure>
      <span className="era-year">{driver.name}</span>
      <h2>{driver.title}</h2>
      <p>{driver.description}</p>
      <div className="legend-stats">
        <span>{driver.titles} titles</span>
        <span>{driver.wins} wins</span>
        <span>{driver.podiums} podiums</span>
        <span>{driver.poles} poles</span>
      </div>
    </article>
  );
}

function FeedbackForm({ drivers }) {
  const [state, setState] = useState({ name: '', email: '', related_driver: '', message: '' });
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: 'loading', message: 'Sending suggestion...' });

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state)
      });
      const payload = await readApiJson(response);
      if (!response.ok) throw new Error(payload.error || 'Could not send feedback.');

      setState({ name: '', email: '', related_driver: '', message: '' });
      setStatus({ type: 'success', message: 'Suggestion received. It is saved in the MongoDB feedback collection.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  }

  return (
    <section className="feedback-panel glass-card" aria-label="GOAT suggestions form">
      <div>
        <span className="era-year">Feedback</span>
        <h2>Suggest a record update.</h2>
        <p>Send notes like “Add Alonso” or “Update Verstappen stats” and the backend will store them for review.</p>
      </div>
      <form className="feedback-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="feedback-name">Name</label>
          <input id="feedback-name" value={state.name} onChange={(e) => setState({ ...state, name: e.target.value })} required placeholder="Alex Mercer" />
        </div>
        <div className="form-group">
          <label htmlFor="feedback-email">Email</label>
          <input id="feedback-email" type="email" value={state.email} onChange={(e) => setState({ ...state, email: e.target.value })} placeholder="alex@example.com" />
        </div>
        <div className="form-group">
          <label htmlFor="feedback-driver">Related Driver</label>
          <select id="feedback-driver" value={state.related_driver} onChange={(e) => setState({ ...state, related_driver: e.target.value })}>
            <option value="">General suggestion</option>
            {drivers.map((driver) => <option value={driver.name} key={driver.slug}>{driver.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="feedback-message">Suggestion</label>
          <textarea id="feedback-message" value={state.message} onChange={(e) => setState({ ...state, message: e.target.value })} required placeholder="Add Alonso to the GOAT records..." />
        </div>
        <button className="cta-button primary full-width" type="submit" disabled={status.type === 'loading'}>Submit Suggestion</button>
        {status.type !== 'idle' && <p className={`form-status ${status.type}`}>{status.message}</p>}
      </form>
    </section>
  );
}

function GoatsPage() {
  const [drivers, setDrivers] = useState(fallbackDrivers);
  const [source, setSource] = useState('static fallback');

  useEffect(() => {
    let active = true;
    fetch('/api/drivers')
      .then((response) => {
        if (!response.ok) throw new Error('API unavailable');
        return readApiJson(response);
      })
      .then((payload) => {
        if (active && Array.isArray(payload.drivers)) {
          setDrivers(payload.drivers);
          setSource('database API');
        }
      })
      .catch(() => {
        if (active) setSource('static fallback');
      });

    return () => {
      active = false;
    };
  }, []);

  const credits = useMemo(() => drivers.filter((driver) => driver.source_url), [drivers]);

  return (
    <>
      <Header active="goats" action={<a className="cta-button primary" href="#/evolution">Evolution Archive</a>} />
      <main className="info-shell">
        <InfoHero
          tagline="Formula One GOATs"
          title="The drivers who bent the sport around them."
          copy={`Seven legends loaded from the ${source}, chosen for championships, records, racecraft, influence, and era-defining control.`}
          image="./assets/f1-goat-champions.png"
          alt="Seven racing helmets and trophies in a dark Formula One champions gallery"
        />
        <section className="legends-grid" aria-label="Formula One greatest drivers">
          {drivers.map((driver) => <DriverCard key={driver.slug} driver={driver} />)}
        </section>
        <FeedbackForm drivers={drivers} />
        <section className="photo-credits" aria-label="Photo credits">
          <p>
            Driver photos via Wikimedia Commons:{' '}
            {credits.map((driver, index) => (
              <span key={driver.slug}>
                <a href={driver.source_url}>{driver.name}</a>{index < credits.length - 1 ? ', ' : '.'}
              </span>
            ))}
          </p>
        </section>
      </main>
    </>
  );
}

function HomePage() {
  useEffect(() => {
    let active = true;
    import('./main.js').then(({ initHomeExperience }) => {
      if (active) initHomeExperience();
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <div id="preloader">
        <div className="loader-content">
          <div className="loader-logo">APEX-01</div>
          <div className="loader-sub">FORMULA ONE ENGINEERING ATELIER</div>
          <div className="progress-bar-container"><div className="progress-bar" id="progress-bar"></div></div>
          <div className="loader-status"><span id="loader-percentage">0%</span><span>CALIBRATING STUDIO</span></div>
        </div>
      </div>
      <Header
        active="home"
        home
        action={(
          <>
            <button className="audio-toggle" id="audio-toggle" aria-label="Toggle audio"><span className="audio-mark"></span><span className="audio-label">AUDIO OFF</span></button>
            <button className="cta-button primary booking-trigger">Private Viewing</button>
          </>
        )}
      />
      <div id="viewport-container" aria-hidden="true">
        <canvas id="three-canvas"></canvas>
        <canvas id="car-canvas"></canvas>
        <div id="hud-overlay">
          <div className="hud-box top-left"><span className="hud-label">Chassis</span><span className="hud-value">Carbon Monocoque</span></div>
          <div className="hud-box top-right"><span className="hud-label">Downforce Load</span><span className="hud-value" id="hud-downforce">0 KG</span></div>
          <div className="hud-box bottom-left"><span className="hud-label">Reference Speed</span><span className="hud-value" id="hud-speed">0 KM/H</span></div>
          <div className="hud-box bottom-right"><span className="hud-label">Mode</span><span className="hud-value" id="hud-gear">Studio</span></div>
        </div>
        <div id="hotspots-container"></div>
      </div>
      <main id="scroll-container">
        <section id="hero" className="scroll-section hero-section"><div className="section-content hero-content"><div className="tagline">Formula One Engineering Atelier</div><h1>APEX-01</h1><p className="subheadline">A study in carbon, titanium, air pressure, and restraint.</p><div className="button-group"><a className="cta-button primary" href="#/mechanical">Explore Engineering</a><button className="cta-button secondary" id="machine-startup-btn">Studio Startup</button></div></div></section>
        <section id="science-of-air" className="scroll-section left-align"><div className="section-content"><div className="tagline">Aerodynamics</div><h2>Pressure made visible.</h2><p>Every surface is composed to manage clean flow, thermal demand, and wake sensitivity without theatrical excess.</p><div className="aero-features-list">{['Front Wing', 'Cooling Bodywork', 'Underfloor', 'Diffuser'].map((item, index) => <button className={`aero-item ${index === 0 ? 'active' : ''}`} data-part={item.toLowerCase().replaceAll(' ', '-')} key={item}><span className="aero-num">{String(index + 1).padStart(2, '0')}</span><span><strong>{item}</strong><small>{['Multi-element carbon planes condition airflow before it reaches the suspension and floor edge.', 'Compact inlets feed heat exchangers while preserving the sidepod undercut.', 'Venturi tunnels create stable load with minimal visible disturbance.', 'Expansion geometry returns underfloor pressure with precision and composure.'][index]}</small></span></button>)}</div></div></section>
        <section id="car-explodes" className="scroll-section right-align"><div className="section-content"><div className="tagline">Exploded Engineering</div><h2>Every assembly, held in alignment.</h2><p>The car separates with the calm symmetry of a manufacturer technical presentation.</p><div className="parts-menu-container glass-card"><div className="parts-menu-header"><h4>Component Index</h4><span className="parts-count">11 primary systems</span></div><div className="parts-list" id="parts-list"></div></div></div></section>
        <section id="power-unit" className="scroll-section center-align"><div className="section-content"><div className="tagline">Power Unit</div><h2>Combustion, recovery, and control.</h2><p>The hybrid package is treated as a compact architectural object: thermal, electrical, and mechanical systems layered around the carbon survival cell.</p><div className="power-specs-grid">{[['V6 Turbo', '1.6 L', 'Direct-injection combustion core with tightly managed thermal loss.'], ['MGU-K', '120 kW', 'Kinetic recovery coupled to rear axle braking and deployment maps.'], ['MGU-H', 'Heat Recovery', 'Electrical control of turbo energy, response, and charge pressure.'], ['Gearbox', '8 Speed', 'Seamless-shift cassette housed behind the power unit.'], ['Differential', 'Torque Bias', 'Precision rear-load management through corner entry and traction phases.'], ['Cooling', 'Microchannel', 'Aluminum cores and ducting integrated into the bodywork volume.']].map(([title, value, copy]) => <div className="power-card glass-card" key={title}><h5>{title}</h5><div className="spec-value">{value}</div><p>{copy}</p></div>)}</div></div></section>
        <section id="craftsmanship" className="scroll-section left-align"><div className="section-content"><div className="tagline">Materials</div><h2>Nothing decorative. Everything structural.</h2><p>Carbon weave, machined metal, rubber, and fastener geometry carry the visual language of the car.</p><div className="materials-detail glass-card"><div className="materials-tabs"><button className="materials-tab active" data-material="carbon">Carbon Fiber</button><button className="materials-tab" data-material="titanium">Titanium</button><button className="materials-tab" data-material="precision">Metrology</button></div><div className="material-body" id="material-body"><h4>Matte and gloss carbon surfaces</h4><p>Directional weave, autoclave-cured resin, and clear-coated details are balanced to preserve a studio-photography finish.</p></div></div></div></section>
        <section id="speed-viz" className="scroll-section right-align"><div className="section-content"><div className="tagline">Performance Data</div><h2>Measured, not dramatized.</h2><p>Reference circuits provide calm engineering context for load, speed, and hybrid deployment.</p><div className="track-dashboard glass-card"><div className="track-selector">{['monaco', 'silverstone', 'suzuka', 'vegas'].map((track, index) => <button className={`track-btn ${index === 0 ? 'active' : ''}`} data-track={track} key={track}>{track[0].toUpperCase() + track.slice(1)}</button>)}</div><div className="track-display"><div className="track-map-container"><svg id="track-svg" viewBox="0 0 200 200" role="img" aria-label="Circuit reference map"><path id="track-path" fill="none" stroke="#eaeaea" strokeWidth="2" d=""></path><circle id="track-dot" r="3.5" fill="#ffffff"></circle></svg></div><div className="track-stats"><h4 id="track-name">MONACO</h4><div className="stat-row"><span>Top Velocity</span><span id="stat-speed" className="stat-num">292 KM/H</span></div><div className="stat-row"><span>Max Lateral Load</span><span id="stat-gforce" className="stat-num">5.2 G</span></div><div className="stat-row"><span>Hybrid Deployment</span><span id="stat-eboost" className="stat-num">100%</span></div><p className="track-description" id="track-desc">High downforce reference with low-speed precision and repeated traction events.</p></div></div></div></div></section>
        <section id="final-section" className="scroll-section center-align final-section"><div className="section-content"><div className="tagline">Private Exhibition</div><h2 className="ultra-headline">A machine of absolute intent.</h2><p className="subheadline">Built to be studied slowly.</p><div className="spec-table glass-card">{[['Architecture', 'Carbon monocoque hybrid'], ['Bodywork', 'Matte and gloss carbon'], ['Fasteners', 'Titanium and machined aluminum'], ['Tyres', 'Rubber racing slicks']].map(([label, value]) => <div className="spec-row" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div><div className="button-group margin-top"><button className="cta-button primary booking-trigger">Book Private Viewing</button><button className="cta-button secondary toggle-spec-sheet">View Specification</button></div></div></section>
      </main>
      <div className="modal-overlay" id="spec-modal"><div className="modal-content glass-card"><button className="modal-close" id="modal-close-btn" aria-label="Close specification modal">&times;</button><h3>Specification</h3><div className="modal-grids"><div className="modal-col"><h4>Chassis and Bodywork</h4><ul><li>Carbon fiber monocoque survival cell</li><li>Front wing, rear wing, and diffuser aero surfaces</li><li>Double wishbone suspension architecture</li><li>Carbon brake systems with forged hubs</li></ul></div><div className="modal-col"><h4>Powertrain</h4><ul><li>Turbocharged V6 hybrid power unit</li><li>MGU-K and MGU-H energy recovery</li><li>Seamless 8-speed gearbox</li><li>Rear differential and thermal management systems</li></ul></div></div></div></div>
      <div className="modal-overlay" id="booking-modal"><div className="modal-content glass-card booking-card"><button className="modal-close" id="booking-close-btn" aria-label="Close booking modal">&times;</button><h3>Private Viewing</h3><p>Request an invitation to a closed engineering presentation.</p><form className="booking-form" id="booking-form"><div className="form-group"><label htmlFor="booking-name">Full Name</label><input type="text" id="booking-name" required placeholder="Alexander Mercer" /></div><div className="form-group"><label htmlFor="booking-email">Email Address</label><input type="email" id="booking-email" required placeholder="alex@mercer.com" /></div><div className="form-group"><label htmlFor="booking-agency">Affiliation</label><input type="text" id="booking-agency" placeholder="Chassis Dynamics Ltd." /></div><button type="submit" className="cta-button primary full-width">Submit Request</button></form><div className="booking-success hidden" id="booking-success"><span className="success-icon">&#10003;</span><h4>Request Submitted</h4><p>The concierge team will reply after review.</p></div></div></div>
    </>
  );
}

function App() {
  const [routeKey, setRouteKey] = useState(getRouteKey);

  useEffect(() => {
    const handleRouteChange = () => {
      setRouteKey(getRouteKey());
      window.scrollTo({ top: 0, left: 0 });
    };

    window.addEventListener('hashchange', handleRouteChange);
    return () => window.removeEventListener('hashchange', handleRouteChange);
  }, []);

  useEffect(() => {
    setPageMeta(routeKey);
  }, [routeKey]);

  if (routeKey === 'evolution') return <EvolutionPage />;
  if (routeKey === 'mechanical') return <MechanicalPage />;
  if (routeKey === 'technical') return <TechnicalPage />;
  if (routeKey === 'goats') return <GoatsPage />;
  return <HomePage />;
}

createRoot(document.getElementById('root')).render(<App />);
