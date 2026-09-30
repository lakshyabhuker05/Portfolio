import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as THREE from 'three';
import gsap from 'gsap';
import './styles/main.css';

const GITHUB = 'https://github.com/lakshyabhuker05';
const LINKEDIN = 'https://linkedin.com/in/lakshyabhuker/';
const EMAIL = 'mailto:lakshyabhuker@email.com';
const PHONE = 'tel:+918295991511';

const projects = [
  { id: 'drone', title: 'Drone Delivery Management System', date: 'Jun 2026 – Jul 2026', eyebrow: 'Delivery Operations Platform', description: 'A responsive drone delivery management system to organize delivery requests, drone assignments, order tracking and centralized delivery operations.', purpose: 'Organizes order details, drone allocation, delivery status and operational updates through a structured workflow.', features: ['Delivery request management', 'Drone assignment workflow', 'Order tracking and delivery status', 'Centralized operations interface'], stack: ['C/C++', 'JavaScript', 'HTML', 'CSS'] },
  { id: 'recall', title: 'Recall — Personal Knowledge & Active Recall System', date: 'Mar 2026 – Apr 2026', eyebrow: 'Knowledge Platform', description: 'A full-stack knowledge platform for capturing, organizing, searching and reviewing learning content.', purpose: 'Creates a searchable and reviewable workflow for learning content with active-recall support.', features: ['JWT authentication and password hashing', 'Protected APIs and MongoDB persistence', 'Review queues and confidence tracking', 'Topic health, search and filtering'], stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'REST APIs'] },
  { id: 'contest', title: 'Contest Tracker System', date: 'Aug 2026 – Sep 2026', eyebrow: 'Competitive Programming Platform', description: 'A full-stack platform for tracking competitive programming contests, schedules and participation data.', purpose: 'Provides a responsive dashboard for discovering, filtering and monitoring coding contests.', features: ['Upcoming contests dashboard', 'Contest listings and filtering', 'Tracking interface', 'Frontend/backend integration'], stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs'] }
];

const skillGroups = [
  ['Languages', ['C/C++', 'JavaScript', 'HTML', 'CSS', 'Python']],
  ['Frameworks & Libraries', ['React.js', 'Next.js', 'Node.js']],
  ['Databases', ['MySQL', 'MongoDB']],
  ['Developer Tools', ['VS Code', 'Git', 'GitHub']],
  ['Core Subjects', ['Data Structures & Algorithms', 'OOPS', 'Database Management Systems', 'Operating Systems']],
  ['Soft Skills', ['Adaptability', 'Team Work', 'Problem Solving']]
];

const certs = [
  ['Programming Using C++', 'Infosys SpringBoard', 'Aug 2025'],
  ['Data Structure and Algorithm', 'NeoColab (An NIIT Venture)', 'Jun 2026'],
  ['Object Oriented Programming', 'NeoColab (An NIIT Venture)', 'Jun 2026']
];

function App() {
  const [theme, setTheme] = useState('dark');
  const [active, setActive] = useState('home');
  const [selected, setSelected] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [intro, setIntro] = useState(() => { try { return sessionStorage.getItem('lb_intro_seen') !== '1'; } catch { return true; } });

  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update(); media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); }), { rootMargin: '-30% 0px -55% 0px' });
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const closeIntro = useCallback(() => { try { sessionStorage.setItem('lb_intro_seen', '1'); } catch {} setIntro(false); }, []);
  const replayIntro = useCallback(() => { try { sessionStorage.removeItem('lb_intro_seen'); } catch {} setIntro(true); }, []);
  const go = id => { setMobileMenu(false); document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); };

  return <div className="app">
    {intro && <Intro onComplete={closeIntro} reduced={reduced} />}
    <GlobalScene reduced={reduced} />
    <Cursor />
    <header className="nav">
      <button className="logo" onClick={() => go('home')} aria-label="Go to home">LB<span>/</span></button>
      <nav className={mobileMenu ? 'open' : ''} aria-label="Primary navigation">
        {['home', 'about', 'skills', 'projects', 'journey', 'certificates', 'contact'].map(id => <button key={id} className={active === id ? 'active' : ''} onClick={() => go(id)}>{id}</button>)}
      </nav>
      <div className="navActions">
        <a className="iconLink" href={GITHUB} target="_blank" rel="noreferrer" aria-label="GitHub">GH</a>
        <button className="themeBtn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">{theme === 'dark' ? '☼' : '◐'}</button>
        <button className="menuBtn" onClick={() => setMobileMenu(v => !v)} aria-label="Toggle menu" aria-expanded={mobileMenu}><span/><span/></button>
      </div>
    </header>

    <main>
      <Hero reduced={reduced} onProjects={() => go('projects')} />
      <About />
      <Skills />
      <Projects onOpen={setSelected} />
      <Journey />
      <Certificates />
      <Contact onReplay={replayIntro} />
    </main>
    <footer><span>LAKSHYA BHUKER</span><span>© 2026 · INTERACTIVE ENGINEERING PORTFOLIO</span><span>CS / WEB / DSA</span></footer>
    {selected && <ProjectExperience project={selected} onClose={() => setSelected(null)} />}
  </div>;
}

