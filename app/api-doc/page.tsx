'use client';

import { RedocStandalone } from 'redoc';
import { useEffect } from 'react';

export default function ApiDocPage() {

  useEffect(() => {
    const robotoFont = document.createElement('link');
    robotoFont.rel = 'stylesheet';
    robotoFont.href = '//fonts.googleapis.com/css?family=Roboto:300,400,700';
    document.head.appendChild(robotoFont);

    const montserratFont = document.createElement('link');
    montserratFont.rel = 'stylesheet';
    montserratFont.href = '//fonts.googleapis.com/css?family=Montserrat:400,700';
    document.head.appendChild(montserratFont);

    return () => {
      document.head.removeChild(robotoFont);
      document.head.removeChild(montserratFont);
    };
  }, []);

  return (
    <div className="api-doc-container">
      <RedocStandalone
        specUrl="https://api.apis.guru/v2/openapi.yaml"
        options={{
          nativeScrollbars: true,
   
          scrollYOffset: '#menu', 
        }}
      />
    </div>
  );
}
