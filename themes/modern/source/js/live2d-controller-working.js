/**
 * Live2D工作版控制器
 * 最简单可靠的方法：通过页面重载切换模型
 */

class Live2DWorkingController {
  constructor() {
    this.currentModel = this.getInitialModel();
    this.isVisible = true;
    this.isSwitching = false;
    
    this.availableModels = [
      { name: 'anon_2151', displayName: 'Anon (2151)', path: '/live2d/bang/anon_2151/model.json' },
      { name: 'hina_1387', displayName: 'Hina (1387)', path: '/live2d/bang/hina_1387/model.json' },
      { name: 'kkr_265', displayName: 'Kokoro (265)', path: '/live2d/bang/kkr_265/model.json' },
      { name: 'ksm_270', displayName: 'Kasumi (270)', path: '/live2d/bang/ksm_270/model.json' },
      { name: 'ksm_271', displayName: 'Kasumi (271)', path: '/live2d/bang/ksm_271/model.json' },
      { name: 'mzm', displayName: 'Mutsumi', path: '/live2d/bang/mzm/model.json' },
      { name: 'nidie', displayName: 'Nidie', path: '/live2d/bang/nidie/model.json' },
      { name: 'tomorin', displayName: 'Tomori', path: '/live2d/bang/tomorin/model.json' }
    ];
    
    this.init();
  }

  getInitialModel() {
    // 从localStorage获取保存的模型，或使用默认模型
    const saved = localStorage.getItem('live2d-current-model');
    return saved || 'anon_2151';
  }

  init() {
    this.createControlPanel();
    this.bindEvents();
    this.enableDragging();
    this.loadSettings();
    // 确保模型选择器显示正确的当前模型
    this.updateModelSelector();
    // 默认隐藏控制面板，用户可以通过快捷键 L 打开
    this.hideControlPanel();
  }

  hideControlPanel() {
    const content = document.getElementById('control-content');
    if (content) {
      content.classList.add('collapsed');
    }
  }

  createControlPanel() {
    const controlPanel = document.createElement('div');
    controlPanel.id = 'live2d-control-panel';
    controlPanel.innerHTML = `
      <div class="control-header">
        <span class="control-title">控制面板</span>
        <button class="control-toggle" id="control-toggle">⚙️</button>
      </div>
      <div class="control-content" id="control-content">
        <!-- 模型选择 -->
        <div class="control-group">
          <label>模型选择</label>
          <select id="model-selector">
            ${this.availableModels.map(model => 
              `<option value="${model.name}" ${model.name === this.currentModel ? 'selected' : ''}>
                ${model.displayName}
              </option>`
            ).join('')}
          </select>
        </div>

        <!-- 透明度调整 -->
        <div class="control-group">
          <label>透明度: <span id="opacity-value">100%</span></label>
          <input type="range" id="opacity-slider" min="0.1" max="1" step="0.1" value="1.0">
        </div>

        <!-- 功能按钮 -->
        <div class="control-group">
          <div class="control-buttons">
            <button id="toggle-visibility">${this.isVisible ? '隐藏' : '显示'}</button>
            <button id="clear-cache">清理缓存</button>
          </div>
        </div>

        <!-- 快捷键提示 -->
        <div class="control-group shortcuts-info">
          <label>快捷键</label>
          <p>按 <kbd>L</kbd> 快速打开/关闭此面板</p>
        </div>
      </div>
    `;

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      #live2d-control-panel {
        position: fixed;
        top: 20px;
        left: 20px;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        min-width: 200px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .control-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        cursor: move;
      }

      .control-title {
        font-weight: 600;
        color: #333;
      }

      .control-toggle {
        background: none;
        border: none;
        font-size: 16px;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: background 0.2s;
      }

      .control-toggle:hover {
        background: rgba(0, 0, 0, 0.1);
      }

      .control-content {
        padding: 16px;
        max-height: 400px;
        overflow-y: auto;
      }

      .control-content.collapsed {
        display: none;
      }

      .control-group {
        margin-bottom: 16px;
      }

      .control-group label {
        display: block;
        margin-bottom: 6px;
        font-weight: 500;
        color: #555;
      }

      .control-group select,
      .control-group input[type="range"] {
        width: 100%;
        padding: 6px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
      }

      .position-controls {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
      }

      .pos-row {
        display: flex;
        gap: 4px;
      }

      .pos-btn {
        width: 32px;
        height: 32px;
        border: 1px solid #ddd;
        background: white;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }

      .pos-btn:hover {
        background: #f0f0f0;
        border-color: #999;
      }

      .reset-btn {
        background: #4CAF50;
        color: white;
        border-color: #4CAF50;
      }

