# 技术设计文档
## 一、技术栈
- 框架：Next.js 14 (App Router) + React 18 + TypeScript
- 样式：Tailwind CSS
- 图标：lucide-react
- 状态与数据：React Context + localStorage (模拟数据库)
## 二、项目结构
- `app/`：页面路由 (包含 `(front)` 前台和 `admin` 后台)
- `components/`：通用 UI 组件
- `lib/`：数据存取层 (localStorage API 封装)
## 三、关键技术点
- 星空背景：使用 Canvas API 绘制，监听窗口大小。
- 路由守卫：通过 `useEffect` 在 `admin` 布局中校验 localStorage 中的 token。