function Intro({ onComplete, reduced }) {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const finish = () => onComplete();
    if (reduced) {
      const timer = setTimeout(finish, 420);
      return () => clearTimeout(timer);
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: finish });
      tl.fromTo('.introName', { opacity: 0, y: 16, letterSpacing: '0.22em' }, { opacity: 1, y: 0, letterSpacing: '-0.045em', duration: 0.55, ease: 'power3.out' })
        .fromTo('.introRole', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, '-=0.25')
        .to({}, { duration: 0.35 })
        .to('.intro', { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)', duration: 0.58, ease: 'power4.inOut' })
        .set(root, { pointerEvents: 'none' });
      gsap.fromTo('.introCut', { x: '100vw' }, { x: '-12vw', duration: 0.58, ease: 'power4.inOut', delay: 1.25 });
      gsap.to('.introParticle', { y: -18, x: 10, opacity: 0.25, duration: 1.4, stagger: 0.05, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }, root);
    const safety = setTimeout(finish, 2500);
    return () => { clearTimeout(safety); ctx.revert(); };
  }, [onComplete, reduced]);
  return <div ref={ref} className="intro" role="presentation">
    <div className="introGrid" />
    <div className="introAtmosphere" />
    {Array.from({ length: 18 }, (_, i) => <i className="introParticle" key={i} style={{ '--i': i }} />)}
    <div className="introCut" />
    <div className="introCore">
      <span className="introKicker">SYSTEM INITIALIZING / 001</span>
      <div className="introName">LAKSHYA <b>BHUKER</b></div>
      <div className="introRole">SOFTWARE ENGINEER&nbsp; / &nbsp;FULL-STACK DEVELOPER</div>
      <div className="introMeta">3D · WEB · DSA · ENGINEERING</div>
    </div>
    <button className="skip" onClick={onComplete}>SKIP INTRO →</button>
  </div>;
}

function GlobalScene({ reduced }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, .1, 100); camera.position.z = 8;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(devicePixelRatio, reduced ? 1 : 1.25)); renderer.setSize(innerWidth, innerHeight);
    const geo = new THREE.BufferGeometry(); const n = reduced ? 120 : 360; const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { pos[i * 3] = (Math.random() - .5) * 24; pos[i * 3 + 1] = (Math.random() - .5) * 16; pos[i * 3 + 2] = (Math.random() - .5) * 14; }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: 0x79dfff, size: .016, transparent: true, opacity: .28 });
    const stars = new THREE.Points(geo, mat); scene.add(stars);
    let raf = 0; const clock = new THREE.Clock();
    const loop = () => { raf = requestAnimationFrame(loop); if (!reduced) stars.rotation.y = clock.getElapsedTime() * .004; renderer.render(scene, camera); }; loop();
    const resize = () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); };
    addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', resize); geo.dispose(); mat.dispose(); renderer.dispose(); };
  }, [reduced]);
  return <canvas ref={ref} className="globalCanvas" aria-hidden="true" />;
}

