// 用户状态
let userState = {
    username: '',
    lastDailyTask: null, // 上次完成每日任务的日期
    isLoggedIn: false
};

// 游戏状态
let gameState = {
    tickets: 3,
    clickCount: 0,
    clickProgress: 0,
    workTime: 0,
    collection: [],
    isOpening: false
};

// 每日任务状态
let dailyTaskState = {
    dustCleaned: 0,
    totalDust: 20,
    isCompleted: false
};

// 创意作品数据 - 使用免费图标替代图片
const artworks = [
    // 神话级 (2% - 约50抽1张)
    { id: 1, name: "蒙娜丽莎", rarity: "mythic", icon: "👸", probability: 1 },
    { id: 2, name: "星夜", rarity: "mythic", icon: "🌌", probability: 1 },
    
    // 传说级 (8%)
    { id: 3, name: "向日葵", rarity: "legendary", icon: "🌻", probability: 4 },
    { id: 4, name: "呐喊", rarity: "legendary", icon: "😱", probability: 4 },
    
    // 史诗级 (20%)
    { id: 5, name: "大卫像", rarity: "epic", icon: "🗿", probability: 7 },
    { id: 6, name: "思想者", rarity: "epic", icon: "🤔", probability: 7 },
    { id: 7, name: "维纳斯", rarity: "epic", icon: "💃", probability: 6 },
    
    // 稀有级 (30%)
    { id: 8, name: "自由女神", rarity: "rare", icon: "🗽", probability: 10 },
    { id: 9, name: "断臂维纳斯", rarity: "rare", icon: "🏛️", probability: 10 },
    { id: 10, name: "胜利女神", rarity: "rare", icon: "👼", probability: 10 },
    
    // 普通级 (40%)
    { id: 11, name: "抽象画A", rarity: "common", icon: "🎨", probability: 10 },
    { id: 12, name: "抽象画B", rarity: "common", icon: "🖼️", probability: 10 },
    { id: 13, name: "抽象画C", rarity: "common", icon: "🖌️", probability: 10 },
    { id: 14, name: "抽象画D", rarity: "common", icon: "🎭", probability: 10 }
];

// DOM 元素
const elements = {
    tickets: document.getElementById('tickets'),
    keysCount: document.getElementById('keys-count'),
    clickCount: document.getElementById('click-count'),
    canvasWorkspace: document.getElementById('canvas-workspace'),
    canvasContent: document.getElementById('canvas-content'),
    progressFillMini: document.getElementById('progress-fill'),
    gachaBtn: document.getElementById('gacha-btn'),
    caseItems: document.getElementById('case-items'),
    
    // 用户系统
    loginModal: document.getElementById('login-modal'),
    usernameInput: document.getElementById('username-input'),
    loginBtn: document.getElementById('login-btn'),
    userInfo: document.getElementById('user-info'),
    userName: document.getElementById('user-name'),
    
    // 每日任务
    dailyTaskModal: document.getElementById('daily-task-modal'),
    dailyTaskBtn: document.getElementById('daily-task-btn'),
    dailyTaskArea: document.getElementById('daily-task-area'),
    dustParticles: document.getElementById('dust-particles'),
    dailyProgressFill: document.getElementById('daily-progress-fill'),
    dailyProgressText: document.getElementById('daily-progress-text'),
    skipDailyBtn: document.getElementById('skip-daily-btn'),
    collection: document.getElementById('collection'),
    resultModal: document.getElementById('result-modal'),
    resultArtwork: document.getElementById('result-artwork'),
    closeModal: document.getElementById('close-modal'),
    
    // 界面切换
    workBtn: document.getElementById('work-btn'),
    gachaNavBtn: document.getElementById('gacha-nav-btn'),
    galleryBtn: document.getElementById('gallery-btn'),
    workScreen: document.getElementById('work-screen'),
    gachaScreen: document.getElementById('gacha-screen'),
    galleryScreen: document.getElementById('gallery-screen'),
    
    // 宝箱相关
    treasureChest: document.getElementById('treasure-chest'),
    treasureChestArea: document.getElementById('treasure-chest-area'),
    crateIcon: document.getElementById('crate-icon'),
    keyAnimation: document.getElementById('key-animation'),
    crateTape: document.getElementById('crate-tape'),
    caseOpeningArea: document.getElementById('case-opening-area'),
    resultTitle: document.getElementById('result-title'),
    
    // 统计相关
    totalArtworks: document.getElementById('total-artworks'),
    rareArtworks: document.getElementById('rare-artworks'),
    

    
    // 钥匙购买相关
    buyKeysPremiumBtn: document.getElementById('buy-keys-premium-btn'),
    keyPurchaseModal: document.getElementById('key-purchase-modal'),
    confirmKeyPurchaseBtn: document.getElementById('confirm-key-purchase-btn'),
    cancelKeyPurchaseBtn: document.getElementById('cancel-key-purchase-btn'),
    
    // 二维码支付相关
    qrPaymentModal: document.getElementById('qr-payment-modal'),
    qrPaymentIcon: document.getElementById('qr-payment-icon'),
    qrPaymentTitle: document.getElementById('qr-payment-title'),
    qrCenterLogo: document.getElementById('qr-center-logo'),
    paymentAppName: document.getElementById('payment-app-name'),
    paymentTimer: document.getElementById('payment-timer'),
    refreshQrBtn: document.getElementById('refresh-qr-btn'),
    cancelQrPaymentBtn: document.getElementById('cancel-qr-payment-btn')
};

// 初始化游戏
function initGame() {
    console.log('开始初始化游戏');
    
    // 检查用户登录状态
    loadUserState();
    
    // 始终显示用户信息
    updateUserDisplay();
    
    // 检查每日任务相关元素
    console.log('检查每日任务元素:', {
        dailyTaskModal: !!elements.dailyTaskModal,
        dailyTaskBtn: !!elements.dailyTaskBtn,
        dailyTaskArea: !!elements.dailyTaskArea,
        dustParticles: !!elements.dustParticles,
        dailyProgressFill: !!elements.dailyProgressFill,
        dailyProgressText: !!elements.dailyProgressText,
        skipDailyBtn: !!elements.skipDailyBtn
    });
    
    // 确保登录弹窗正确显示/隐藏
    if (!userState.isLoggedIn) {
        // 显示登录弹窗
        showLoginModal();
    } else {
        // 已登录，隐藏登录弹窗
        hideLoginModal();
        // 检查每日任务
        checkDailyTask();
    }
    
    updateUI();
    loadCollection();
    
    // 确保初始状态栏不透明
    const statusBar = document.querySelector('.status-bar');
    if (statusBar) {
        statusBar.classList.remove('transparent');
    }
    
    // 画布点击事件 - 确保事件绑定正确
    if (elements.canvasWorkspace) {
        console.log('Canvas workspace found, binding click event');
        elements.canvasWorkspace.addEventListener('click', handleCanvasClick);
        elements.canvasWorkspace.style.pointerEvents = 'auto';
    } else {
        console.error('Canvas workspace not found!');
    }
    
    // 其他事件监听
    if (elements.gachaBtn) elements.gachaBtn.addEventListener('click', performGacha);
    if (elements.closeModal) elements.closeModal.addEventListener('click', closeModal);
    
    // 界面切换
    if (elements.workBtn) elements.workBtn.addEventListener('click', () => switchScreen('work'));
    if (elements.gachaNavBtn) elements.gachaNavBtn.addEventListener('click', () => switchScreen('gacha'));
    if (elements.galleryBtn) elements.galleryBtn.addEventListener('click', () => switchScreen('gallery'));
    
    // 手机端导航
    const mobileWorkBtn = document.getElementById('mobile-work-btn');
    const mobileGachaBtn = document.getElementById('mobile-gacha-nav-btn');
    const mobileGalleryBtn = document.getElementById('mobile-gallery-btn');
    
    if (mobileWorkBtn) mobileWorkBtn.addEventListener('click', () => switchScreen('work'));
    if (mobileGachaBtn) mobileGachaBtn.addEventListener('click', () => switchScreen('gacha'));
    if (mobileGalleryBtn) mobileGalleryBtn.addEventListener('click', () => switchScreen('gallery'));
    
    // 宝箱点击效果和开箱功能
    if (elements.treasureChest) {
        elements.treasureChest.addEventListener('click', () => {
            if (gameState.tickets > 0 && !gameState.isOpening) {
                // 播放点击动画
                elements.treasureChest.style.animation = 'iconBounce 0.6s ease';
                setTimeout(() => {
                    elements.treasureChest.style.animation = '';
                }, 600);
                
                // 实际执行开箱
                performGacha();
            }
        });
    }
    
    // 用户登录事件
    if (elements.loginBtn) {
        elements.loginBtn.addEventListener('click', handleLogin);
    }
    if (elements.usernameInput) {
        elements.usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleLogin();
        });
    }
    
    // 每日任务事件
    if (elements.dailyTaskBtn) {
        elements.dailyTaskBtn.addEventListener('click', showDailyTaskModal);
    }
    if (elements.skipDailyBtn) {
        elements.skipDailyBtn.addEventListener('click', hideDailyTaskModal);
    }
    
    // 添加点击特效
    addClickEffects();
    
    // 添加展厅筛选功能
    setupGalleryFilters();
    

    
    // 添加购买钥匙功能
    setupKeyPurchase();
    
    // 添加移动端优化
    addMobileOptimizations();
}

