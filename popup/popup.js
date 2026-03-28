document.addEventListener('DOMContentLoaded', () => {
  const activateBtn = document.getElementById('activate-btn');
  const saverSelect = document.getElementById('saver-select');
  const floatingTextConfig = document.getElementById('floating-text-config');
  const matrixConfig = document.getElementById('matrix-config');
  const floatingTextInput = document.getElementById('floating-text');
  const textColorInput = document.getElementById('text-color');
  const bgColorInput = document.getElementById('bg-color');
  const matrixSpeedSelect = document.getElementById('matrix-speed');
  const passwordPromptCheckbox = document.getElementById('password-prompt');

  loadConfig();

  function updateConfigVisibility() {
    const selectedSaver = saverSelect.value;
    floatingTextConfig.classList.toggle('visible', selectedSaver === 'floating-text');
    matrixConfig.classList.toggle('visible', selectedSaver === 'matrix');
  }

  saverSelect.addEventListener('change', () => {
    updateConfigVisibility();
    saveConfig();
  });

  floatingTextInput.addEventListener('input', saveConfig);
  textColorInput.addEventListener('input', saveConfig);
  bgColorInput.addEventListener('input', saveConfig);
  matrixSpeedSelect.addEventListener('change', saveConfig);
  passwordPromptCheckbox.addEventListener('change', saveConfig);

  function getConfig() {
    return {
      saver: saverSelect.value,
      floatingText: {
        text: floatingTextInput.value || 'Hello World',
        textColor: textColorInput.value,
        bgColor: bgColorInput.value
      },
      matrixSpeed: matrixSpeedSelect.value,
      passwordPrompt: passwordPromptCheckbox.checked
    };
  }

  function saveConfig() {
    chrome.storage.local.set({ screenSaverConfig: getConfig() });
  }

  function loadConfig() {
    chrome.storage.local.get('screenSaverConfig', (result) => {
      const config = result.screenSaverConfig;
      if (config) {
        if (config.saver) {
          saverSelect.value = config.saver;
        }

        if (config.floatingText) {
          floatingTextInput.value = config.floatingText.text || 'Hello World';
          textColorInput.value = config.floatingText.textColor || '#00ff88';
          bgColorInput.value = config.floatingText.bgColor || '#1a1a2e';
        }

        matrixSpeedSelect.value = config.matrixSpeed || 'slow';
        passwordPromptCheckbox.checked = config.passwordPrompt !== false;
      }
      updateConfigVisibility();
    });
  }

  activateBtn.addEventListener('click', () => {
    const config = getConfig();
    
    chrome.runtime.sendMessage({
      action: 'activate',
      saver: config.saver,
      config: config
    }, (response) => {
      if (response && response.success) {
        window.close();
      } else {
        console.error('Failed to activate:', response?.error);
      }
    });
  });
});
