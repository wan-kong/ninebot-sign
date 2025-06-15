# 九号出行自动签到

这是一个用于九号出行自动签到的 Node.js 脚本。

## 功能特点

- 自动签到
- 查看签到状态
- 支持 GitHub Actions 自动运行

## 使用 GitHub Actions（推荐）

1. Fork 本仓库
2. 在仓库的 Settings -> Secrets and variables -> Actions 中添加以下 Secrets：
   - `NINEBOT_DEVICE_ID`: 设备 ID（具体内容自行抓包获取）
   - `NINEBOT_AUTHORIZATION`: 授权令牌（具体内容自行抓包获取）
3. 启用 GitHub Actions
4. 工作流将在每天 08:00 自动运行
5. 也可以手动触发工作流

## 本地运行

1. 克隆仓库
2. 安装依赖：

   ```bash
   npm install
   ```

3. 设置环境变量：

   ```bash
   cp .env.example .env
   // edit your config
   export NINEBOT_DEVICE_ID="你的设备ID"
   export NINEBOT_AUTHORIZATION="你的授权令牌"
   ```

4. 运行脚本：

   ```bash
   node sign_ninebot.js
   ```

## 注意事项

- 请确保环境变量正确设置
- 设备 ID 和授权令牌需要自行抓包获取
- 建议使用 GitHub Actions 方式运行，更加稳定可靠

## 致谢

- 灵感来源 [KotoriMinami/qinglong-sign](https://github.com/KotoriMinami/qinglong-sign)。
- 感谢[KotoriMinami/qinglong-sign](https://github.com/KotoriMinami/qinglong-sign) 提供的原始 Python 版本实现。
- 感谢所有为本项目提供帮助和建议的开发者
- 项目使用 `cursor` 完成.

## 免责声明

本项目仅供学习和研究使用，使用本项目产生的任何后果由使用者自行承担。作者不对使用本项目造成的任何损失负责。

本项目不提供任何明示或暗示的保证，包括但不限于对适销性、特定用途适用性和非侵权性的保证。

使用本项目即表示您同意并接受以上免责声明。

## 许可证

MIT