// 界面切换
function switchScreen(screen) {
    // 更新导航按钮状态 - 桌面端和手机端
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    // 隐藏所有界面
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    
    // 获取状态栏元素
    const statusBar = document.querySelector('.status-bar');
    
    if (screen === 'work') {
        if (elements.workBtn) elements.workBtn.classList.add('active');
        const mobileWorkBtn = document.getElementById('mobile-work-btn');
        if (mobileWorkBtn) mobileWorkBtn.classList.add('active');
        elements.workScreen.classList.add('active');
        // 设置状态栏透明 - 工作界面也透明
        if (statusBar) statusBar.classList.add('transparent');
    } else if (screen === 'gacha') {
        if (elements.gachaNavBtn) elements.gachaNavBtn.classList.add('active');
        const mobileGachaBtn = document.getElementById('mobile-gacha-nav-btn');
        if (mobileGachaBtn) mobileGachaBtn.classList.add('active');
        elements.gachaScreen.classList.add('active');
        
        // 设置状态栏透明
        if (statusBar) statusBar.classList.add('transparent');
        
        // 重置宝箱状态并确保正确显示
        resetGachaScreen();
    } else if (screen === 'gallery') {
        if (elements.galleryBtn) elements.galleryBtn.classList.add('active');
        const mobileGalleryBtn = document.getElementById('mobile-gallery-btn');
        if (mobileGalleryBtn) mobileGalleryBtn.classList.add('active');
        elements.galleryScreen.classList.add('active');
        // 设置状态栏透明 - 展厅界面也透明
        if (statusBar) statusBar.classList.add('transparent');
        displayCollection();
    }
}

// 重置宝箱界面状态
function resetGachaScreen() {
    // 隐藏开箱动画区域
    if (elements.caseOpeningArea) {
        elements.caseOpeningArea.classList.add('hidden');
    }
    
    // 显示宝箱区域
    if (elements.treasureChestArea) {
        elements.treasureChestArea.style.display = 'flex';
        elements.treasureChestArea.style.position = 'fixed';
        elements.treasureChestArea.style.top = '0';
        elements.treasureChestArea.style.left = '0';
        elements.treasureChestArea.style.width = '100vw';
        elements.treasureChestArea.style.height = '100vh';
        elements.treasureChestArea.style.zIndex = '1';
    }
    
    // 重置宝箱动画状态
    if (elements.treasureChest) {
        elements.treasureChest.style.animation = '';
    }
    if (elements.crateIcon) {
        elements.crateIcon.style.animation = '';
    }
    if (elements.keyAnimation) {
        elements.keyAnimation.style.display = 'none';
    }
    
    // 重置开箱按钮
    if (elements.gachaBtn) {
        elements.gachaBtn.innerHTML = `
            <span class="btn-icon">🔓</span>
            <span class="btn-text">开启创意宝箱</span>
        `;
        elements.gachaBtn.disabled = gameState.tickets <= 0 || gameState.isOpening;
    }
}

// 更新UI
function updateUI() {
    elements.tickets.textContent = gameState.tickets;
    if (elements.keysCount) elements.keysCount.textContent = gameState.tickets;
    elements.clickCount.textContent = gameState.clickCount;
    
    // 更新手机端钥匙显示
    const mobileTickets = document.getElementById('mobile-tickets');
    if (mobileTickets) mobileTickets.textContent = gameState.tickets;
    
    const progressPercent = (gameState.clickProgress / 100) * 100;
    if (elements.progressFillMini) {
        elements.progressFillMini.style.width = `${progressPercent}%`;
    }
    
    // 更新按钮状态
    elements.gachaBtn.disabled = gameState.tickets <= 0 || gameState.isOpening;
    
    // 更新统计信息
    if (elements.totalArtworks) {
        elements.totalArtworks.textContent = gameState.collection.length;
    }
    if (elements.rareArtworks) {
        const rareCount = gameState.collection.filter(art => 
            art.rarity === 'epic' || art.rarity === 'legendary' || art.rarity === 'mythic'
        ).length;
        elements.rareArtworks.textContent = rareCount;
    }
}

// 创建CS风格箱子物品
function createCaseItems() {
    elements.caseItems.innerHTML = '';
    
    // 生成足够多的物品用于滚动效果 - 30秒需要更多卡片
    const totalItems = 120;
    
    for (let i = 0; i < totalItems; i++) {
        let artwork;
        
        // 控制稀有度分布：大部分是普通卡，少量高级卡
        const rand = Math.random();
        if (rand < 0.75) {
            // 75% 普通卡
            artwork = artworks.filter(art => art.rarity === 'common')[Math.floor(Math.random() * 4)];
        } else if (rand < 0.90) {
            // 15% 稀有卡
            artwork = artworks.filter(art => art.rarity === 'rare')[Math.floor(Math.random() * 3)];
        } else if (rand < 0.97) {
            // 7% 史诗卡
            artwork = artworks.filter(art => art.rarity === 'epic')[Math.floor(Math.random() * 3)];
        } else if (rand < 0.995) {
            // 2.5% 传说卡
            artwork = artworks.filter(art => art.rarity === 'legendary')[Math.floor(Math.random() * 2)];
        } else {
            // 0.5% 神话卡
            artwork = artworks.filter(art => art.rarity === 'mythic')[Math.floor(Math.random() * 2)];
        }
        
        const item = document.createElement('div');
        item.className = 'case-item';
        item.innerHTML = `
            <div class="case-item-rarity rarity-${artwork.rarity}"></div>
            <div class="case-item-icon">${artwork.icon}</div>
            <div class="case-item-name">${artwork.name}</div>
        `;
        elements.caseItems.appendChild(item);
    }
}

// 全屏画布点击系统
function handleCanvasClick(event) {
    console.log('Canvas clicked!', event.clientX, event.clientY);
    
    gameState.clickCount++;
    gameState.clickProgress++;
    
    // 获取点击位置
    const rect = elements.canvasWorkspace.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    console.log('Paint stroke at:', x, y);
    
    // 创建随机颜色的笔触
    createRandomPaintStroke(x, y);
    
    // 创建点击特效
    createPaintEffect(event.clientX, event.clientY);
    
    // 检查是否完成画作 - 100次完成
    if (gameState.clickProgress >= 100) {
        gameState.clickProgress = 0;
        gameState.tickets++;
        showNotification('🗝️ 完成了一个创意！获得1把创意钥匙！');
        
        // 画作完成特效
        createCompletionEffect();
    }
    
    updateUI();
    saveGameState();
}

