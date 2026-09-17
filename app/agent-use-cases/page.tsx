import { Asterisk, ArrowLeft } from 'lucide-react';
import Discovery from './discovery';
import './discovery.css';

export const metadata = {
  title: 'Find your starting point | Chen',
  description: 'Find a workflow worth examining: spot friction, describe real incidents, and choose a starting point for an agent use-case investigation.',
};

export default function AgentUseCases() {
  return <div className="discovery-page">
    <a className="skip" href="#discovery-main">Skip to content</a>
    <header className="nav wrap"><a href="/" className="wordmark" aria-label="Chen home">chen<Asterisk size={20}/></a><a className="text-link" href="/"><ArrowLeft size={16}/> Back home</a></header>
    <Discovery/>
    <footer className="wrap discovery-footer"><div><img src="/chen-portrait.png" width="32" height="32" alt="Chen"/><span>A companion to Chen's talk<br/><strong>Where Agents Actually Pay Off</strong></span></div><a href="/contact">Discuss a workflow with Chen</a></footer>
  </div>;
}
