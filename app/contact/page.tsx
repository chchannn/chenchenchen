import { Asterisk, ArrowLeft } from 'lucide-react';
import ContactForm from './form';

export const metadata = {
  title: "Let's talk | Chen",
  description: 'Tell Chen about your project, agent workflow, or consulting inquiry.',
};

export default function Contact() {
  return <>
    <header className="nav wrap"><a href="/" className="wordmark" aria-label="Chen home">chen<Asterisk size={20}/></a><a className="text-link" href="/"><ArrowLeft size={16}/> Back home</a></header>
    <main className="inquiry wrap">
      <div className="inquiry-intro"><span className="small">WORK TOGETHER</span><h1>Let's talk<span>.</span></h1><p>What are you working on?</p><p>Tell me about your team, the problem you're exploring, and where you could use a hand.</p></div>
      <ContactForm/>
    </main>
    <footer className="wrap footer"><span>Chen / A conversation starts here.</span><a href="/#writing">Field notes</a></footer>
  </>;
}