// 创建随机笔触
function createRandomPaintStroke(x, y) {
    const colors = [
        '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', 
        '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
        '#10ac84', '#ee5a52', '#0abde3', '#006ba6', '#f368e0'
    ];
    
    const stroke = document.createElement('div');
    stroke.className = 'paint-stroke';
    
    // 随机大小和形状
    const size = Math.random() * 30 + 10; // 10-40px
    const color = colors[Math.floor(Math.random() * colors.length)];
    const rotation = Math.random() * 360;
    const opacity = Math.random() * 0.4 + 0.4; // 0.4-0.8
    
    // 随机偏移，让笔触不完全在鼠标位置
    const offsetX = (Math.random() - 0.5) * 40;
    const offsetY = (Math.random() - 0.5) * 40;
    
    stroke.style.cssText = `
        left: ${x + offsetX}px;
        top: ${y + offsetY}px;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        opacity: ${opacity};
        transform: rotate(${rotation}deg);
    `;
    
    elements.canvasContent.appendChild(stroke);
    
    // 限制画布上的笔触数量，避免性能问题
    const strokes = elements.canvasContent.querySelectorAll('.paint-stroke');
    if (strokes.length > 200) {
        strokes[0].remove();
    }
}

// 画作完成特效
function createCompletionEffect() {
    // 闪光效果
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%);
        pointer-events: none;
        z-index: 1000;
        animation: flashEffect 1s ease-out;
    `;
    
    document.body.appendChild(flash);
    
    setTimeout(() => {
        flash.remove();
    }, 1000);
    
    // 重置画布（可选，让用户重新开始创作）
    setTimeout(() => {
        const strokes = elements.canvasContent.querySelectorAll('.paint-stroke');
        strokes.forEach((stroke, index) => {
            setTimeout(() => {
                stroke.style.animation = 'fadeOut 0.5s ease-out forwards';
                setTimeout(() => stroke.remove(), 500);
            }, index * 20);
        });
    }, 2000);
}

// 添加点击特效
function addClickEffects() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes bounce {
            0%, 20%, 60%, 100% { transform: translateY(0) scale(1); }
            40% { transform: translateY(-20px) scale(1.1); }
            80% { transform: translateY(-10px) scale(1.05); }
        }
        
        @keyframes paintEffect {
            0% { transform: scale(0) rotate(0deg); opacity: 1; }
            100% { transform: scale(1.5) rotate(180deg); opacity: 0; }
        }
        
        @keyframes paintingComplete {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); box-shadow: 0 0 30px rgba(255, 215, 0, 0.8); }
        }
        
        .paint-effect {
            position: fixed;
            pointer-events: none;
            z-index: 1000;
            font-size: 20px;
            animation: paintEffect 0.8s ease-out forwards;
        }
    `;
    document.head.appendChild(style);
}

// 创建绘画特效
function createPaintEffect(x, y) {
    const effects = ['🎨', '🖌️', '✨', '🌈', '💫'];
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
    
    const effect = document.createElement('div');
    effect.className = 'paint-effect';
    effect.textContent = effects[Math.floor(Math.random() * effects.length)];
    effect.style.left = x + 'px';
    effect.style.top = y + 'px';
    effect.style.color = colors[Math.floor(Math.random() * colors.length)];
    
    document.body.appendChild(effect);
    
    setTimeout(() => {
        effect.remove();
    }, 800);
}

// 炫酷的开箱系统
function performGacha() {
    if (gameState.tickets <= 0 || gameState.isOpening) return;
    
    gameState.tickets -= 1;
    gameState.isOpening = true;
    
    // 第一阶段：宝箱开启动画
    elements.gachaBtn.innerHTML = `
        <span class="button-text">🔓 开启中...</span>
        <span class="button-cost">请稍候</span>
    `;
    
    // 开始开箱动画序列
    startCrateOpeningAnimation();
    
    updateUI();
}

// 宝箱开启动画序列
function startCrateOpeningAnimation() {
    const crateIcon = elements.crateIcon;
    const keyAnimation = elements.keyAnimation;
    const crateTape = elements.crateTape;
    
    // 第一步：显示钥匙动画
    keyAnimation.style.display = 'block';
    keyAnimation.style.animation = 'keyInsert 1s ease-in-out';
    
    setTimeout(() => {
        // 第二步：钥匙转动效果，开始切割封条
        keyAnimation.style.animation = 'keyTurn 0.8s ease-in-out';
        
        // 移除封条动画
        
        setTimeout(() => {
            // 第三步：宝箱打开动画（震动+发光效果）
            crateIcon.style.animation = 'crateShakeAndGlow 1.5s ease-out';
            
            setTimeout(() => {
                // 第四步：隐藏钥匙，添加发光效果
                keyAnimation.style.display = 'none';
                elements.treasureChest.style.animation = 'crateGlow 0.5s ease-in-out 2';
                
                setTimeout(() => {
                    // 第五步：跳转到滚动界面
                    elements.treasureChestArea.style.display = 'none';
                    elements.caseOpeningArea.classList.remove('hidden');
                    
                    // 重置宝箱状态
                    crateIcon.style.animation = '';
                    elements.treasureChest.style.animation = '';
                    // 移除封条重置代码
                    
                    // 开始CS风格滚动
                    startCaseOpening();
                }, 1000);
            }, 1000);
        }, 800);
    }, 1000);
}

function startCaseOpening() {
    // 先确定获奖物品
    const finalArtwork = getRandomArtwork();
    
    // 重新生成物品确保随机性
    createCaseItems();
    
    const containerWidth = elements.caseItems.parentElement.offsetWidth;
    const itemWidth = 180; // 更新为新的物品宽度
    
    // 确保获奖物品在中间位置 - 使用固定的中间索引
    const winningIndex = 40; // 120个卡片中的中间位置
    
    // 设置获奖物品内容
    const winningItem = elements.caseItems.children[winningIndex];
    if (winningItem) {
        winningItem.innerHTML = `
            <div class="case-item-rarity rarity-${finalArtwork.rarity}"></div>
            <div class="case-item-icon">${finalArtwork.icon}</div>
            <div class="case-item-name">${finalArtwork.name}</div>
        `;
    }
    
    // 计算精确的停止位置，让获奖物品正好在指针下方
    const centerPosition = containerWidth / 2;
    const itemCenterPosition = (winningIndex * itemWidth) + (itemWidth / 2);
    const finalOffset = centerPosition - itemCenterPosition;
    
    // 计算一致的滚动方向 - 从右向左滚动，匀速减慢
    const startOffset = itemWidth * 20; // 适中的起始距离，确保卡片可见
    
    // 设置起始位置并立即开始滚动
    elements.caseItems.style.transform = `translateX(${startOffset}px)`;
    elements.caseItems.style.transition = 'none';
    elements.caseItems.style.opacity = '1';
    
    // 强制浏览器重绘，然后开始滚动动画
    elements.caseItems.offsetHeight; // 触发重绘
    
    // 立即开始滚动动画，从极快到很慢 - 30秒时长
    // 使用从极快到很慢的缓动函数，30秒滚动到最终位置
    // cubic-bezier(0.005, 0.95, 0.6, 0.99) 提供超快开始且持续更久：开始极快，长时间高速，最后急剧减速
    elements.caseItems.style.transition = 'transform 30s cubic-bezier(0.005, 0.95, 0.6, 0.99)';
    elements.caseItems.style.transform = `translateX(${finalOffset}px)`;
    
    // 确保动画结束后立即停止所有transition
    setTimeout(() => {
        elements.caseItems.style.transition = 'none';
    }, 30000);
    
    // 添加调试信息
    console.log('滚动信息:', {
        containerWidth,
        itemWidth,
        winningIndex,
        centerPosition,
        itemCenterPosition,
        finalOffset,
        artwork: finalArtwork.name
    });
    
    // 等待滚动完成 - 总时间20秒
    setTimeout(() => {
        // 验证获奖物品是否正确显示在中心位置
        const currentWinningItem = elements.caseItems.children[winningIndex];
        console.log('验证获奖物品:', {
            expectedName: finalArtwork.name,
            actualName: currentWinningItem?.querySelector('.case-item-name')?.textContent,
            position: winningIndex
        });
        
        // 添加到收藏
        gameState.collection.push(finalArtwork);
        
        // 滚轮停止后停顿2秒，让玩家看清楚获得的物品
        setTimeout(() => {
            // 显示结果弹窗
            showResult(finalArtwork);
            
            // 重置状态
            gameState.isOpening = false;
            elements.gachaBtn.innerHTML = `
                <span class="btn-icon">🔓</span>
                <span class="btn-text">开启创意宝箱</span>
            `;
            
            // 重置界面
            elements.treasureChestArea.style.display = 'flex';
            elements.caseOpeningArea.classList.add('hidden');
            
            // 重置滚动位置
            elements.caseItems.style.transition = 'none';
            elements.caseItems.style.transform = 'translateX(0)';
            
            updateUI();
            saveGameState();
        }, 2000); // 停顿2秒后显示结果
        
    }, 30000); // 总时间30秒
}

