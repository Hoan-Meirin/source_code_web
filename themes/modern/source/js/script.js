// 主题切换功能
document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.querySelector('.theme-toggle');
  const body = document.body;
  
  // 检查本地存储的主题设置
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    body.classList.add(savedTheme);
    updateThemeIcon(savedTheme);
  }
  
  // 主题切换事件
  themeToggle.addEventListener('click', function() {
    if (body.classList.contains('dark-theme')) {
      body.classList.remove('dark-theme');
      localStorage.setItem('theme', '');
      updateThemeIcon('');
    } else {
      body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark-theme');
      updateThemeIcon('dark-theme');
    }
  });
  
  function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark-theme') {
      icon.className = 'fas fa-sun';
    } else {
      icon.className = 'fas fa-moon';
    }
  }
});

// 搜索功能
document.addEventListener('DOMContentLoaded', function() {
  const searchBtn = document.querySelector('.search-btn');
  
  searchBtn.addEventListener('click', function() {
    // 这里可以添加搜索功能
    alert('搜索功能开发中...');
  });
});

// 移动端菜单切换
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  
  menuToggle.addEventListener('click', function() {
    nav.classList.toggle('mobile-active');
  });
});

// 平滑滚动
document.addEventListener('DOMContentLoaded', function() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
});

// 卡片悬停效果增强
document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('.course-card, .category-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
});

// 技术标签动画
document.addEventListener('DOMContentLoaded', function() {
  const techTags = document.querySelectorAll('.tech-tag');
  
  techTags.forEach((tag, index) => {
    tag.style.animationDelay = `${index * 0.1}s`;
    tag.classList.add('fade-in');
  });
});

// 添加CSS动画类
const style = document.createElement('style');
style.textContent = `
  .fade-in {
    animation: fadeInUp 0.6s ease-out forwards;
    opacity: 0;
    transform: translateY(20px);
  }
  
  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .dark-theme {
    background-color: #0f172a;
    color: #e2e8f0;
  }
  
  .dark-theme .header {
    background: #1e293b;
  }
  
  .dark-theme .sidebar-card,
  .dark-theme .course-card {
    background: #1e293b;
    color: #e2e8f0;
  }
  
  .dark-theme .nav-link {
    color: #94a3b8;
  }
  
  .dark-theme .nav-link:hover {
    color: #60a5fa;
  }
  
  @media (max-width: 768px) {
    .nav {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      flex-direction: column;
      padding: 1rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      transform: translateY(-100%);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s;
    }
    
    .nav.mobile-active {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }
    
    .dark-theme .nav {
      background: #1e293b;
    }
  }
`;
document.head.appendChild(style);

// Live2D 交互功能
document.addEventListener('DOMContentLoaded', function() {
  // 检查是否启用了Live2D
  if (typeof L2Dwidget !== 'undefined') {
    console.log('🎭 Live2D 看板娘已加载');
    
    // 添加点击事件
    document.addEventListener('click', function(e) {
      // 随机显示一些消息
      const messages = [
        '你好呀！欢迎来到我的的博客~',
        '今天也要好好学习哦！',
        '记得多看看技术文章呢~',
        '编程路上，我们一起加油！',
        '有什么问题可以在评论区留言哦~'
      ];
      
      // 随机选择一条消息（这里只是示例，实际需要Live2D插件支持）
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      console.log('💬 Live2D消息:', randomMessage);
    });
    
    // 页面滚动时的互动
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > lastScrollTop) {
        // 向下滚动
        console.log('📜 向下滚动中...');
      } else {
        // 向上滚动
        console.log('📜 向上滚动中...');
      }
      
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);
  }
});

// 添加Live2D相关的CSS样式
const live2dStyle = document.createElement('style');
live2dStyle.textContent = `
  /* Live2D 容器样式 */
  #live2d-widget {
    transition: all 0.3s ease-in-out;
  }
  
  #live2d-widget:hover {
    transform: translateY(-10px);
  }
  
  /* 移动端适配 */
  @media (max-width: 768px) {
    #live2d-widget {
      transform: scale(0.7);
      bottom: 10px;
      right: 10px;
    }
  }
  
  /* Live2D 消息框样式 */
  .live2d-message {
    position: fixed;
    bottom: 320px;
    right: 20px;
    background: rgba(255, 255, 255, 0.95);
    border: 2px solid #2563eb;
    border-radius: 12px;
    padding: 10px 15px;
    max-width: 200px;
    font-size: 14px;
    color: #333;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
    pointer-events: none;
  }
  
  .live2d-message.show {
    opacity: 1;
    transform: translateY(0);
  }
  
  .live2d-message::after {
    content: '';
    position: absolute;
    bottom: -8px;
    right: 30px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid #2563eb;
  }
`;
document.head.appendChild(live2dStyle);
// MathJax 渲染支持
document.addEventListener('DOMContentLoaded', function() {
  // 检查是否有MathJax
  if (typeof MathJax !== 'undefined') {
    console.log('🔢 MathJax 已加载');
    
    // 确保MathJax正确渲染
    MathJax.startup.promise.then(() => {
      console.log('✅ MathJax 渲染完成');
      
      // 为动态加载的内容重新渲染数学公式
      const observer = new MutationObserver(function(mutations) {
        let shouldRerender = false;
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            for (let node of mutation.addedNodes) {
              if (node.nodeType === 1 && (node.textContent.includes('$') || node.textContent.includes('\\('))) {
                shouldRerender = true;
                break;
              }
            }
          }
        });
        
        if (shouldRerender) {
          MathJax.typesetPromise().then(() => {
            console.log('🔄 MathJax 重新渲染完成');
          });
        }
      });
      
      // 监听页面内容变化
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }
});

// 手动触发MathJax渲染的函数
function renderMath() {
  if (typeof MathJax !== 'undefined' && MathJax.typesetPromise) {
    MathJax.typesetPromise().then(() => {
      console.log('🔢 手动渲染MathJax完成');
    }).catch((err) => {
      console.error('❌ MathJax渲染错误:', err);
    });
  }
}

// 页面加载完成后延迟渲染
window.addEventListener('load', function() {
  setTimeout(renderMath, 500);
});