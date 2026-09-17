import Link from 'next/link';
import { ArrowDown, ArrowUpRight, Asterisk } from 'lucide-react';
import { posts } from './posts';

export default function Home() {
  return <>
    <a className="skip" href="#main">Skip to content</a>
    <header className="nav wrap">
      <Link href="/" className="wordmark" aria-label="Chen home">chen<Asterisk size={20} /></Link>
      <nav aria-label="Main navigation"><a href="#writing">Writing</a><a href="#about">About</a><a href="#contact">Let's talk <ArrowUpRight size={16}/></a></nav>
    </header>
    <main id="main">
      <section className="hero">
        <div className="wrap hero-content">
          <img className="portrait" src="/chen-portrait.png" alt="Chen smiling in an orange knit hat" width="1792" height="1804" fetchPriority="high" />
          <div className="eyebrow"><span className="status-dot"/> APPLIED AI</div>
          <h1>Hi, I'm Chen<span>.</span></h1>
          <p className="hero-intro">I build AI systems and write about the work of making them useful.</p>
          <a className="text-link" href="#writing">Read my field notes <ArrowDown size={18}/></a>
          <div className="hero-bottom"><span>Ideas from the workbench.</span><span>Agents. Evals. How we work.</span></div>
        </div>
      </section>
      <section id="writing" className="wrap writing section">
        <div className="section-heading"><h2>Field notes</h2><span className="small">01 / WRITING</span></div>
        <p className="section-intro">Questions I keep coming back to while building.</p>
        <div className="post-list">{posts.map((post,index)=><Link className="post-row" href={`/writing/${post.slug}`} key={post.slug}>
          <span className="post-number">0{index+1}</span>
          <div><div className="post-meta">{post.category} <span>/</span> {post.minutes} MIN READ{post.publishedMonth && <> <span>/</span> <time dateTime={post.publishedMonth}>{post.publishedLabel}</time></>}</div><h3>{post.title}</h3><p>{post.description}</p></div>
          <ArrowUpRight className="post-arrow" size={26}/>
        </Link>)}</div>
      </section>
      <section id="about" className="about-band"><div className="wrap about-layout section">
        <div><span className="small">02 / A LITTLE CONTEXT</span><h2>Close to the work.<br/>Curious about<br/>what comes next.</h2></div>
        <div className="about-copy"><p>I'm Chen, an applied AI builder interested in how agents change the way people work.</p><p>My work spans agent workflows, evaluation, and the context that connects people to decisions. I care about what happens after the demo: how a system earns trust, handles uncertainty, and fits into someone's day.</p><p>This is where I think out loud, share useful patterns, and follow the questions that keep showing up.</p><div className="interests"><span>Agent workflows</span><span>Evaluation</span><span>Organizational context</span></div></div>
      </div></section>
      <section id="contact" className="wrap section contact">
        <div className="contact-top"><span className="small">03 / WORK TOGETHER</span><span className="availability"><span className="status-dot"/> Consulting inquiries</span></div>
        <h2>Something on<br/>your mind<span>?</span></h2>
        <div className="contact-bottom"><p>I help teams find a useful starting point for AI,<br className="desktop-break"/> shape agent workflows, and decide what good looks like.</p><div><span className="contact-link">Let's talk <ArrowUpRight size={32}/></span><p className="contact-pending">Contact details coming soon.</p></div></div>
        <div className="services"><span>Workflow strategy</span><span>Agent product design</span><span>Evaluation & review</span></div>
      </section>
    </main>
    <footer className="wrap footer"><span>Chen / A work in progress, always.</span><a href="#main">Back to top <ArrowUpRight size={15}/></a></footer>
  </>;
}