// 获取随机创意作品
function getRandomArtwork() {
    const random = Math.random() * 100;
    let cumulativeProbability = 0;
    
    for (const artwork of artworks) {
        cumulativeProbability += artwork.probability;
        if (random <= cumulativeProbability) {
            return { ...artwork, obtainedAt: new Date().toISOString() };
        }
    }
    
    return { ...artworks[artworks.length - 1], obtainedAt: new Date().toISOString() };
}



// 显示抽卡结果
function showResult(artwork) {
    // 根据稀有度设置不同的标题和效果
    let title = '🎉 恭喜获得！';
    let titleClass = '';
    
    switch(artwork.rarity) {
        case 'mythic':
            title = '🌟 传奇降临！神话级创意！';
            titleClass = 'mythic-result';
            break;
        case 'legendary':
            title = '✨ 传说级创意！';
            titleClass = 'legendary-result';
            break;
        case 'epic':
            title = '💜 史诗级创意！';
            titleClass = 'epic-result';
            break;
        case 'rare':
            title = '💙 稀有创意！';
            titleClass = 'rare-result';
            break;
        default:
            title = '🎨 获得创意作品！';
            titleClass = 'common-result';
    }
    
    elements.resultTitle.textContent = title;
    elements.resultTitle.className = titleClass;
    
    elements.resultArtwork.innerHTML = `
        <div class="result-icon">${artwork.icon}</div>
        <h4>${artwork.name}</h4>
        <span class="artwork-rarity rarity-${artwork.rarity}">${getRarityText(artwork.rarity)}</span>
    `;
    
    elements.resultModal.classList.remove('hidden');
    
    // 添加特殊效果
    if (artwork.rarity === 'mythic' || artwork.rarity === 'legendary') {
        createFireworks();
    }
}

// 关闭弹窗
function closeModal() {
    elements.resultModal.classList.add('hidden');
    displayCollection();
}

// 显示收藏
function displayCollection(filterRarity = 'all') {
    elements.collection.innerHTML = '';
    
    // 筛选收藏品
    let filteredCollection = gameState.collection;
    if (filterRarity !== 'all') {
        filteredCollection = gameState.collection.filter(artwork => artwork.rarity === filterRarity);
    }
    
    if (gameState.collection.length === 0) {
        elements.collection.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px; color: #6c757d;">
                <div style="font-size: 4em; margin-bottom: 20px;">🖼️</div>
                <h3>暂无收藏</h3>
                <p>去开箱获得您的第一个创意作品吧！</p>
            </div>
        `;
        return;
    }
    
    if (filteredCollection.length === 0) {
        elements.collection.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px; color: #6c757d;">
                <div style="font-size: 4em; margin-bottom: 20px;">🔍</div>
                <h3>暂无此类型收藏</h3>
                <p>尝试其他筛选条件或去开箱获得更多创意作品！</p>
            </div>
        `;
        return;
    }
    
    filteredCollection.forEach(artwork => {
        const item = document.createElement('div');
        item.className = 'artwork-item';
        item.setAttribute('data-rarity', artwork.rarity);
        item.innerHTML = `
            <div class="artwork-icon">${artwork.icon}</div>
            <div class="artwork-name">${artwork.name}</div>
            <span class="artwork-rarity rarity-${artwork.rarity}">${getRarityText(artwork.rarity)}</span>
            <div class="artwork-date">获得于: ${new Date(artwork.obtainedAt).toLocaleDateString()}</div>
        `;
        
        // 为所有卡片添加点击展开功能
        item.addEventListener('click', () => {
            showCardExpansion(item, artwork);
        });
        item.style.cursor = 'pointer';
        
        elements.collection.appendChild(item);
    });
}

// 获取稀有度文本
function getRarityText(rarity) {
    const rarityMap = {
        common: '普通',
        rare: '稀有',
        epic: '史诗',
        legendary: '传说',
        mythic: '神话'
    };
    return rarityMap[rarity] || '未知';
}

// 显示创意作品特效
function showArtworkEffect(itemElement, artwork) {
    // 添加点击特效类
    itemElement.classList.add('artwork-clicked');
    
    // 根据稀有度创建不同特效
    switch(artwork.rarity) {
        case 'rare':
            createRareEffect(itemElement);
            break;
        case 'epic':
            createEpicEffect(itemElement);
            break;
        case 'legendary':
            createLegendaryEffect(itemElement);
            break;
        case 'mythic':
            createMythicEffect(itemElement);
            break;
    }
    
    // 移除特效类
    setTimeout(() => {
        itemElement.classList.remove('artwork-clicked');
    }, 2000);
}

// 稀有卡片特效
function createRareEffect(element) {
    // 蓝色光环特效
    const effect = document.createElement('div');
    effect.className = 'rare-effect';
    effect.style.cssText = `
        position: absolute;
        top: -10px;
        left: -10px;
        right: -10px;
        bottom: -10px;
        border: 3px solid #3498db;
        border-radius: 20px;
        box-shadow: 0 0 20px #3498db;
        animation: rareGlow 1.5s ease-in-out;
        pointer-events: none;
        z-index: 10;
    `;
    element.style.position = 'relative';
    element.appendChild(effect);
    
    setTimeout(() => {
        if (effect.parentNode) {
            effect.parentNode.removeChild(effect);
        }
    }, 1500);
}

// 史诗卡片特效
function createEpicEffect(element) {
    // 紫色粒子特效
    const effect = document.createElement('div');
    effect.className = 'epic-effect';
    effect.style.cssText = `
        position: absolute;
        top: -15px;
        left: -15px;
        right: -15px;
        bottom: -15px;
        border: 4px solid #9b59b6;
        border-radius: 25px;
        box-shadow: 0 0 30px #9b59b6, inset 0 0 20px rgba(155, 89, 182, 0.3);
        animation: epicPulse 2s ease-in-out;
        pointer-events: none;
        z-index: 10;
    `;
    element.style.position = 'relative';
    element.appendChild(effect);
    
    // 添加粒子
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            createParticle(element, '#9b59b6');
        }, i * 200);
    }
    
    setTimeout(() => {
        if (effect.parentNode) {
            effect.parentNode.removeChild(effect);
        }
    }, 2000);
}

// 传说卡片特效
function createLegendaryEffect(element) {
    // 金色光芒特效
    const effect = document.createElement('div');
    effect.className = 'legendary-effect';
    effect.style.cssText = `
        position: absolute;
        top: -20px;
        left: -20px;
        right: -20px;
        bottom: -20px;
        border: 5px solid #f39c12;
        border-radius: 30px;
        box-shadow: 0 0 40px #f39c12, inset 0 0 30px rgba(243, 156, 18, 0.4);
        animation: legendaryShine 2.5s ease-in-out;
        pointer-events: none;
        z-index: 10;
    `;
    element.style.position = 'relative';
    element.appendChild(effect);
    
    // 添加光芒粒子
    for (let i = 0; i < 12; i++) {
        setTimeout(() => {
            createParticle(element, '#f39c12');
        }, i * 150);
    }
    
    // 添加闪光效果
    createFlashEffect(element);
    
    setTimeout(() => {
        if (effect.parentNode) {
            effect.parentNode.removeChild(effect);
        }
    }, 2500);
}