function Cursor() {
  useEffect(() => {
    if (matchMedia('(pointer: coarse)').matches) return undefined;
    const cursor = document.querySelector('.cursor'); if (!cursor) return undefined;
    const move = e => { cursor.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`; };
    const over = e => cursor.classList.toggle('hover', !!e.target.closest('a,button,.interactive,.projectCard'));
    addEventListener('pointermove', move); addEventListener('pointerover', over);
    return () => { removeEventListener('pointermove', move); removeEventListener('pointerover', over); };
  }, []);
  return <div className="cursor" aria-hidden="true" />;
}

function Hero({ reduced, onProjects }) {
  return <section id="home" className="hero sectionTop">
    <div className="heroCopy">
      <div className="eyebrow">SOFTWARE ENGINEER / FULL-STACK DEVELOPER</div>
      <h1>BUILDING<br /><span>DIGITAL</span><br />SYSTEMS.</h1>
      <p>I'm Lakshya Bhuker — a BTech Computer Science student building practical web systems, exploring software fundamentals and solving problems with C/C++ and JavaScript.</p>
      <div className="heroBtns"><button className="btn primary magnetic" onClick={onProjects}>VIEW PROJECTS <b>↗</b></button><a className="btn magnetic" href="/resume.pdf" target="_blank" rel="noreferrer">VIEW RESUME <b>↗</b></a></div>
      <div className="heroMeta"><span>LOVELY PROFESSIONAL UNIVERSITY</span><span>CGPA 7.13</span><span>150+ PROBLEMS</span></div>
    </div>
    <div className="heroVisual">
      <div className="sceneLabel">PERSONAL SYSTEM / ONLINE</div>
      <div className="heroGlow" />
      <div className="photoFrame"><div className="photoScan" /><img src="/profile.png" alt="Lakshya Bhuker professional portrait" /><div className="photoHud top">IDENTITY / LAKSHYA BHUKER</div><div className="photoHud bottom">CSE / WEB / DSA</div></div>
      <div className="companionDrone"><DroneCanvas reduced={reduced} /></div>
      <div className="orbit orbit1" /><div className="orbit orbit2" />
      <div className="heroHint">MOVE POINTER / INTERACT ↗</div>
    </div>
  </section>;
}

function DroneCanvas({ reduced = false, flight = false, status = 'READY', progress = 0, onProgress }) {
  const mountRef = useRef(null); const statusRef = useRef(status); const progressRef = useRef(progress);
  useEffect(() => { statusRef.current = status; }, [status]);
  useEffect(() => { progressRef.current = progress; }, [progress]);
  useEffect(() => {
    const mount = mountRef.current; if (!mount) return undefined;
    const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(38, Math.max(1, mount.clientWidth) / Math.max(1, mount.clientHeight), .1, 100); camera.position.set(0, 1.3, 7.4);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' }); renderer.setPixelRatio(Math.min(devicePixelRatio, reduced ? 1 : 1.35)); renderer.setSize(mount.clientWidth, mount.clientHeight); renderer.shadowMap.enabled = true; renderer.outputColorSpace = THREE.SRGBColorSpace; mount.appendChild(renderer.domElement);
    scene.add(new THREE.HemisphereLight(0xc9f5ff, 0x07111e, 1.5)); const key = new THREE.DirectionalLight(0xe8f8ff, 2.1); key.position.set(4, 6, 5); key.castShadow = true; scene.add(key);
    const rim = new THREE.PointLight(0x55e8ff, 5, 12); rim.position.set(-3, 2, 1); scene.add(rim);
    const rig = new THREE.Group(); scene.add(rig);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x27384c, metalness: .84, roughness: .22 });
    const topMat = new THREE.MeshStandardMaterial({ color: 0xeaf7ff, metalness: .7, roughness: .2 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x07111e, metalness: .68, roughness: .24 });
    const glowMat = new THREE.MeshStandardMaterial({ color: 0x76edff, emissive: 0x2dd9ff, emissiveIntensity: 4, roughness: .2 });
    const cargoMat = new THREE.MeshStandardMaterial({ color: 0xa97b49, roughness: .72 });
    const body = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 18, 0, Math.PI * 2, 0, Math.PI * .55), bodyMat); body.scale.set(1.22, .64, .82); body.rotation.x = Math.PI; body.position.y = .12; body.castShadow = true; rig.add(body);
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.2, .26, .82), topMat); top.position.y = .38; top.castShadow = true; rig.add(top);
    const cargo = new THREE.Mesh(new THREE.BoxGeometry(.5, .42, .46), cargoMat); cargo.position.set(0, -.54, .08); cargo.castShadow = true; rig.add(cargo);
    const propellers = []; const lights = [];
    [[1.78, 0, 1.32], [-1.78, 0, 1.32], [1.78, 0, -1.32], [-1.78, 0, -1.32]].forEach((p, i) => {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(.065, .065, 2.35, 12), bodyMat); arm.rotation.z = Math.PI / 2; arm.rotation.y = i < 2 ? .08 : -.08; arm.position.set(p[0] / 2, 0, p[2] / 2); rig.add(arm);
      const motor = new THREE.Mesh(new THREE.CylinderGeometry(.17, .17, .18, 18), darkMat); motor.rotation.x = Math.PI / 2; motor.position.set(...p); rig.add(motor);
      const prop = new THREE.Group(); prop.position.set(...p); const bladeMat = new THREE.MeshStandardMaterial({ color: 0x7eeaff, transparent: true, opacity: .55, emissive: 0x2dd9ff, emissiveIntensity: 1.2 });
      for (let j = 0; j < 2; j++) { const blade = new THREE.Mesh(new THREE.BoxGeometry(.88, .035, .12), bladeMat); blade.rotation.y = j * Math.PI / 2; prop.add(blade); }
      propellers.push(prop); rig.add(prop);
    });
    [-1, 1].forEach(x => { const l = new THREE.Mesh(new THREE.SphereGeometry(.065, 10, 8), glowMat); l.position.set(x * .64, .1, .55); rig.add(l); lights.push(l); });

    const route = flight ? new THREE.CatmullRomCurve3([new THREE.Vector3(-2.5, 0, 0), new THREE.Vector3(-1.2, .8, -.2), new THREE.Vector3(0, 1.1, .25), new THREE.Vector3(1.2, .65, 0), new THREE.Vector3(2.5, 0, 0)]) : null;
    const routeLine = route ? new THREE.Line(new THREE.BufferGeometry().setFromPoints(route.getPoints(80)), new THREE.LineBasicMaterial({ color: 0x5de0ff, transparent: true, opacity: .25 })) : null;
    if (routeLine) scene.add(routeLine);
    let raf = 0, last = performance.now(), mouseX = 0, mouseY = 0;
    const move = e => { mouseX = (e.clientX / innerWidth - .5) * .55; mouseY = (e.clientY / innerHeight - .5) * .28; };
    addEventListener('pointermove', move);
    const render = now => {
      raf = requestAnimationFrame(render); const dt = Math.min(.04, (now - last) / 1000); last = now; const t = now * .001;
      if (flight && statusRef.current === 'IN TRANSIT' && !reduced) {
        progressRef.current = Math.min(1, progressRef.current + dt * .13);
        if (onProgress && Math.floor(now / 80) !== Math.floor((now - dt * 1000) / 80)) onProgress(progressRef.current);
      }
      const p = Math.min(1, progressRef.current);
      if (flight && route) {
        const point = route.getPointAt(p); rig.position.copy(point); rig.position.y += reduced ? 0 : Math.sin(t * 3.2) * .055;
        if (p < .999) { const next = route.getPointAt(Math.min(1, p + .01)); const dir = next.clone().sub(point).normalize(); rig.rotation.y = Math.atan2(dir.x, dir.z); rig.rotation.z = THREE.MathUtils.lerp(rig.rotation.z, -dir.y * .35, .08); }
      } else {
        rig.position.y = reduced ? 0 : Math.sin(t * .85) * .12; rig.rotation.y += (mouseX - rig.rotation.y) * .025; rig.rotation.x += (-mouseY - rig.rotation.x) * .025;
      }
      if (!reduced) propellers.forEach((prop, i) => { prop.rotation.y += .22 + (i % 2) * .025; });
      lights.forEach((l, i) => { l.material.emissiveIntensity = 3.5 + Math.sin(t * 4 + i) * 1.3; });
      if (routeLine) routeLine.material.opacity = .12 + p * .55;
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(render);
    const resize = () => { camera.aspect = Math.max(1, mount.clientWidth) / Math.max(1, mount.clientHeight); camera.updateProjectionMatrix(); renderer.setSize(mount.clientWidth, mount.clientHeight); };
    const ro = new ResizeObserver(resize); ro.observe(mount);
    return () => { cancelAnimationFrame(raf); removeEventListener('pointermove', move); ro.disconnect(); propellers.forEach(p => p.children.forEach(b => b.material.dispose())); scene.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material && !propellers.some(p => p.children.includes(o))) { if (Array.isArray(o.material)) o.material.forEach(m => m.dispose()); else o.material.dispose(); } }); renderer.dispose(); if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement); };
  }, [flight, reduced, onProgress]);
  return <div ref={mountRef} className="droneCanvas" aria-label={flight ? 'Interactive drone delivery scene' : '3D autonomous delivery drone'} />;
}

function About() {
  return <section id="about" className="section about"><SectionHead index="01" title="About" desc="A developer profile grounded in the supplied CV — practical web development, software fundamentals and problem solving."/><div className="aboutGrid"><div><div className="aboutCore"><div className="coreOrb"><span>ENGINEERING</span><b>CORE</b><small>CS / WEB / DSA</small></div><div className="coreLine l1"/><div className="coreLine l2"/><div className="coreLine l3"/><i className="coreNode n1">C++</i><i className="coreNode n2">REACT</i><i className="coreNode n3">DSA</i><i className="coreNode n4">NODE</i></div><p className="bigText">I like problems with a clear outcome and many ways to get there.</p><p>My focus is Data Structures & Algorithms, practical web development and building software that turns a messy workflow into a clear interface.</p><p>I'm pursuing a BTech in Computer Science at Lovely Professional University, Phagwara.</p></div><div className="statGrid"><Stat value="150+" label="coding problems across LeetCode & Codeforces"/><Stat value="45" label="days of structured DSA training"/><Stat value="7.13" label="BTech CGPA"/><Stat value="3" label="featured software projects"/></div></div></section>;
}
function Stat({ value, label }) { return <div className="stat interactive"><strong>{value}</strong><span>{label}</span></div>; }
function SectionHead({ index, title, desc }) { return <div className="sectionHead"><span>{index} / 06</span><h2>{title}</h2>{desc && <p>{desc}</p>}</div>; }

function Skills() {
  const [active, setActive] = useState('Languages');
  const group = skillGroups.find(([name]) => name === active) || skillGroups[0];
  return <section id="skills" className="section skillsSec"><SectionHead index="02" title="Skill System" desc="A controlled technology system with readable spacing instead of a crowded orbital wall."/><div className="skillLayout"><div className="skillCorePanel"><div className="skillCore"><span>ENGINEERING</span><b>CORE</b><small>TECHNOLOGY SYSTEM</small></div><div className="corePulse"/></div><div className="skillPanel"><div className="skillTabs">{skillGroups.slice(0, 5).map(([name]) => <button key={name} className={active === name ? 'selected' : ''} onClick={() => setActive(name)}>{name.replace(' & Libraries', '')}</button>)}</div><div className="skillList"><div className="skillPanelLabel">{group[0].toUpperCase()}</div>{group[1].map((skill, i) => <button key={skill} className="skillNode interactive" style={{ '--i': i }} onClick={e => e.currentTarget.classList.toggle('focus')}><span>{skill}</span><em>{group[0].split(' ')[0].toUpperCase()}</em></button>)}</div></div></div><div className="skillRows">{skillGroups.map(([name, skills]) => <div className="skillRow" key={name}><h3>{name}</h3><div>{skills.map(s => <span key={s}>{s}</span>)}</div></div>)}</div></section>;
}

function Projects({ onOpen }) {
  return <section id="projects" className="section projectsSec"><SectionHead index="03" title="Project Worlds" desc="Three real projects from the CV, each with a restrained interactive visual language."/><div className="projectGrid">{projects.map((project, i) => <ProjectCard key={project.id} project={project} index={i} onOpen={onOpen} />)}</div></section>;
}
function ProjectCard({ project, index, onOpen }) {
  const ref = useRef(null);
  const move = e => { const r = ref.current.getBoundingClientRect(); const x = e.clientX / r.width - (r.left / r.width) - .5; const y = e.clientY / r.height - (r.top / r.height) - .5; ref.current.style.setProperty('--rx', `${-y * 3.5}deg`); ref.current.style.setProperty('--ry', `${x * 5}deg`); };
  const leave = () => { ref.current.style.setProperty('--rx', '0deg'); ref.current.style.setProperty('--ry', '0deg'); };
  return <article ref={ref} className={'projectCard interactive ' + project.id} onPointerMove={move} onPointerLeave={leave}><div className="projectPreview">{project.id === 'drone' ? <MiniDrone /> : project.id === 'recall' ? <RecallMini /> : <ContestMini />}<div className="previewTag">{String(index + 1).padStart(2, '0')} / VISUAL PREVIEW</div></div><div className="projectInfo"><span className="eyebrow">{project.eyebrow}</span><h3>{project.title}</h3><p>{project.description}</p><div className="chips">{project.stack.map(s => <span key={s}>{s}</span>)}</div><button className="projectOpen" onClick={() => onOpen(project)}>ENTER PROJECT <b>↗</b></button></div></article>;
}
function MiniDrone() { return <div className="miniDrone"><div className="miniDroneMap"><span className="miniHub">HUB</span><div className="miniRoute"/><span className="miniDest">DESTINATION</span><div className="miniDroneModel"><DroneCanvas small /></div></div></div>; }
function RecallMini() { return <div className="knowledge"><div className="knowledgeCore">RECALL</div>{['CAPTURE', 'ORGANIZE', 'SEARCH', 'REVIEW'].map((x, i) => <button key={x} className="knowledgeNode" style={{ '--i': i }}>{x}</button>)}<div className="knowledgeFlow">CAPTURE → ORGANIZE → SEARCH → REVIEW</div></div>; }
function ContestMini() { return <div className="contestMini"><div className="terminal"><span>&gt; contest_tracker.boot()</span><span>loading dashboard...</span><span className="ok">status: ready</span></div><div className="bars">{[42, 75, 55, 88, 64, 94, 71].map((h, i) => <i key={i} style={{ height: h + '%' }} />)}</div><div className="contestTimeline"><b/><b/><b/><b/><b/></div></div>; }

function Journey() {
  return <section id="journey" className="section"><SectionHead index="04" title="Journey" desc="Education and training milestones supported directly by the supplied CV."/><div className="timeline"><div className="line"/><article><span>JUN 2024 — JUN 2028</span><h3>BTech / Computer Science</h3><p>Lovely Professional University · Phagwara, Punjab</p><strong>CGPA 7.13</strong></article><article><span>JUN 2026 — JUL 2026</span><h3>45-Day Summer Training in Data Structures & Algorithms</h3><p>Structured training focused on core concepts, implementation techniques and algorithmic problem solving.</p><strong>C/C++ · DSA</strong></article><article><span>MAR 2023 — MAR 2024</span><h3>Senior Secondary / Class XII</h3><p>Prince Academy · Sikar, Rajasthan</p><strong>80%</strong></article></div></section>;
}
function Certificates() {
  return <section id="certificates" className="section"><SectionHead index="05" title="Certificates" desc="Certificate names, issuers and dates are taken directly from the CV."/><div className="certGrid">{certs.map((c, i) => <article className="certCard interactive" key={c[0]}><div className="certVisual"><span>LEARNING<br />CREDENTIAL</span><b>0{i + 1}</b><em>{c[2]}</em></div><h3>{c[0]}</h3><p>{c[1]}</p><span>{c[2]}</span></article>)}</div></section>;
}
function Contact({ onReplay }) {
  return <section id="contact" className="section contact"><SectionHead index="06" title="Connect" desc="Open a real channel. No fake forms, no dead ends."/><div className="contactGrid"><div><p className="contactBig">LET'S BUILD SOMETHING.</p><div className="contactLinks"><a href={EMAIL}>EMAIL <b>↗</b></a><a href={LINKEDIN} target="_blank" rel="noreferrer">LINKEDIN <b>↗</b></a><a href={GITHUB} target="_blank" rel="noreferrer">GITHUB <b>↗</b></a><a href={PHONE}>+91 82959 91511 <b>↗</b></a></div></div><div className="contactTerminal"><span>CONTACT_PROTOCOL</span><code>01 email.connect()<br />02 linkedin.open()<br />03 github.inspect()<br />04 collaboration.listen()</code><i>READY_</i><button className="replayIntro" onClick={onReplay}>REPLAY INTRO ↗</button></div></div></section>;
}

function ProjectExperience({ project, onClose }) {
  const [status, setStatus] = useState('READY'); const [progress, setProgress] = useState(0);
  useEffect(() => { const pause = () => setStatus(s => s === 'IN TRANSIT' ? 'PAUSED' : s); addEventListener('lb-pause-drone', pause); return () => removeEventListener('lb-pause-drone', pause); }, []);
  useEffect(() => { if (progress >= 1 && status === 'IN TRANSIT') setStatus('DELIVERED'); }, [progress, status]);
  useEffect(() => { const key = e => { if (e.key === 'Escape') onClose(); }; addEventListener('keydown', key); document.body.style.overflow = 'hidden'; return () => { removeEventListener('keydown', key); document.body.style.overflow = ''; }; }, [onClose]);
  const start = () => { if (status === 'PAUSED' || status === 'READY') setStatus('IN TRANSIT'); };
  const reset = () => { setProgress(0); setStatus('READY'); };
  return <div className={'projectOverlay ' + project.id} role="dialog" aria-modal="true" aria-label={project.title}><button className="closeProject" onClick={onClose}>ESC / CLOSE ×</button><div className="projectStage">{project.id === 'drone' ? <DroneProject status={status} progress={progress} setProgress={setProgress} start={start} reset={reset} /> : project.id === 'recall' ? <RecallProject /> : <ContestProject />}<div className="projectDetails"><span className="eyebrow">{project.eyebrow}</span><h2>{project.title}</h2><p>{project.description}</p><div className="detailColumns"><div><small>PURPOSE</small><p>{project.purpose}</p></div><div><small>SUPPORTED WORK</small><ul>{project.features.map(x => <li key={x}>{x}</li>)}</ul></div></div><div className="chips">{project.stack.map(s => <span key={s}>{s}</span>)}</div><a className="btn" href={GITHUB} target="_blank" rel="noreferrer">GITHUB PROFILE ↗</a></div></div></div>;
}

function DroneProject({ status, progress, setProgress, start, reset }) {
  const onProgress = useMemo(() => value => setProgress(value), [setProgress]);
  const eta = Math.max(0, Math.ceil((1 - progress) * 42));
  return <div className="droneProject"><div className="deliveryMap"><div className="mapGrid"/><div className="routePath" style={{ '--p': progress }} /><div className="hubPoint">HUB</div><div className={'destPoint ' + (status === 'DELIVERED' ? 'arrived' : '')}>DESTINATION</div><div className="stageDrone3d"><DroneCanvas flight status={status} progress={progress} onProgress={onProgress} /></div><div className="mapCaption">LIVE THREE.JS DELIVERY SIMULATION</div></div><div className="deliveryHud"><div><span>DRONE</span><b>D-001</b></div><div><span>STATUS</span><b className={status === 'DELIVERED' ? 'done' : ''}>{status}</b></div><div><span>ROUTE</span><b>HUB → DESTINATION</b></div><div><span>PAYLOAD</span><b>DELIVERY PACKAGE</b></div><div><span>PROGRESS</span><b>{Math.round(progress * 100)}%</b></div><div><span>ETA</span><b>{status === 'DELIVERED' ? 'ARRIVED' : eta + ' SEC'}</b></div><div className="deliveryControls"><button onClick={start} disabled={status === 'IN TRANSIT' || status === 'DELIVERED'}>{status === 'PAUSED' ? 'RESUME DELIVERY' : 'START DELIVERY'}</button><button onClick={() => window.dispatchEvent(new CustomEvent('lb-pause-drone'))} disabled={status !== 'IN TRANSIT'}>PAUSE</button><button onClick={reset}>RESET</button></div></div></div>;
}

function RecallProject() { return <div className="recallProject"><div className="graphGrid"/><div className="graphCore">RECALL</div>{['CAPTURE', 'ORGANIZE', 'SEARCH', 'REVIEW'].map((x, i) => <button key={x} className="graphNode" style={{ '--i': i }}>{x}</button>)}<div className="graphFlow">CAPTURE <i /> ORGANIZE <i /> SEARCH <i /> REVIEW</div></div>; }
function ContestProject() { return <div className="contestProject"><div className="bigTerminal"><span>&gt; contest_tracker.boot()</span><span>&gt; loading dashboard modules...</span><span>&gt; connecting frontend / backend...</span><b>STATUS: READY</b></div><div className="dataDash"><div className="dashTitle">CONTEST TIMELINE / DEMO VISUALIZATION</div><div className="dataBars">{[38, 66, 52, 84, 59, 92, 73, 47, 88].map((h, i) => <i key={i} style={{ height: h + '%' }}><span>{String(i + 1).padStart(2, '0')}</span></i>)}</div><div className="dashCards"><div>UPCOMING<br /><b>CONTESTS</b></div><div>FILTER<br /><b>ACTIVE</b></div><div>TRACKING<br /><b>READY</b></div></div></div></div>; }

createRoot(document.getElementById('root')).render(<App />);
