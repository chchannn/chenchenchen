export type Incident = {
  workflow: string; incident: string; people: string; artifacts: string;
  frequency: string; consequence: string; access: string;
};

export const symptoms = [
  { id: 'waiting', title: 'Waiting for answers', detail: 'Someone checks several systems before work can move.', prompt: 'What was someone waiting to learn, and what could not happen until they knew?' },
  { id: 'copying', title: 'Copying between tools', detail: 'The same information gets entered repeatedly.', prompt: 'What was copied, between which tools, and what happened along the way?' },
  { id: 'conflict', title: 'Conflicting information', detail: 'Different teams have different versions of the truth.', prompt: 'What did the sources disagree about, and who had to resolve it?' },
  { id: 'expert', title: 'Depending on one person', detail: 'Progress requires experience nobody has written down.', prompt: 'What did the experienced person know that everyone else needed?' },
  { id: 'late', title: 'Finding mistakes late', detail: 'Errors become visible after they have caused rework.', prompt: 'When did the mistake become visible, and what had to be redone?' },
  { id: 'promises', title: 'Losing promises', detail: 'A commitment disappears between teams.', prompt: 'What was promised, and where did that promise stop travelling with the work?' },
  { id: 'other', title: 'Something else', detail: 'A different point of friction in your business.', prompt: 'What happened the last time this problem stopped important work?' },
];

export const emptyIncident = (): Incident => ({ workflow: '', incident: '', people: '', artifacts: '', frequency: '', consequence: '', access: '' });
export function toggleSymptom(selected: string[], id: string): string[] {
  if (selected.includes(id)) return selected.filter(item => item !== id);
  return selected.length < 3 ? [...selected, id] : selected;
}
export function isComplete(item: Incident): boolean {
  return [item.workflow, item.incident, item.frequency, item.consequence, item.access].every(value => value.trim().length > 0);
}

// The transcript's composite scenario. Frequency and access remain unknown.
export const room100: Record<string, Incident> = {
  conflict: {
    workflow: 'Room 100 readiness',
    incident: 'At 11:15, housekeeping says clean, the front desk says dirty, maintenance says unavailable, and booking says sold tonight. Someone must establish what should happen next.',
    people: 'Front desk, housekeeping, maintenance, booking',
    artifacts: 'Room status, cleaning task, maintenance ticket, reservation',
    frequency: 'Not sure yet', consequence: 'Potential guest waiting or a missed promise', access: 'Not sure yet',
  },
  waiting: {
    workflow: 'Vacant room to next useful action',
    incident: 'A room becomes vacant. A status update, a radio call, and a supervisor handoff happen before the next task is assigned. The time between vacancy and the next useful action needs investigation.',
    people: 'Front desk, housekeeping supervisor, cleaning team',
    artifacts: 'Vacancy timestamp, status updates, task assignment',
    frequency: 'Not sure yet', consequence: 'Work waits or a customer waits', access: 'Not sure yet',
  },
  expert: {
    workflow: 'Choosing the next room to clean',
    incident: 'The supervisor combines arrivals, promises, late checkouts, scarce room types, and staffing by floor to choose what to clean next. Room status alone does not explain the decision.',
    people: 'Housekeeping supervisor, front desk',
    artifacts: 'Arrivals, guest promises, late checkouts, room types, staffing',
    frequency: 'Not sure yet', consequence: 'Potential guest waiting or a missed promise', access: 'Not sure yet',
  },
};

export function makeBrief(symptom: string, item: Incident, example: boolean): string {
  return `# Workflow to investigate: ${item.workflow}\n\n${example ? 'Composite hotel example adapted from Chen\'s talk. Not measured operational data.\n\n' : ''}## Starting signal\n${symptom}\n\n## A concrete incident\n${item.incident}\n\n## People\n${item.people || 'To investigate'}\n\n## Artifacts\n${item.artifacts || 'To investigate'}\n\n## Comparison\n- Frequency: ${item.frequency}\n- Consequence: ${item.consequence}\n- Access to evidence: ${item.access}\n\n## Next investigation\nFollow this work from its beginning to its completed outcome. Gather real artifacts and ask where truth, time, or judgment is lost. Compare process change, ordinary automation, an agent, or no intervention before choosing a pilot.\n\nThis is a candidate to investigate, not an agent recommendation.\n`;
}