// 神话卡片特效
function createMythicEffect(element) {
    // 彩虹光环特效
    const effect = document.createElement('div');
    effect.className = 'mythic-effect';
    effect.style.cssText = `
        position: absolute;
        top: -25px;
        left: -25px;
        right: -25px;
        bottom: -25px;
        border: 6px solid;
        border-image: linear-gradient(45deg, #e74c3c, #f39c12, #f1c40f, #27ae60, #3498db, #9b59b6) 1;
        border-radius: 35px;
        box-shadow: 0 0 50px rgba(231, 76, 60, 0.8), inset 0 0 40px rgba(255, 255, 255, 0.3);
        animation: mythicRainbow 3s ease-in-out;
        pointer-events: none;
        z-index: 10;
    `;
    element.style.position = 'relative';
    element.appendChild(effect);
    
    // 添加彩虹粒子
    const colors = ['#e74c3c', '#f39c12', '#f1c40f', '#27ae60', '#3498db', '#9b59b6'];
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createParticle(element, colors[i % colors.length]);
        }, i * 100);
    }
    
    // 添加强烈闪光效果
    createFlashEffect(element, true);
    
    // 添加烟花效果
    setTimeout(() => {
        createFireworks();
    }, 1000);
    
    setTimeout(() => {
        if (effect.parentNode) {
            effect.parentNode.removeChild(effect);
        }
    }, 3000);
}

// 创建粒子效果
function createParticle(parentElement, color) {
    const particle = document.createElement('div');
    const angle = Math.random() * 360;
    const distance = 50 + Math.random() * 30;
    const size = 4 + Math.random() * 6;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation: particleFloat 1.5s ease-out forwards;
        pointer-events: none;
        z-index: 15;
        box-shadow: 0 0 10px ${color};
    `;
    
    // 设置粒子运动方向
    particle.style.setProperty('--angle', angle + 'deg');
    particle.style.setProperty('--distance', distance + 'px');
    
    parentElement.appendChild(particle);
    
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 1500);
}

// 创建闪光效果
function createFlashEffect(element, intense = false) {
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: ${intense ? 
            'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)' : 
            'radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)'
        };
        border-radius: 15px;
        animation: flashPulse ${intense ? '0.8s' : '0.5s'} ease-in-out;
        pointer-events: none;
        z-index: 20;
    `;
    
    element.appendChild(flash);
    
    setTimeout(() => {
        if (flash.parentNode) {
            flash.parentNode.removeChild(flash);
        }
    }, intense ? 800 : 500);
}

// 卡片展开到页面中心的动画
function showCardExpansion(cardElement, artwork) {
    console.log('展开卡片:', artwork.name);
    
    // 获取卡片的当前位置
    const rect = cardElement.getBoundingClientRect();
    
    // 创建展开的卡片副本
    const expandedCard = document.createElement('div');
    expandedCard.className = 'expanded-card-overlay';
    expandedCard.innerHTML = `
        <div class="expanded-card-backdrop"></div>
        <div class="expanded-card-content" id="expanded-card">
            <div class="expanded-card-header">
                <div class="expanded-icon">${artwork.icon}</div>
                <h2 class="expanded-title">${artwork.name}</h2>
                <span class="expanded-rarity rarity-${artwork.rarity}">${getRarityText(artwork.rarity)}</span>
            </div>
            <div class="expanded-card-body">
                <div class="expanded-details">
                    <div class="detail-item">
                        <span class="detail-label">获得时间</span>
                        <span class="detail-value">${new Date(artwork.obtainedAt).toLocaleDateString()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">稀有度</span>
                        <span class="detail-value">${getRarityText(artwork.rarity)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">思维类型</span>
                        <span class="detail-value">${getThoughtType(artwork.rarity)}</span>
                    </div>
                </div>
            </div>
            <button class="close-expanded-btn">
                <span>✕</span>
            </button>
            <div class="tap-to-close-hint">点击任意位置关闭</div>
        </div>
    `;
    
    // 设置初始位置（卡片原位置）
    const expandedCardContent = expandedCard.querySelector('.expanded-card-content');
    expandedCardContent.style.cssText = `
        position: fixed;
        left: ${rect.left}px;
        top: ${rect.top}px;
        width: ${rect.width}px;
        height: ${rect.height}px;
        transform: scale(1);
        transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        z-index: 10000;
    `;
    
    document.body.appendChild(expandedCard);
    
    // 触发展开动画
    setTimeout(() => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            expandedCardContent.style.cssText = `
                position: fixed;
                left: 5px;
                top: 5px;
                width: calc(100vw - 10px);
                height: calc(100vh - 10px);
                height: calc(var(--vh, 1vh) * 100 - 10px);
                transform: scale(1);
                transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                z-index: 10000;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
                overscroll-behavior: contain;
            `;
        } else {
            expandedCardContent.style.cssText = `
                position: fixed;
                left: ${centerX - 250}px;
                top: ${centerY - 200}px;
                width: 500px;
                height: 400px;
                transform: scale(1);
                transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                z-index: 10000;
                max-height: 80vh;
                overflow-y: auto;
            `;
        }
    }, 50);
    
    // 添加事件监听器
    const backdrop = expandedCard.querySelector('.expanded-card-backdrop');
    const closeBtn = expandedCard.querySelector('.close-expanded-btn');
    
    // 点击背景关闭
    if (backdrop) {
        backdrop.addEventListener('click', closeExpandedCard);
    }
    
    // 点击关闭按钮
    if (closeBtn) {
        closeBtn.addEventListener('click', closeExpandedCard);
    }
    
    // 点击卡片内容也可以关闭 - 用户要求点击任意位置都能关闭
    expandedCard.addEventListener('click', (e) => {
        // 阻止关闭按钮的事件冒泡，其他任何地方都可以关闭
        if (!e.target.classList.contains('close-expanded-btn')) {
            closeExpandedCard();
        }
    });
    
    // 添加触摸事件支持（移动端）
    expandedCard.addEventListener('touchstart', (e) => {
        // 阻止关闭按钮的事件冒泡，其他任何地方都可以关闭
        if (!e.target.classList.contains('close-expanded-btn')) {
            closeExpandedCard();
        }
    });
    
    // ESC键关闭
    const handleKeyPress = (e) => {
        if (e.key === 'Escape') {
            closeExpandedCard();
            document.removeEventListener('keydown', handleKeyPress);
        }
    };
    document.addEventListener('keydown', handleKeyPress);
    
    // 将键盘事件处理器存储到卡片元素上，以便在关闭时清理
    expandedCard._keyHandler = handleKeyPress;
    
    // 为稀有卡片添加特效
    if (artwork.rarity !== 'common') {
        setTimeout(() => {
            showArtworkEffect(expandedCardContent, artwork);
        }, 600);
    }
    
    console.log('卡片展开完成，已添加关闭事件监听器');
}

// 关闭展开的卡片
function closeExpandedCard() {
    console.log('关闭展开的卡片');
    const expandedCard = document.querySelector('.expanded-card-overlay');
    if (expandedCard) {
        const cardContent = expandedCard.querySelector('.expanded-card-content');
        if (cardContent) {
            cardContent.style.transform = 'scale(0)';
            cardContent.style.opacity = '0';
        }
        
        // 移除键盘事件监听器
        if (expandedCard._keyHandler) {
            document.removeEventListener('keydown', expandedCard._keyHandler);
        }
        
        setTimeout(() => {
            try {
                if (expandedCard && expandedCard.parentNode) {
                    expandedCard.parentNode.removeChild(expandedCard);
                    console.log('卡片已成功关闭并移除');
                }
            } catch (error) {
                console.error('关闭卡片时出错:', error);
            }
        }, 300);
    } else {
        console.log('未找到展开的卡片');
    }
}

// 使函数全局可访问
window.closeExpandedCard = closeExpandedCard;

