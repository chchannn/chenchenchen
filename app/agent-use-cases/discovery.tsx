'use client';

import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Clock3, Copy, Download, GitCompareArrows, Handshake, Hotel, Plus, RotateCcw, SearchCheck, UserRound } from 'lucide-react';
import { emptyIncident, isComplete, makeBrief, room100, symptoms, toggleSymptom, type Incident } from '@/lib/discovery';
import { trackEvent, worksheetAnswers, frequencies, consequences, accessOptions } from '@/lib/analytics';
import WorksheetSubmit from './worksheet-submit';

const icons = [Clock3, Copy, GitCompareArrows, UserRound, SearchCheck, Handshake, Plus];
const steps = ['Spot the friction', 'Make it concrete', 'Choose a workflow'];

export default function Discovery() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Incident>>({});
  const [example, setExample] = useState(false);
  const [active, setActive] = useState(0);
  const [chosen, setChosen] = useState('');
  const [error, setError] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const id = selected[active];
  const item = drafts[id] || emptyIncident();
  const symptom = symptoms.find(s => s.id === id);
  const chosenItem = drafts[chosen];

  function move(next: number) {
    trackEvent('worksheet_step', { worksheet_step: next + 1 });
    setStep(next); setError(''); setConfirmReset(false);
    requestAnimationFrame(() => { heading.current?.focus(); heading.current?.scrollIntoView({ block: 'start', behavior: 'instant' }); });
  }
  function update(key: keyof Incident, value: string) {
    setDrafts(current => ({ ...current, [id]: { ...(current[id] || emptyIncident()), [key]: value } }));
    setError('');
  }
  function chooseSymptom(nextId: string) {
    trackEvent('worksheet_problem_select', { ...worksheetAnswers(nextId, {}, example), selected: !selected.includes(nextId) });
    setSelected(current => toggleSymptom(current, nextId));
    setActive(0); setChosen(''); setError('');
  }
  function loadExample() {
    setSelected(['conflict', 'waiting', 'expert']); setDrafts(structuredClone(room100));
    setExample(true); setActive(0); setChosen(''); move(1);
  }
  function clear() {
    setSelected([]); setDrafts({}); setExample(false); setActive(0); setChosen(''); move(0);
  }
  function nextIncident(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isComplete(item)) { setError('Add a workflow, a real incident, and the three comparison answers.'); return; }
    trackEvent('worksheet_example_complete', worksheetAnswers(id, item, example));
    if (active < selected.length - 1) { setActive(active + 1); setError(''); heading.current?.focus(); }
    else move(2);
  }
  function download() {
    if (!chosenItem) return;
    trackEvent('worksheet_download', worksheetAnswers(chosen, chosenItem, example));
    const content = makeBrief(symptoms.find(s => s.id === chosen)?.title || '', chosenItem, example);
    const url = URL.createObjectURL(new Blob([content], { type: 'text/markdown;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'workflow-to-investigate.md'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <main id="discovery-main" className="wrap discovery-main">
    <div className="discovery-topline"><span className="small">AGENT USE-CASE FINDER <span className="prototype-tag">PROTOTYPE</span></span><span className="discovery-private">No sign-in. Share only when ready.</span></div>
    <nav className="discovery-steps" aria-label="Discovery progress">{steps.map((label, index) => <button key={label} disabled={index > step} aria-current={step === index ? 'step' : undefined} onClick={() => move(index)}><span>{index < step ? <Check size={14}/> : index + 1}</span>{label}</button>)}</nav>
    <div className="discovery-layout">
      <section className="discovery-work">
        <div className="discovery-title"><div><p className="discovery-kicker">{step === 0 ? '01 / RECOGNIZE THE PATTERN' : step === 1 ? `02 / EXAMPLE ${active + 1} OF ${selected.length}` : '03 / A STARTING POINT, NOT A VERDICT'}</p><h1 ref={heading} tabIndex={-1}>{step === 0 ? 'Where does work get stuck?' : step === 1 ? 'Think of the last time.' : 'Which workflow is worth a closer look?'}</h1></div></div>
        {step === 0 && <>
          <p className="discovery-lead">Start with a problem you recognize. Pick up to three.</p>
          <fieldset className="symptom-grid"><legend className="sr-only">Problems in your business</legend>{symptoms.map((s, index) => {
            const Icon = icons[index]; const checked = selected.includes(s.id); const disabled = selected.length === 3 && !checked;
            return <label key={s.id} className={`symptom-tile ${s.id === 'other' ? 'symptom-other' : ''} ${checked ? 'is-selected' : ''} ${disabled ? 'is-disabled' : ''}`}>
              <input type="checkbox" checked={checked} disabled={disabled} onChange={() => chooseSymptom(s.id)}/><Icon size={23} className="symptom-icon"/><span className="symptom-copy"><strong>{s.title}</strong><span>{s.detail}</span></span>
            </label>;
          })}</fieldset>
          <div className="discovery-actions"><span aria-live="polite">{selected.length} of 3 selected</span><button className="discovery-primary" disabled={!selected.length} onClick={() => move(1)}>Describe an example <ArrowRight size={17}/></button></div>
        </>}
        {step === 1 && <>
          <p className="discovery-lead">{symptom?.prompt}</p>
          <div className="incident-tabs" role="tablist" aria-label="Your examples">{selected.map((key, index) => <button role="tab" aria-selected={active === index} key={key} onClick={() => { setActive(index); setError(''); }}>{drafts[key] && isComplete(drafts[key]) ? <Check size={14}/> : <span>{index + 1}.</span>}{symptoms.find(s => s.id === key)?.title}</button>)}</div>
          <form id="worksheet-example" onSubmit={nextIncident} className="incident-form" key={id}>
            <label>What was someone trying to get done?<input required maxLength={120} value={item.workflow} onChange={e => update('workflow', e.target.value)} placeholder="e.g. Get a vacant room ready for the next guest"/></label>
            <label>What happened?<textarea required maxLength={2000} rows={4} value={item.incident} onChange={e => update('incident', e.target.value)} placeholder="Describe one incident, including where the work stopped."/></label>
            <div className="incident-pair"><label>Who was involved? <small>Optional</small><input maxLength={500} value={item.people} onChange={e => update('people', e.target.value)} placeholder="People or teams"/></label><label>What information did they need? <small>Optional</small><input maxLength={500} value={item.artifacts} onChange={e => update('artifacts', e.target.value)} placeholder="Emails, tools, tickets, checklists..."/></label></div>
            <div className="incident-comparison"><label>How often does this happen?<select required value={item.frequency} onChange={e => update('frequency', e.target.value)}><option value="">Choose frequency</option>{frequencies.map(value => <option key={value}>{value}</option>)}</select></label><label>What is the consequence?<select required value={item.consequence} onChange={e => update('consequence', e.target.value)}><option value="">Choose consequence</option>{!consequences.includes(item.consequence) && item.consequence && <option>{item.consequence}</option>}{consequences.map(value => <option key={value}>{value}</option>)}</select></label><label>Can you investigate with real people and artifacts?<select required value={item.access} onChange={e => update('access', e.target.value)}><option value="">Choose access</option>{accessOptions.map(value => <option key={value}>{value}</option>)}</select></label></div>
            {error && <p role="alert" className="discovery-error">{error}</p>}
            <div className="discovery-actions"><button type="button" className="discovery-secondary" onClick={() => active ? setActive(active - 1) : move(0)}><ArrowLeft size={17}/> Back</button><button className="discovery-primary" type="submit">{active < selected.length - 1 ? 'Next example' : 'Compare workflows'}<ArrowRight size={17}/></button></div>
          </form>
        </>}
        {step === 2 && <>
          <p className="discovery-lead">Compare what happens, how often, and what you can investigate. Choose one to follow from beginning to end.</p>
          <fieldset className="candidate-list"><legend className="sr-only">Choose a workflow to investigate</legend>{selected.map((key, index) => {
            const candidate = drafts[key] || emptyIncident(); const complete = isComplete(candidate);
            return <div key={key} className={`candidate ${chosen === key ? 'is-selected' : ''}`}>
              <label className="candidate-choice"><input type="radio" name="workflow" checked={chosen === key} disabled={!complete} onChange={() => { setChosen(key); trackEvent('worksheet_candidate_select', worksheetAnswers(key, candidate, example)); }}/><span><small>{symptoms.find(s => s.id === key)?.title}</small><strong>{candidate.workflow || 'Unfinished example'}</strong></span></label>
              <p>{candidate.incident || 'Describe an incident before choosing this workflow.'}</p>
              <dl><div><dt>Frequency</dt><dd>{candidate.frequency || 'Missing'}</dd></div><div><dt>Consequence</dt><dd>{candidate.consequence || 'Missing'}</dd></div><div><dt>Access</dt><dd>{candidate.access || 'Missing'}</dd></div></dl>
              <button className="discovery-text-button" onClick={() => { setActive(index); move(1); }}>Edit example <ArrowRight size={14}/></button>
            </div>;
          })}</fieldset>
          {chosenItem && <section className="investigation-result" aria-live="polite"><span className="small">YOUR NEXT INVESTIGATION</span><h2>{chosenItem.workflow}</h2><p>Follow this work from its trigger to its completed outcome. Gather real artifacts and ask where truth, time, or judgment is lost.</p><ul><li>Where do sources disagree?</li><li>How long until the next useful action?</li><li>What does an experienced person know that is not written down?</li></ul><p className="result-caution">This is a candidate to investigate, not an agent recommendation. A process change, ordinary automation, or no intervention may be the better fit.</p><button className="discovery-primary" onClick={download}><Download size={17}/> Download your notes</button></section>}
          {chosenItem && selected.every(key => isComplete(drafts[key] || emptyIncident())) && <WorksheetSubmit key={JSON.stringify({ chosen, drafts, example })} chosen={chosen} example={example} incidents={selected.map(symptom => ({ symptom, ...drafts[symptom] }))}/>}
          <div className="discovery-actions"><button className="discovery-secondary" onClick={() => move(1)}><ArrowLeft size={17}/> Back to examples</button>{!chosen && <span>Choose one workflow above.</span>}</div>
        </>}
      </section>
      <aside className="discovery-aside">
        <div className="room-heading"><Hotel size={20}/><span>THE ROOM 100 EXAMPLE</span></div>
        <p className="room-time">11:15 <span>One room. Four answers.</span></p>
        <div className="room-statuses"><div><span>Housekeeping</span><strong className="status-clean">Clean</strong></div><div><span>Front desk</span><strong className="status-dirty">Dirty</strong></div><div><span>Maintenance</span><strong className="status-unavailable">Unavailable</strong></div><div><span>Booking</span><strong className="status-sold">Sold tonight</strong></div></div>
        <p className="room-question">The hotel still needs one answer:<br/><strong>What should happen next?</strong></p>
        <p className="room-caption">A composite hotel scenario from the talk. Frequency and access are unknown until investigated.</p>
        {!example && <button className="discovery-secondary example-button" onClick={() => { if (selected.length) setConfirmReset(true); else loadExample(); }}>Explore Room 100 <ArrowRight size={16}/></button>}
        {example && <p className="example-active"><Check size={15}/> Room 100 example loaded</p>}
        <div className="discovery-boundary"><span className="small">THE QUESTION TO CARRY</span><p>Where is messy information stopping important work from moving forward?</p></div>
        {(selected.length > 0 || example) && <button className="discovery-text-button" onClick={() => setConfirmReset(true)}><RotateCcw size={15}/> Start fresh</button>}
        {confirmReset && <div className="reset-confirm" role="group" aria-label="Replace current answers"><p>Replace the answers in this tab?</p><button className="discovery-secondary" onClick={clear}>Start blank</button>{!example && <button className="discovery-secondary" onClick={loadExample}>Use Room 100</button>}<button className="discovery-text-button" onClick={() => setConfirmReset(false)}>Keep my answers</button></div>}
        <p className="discovery-storage">Google Analytics measures your selected options and tool interactions. Written answers stay in this tab until you submit them to Chen. Download your notes before closing or refreshing.</p>
      </aside>
    </div>
  </main>;
}
