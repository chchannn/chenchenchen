'use client';

import { useEffect, useRef } from 'react';
import { MEASUREMENT_ID, analyticsPage, type AnalyticsWindow } from '@/lib/analytics';

export default function Analytics() {
  const started = useRef(false);
  useEffect(() => {
    if (started.current || !['chenchenchen.me', 'www.chenchenchen.me'].includes(location.hostname)) return;
    started.current = true;
    const client = window as AnalyticsWindow;
    client.dataLayer = client.dataLayer || [];
    client.gtag = function (..._args: unknown[]) { client.dataLayer!.push(arguments); };
    client.gtag('consent', 'default', {
      ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    });
    client.gtag('js', new Date());
    client.gtag('config', MEASUREMENT_ID, {
      ...analyticsPage(location.href, document.referrer),
      allow_google_signals: false, allow_ad_personalization_signals: false,
      cookie_domain: 'chenchenchen.me', cookie_path: '/',
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }, []);
  return null;
}