// 测试函数 - 强制显示每日任务
window.testDailyTask = function() {
    console.log('强制测试每日任务');
    // 重置用户状态，强制显示任务
    userState.lastDailyTask = null;
    showDailyTaskModal();
};

// 调试函数 - 检查每日任务元素
window.debugDailyTask = function() {
    console.log('每日任务调试信息:', {
        dailyTaskModal: elements.dailyTaskModal,
        dailyTaskBtn: elements.dailyTaskBtn,
        dailyTaskArea: elements.dailyTaskArea,
        dustParticles: elements.dustParticles,
        dailyProgressFill: elements.dailyProgressFill,
        dailyProgressText: elements.dailyProgressText,
        skipDailyBtn: elements.skipDailyBtn,
        userState: userState,
        dailyTaskState: dailyTaskState
    });
    
    if (elements.dailyTaskModal) {
        console.log('弹窗当前状态:', {
            classList: elements.dailyTaskModal.classList.toString(),
            style: elements.dailyTaskModal.style.cssText,
            display: getComputedStyle(elements.dailyTaskModal).display
        });
    }
};







// 获取思维类型
function getThoughtType(rarity) {
    const thoughtTypes = {
        common: '日常思考',
        rare: '深度洞察',
        epic: '创新灵感',
        legendary: '突破性思维',
        mythic: '天才级想法'
    };
    return thoughtTypes[rarity] || '未知思维';
}

// 显示通知
function showNotification(message) {
    const notification = document.createElement('div');
    const isMobileDevice = window.innerWidth <= 768;
    
    notification.style.cssText = `
        position: fixed;
        top: ${isMobileDevice ? '50%' : '20px'};
        left: ${isMobileDevice ? '50%' : 'auto'};
        right: ${isMobileDevice ? 'auto' : '20px'};
        transform: ${isMobileDevice ? 'translate(-50%, -50%)' : 'none'};
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        z-index: 10001;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        font-size: ${isMobileDevice ? '16px' : '16px'};
        text-align: center;
        backdrop-filter: blur(10px);
        max-width: ${isMobileDevice ? '280px' : '300px'};
        word-wrap: break-word;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 4000); // 延长显示时间到4秒
}

// 保存游戏状态
function saveGameState() {
    localStorage.setItem('artworkCollection', JSON.stringify(gameState.collection));
    localStorage.setItem('gameState', JSON.stringify({
        tickets: gameState.tickets,
        clickCount: gameState.clickCount,
        clickProgress: gameState.clickProgress,
        workTime: gameState.workTime
    }));
}

// 加载游戏状态
function loadCollection() {
    const savedCollection = localStorage.getItem('artworkCollection');
    const savedState = localStorage.getItem('gameState');
    
    if (savedCollection) {
        gameState.collection = JSON.parse(savedCollection);
        displayCollection();
    }
    
    if (savedState) {
        const state = JSON.parse(savedState);
        gameState.tickets = state.tickets || 3;
        gameState.clickCount = state.clickCount || 0;
        gameState.clickProgress = state.clickProgress || 0;
        gameState.workTime = state.workTime || 0;
        updateUI();
    }
}

// 创建烟花特效 (稀有卡专用)
function createFireworks() {
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: ${['#ff6b6b', '#4ecdc4', '#45b7d1', '#feca57', '#ff9ff3'][Math.floor(Math.random() * 5)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 2000;
                left: ${Math.random() * window.innerWidth}px;
                top: ${Math.random() * window.innerHeight}px;
                animation: fireworkExplode 2s ease-out forwards;
            `;
            document.body.appendChild(firework);
            
            setTimeout(() => firework.remove(), 2000);
        }, i * 100);
    }
}

// ==================== 用户系统 ====================

// 加载用户状态
function loadUserState() {
    const savedUser = localStorage.getItem('userState');
    if (savedUser) {
        userState = JSON.parse(savedUser);
        if (userState.username) {
            userState.isLoggedIn = true;
            updateUserDisplay();
        }
    }
}

// 保存用户状态
function saveUserState() {
    localStorage.setItem('userState', JSON.stringify(userState));
}

// 显示登录弹窗
function showLoginModal() {
    if (elements.loginModal) {
        elements.loginModal.classList.remove('hidden');
    }
}

// 隐藏登录弹窗
function hideLoginModal() {
    if (elements.loginModal) {
        elements.loginModal.classList.add('hidden');
    }
}

// 处理登录
function handleLogin() {
    const username = elements.usernameInput.value.trim();
    
    if (username.length < 2) {
        showNotification('昵称至少需要2个字符');
        return;
    }
    
    if (username.length > 10) {
        showNotification('昵称最多10个字符');
        return;
    }
    
    userState.username = username;
    userState.isLoggedIn = true;
    userState.lastDailyTask = null; // 新用户没有完成过每日任务
    
    saveUserState();
    updateUserDisplay();
    hideLoginModal();
    
    // 显示用户信息面板
    if (elements.userInfo) {
        elements.userInfo.style.display = 'flex';
    }
    
    showNotification(`欢迎，${username}！`);
    
    // 检查每日任务
    setTimeout(() => {
        checkDailyTask();
    }, 1000);
}

// 更新用户显示
function updateUserDisplay() {
    if (elements.userName) {
        const displayName = userState.username ? `创作中的艺术家 ${userState.username}` : '创作中的艺术家 访客';
        elements.userName.textContent = displayName;
    }
    // 始终显示用户信息
    if (elements.userInfo) {
        elements.userInfo.style.display = 'flex';
    }
}

// ==================== 每日任务系统 ====================

