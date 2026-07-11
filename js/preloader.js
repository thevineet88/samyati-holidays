(function () {
  if (sessionStorage.getItem('sy-loaded')) return;
  sessionStorage.setItem('sy-loaded', '1');
  var overlay = document.createElement('div');
  overlay.id = 'samyati-preloader';
  overlay.innerHTML = `
    <style>
      #samyati-preloader {
        position:fixed;inset:0;z-index:9999;display:flex;align-items:center;
        justify-content:center;background:#fff;
        transition:opacity 0.6s ease,visibility 0.6s ease;
      }
      @keyframes sy-logoPop {
        0% { opacity:0; transform:scale(0.88); }
        100% { opacity:1; transform:scale(1); }
      }
      @keyframes sy-shineSweep {
        0% { transform:translateX(-160%) skewX(-20deg); opacity:0; }
        15% { opacity:1; }
        85% { opacity:1; }
        100% { transform:translateX(160%) skewX(-20deg); opacity:0; }
      }
      @keyframes sy-twinkle {
        0%,100% { opacity:0; transform:scale(0.3) rotate(0deg); }
        50% { opacity:1; transform:scale(1) rotate(20deg); }
      }
      @keyframes sy-shadowFade {
        0% { opacity:0; transform:translateX(-50%) scaleX(0.8); }
        100% { opacity:1; transform:translateX(-50%) scaleX(1); }
      }
      .sy-stage { position:relative; width:180px; }
      @media(min-width:640px){ .sy-stage { width:240px; } }
      .sy-logo-card { position:relative; overflow:hidden; opacity:0; animation:sy-logoPop 0.5s cubic-bezier(0.25,0.1,0.25,1) 0.1s forwards; }
      .sy-logo-card img { display:block; width:100%; height:auto; }
      .sy-shine { position:absolute; top:-20%; left:0; width:35%; height:140%; background:linear-gradient(100deg,transparent 0%,rgba(255,255,255,0.75) 50%,transparent 100%); mix-blend-mode:overlay; opacity:0; animation:sy-shineSweep 0.8s ease-in-out 0.5s forwards; pointer-events:none; }
      .sy-shadow { position:absolute; left:50%; bottom:-10px; width:55%; height:14px; background:radial-gradient(ellipse at center,rgba(12,12,12,0.14),transparent 72%); filter:blur(3px); opacity:0; animation:sy-shadowFade 0.5s ease-out 0.15s forwards; }
      .sy-sparkle { position:absolute; color:#F47920; opacity:0; pointer-events:none; animation:sy-twinkle 1.9s ease-in-out infinite; }
      .sy-sparkle-1 { top:2%; left:-4%; font-size:14px; animation-delay:0.4s; }
      .sy-sparkle-2 { bottom:10%; right:-6%; font-size:11px; animation-delay:0.6s; }
      .sy-sparkle-3 { top:40%; right:-8%; font-size:8px; animation-delay:0.8s; }
    </style>
    <div class="sy-stage">
      <div class="sy-logo-card">
        <img src="/assets/samyati-logo-cropped.png" alt="Samyati Holidays"/>
        <div class="sy-shine"></div>
      </div>
      <div class="sy-shadow"></div>
      <span class="sy-sparkle sy-sparkle-1" aria-hidden="true">✦</span>
      <span class="sy-sparkle sy-sparkle-2" aria-hidden="true">✦</span>
      <span class="sy-sparkle sy-sparkle-3" aria-hidden="true">✦</span>
    </div>
  `;

  document.body.insertBefore(overlay, document.body.firstChild);

  // lock scroll
  var scrollY = window.scrollY;
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.top = '-' + scrollY + 'px';
  document.body.style.left = '0';
  document.body.style.right = '0';

  setTimeout(function () {
    overlay.style.opacity = '0';
    overlay.style.visibility = 'hidden';
    // restore scroll
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    window.scrollTo(0, scrollY);
  }, 1200);
})();