      .control-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .control-buttons button {
        flex: 1;
        min-width: 60px;
        padding: 6px 12px;
        border: 1px solid #ddd;
        background: white;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s;
      }

      .control-buttons button:hover {
        background: #f0f0f0;
      }

      .control-group input[type="checkbox"] {
        margin-right: 6px;
      }

      .shortcuts-info {
        background: #f5f5f5;
        padding: 10px;
        border-radius: 4px;
        font-size: 12px;
      }

      .shortcuts-info p {
        margin: 5px 0;
        color: #666;
      }

      .shortcuts-info kbd {
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 3px;
        padding: 2px 6px;
        font-family: monospace;
        font-size: 11px;
      }

      @media (max-width: 768px) {
        #live2d-control-panel {
          top: 10px;
          left: 10px;
          right: 10px;
          width: auto;
        }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(controlPanel);
    
    // 立即设置选择器的正确值
    setTimeout(() => {
      this.updateModelSelector();
    }, 0);
  }

  bindEvents() {
    // 控制面板折叠/展开
    document.getElementById('control-toggle').addEventListener('click', () => {
      const content = document.getElementById('control-content');
      content.classList.toggle('collapsed');
    });

    // 模型切换
    document.getElementById('model-selector').addEventListener('change', (e) => {
      this.switchModel(e.target.value);
    });

    // 透明度调整
    document.getElementById('opacity-slider').addEventListener('input', (e) => {
      const opacity = parseFloat(e.target.value);
      document.getElementById('opacity-value').textContent = Math.round(opacity * 100) + '%';
      this.updateModelOpacity(opacity);
    });

    // 功能按钮
    document.getElementById('toggle-visibility').addEventListener('click', () => {
      this.toggleVisibility();
    });

    document.getElementById('clear-cache').addEventListener('click', () => {
      this.clearCache();
    });

    // 快捷键：按 L 打开/关闭控制面板
    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'l' && !this.isInputFocused()) {
        const content = document.getElementById('control-content');
        content.classList.toggle('collapsed');
      }
    });
  }

  enableDragging() {
    const panel = document.getElementById('live2d-control-panel');
    const header = document.querySelector('.control-header');
    
    if (!panel || !header) return;
    
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    
    // 保存面板位置到 localStorage
    const savePanelPosition = () => {
      const rect = panel.getBoundingClientRect();
      localStorage.setItem('live2d-panel-position', JSON.stringify({
        x: panel.offsetLeft,
        y: panel.offsetTop
      }));
    };
    
    // 从 localStorage 恢复面板位置
    const restorePanelPosition = () => {
      const saved = localStorage.getItem('live2d-panel-position');
      if (saved) {
        try {
          const pos = JSON.parse(saved);
          panel.style.left = pos.x + 'px';
          panel.style.top = pos.y + 'px';
          panel.style.right = 'auto';
        } catch (e) {
          console.warn('恢复面板位置失败:', e);
        }
      }
    };
    
    // 鼠标按下
    header.addEventListener('mousedown', (e) => {
      isDragging = true;
      initialX = e.clientX - panel.offsetLeft;
      initialY = e.clientY - panel.offsetTop;
      header.style.cursor = 'grabbing';
    });
    
    // 鼠标移动
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
      
      // 限制面板在视口内
      const maxX = window.innerWidth - panel.offsetWidth;
      const maxY = window.innerHeight - panel.offsetHeight;
      
      currentX = Math.max(0, Math.min(currentX, maxX));
      currentY = Math.max(0, Math.min(currentY, maxY));
      
      panel.style.left = currentX + 'px';
      panel.style.top = currentY + 'px';
      panel.style.right = 'auto';
    });
    
    // 鼠标释放
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        header.style.cursor = 'move';
        savePanelPosition();
      }
    });
    
    // 鼠标离开窗口
    document.addEventListener('mouseleave', () => {
      if (isDragging) {
        isDragging = false;
        header.style.cursor = 'move';
        savePanelPosition();
      }
    });
    
    // 页面加载时恢复位置
    restorePanelPosition();
  }

  isInputFocused() {
    const activeElement = document.activeElement;
    return activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'SELECT');
  }

  // 最简单可靠的模型切换：直接重新初始化Live2D
  switchModel(modelName) {
    if (this.isSwitching) {
      console.log('⚠️ 正在切换中，请稍候...');
      return;
    }

    const model = this.availableModels.find(m => m.name === modelName);
    if (!model) {
      console.error('❌ 模型不存在:', modelName);
      this.showNotification(`模型 ${modelName} 不存在`);
      return;
    }

    if (modelName === this.currentModel) {
      console.log('ℹ️ 已经是当前模型');
      return;
    }

    console.log(`🔄 切换到模型: ${model.displayName} (${modelName})`);
    this.isSwitching = true;
    
    // 保存新模型选择
    localStorage.setItem('live2d-current-model', modelName);
    console.log('💾 已保存模型选择到localStorage:', modelName);
    
    // 更新当前模型
    this.currentModel = modelName;
    
    // 保存当前设置
    this.saveSettings();
    
    // 显示切换提示
    this.showNotification(`正在切换到 ${model.displayName}...`);
    
    try {
      // 尝试直接重新初始化Live2D
      console.log('🔄 重新初始化Live2D...');
      
      // 清除现有的Live2D实例
      if (window.L2Dwidget) {
        // 尝试清理现有实例
        const canvas = document.getElementById('live2dcanvas');
        if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
      
      // 重新初始化Live2D
      setTimeout(() => {
        L2Dwidget.init({
          "model": {
            "jsonPath": model.path,
            "scale": 1
          },
          "display": {
            "position": "right",
            "width": 450,
            "height": 600,
            "hOffset": 0,
            "vOffset": -60
          },
          "mobile": {
            "show": true,
            "scale": 1.0
          },
          "react": {
            "opacity": 1.0,
            "opacityOnHover": 0.2
          },
          "dialog": {
            "enable": false
          },
          "log": true
        });
        
        this.isSwitching = false;
        this.showNotification(`已切换到 ${model.displayName}`);
        console.log('✅ 模型切换完成');
      }, 500);
      
    } catch (error) {
      console.error('❌ 直接切换失败，尝试重载页面:', error);
      // 如果直接切换失败，回退到重载页面
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  updateModelScale() {
    // 已移除大小调整功能
  }

  updateModelOpacity(opacity) {
    const widget = document.getElementById('live2d-widget');
    if (widget) {
      widget.style.opacity = opacity;
    }
  }

  adjustPosition(direction) {
    // 已移除位置调整功能
  }

  updateModelPosition() {
    // 已移除位置调整功能
  }

  toggleVisibility() {
    const widget = document.getElementById('live2d-widget');
    const button = document.getElementById('toggle-visibility');
    
    if (widget) {
      this.isVisible = !this.isVisible;
      widget.style.display = this.isVisible ? 'block' : 'none';
      if (button) {
        button.textContent = this.isVisible ? '隐藏' : '显示';
      }
    }
    this.saveSettings();
  }

  // 清理缓存和重置
  clearCache() {
    console.log('🧹 清理Live2D缓存...');
    
    // 清理localStorage
    localStorage.removeItem('live2d-current-model');
    localStorage.removeItem('live2d-settings');
    
    this.showNotification('缓存已清理，即将重载页面...');
    
    // 延迟重载页面
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      z-index: 10001;
      font-size: 14px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 2000);
  }

  saveSettings() {
    const settings = {
      model: this.currentModel,
      visible: this.isVisible
    };
    localStorage.setItem('live2d-settings', JSON.stringify(settings));
  }

  loadSettings() {
    const saved = localStorage.getItem('live2d-settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        this.currentModel = settings.model || this.currentModel;
        this.isVisible = settings.visible !== false;

        // 不修改Live2D样式，保持原始设置
        setTimeout(() => {
          if (!this.isVisible) {
            this.toggleVisibility();
          }
        }, 1000);
      } catch (e) {
        console.warn('加载Live2D设置失败:', e);
      }
    }
  }

  // 更新模型选择器显示
  updateModelSelector() {
    const selector = document.getElementById('model-selector');
    if (selector) {
      console.log('🔍 当前模型:', this.currentModel);
      console.log('🔍 选择器当前值:', selector.value);
      
      // 确保选择器显示当前模型
      selector.value = this.currentModel;
      
      console.log('✅ 模型选择器已更新到:', selector.value);
      
      // 验证是否更新成功
      if (selector.value !== this.currentModel) {
        console.warn('⚠️ 选择器更新失败，尝试强制更新');
        // 强制更新：找到对应的option并设置selected
        const options = selector.querySelectorAll('option');
        options.forEach(option => {
          option.selected = option.value === this.currentModel;
        });
      }
    } else {
      console.error('❌ 未找到模型选择器元素');
    }
  }
}

// 等待页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 等待Live2D加载完成
  setTimeout(() => {
    window.live2dController = new Live2DWorkingController();
    console.log('✅ Live2D工作版控制器已初始化');
    
    // 延迟更新选择器，确保DOM完全加载
    setTimeout(() => {
      if (window.live2dController) {
        window.live2dController.updateModelSelector();
      }
    }, 500);
  }, 2000);
});