// 获取今天的日期字符串
function getTodayString() {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

// 检查每日任务
function checkDailyTask() {
    const today = getTodayString();
    
    // 确保每日任务按钮存在并可见
    if (elements.dailyTaskBtn) {
        elements.dailyTaskBtn.style.display = 'flex';
        
        if (userState.lastDailyTask !== today) {
            // 今天还没完成每日任务，显示提示
            elements.dailyTaskBtn.classList.add('has-reward');
            // 自动弹出每日任务
            setTimeout(() => {
                showDailyTaskModal();
            }, 1000); // 延长到1秒，确保界面完全加载
        } else {
            // 今天已完成
            elements.dailyTaskBtn.classList.remove('has-reward');
        }
    }
    
    // 确保用户信息面板可见
    if (elements.userInfo) {
        elements.userInfo.style.display = 'flex';
    }
}

// 显示每日任务弹窗
function showDailyTaskModal() {
    console.log('显示每日任务弹窗被调用');
    const today = getTodayString();
    
    if (userState.lastDailyTask === today) {
        showNotification('今天的任务已完成，明天再来吧！');
        return;
    }
    
    // 检查DOM元素是否存在
    if (!elements.dailyTaskModal) {
        console.error('每日任务弹窗元素未找到');
        // 尝试重新获取元素
        elements.dailyTaskModal = document.getElementById('daily-task-modal');
        if (!elements.dailyTaskModal) {
            console.error('重新获取后仍未找到每日任务弹窗元素');
            return;
        }
    }
    
    if (!elements.dustParticles) {
        console.error('灰尘粒子容器未找到');
        // 尝试重新获取元素
        elements.dustParticles = document.getElementById('dust-particles');
        if (!elements.dustParticles) {
            console.error('重新获取后仍未找到灰尘粒子容器');
            return;
        }
    }
    
    console.log('开始重置任务状态');
    // 重置任务状态
    dailyTaskState.dustCleaned = 0;
    dailyTaskState.isCompleted = false;
    
    // 生成灰尘
    console.log('生成灰尘');
    generateDust();
    
    // 更新进度显示
    console.log('更新进度显示');
    updateDailyProgress();
    
    // 显示弹窗 - 确保弹窗可见
    console.log('显示弹窗');
    elements.dailyTaskModal.classList.remove('hidden');
    elements.dailyTaskModal.style.display = 'flex';
    elements.dailyTaskModal.style.visibility = 'visible';
    elements.dailyTaskModal.style.opacity = '1';
    
    // 确保弹窗在最顶层
    elements.dailyTaskModal.style.zIndex = '10001';
    
    console.log('每日任务弹窗应该已显示');
    
    // 验证弹窗是否真的显示了
    setTimeout(() => {
        const computedStyle = getComputedStyle(elements.dailyTaskModal);
        console.log('弹窗显示验证:', {
            display: computedStyle.display,
            visibility: computedStyle.visibility,
            opacity: computedStyle.opacity,
            zIndex: computedStyle.zIndex
        });
    }, 100);
}

// 隐藏每日任务弹窗
function hideDailyTaskModal() {
    console.log('隐藏每日任务弹窗');
    if (elements.dailyTaskModal) {
        elements.dailyTaskModal.classList.add('hidden');
        elements.dailyTaskModal.style.display = 'none';
    }
}

// 生成灰尘粒子
function generateDust() {
    if (!elements.dustParticles) return;
    
    elements.dustParticles.innerHTML = '';
    
    // 根据设备调整灰尘数量和大小
    const isMobileDevice = window.innerWidth <= 768;
    const dustCount = isMobileDevice ? 15 : 20; // 手机端减少灰尘数量
    const baseSize = isMobileDevice ? 20 : 25; // 手机端稍小的基础大小
    
    for (let i = 0; i < dustCount; i++) {
        const dust = document.createElement('div');
        dust.className = 'dust';
        dust.style.left = `${Math.random() * 80 + 10}%`;
        dust.style.top = `${Math.random() * 70 + 15}%`;
        dust.style.animationDelay = `${Math.random() * 2}s`;
        
        // 根据设备调整大小
        const size = Math.random() * 15 + baseSize;
        dust.style.width = `${size}px`;
        dust.style.height = `${size}px`;
        
        // 增大点击区域
        dust.style.padding = isMobileDevice ? '15px' : '10px';
        dust.style.margin = isMobileDevice ? '-15px' : '-10px';
        
        // 添加触摸事件支持
        dust.addEventListener('click', () => cleanDust(dust));
        dust.addEventListener('touchstart', (e) => {
            e.preventDefault();
            cleanDust(dust);
        });
        
        elements.dustParticles.appendChild(dust);
    }
    
    // 更新总数
    dailyTaskState.totalDust = dustCount;
}

// 清扫灰尘
function cleanDust(dustElement) {
    if (dustElement.classList.contains('cleaned')) return;
    
    dustElement.classList.add('cleaned');
    dailyTaskState.dustCleaned++;
    
    // 播放清扫音效（可选）
    // playSound('sweep');
    
    updateDailyProgress();
    
    // 检查是否完成
    if (dailyTaskState.dustCleaned >= dailyTaskState.totalDust) {
        completeDailyTask();
    }
}

// 更新每日任务进度
function updateDailyProgress() {
    const progress = (dailyTaskState.dustCleaned / dailyTaskState.totalDust) * 100;
    
    if (elements.dailyProgressFill) {
        elements.dailyProgressFill.style.width = `${progress}%`;
    }
    
    if (elements.dailyProgressText) {
        elements.dailyProgressText.textContent = `${dailyTaskState.dustCleaned}/${dailyTaskState.totalDust}`;
    }
}

// 完成每日任务
function completeDailyTask() {
    dailyTaskState.isCompleted = true;
    
    // 记录完成日期
    userState.lastDailyTask = getTodayString();
    saveUserState();
    
    // 奖励5把钥匙
    gameState.tickets += 5;
    saveGameState();
    updateUI();
    
    // 移除提示标记
    if (elements.dailyTaskBtn) {
        elements.dailyTaskBtn.classList.remove('has-reward');
    }
    
    // 显示完成动画
    setTimeout(() => {
        hideDailyTaskModal();
        showNotification('🎉 每日任务完成！获得5把创意钥匙！');
        createFireworks();
    }, 500);
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { 
            transform: translateY(-20px); 
            opacity: 0; 
            scale: 0.9;
        }
        to { 
            transform: translateY(0); 
            opacity: 1; 
            scale: 1;
        }
    }
    
    @keyframes glow {
        0%, 100% { box-shadow: 0 0 10px rgba(102, 126, 234, 0.5); }
        50% { box-shadow: 0 0 30px rgba(102, 126, 234, 0.8), 0 0 50px rgba(102, 126, 234, 0.6); }
    }
    
    @keyframes fireworkExplode {
        0% { transform: scale(0); opacity: 1; }
        50% { transform: scale(1.5); opacity: 0.8; }
        100% { transform: scale(3); opacity: 0; }
    }
    
    @keyframes chestGlow {
        0%, 100% { opacity: 0; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.05); }
    }
    
    @keyframes flashEffect {
        0% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.8); }
    }
    
    .main-artwork img {
        animation: glow 3s ease-in-out infinite;
    }
    
    .mythic-result {
        background: linear-gradient(45deg, #e74c3c, #f39c12);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: rainbow 2s ease-in-out infinite;
    }
    
    .legendary-result {
        color: #f39c12;
        text-shadow: 0 0 10px rgba(243, 156, 18, 0.5);
    }
    
    .epic-result {
        color: #9b59b6;
        text-shadow: 0 0 10px rgba(155, 89, 182, 0.5);
    }
    
    .rare-result {
        color: #3498db;
        text-shadow: 0 0 10px rgba(52, 152, 219, 0.5);
    }
    
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
    
    @keyframes iconBounce {
        0%, 20%, 60%, 100% { transform: translateY(0) scale(1); }
        40% { transform: translateY(-20px) scale(1.1); }
        80% { transform: translateY(-10px) scale(1.05); }
    }
    
    @keyframes keyInsert {
        0% { 
            transform: translate(-50%, -150%) scale(0.5); 
            opacity: 0; 
        }
        100% { 
            transform: translate(-50%, -50%) scale(1); 
            opacity: 1; 
        }
    }
    
    @keyframes keyTurn {
        0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
        50% { transform: translate(-50%, -50%) rotate(90deg); }
    }
    
    @keyframes crateOpen {
        0% { 
            transform: scale(1) rotate(0deg); 
        }
        50% { 
            transform: scale(1.2) rotate(5deg); 
        }
        100% { 
            transform: scale(1) rotate(0deg); 
        }
    }
    
    @keyframes crateGlow {
        0%, 100% { 
            filter: drop-shadow(0 10px 30px rgba(0,0,0,0.3)); 
        }
        50% { 
            filter: drop-shadow(0 15px 50px rgba(255, 215, 0, 0.8)); 
            transform: scale(1.05); 
        }
    }
    
    .hidden {
        display: none !important;
    }
`;
document.head.appendChild(style);

// 设置展厅筛选功能
function setupGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有按钮的active状态
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // 添加当前按钮的active状态
            button.classList.add('active');
            
            // 获取筛选类型
            const filterType = button.getAttribute('data-filter');
            
            // 显示筛选后的收藏
            displayCollection(filterType);
        });
    });
}











// 检测是否为移动设备
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// 检测是否为触摸设备
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// 添加移动端优化
function addMobileOptimizations() {
    if (isMobile() || isTouchDevice()) {
        // 防止双击缩放
        document.addEventListener('touchstart', function(e) {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // 防止长按选择文本
        document.addEventListener('selectstart', function(e) {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
            }
        });
        
        // 优化滚动性能
        document.body.style.webkitOverflowScrolling = 'touch';
        
        // 添加触摸反馈
        document.body.classList.add('touch-device');
        
        // 防止iOS Safari的弹跳效果
        document.addEventListener('touchmove', function(e) {
            if (e.target.closest('.modal-content') || e.target.closest('.gallery-main')) {
                return; // 允许模态框和画廊内容滚动
            }
            e.preventDefault();
        }, { passive: false });
        
        // 优化触摸延迟
        if ('FastClick' in window) {
            FastClick.attach(document.body);
        }
        
        // 添加视口高度CSS变量（解决移动端100vh问题）
        function setViewportHeight() {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }
        
        setViewportHeight();
        window.addEventListener('resize', setViewportHeight);
        window.addEventListener('orientationchange', setViewportHeight);
    }
}





// ==================== 钥匙购买系统 ====================

let selectedKeyPaymentMethod = 'alipay';
let paymentTimer = null;
let paymentTimeLeft = 300; // 5分钟

// 设置钥匙购买功能
function setupKeyPurchase() {
    // 充值钥匙按钮
    if (elements.buyKeysPremiumBtn) {
        elements.buyKeysPremiumBtn.addEventListener('click', showKeyPurchaseModal);
    }
    
    // 支付方式选择
    const keyPaymentBtns = document.querySelectorAll('#key-purchase-modal .payment-btn');
    keyPaymentBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            keyPaymentBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedKeyPaymentMethod = btn.getAttribute('data-method');
        });
    });
    
    // 确认购买按钮
    if (elements.confirmKeyPurchaseBtn) {
        elements.confirmKeyPurchaseBtn.addEventListener('click', processKeyPurchase);
    }
    
    // 取消购买按钮
    if (elements.cancelKeyPurchaseBtn) {
        elements.cancelKeyPurchaseBtn.addEventListener('click', hideKeyPurchaseModal);
    }
    
    // 二维码相关按钮
    if (elements.refreshQrBtn) {
        elements.refreshQrBtn.addEventListener('click', refreshQRCode);
    }
    
    if (elements.cancelQrPaymentBtn) {
        elements.cancelQrPaymentBtn.addEventListener('click', cancelQRPayment);
    }
}

// 显示钥匙购买弹窗
function showKeyPurchaseModal() {
    if (elements.keyPurchaseModal) {
        elements.keyPurchaseModal.classList.remove('hidden');
    }
}

// 隐藏钥匙购买弹窗
function hideKeyPurchaseModal() {
    if (elements.keyPurchaseModal) {
        elements.keyPurchaseModal.classList.add('hidden');
    }
}

// 处理钥匙购买
function processKeyPurchase() {
    hideKeyPurchaseModal();
    showQRPayment(selectedKeyPaymentMethod);
}

// 显示二维码支付
function showQRPayment(method) {
    const methodConfig = {
        alipay: {
            icon: '💙',
            title: '支付宝支付',
            appName: '支付宝',
            logo: '💙'
        },
        wechat: {
            icon: '💚',
            title: '微信支付',
            appName: '微信',
            logo: '💚'
        }
    };
    
    const config = methodConfig[method];
    
    // 更新UI
    if (elements.qrPaymentIcon) elements.qrPaymentIcon.textContent = config.icon;
    if (elements.qrPaymentTitle) elements.qrPaymentTitle.textContent = config.title;
    if (elements.qrCenterLogo) elements.qrCenterLogo.textContent = config.logo;
    if (elements.paymentAppName) elements.paymentAppName.textContent = config.appName;
    
    // 显示二维码弹窗
    if (elements.qrPaymentModal) {
        elements.qrPaymentModal.classList.remove('hidden');
    }
    
    // 开始倒计时
    startPaymentTimer();
    
    // 模拟支付检测
    simulatePaymentDetection();
}

// 开始支付倒计时
function startPaymentTimer() {
    paymentTimeLeft = 300; // 重置为5分钟
    
    if (paymentTimer) {
        clearInterval(paymentTimer);
    }
    
    paymentTimer = setInterval(() => {
        paymentTimeLeft--;
        
        const minutes = Math.floor(paymentTimeLeft / 60);
        const seconds = paymentTimeLeft % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (elements.paymentTimer) {
            elements.paymentTimer.textContent = timeString;
        }
        
        if (paymentTimeLeft <= 0) {
            clearInterval(paymentTimer);
            showNotification('支付超时，请重新生成二维码');
        }
    }, 1000);
}

// 模拟支付检测
function simulatePaymentDetection() {
    // 模拟15-30秒后支付成功
    const paymentDelay = Math.random() * 15000 + 15000; // 15-30秒
    
    setTimeout(() => {
        if (elements.qrPaymentModal && !elements.qrPaymentModal.classList.contains('hidden')) {
            // 支付成功
            completeKeyPurchase();
        }
    }, paymentDelay);
}

// 完成钥匙购买
function completeKeyPurchase() {
    // 清除定时器
    if (paymentTimer) {
        clearInterval(paymentTimer);
        paymentTimer = null;
    }
    
    // 隐藏二维码弹窗
    hideQRPayment();
    
    // 添加钥匙
    gameState.tickets += 20;
    updateUI();
    saveGameState();
    
    // 显示成功消息
    showNotification('🎉 支付成功！获得20把创意钥匙！');
    createFireworks();
}

// 刷新二维码
function refreshQRCode() {
    showNotification('二维码已刷新');
    startPaymentTimer(); // 重新开始倒计时
    
    // 重新开始支付检测
    simulatePaymentDetection();
}

// 取消二维码支付
function cancelQRPayment() {
    hideQRPayment();
    showNotification('支付已取消');
}

// 隐藏二维码支付弹窗
function hideQRPayment() {
    if (elements.qrPaymentModal) {
        elements.qrPaymentModal.classList.add('hidden');
    }
    
    // 清除定时器
    if (paymentTimer) {
        clearInterval(paymentTimer);
        paymentTimer = null;
    }
}

// 性能监控
function monitorPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('页面加载性能:', {
                    domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                    totalTime: perfData.loadEventEnd - perfData.fetchStart
                });
            }, 0);
        });
    }
}

// 错误处理和恢复
function handleGameError(error, context = '') {
    console.error(`游戏错误 ${context}:`, error);
    
    // 尝试恢复游戏状态
    try {
        if (context.includes('localStorage')) {
            // 清除可能损坏的本地存储
            localStorage.removeItem('gameState');
            localStorage.removeItem('artworkCollection');
            showNotification('检测到数据异常，已重置游戏数据');
            location.reload();
        }
    } catch (recoveryError) {
        console.error('恢复失败:', recoveryError);
    }
}

// 全局错误处理
window.addEventListener('error', function(e) {
    handleGameError(e.error, e.filename || 'unknown');
});

// 未处理的Promise错误
window.addEventListener('unhandledrejection', function(e) {
    handleGameError(e.reason, 'promise');
    e.preventDefault();
});

// 资源加载错误处理
window.addEventListener('error', function(e) {
    if (e.target !== window) {
        console.warn('资源加载失败:', e.target.src || e.target.href);
    }
}, true);

// 启动游戏
document.addEventListener('DOMContentLoaded', function() {
    try {
        // 启动性能监控
        monitorPerformance();
        
        // 初始化游戏
        initGame();
        
        // 预加载关键资源
        preloadCriticalResources();
        
    } catch (error) {
        handleGameError(error, 'initialization');
        
        // 显示友好的错误信息
        document.body.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100vh; flex-direction: column; font-family: Arial, sans-serif; padding: 20px; text-align: center;">
                <h2>🎨 游戏加载中遇到问题</h2>
                <p>请刷新页面重试，或检查浏览器是否支持现代JavaScript功能。</p>
                <p style="font-size: 14px; color: #666; margin-top: 10px;">
                    支持的浏览器：Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
                </p>
                <button onclick="location.reload()" style="padding: 12px 24px; margin-top: 20px; border: none; border-radius: 8px; background: #667eea; color: white; cursor: pointer; font-size: 16px;">
                    刷新页面
                </button>
            </div>
        `;
    }
});

// 预加载关键资源
function preloadCriticalResources() {
    // 预加载字体（如果有的话）
    // 预加载关键CSS类
    const preloadDiv = document.createElement('div');
    preloadDiv.style.cssText = 'position: absolute; left: -9999px; top: -9999px; visibility: hidden;';
    preloadDiv.innerHTML = `
        <div class="paint-stroke"></div>
        <div class="case-item"></div>
        <div class="artwork-item"></div>
        <div class="dust"></div>
    `;
    document.body.appendChild(preloadDiv);
    
    // 清理预加载元素
    setTimeout(() => {
        if (preloadDiv.parentNode) {
            preloadDiv.parentNode.removeChild(preloadDiv);
        }
    }, 100);
}