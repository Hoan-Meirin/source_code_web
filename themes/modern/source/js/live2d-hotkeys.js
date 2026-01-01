/**
 * Live2D快捷键控制
 * 提供键盘快捷键操作Live2D模型
 */

class Live2DHotkeys {
  constructor() {
    this.shortcuts = {
      'KeyH': () => this.toggleVisibility(),           // H - 隐藏/显示
      'Digit1': () => this.switchModel('anon_2151'),     // 1 - 切换到Anon
      'Digit2': () => this.switchModel('hina_1387'),     // 2 - 切换到Hina
      'Digit3': () => this.switchModel('kkr_265'),       // 3 - 切换到Kokoro
      'Digit4': () => this.switchModel('ksm_270'),       // 4 - 切换到Kasumi 270
      'Digit5': () => this.switchModel('ksm_271'),       // 5 - 切换到Kasumi 271
      'Digit6': () => this.switchModel('mzm'),           // 6 - 切换到Mutsumi
      'Digit7': () => this.switchModel('nidie'),         // 7 - 切换到Nidie
      'Digit8': () => this.switchModel('tomorin'),       // 8 - 切换到Tomori
    };

    this.isEnabled = true;
    this.showHelpOnStart = false;  // 禁用自动显示帮助面板
    
    this.init();
  }

  init() {
    this.bindHotkeys();
    // 不创建帮助面板，因为已禁用快捷键功能
  }

  bindHotkeys() {
    document.addEventListener('keydown', (e) => {
      // 只在没有焦点在输入框时响应快捷键
      if (this.isInputFocused() || !this.isEnabled) return;
      
      // 检查是否按下Ctrl键（用于组合键）
      const isCtrlPressed = e.ctrlKey || e.metaKey;
      
      if (isCtrlPressed && this.shortcuts[e.code]) {
        e.preventDefault();
        this.shortcuts[e.code]();
        this.showActionFeedback(this.getActionName(e.code));
      }
    });
  }

  isInputFocused() {
    const activeElement = document.activeElement;
    return activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.contentEditable === 'true'
    );
  }

  getActionName(code) {
    const actionNames = {
      'KeyH': '切换显示',
      'Digit1': '切换到Anon',
      'Digit2': '切换到Hina',
      'Digit3': '切换到Kokoro',
      'Digit4': '切换到Kasumi 270',
      'Digit5': '切换到Kasumi 271',
      'Digit6': '切换到Mutsumi',
      'Digit7': '切换到Nidie',
      'Digit8': '切换到Tomori'
    };
    return actionNames[code] || '未知操作';
  }

  // 快捷键操作方法
  toggleVisibility() {
    if (window.live2dController) {
      window.live2dController.toggleVisibility();
    }
  }

  switchModel(modelName) {
    if (window.live2dController) {
      const selector = document.getElementById('model-selector');
      if (selector) {
        selector.value = modelName;
        selector.dispatchEvent(new Event('change'));
      }
    }
  }

  showActionFeedback(actionName) {
    // 移除之前的反馈
    const existingFeedback = document.querySelector('.action-feedback');
    if (existingFeedback) {
      existingFeedback.remove();
    }

    const feedback = document.createElement('div');
    feedback.className = 'action-feedback';
    feedback.textContent = actionName;
    feedback.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      z-index: 10001;
      font-size: 14px;
      font-weight: 500;
      animation: fadeInOut 1.5s ease-in-out;
    `;

    // 添加动画
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(-10px); }
        20% { opacity: 1; transform: translateY(0); }
        80% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-10px); }
      }
    `;
    document.head.appendChild(animationStyle);

    document.body.appendChild(feedback);

    setTimeout(() => {
      feedback.remove();
    }, 1500);
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }
}

// 初始化快捷键控制
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    window.live2dHotkeys = new Live2DHotkeys();
    console.log('✅ Live2D快捷键控制已初始化');
  }, 3000);
});