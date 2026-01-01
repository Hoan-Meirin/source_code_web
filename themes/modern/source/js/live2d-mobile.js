/**
 * Live2D移动端控制器
 * 提供简化的移动端交互功能
 */

class Live2DMobileController {
  constructor() {
    this.isVisible = true;
    this.currentScale = 0.5; // 移动端默认更小
    
    this.init();
  }

  init() {
    if (this.isMobile()) {
      this.createMobileControls();
      this.bindMobileEvents();
    }
  }

  isMobile() {
    return window.innerWidth <= 768;
  }

  createMobileControls() {
    const mobileControls = document.createElement('div');
    mobileControls.id = 'live2d-mobile-controls';
    mobileControls.innerHTML = `
      <div class="mobile-control-btn" id="mobile-toggle">
        <span class="control-icon">${this.isVisible ? '👁️' : '🙈'}</span>
      </div>
      <div class="mobile-menu" id="mobile-menu">
        <button class="mobile-btn" data-action="toggle">切换显示</button>
        <button class="mobile-btn" data-action="smaller">缩小</button>
        <button class="mobile-btn" data-action="bigger">放大</button>
        <button class="mobile-btn" data-action="move">移动</button>
      </div>
    `;

    // 添加移动端样式
    const mobileStyle = document.createElement('style');
    mobileStyle.textContent = `
      #live2d-mobile-controls {
        position: fixed;
        bottom: 80px;
        right: 20px;
        z-index: 10000;
        display: none;
      }

      @media (max-width: 768px) {
        #live2d-mobile-controls {
          display: block;
        }
        
        #live2d-control-panel {
          display: none;
        }
      }

      .mobile-control-btn {
        width: 50px;
        height: 50px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        font-size: 20px;
        transition: all 0.3s;
      }

      .mobile-control-btn:active {
        transform: scale(0.95);
      }

      .mobile-menu {
        position: absolute;
        bottom: 60px;
        right: 0;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 10px;
        padding: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        display: none;
        flex-direction: column;
        gap: 8px;
        min-width: 100px;
      }

      .mobile-menu.show {
        display: flex;
      }

      .mobile-btn {
        padding: 8px 12px;
        border: none;
        background: white;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        transition: all 0.2s;
      }

      .mobile-btn:active {
        transform: scale(0.95);
        background: #f0f0f0;
      }
    `;

    document.head.appendChild(mobileStyle);
    document.body.appendChild(mobileControls);
  }

  bindMobileEvents() {
    // 切换菜单显示
    document.getElementById('mobile-toggle').addEventListener('click', () => {
      const menu = document.getElementById('mobile-menu');
      menu.classList.toggle('show');
    });

    // 菜单按钮事件
    document.querySelectorAll('.mobile-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        this.handleMobileAction(action);
        
        // 关闭菜单
        document.getElementById('mobile-menu').classList.remove('show');
      });
    });

    // 点击外部关闭菜单
    document.addEventListener('click', (e) => {
      const controls = document.getElementById('live2d-mobile-controls');
      if (controls && !controls.contains(e.target)) {
        document.getElementById('mobile-menu').classList.remove('show');
      }
    });
  }

  handleMobileAction(action) {
    const widget = document.querySelector('#live2d-widget');
    if (!widget) return;

    switch (action) {
      case 'toggle':
        this.isVisible = !this.isVisible;
        widget.style.display = this.isVisible ? 'block' : 'none';
        document.querySelector('.control-icon').textContent = this.isVisible ? '👁️' : '🙈';
        break;

      case 'smaller':
        this.currentScale = Math.max(0.2, this.currentScale - 0.1);
        widget.style.transform = `scale(${this.currentScale})`;
        widget.style.transformOrigin = 'bottom right';
        break;

      case 'bigger':
        this.currentScale = Math.min(1.5, this.currentScale + 0.1);
        widget.style.transform = `scale(${this.currentScale})`;
        widget.style.transformOrigin = 'bottom right';
        break;

      case 'move':
        this.enableMobileMove();
        break;
    }
  }

  enableMobileMove() {
    const widget = document.querySelector('#live2d-widget');
    if (!widget) return;

    // 显示移动提示
    const moveHint = document.createElement('div');
    moveHint.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 15px 25px;
      border-radius: 10px;
      z-index: 10001;
      font-size: 16px;
      text-align: center;
    `;
    moveHint.innerHTML = '拖拽Live2D模型到新位置<br><small>点击任意处完成</small>';
    document.body.appendChild(moveHint);

    // 启用拖拽
    widget.style.cursor = 'move';
    let isDragging = false;
    let startPos = { x: 0, y: 0 };
    let currentPos = { x: 0, y: 0 };

    const handleTouchStart = (e) => {
      isDragging = true;
      const touch = e.touches[0];
      startPos.x = touch.clientX;
      startPos.y = touch.clientY;
      e.preventDefault();
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - startPos.x;
      const deltaY = touch.clientY - startPos.y;
      
      currentPos.x += deltaX;
      currentPos.y += deltaY;
      
      widget.style.right = `${20 - currentPos.x}px`;
      widget.style.bottom = `${0 - currentPos.y}px`;
      
      startPos.x = touch.clientX;
      startPos.y = touch.clientY;
      e.preventDefault();
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    widget.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    // 点击完成移动
    const finishMove = () => {
      widget.style.cursor = '';
      widget.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('click', finishMove);
      moveHint.remove();
    };

    setTimeout(() => {
      document.addEventListener('click', finishMove);
    }, 100);
  }
}

// 初始化移动端控制器
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    window.live2dMobileController = new Live2DMobileController();
    console.log('✅ Live2D移动端控制器已初始化');
  }, 2500);
});