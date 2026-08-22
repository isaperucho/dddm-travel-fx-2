import React, { useEffect } from 'react';
import { MessageSquare, MessageCircle } from 'lucide-react';

declare global {
  interface Window {
    DISQUS?: {
      reset: (options: { reload: boolean; config?: () => void }) => void;
    };
    disqus_config?: () => void;
  }
}

export const DisqusComments: React.FC = () => {
  useEffect(() => {
    // Check if Disqus embed script already exists
    const scriptId = 'disqus-embed-script';
    const existingScript = document.getElementById(scriptId);

    if (!existingScript) {
      const d = document;
      const s = d.createElement('script');
      s.id = scriptId;
      s.src = 'https://travel-fx.disqus.com/embed.js';
      s.setAttribute('data-timestamp', String(+new Date()));
      s.async = true;
      (d.head || d.body).appendChild(s);
    } else if (window.DISQUS) {
      // If script is already loaded (e.g. user navigated between tabs), reset Disqus to render in the container
      try {
        window.DISQUS.reset({
          reload: true,
          config: function () {
            // Optional configuration
          },
        });
      } catch (err) {
        console.error('Error reloading Disqus thread:', err);
      }
    }

    // Check if Disqus count script already exists
    const countScriptId = 'dsq-count-scr';
    const existingCountScript = document.getElementById(countScriptId);
    if (!existingCountScript) {
      const d = document;
      const countScript = d.createElement('script');
      countScript.id = countScriptId;
      countScript.src = '//travel-fx.disqus.com/count.js';
      countScript.async = true;
      (d.head || d.body).appendChild(countScript);
    }
  }, []);

  return (
    <div id="talk-to-us-section" className="bg-white rounded-[20px] p-5 border border-[#e9ecef] shadow-[0px_4px_20px_rgba(0,93,170,0.04)]">
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 text-[#004581] rounded-xl">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#191c1d]">Talk to Us</h2>
            <p className="text-[11px] text-slate-500">
              Community discussion forum & travel FX advice
            </p>
          </div>
        </div>
        <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
          <MessageCircle className="w-3 h-3" />
          Disqus
        </span>
      </div>

      <div className="min-h-[220px]">
        <div id="disqus_thread"></div>
        <noscript>
          Please enable JavaScript to view the{' '}
          <a
            href="https://disqus.com/?ref_noscript"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            comments powered by Disqus.
          </a>
        </noscript>
      </div>
    </div>
  );
};
