'use client';

import { useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import {
  getToken,
  logout,
  renewStoredSession,
  sessionExpiredByInactivity,
  shouldRenewSession,
  touchSession,
} from '@/lib/auth';

const ACTIVITY_EVENTS = ['click', 'keydown', 'mousemove', 'scroll', 'touchstart', 'visibilitychange'];
const ACTIVITY_THROTTLE_MS = 30 * 1000;

export function SessionActivity() {
  const renewingRef = useRef(false);
  const lastActivityHandledRef = useRef(0);

  useEffect(() => {
    async function renewIfNeeded() {
      if (!getToken() || renewingRef.current || !shouldRenewSession()) return;

      renewingRef.current = true;
      try {
        const response = await api.post('/auth/refresh');
        renewStoredSession(response.data.accessToken, response.data.user);
      } catch {
        logout('/login?session=expired');
      } finally {
        renewingRef.current = false;
      }
    }

    function handleActivity() {
      if (!getToken()) return;

      if (sessionExpiredByInactivity()) {
        logout('/login?session=expired');
        return;
      }

      const currentTime = Date.now();
      if (currentTime - lastActivityHandledRef.current < ACTIVITY_THROTTLE_MS) return;

      lastActivityHandledRef.current = currentTime;
      touchSession();
      void renewIfNeeded();
    }

    function checkInactivity() {
      if (getToken() && sessionExpiredByInactivity()) {
        logout('/login?session=expired');
      }
    }

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, handleActivity, { passive: true });
    });

    const interval = window.setInterval(checkInactivity, 60 * 1000);

    return () => {
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, handleActivity);
      });
      window.clearInterval(interval);
    };
  }, []);

  return null;
}
