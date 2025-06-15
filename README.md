# 九号出行自动签到

这是一个用于九号出行自动签到的 Node.js 脚本。

## 功能特点

- 自动签到
- 查看签到状态
- 支持 GitHub Actions 自动运行

## 环境变量设置

在 GitHub 仓库的 Settings -> Secrets and variables -> Actions 中设置以下环境变量：
具体内自行抓包获取。

- `NINEBOT_DEVICE_ID`: 设备 ID
- `NINEBOT_AUTHORIZATION`: 授权令牌

## 本地运行

1. 克隆仓库
2. 安装依赖：
   ```bash
   npm install
   ```
3. 设置环境变量：
   ```bash
   export NINEBOT_DEVICE_ID="你的设备ID"
   export NINEBOT_AUTHORIZATION="你的授权令牌"
   ```
4. 运行脚本：
   ```bash
   node sign_ninebot.js
   ```

## GitHub Actions 使用说明

1. Fork 本仓库
2. 在仓库的 Settings -> Secrets and variables -> Actions 中添加以下 Secrets：
   - `NINEBOT_DEVICE_ID`
   - `NINEBOT_AUTHORIZATION`
3. 启用 GitHub Actions
4. 工作流将在每天 00:00 自动运行
5. 也可以手动触发工作流

## 注意事项

- 请确保环境变量正确设置
- 设备 ID 可以从九号出行 App 中获取

## 使用方法

### 作为命令行工具

1. 设置环境变量：
```bash
export NINEBOT_ACCOUNTS="deviceId1#authorization1&deviceId2#authorization2"
```

2. 运行脚本：
```bash
npx ninebot-sign
```

## 致谢

- 感谢 [KotoriMinami/qinglong-sign](https://github.com/KotoriMinami/qinglong-sign) 提供的原始 Python 版本实现
- 感谢所有为本项目提供帮助和建议的开发者

## 免责声明

本项目仅供学习和研究使用，使用本项目产生的任何后果由使用者自行承担。作者不对使用本项目造成的任何损失负责。

本项目不提供任何明示或暗示的保证，包括但不限于对适销性、特定用途适用性和非侵权性的保证。

使用本项目即表示您同意并接受以上免责声明。

## 许可证

MIT 