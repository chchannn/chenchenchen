export const MEASUREMENT_ID = 'G-S6WSKC866R';
export type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

export const frequencies = ['Every day', 'Every week', 'Every month', 'Rarely', 'Not sure yet'];
export const consequences = ['Minor inconvenience', 'Work waits or a customer waits', 'Rework or extra cost', 'A missed promise or lost business', 'Safety or compliance concern', 'Not sure yet'];
export const accessOptions = ['People and artifacts are accessible', 'Some access; gaps to resolve', 'Access is blocked', 'Not sure yet'];

// Only predefined choices can leave the worksheet through analytics.
export function worksheetAnswers(symptom: string, item: { frequency?: string; consequence?: string; access?: string }, example: boolean) {
  const choice = (value: string | undefined, allowed: string[]) => value && allowed.includes(value) ? value : 'unspecified';
  return {
    worksheet_problem: choice(symptom, ['waiting', 'copying', 'conflict', 'expert', 'late', 'promises', 'other']),
    worksheet_frequency: choice(item.frequency, frequencies),
    worksheet_consequence: choice(item.consequence, [...consequences, 'Potential guest waiting or a missed promise']),
    worksheet_access: choice(item.access, accessOptions),
    worksheet_mode: example ? 'example' : 'own_workflow',
  };
}

export function trackEvent(name: string, parameters: Record<string, string | number | boolean> = {}) {
  if (typeof window === 'undefined') return;
  (window as AnalyticsWindow).gtag?.('event', name, parameters);
}

export function analyticsPage(href: string, referrer: string) {
  const page = new URL(href);
  let source = '';
  try { source = new URL(referrer).origin + '/'; } catch { /* No referrer on direct visits. */ }
  return { page_location: page.origin + page.pathname, page_referrer: source };
}
