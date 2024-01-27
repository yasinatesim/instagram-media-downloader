'use client';
import React from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export default function GoogleCaptchaWrapper({ children }: { children: React.ReactNode }) {
  const recaptchaKey: string | undefined = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={recaptchaKey ?? 'NOT DEFINED'}
      scriptProps={{
        async: false,
        defer: false,
        appendTo: 'head',
        nonce: undefined,
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
