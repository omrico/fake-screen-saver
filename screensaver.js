(function() {
  const startOverlay = document.getElementById('start-overlay');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const lockScreen = document.getElementById('lock-screen');
  const passwordInput = document.getElementById('password-input');
  const unlockBtn = document.getElementById('unlock-btn');
  const cancelLink = document.getElementById('cancel-link');
  const lockTime = document.getElementById('lock-time');
  const lockDate = document.getElementById('lock-date');

  let animationId = null;
  let clockInterval = null;
  let currentSaver = null;
  let config = null;
  let isLocked = false;
  let hasStarted = false;
  let hasInteracted = false;
  let isDemoMode = false;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function handleInteraction(e) {
    if (!hasStarted || isLocked || isDemoMode) return;

    if (e.type === 'mousemove') {
      if (!hasInteracted) {
        hasInteracted = true;
        return;
      }
    }

    if (config && config.passwordPrompt) {
      showLockScreen();
    } else {
      exitScreenSaver();
    }
  }

  function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    lockTime.textContent = `${hours}:${minutes}`;
    
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    lockDate.textContent = now.toLocaleDateString('en-US', options);
  }

  function showLockScreen() {
    isLocked = true;
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    document.body.style.cursor = 'default';
    updateClock();
    clockInterval = setInterval(updateClock, 1000);
    lockScreen.classList.add('visible');
    setTimeout(() => passwordInput.focus(), 100);
  }

  function exitScreenSaver() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    if (clockInterval) {
      clearInterval(clockInterval);
      clockInterval = null;
    }
    if (document.fullscreenElement) {
      document.exitFullscreen().then(() => {
        window.close();
      }).catch(() => {
        window.close();
      });
    } else {
      window.close();
    }
  }

  function animate() {
    if (!currentSaver || isLocked) return;
    currentSaver.draw(ctx, canvas);
    animationId = requestAnimationFrame(animate);
  }

  function startScreenSaver() {
    if (hasStarted) return;
    hasStarted = true;

    function beginAnimation() {
      startOverlay.classList.add('hidden');
      if (!isDemoMode) {
        document.body.style.cursor = 'none';
      }
      
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      if (!isDemoMode) {
        document.addEventListener('mousemove', handleInteraction);
        document.addEventListener('click', handleInteraction);
        document.addEventListener('keydown', handleKeyDown);
      }

      if (window.FakeScreenSaverModules && window.FakeScreenSaverModules[config.saver]) {
        currentSaver = window.FakeScreenSaverModules[config.saver];
        currentSaver.init(canvas, ctx, config);
        animate();
      }
    }

    if (isDemoMode) {
      beginAnimation();
    } else {
      document.documentElement.requestFullscreen().then(() => {
        beginAnimation();
      }).catch((err) => {
        console.error('Fullscreen failed:', err);
        alert('Fullscreen mode is required for the screen saver. Please try again.');
      });
    }
  }

  function handleKeyDown(e) {
    if (isLocked) return;
    
    if (e.key === 'Escape') {
      return;
    }
    
    handleInteraction(e);
  }

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && hasStarted && !isLocked) {
      exitScreenSaver();
    }
  });

  startOverlay.addEventListener('click', startScreenSaver);

  unlockBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    exitScreenSaver();
  });

  passwordInput.addEventListener('keydown', (e) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      exitScreenSaver();
    }
  });

  cancelLink.addEventListener('click', (e) => {
    e.stopPropagation();
    exitScreenSaver();
  });

  lockScreen.addEventListener('click', (e) => e.stopPropagation());
  lockScreen.addEventListener('mousemove', (e) => e.stopPropagation());

  chrome.storage.local.get('screenSaverConfig', (result) => {
    config = result.screenSaverConfig || {
      saver: 'floating-text',
      floatingText: { text: 'Hello World', textColor: '#00ff88', bgColor: '#1a1a2e' },
      demoMode: false,
      passwordPrompt: true
    };
    isDemoMode = config.demoMode || false;
    
    if (isDemoMode) {
      startScreenSaver();
    }
  });

  window.FakeScreenSaverModules = window.FakeScreenSaverModules || {};
})();
