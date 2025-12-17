# 部署指南

## GitHub Pages 部署

### 1. 创建 GitHub 仓库

1. 登录 GitHub
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 仓库名称建议使用: `creative-artist-game`
4. 设置为 Public（公开）
5. 勾选 "Add a README file"
6. 点击 "Create repository"

### 2. 上传代码

#### 方法一：通过 GitHub 网页界面

1. 在仓库页面点击 "uploading an existing file"
2. 将以下文件拖拽到页面中：
   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md`
   - `.gitignore`
3. 在底部填写提交信息：`Initial commit: Creative Artist Game`
4. 点击 "Commit changes"

#### 方法二：通过 Git 命令行

```bash
# 克隆仓库
git clone https://github.com/fcfcfffc/creative-artist-game.git
cd creative-artist-game

# 添加文件
# 将 index.html, style.css, script.js 等文件复制到此目录

# 提交代码
git add .
git commit -m "Initial commit: Creative Artist Game"
git push origin main
```

### 3. 启用 GitHub Pages

1. 在仓库页面点击 "Settings" 标签
2. 在左侧菜单中找到 "Pages"
3. 在 "Source" 部分选择 "Deploy from a branch"
4. 选择 "main" 分支
5. 选择 "/ (root)" 文件夹
6. 点击 "Save"

### 4. 访问网站

- 等待几分钟后，访问: `https://fcfcfffc.github.io/creative-artist-game`
- GitHub 会显示部署状态，通常需要 1-5 分钟

## 其他部署选项

### Netlify 部署

1. 访问 [Netlify](https://netlify.com)
2. 注册/登录账号
3. 点击 "New site from Git"
4. 连接 GitHub 账号并选择仓库
5. 部署设置保持默认
6. 点击 "Deploy site"

### Vercel 部署

1. 访问 [Vercel](https://vercel.com)
2. 注册/登录账号
3. 点击 "New Project"
4. 导入 GitHub 仓库
5. 部署设置保持默认
6. 点击 "Deploy"

## 自定义域名（可选）

### GitHub Pages 自定义域名

1. 在仓库根目录创建 `CNAME` 文件
2. 文件内容为你的域名，如: `game.yourdomain.com`
3. 在域名提供商处设置 CNAME 记录指向: `fcfcfffc.github.io`

## 设备兼容性测试

### 自动化测试
1. 访问 `device-test.html` 进行自动化兼容性检测
2. 检查所有测试项目是否通过
3. 记录任何失败的测试项目

### 手动测试清单

#### 桌面端测试 (Chrome, Firefox, Safari, Edge)
- [ ] 页面正常加载，无控制台错误
- [ ] 用户注册/登录功能正常
- [ ] 画布点击创作功能响应迅速
- [ ] 开箱动画流畅，30秒滚动正常
- [ ] 思维宫殿展示和筛选功能
- [ ] AI方案生成功能
- [ ] 每日任务交互正常
- [ ] 支付弹窗显示正确
- [ ] 窗口缩放时布局自适应

#### 平板设备测试 (iPad, Android平板)
- [ ] 触摸操作响应正常
- [ ] 界面元素大小适中，易于点击
- [ ] 横屏/竖屏切换正常
- [ ] 滚动性能流畅
- [ ] 弹窗在平板上显示完整
- [ ] 画布点击精确度良好

#### 手机端测试 (iOS Safari, Android Chrome)
- [ ] 页面加载速度可接受
- [ ] 触摸目标足够大（最小44px）
- [ ] 文字大小清晰可读
- [ ] 导航按钮易于操作
- [ ] 弹窗适配屏幕尺寸
- [ ] 输入框聚焦时无异常缩放
- [ ] 长按不会选中文本（游戏区域）
- [ ] 双击不会缩放页面

#### 性能测试
- [ ] 首次加载时间 < 3秒
- [ ] 画布点击响应时间 < 100ms
- [ ] 开箱动画帧率稳定
- [ ] 内存使用合理（< 100MB）
- [ ] 长时间游戏无明显卡顿

#### 兼容性测试
- [ ] iOS 12+ Safari
- [ ] Android 8+ Chrome
- [ ] Chrome 60+
- [ ] Firefox 55+
- [ ] Safari 12+
- [ ] Edge 79+

#### 网络环境测试
- [ ] 3G网络下可正常使用
- [ ] 离线状态下已加载内容可用
- [ ] 网络恢复后功能正常

## 常见问题

### Q: 页面显示空白
A: 检查浏览器控制台是否有JavaScript错误，确保所有文件都已正确上传

### Q: 样式显示异常
A: 确保 `style.css` 文件路径正确，检查文件是否完整上传

### Q: 功能不工作
A: 检查 `script.js` 是否正确加载，确保浏览器支持现代JavaScript功能

### Q: 移动端显示问题
A: 确保 viewport meta 标签设置正确，测试不同设备的响应式效果

### Q: 触摸操作不响应
A: 检查是否为触摸设备添加了相应的事件监听器，确保触摸目标足够大

### Q: 画布点击不准确
A: 检查触摸事件的坐标计算，确保考虑了设备像素比和滚动偏移

### Q: 动画卡顿
A: 检查CSS动画是否使用了GPU加速属性（transform, opacity），减少重绘和回流

### Q: 本地存储失败
A: 检查浏览器是否启用了本地存储，私人浏览模式可能会限制存储功能

### Q: iOS Safari特殊问题
A: 
- 确保输入框字体大小 ≥ 16px 防止自动缩放
- 使用 `-webkit-overflow-scrolling: touch` 优化滚动
- 注意100vh在iOS上的问题，使用CSS变量修复

### Q: Android Chrome特殊问题
A:
- 检查触摸延迟，考虑使用FastClick库
- 注意软键盘弹出时的布局变化
- 测试不同Android版本的兼容性

## 更新部署

当需要更新游戏时：

1. 修改本地文件
2. 提交到 GitHub 仓库
3. GitHub Pages 会自动重新部署（通常需要几分钟）

```bash
git add .
git commit -m "Update: 描述更新内容"
git push origin main
```

## 监控和分析

可以添加以下服务来监控网站：

- Google Analytics（网站分析）
- Google Search Console（搜索优化）
- Hotjar（用户行为分析）

在 `index.html` 的 `<head>` 部分添加相应的跟踪代码。