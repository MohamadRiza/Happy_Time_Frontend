// src/components/TawkToChat.jsx
import { useEffect } from 'react';

const TawkToChat = () => {
  useEffect(() => {
    // Only load on desktop
    if (window.innerWidth < 1024) {
      return; // Don't load Tawk.to on mobile
    }

    // Load Tawk.to script (existing code)
    var Tawk_API = Tawk_API || {};
    var Tawk_LoadStart = new Date();
    
    (function() {
      var s1 = document.createElement("script");
      var s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/697887dc47b101197ca6e840/1jfvd5dhq';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    })();

    // Hide widget on mobile if it loads
    const hideOnMobile = () => {
      if (window.innerWidth < 1024) {
        const widget = document.querySelector('#tawk-bubble-container');
        if (widget) {
          widget.style.display = 'none';
        }
      }
    };

    setTimeout(hideOnMobile, 1000);
    window.addEventListener('resize', hideOnMobile);

    return () => {
      window.removeEventListener('resize', hideOnMobile);
    };
  }, []);

  return null;
};

export default TawkToChat;