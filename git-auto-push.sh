#!/bin/bash

# 门店数据可视化系统 - 自动Git推送脚本
# 作者: hueyluox
# 用途: 自动保存并推送代码到GitHub

echo "🚀 开始自动保存代码到GitHub..."

# 进入项目目录
cd "$(dirname "$0")"

# 检查是否有更改
if git diff --quiet && git diff --cached --quiet; then
    echo "✅ 没有检测到文件更改，无需提交"
    exit 0
fi

# 显示当前状态
echo "📋 检查文件状态..."
git status --short

# 添加所有更改
echo "📦 添加文件到暂存区..."
git add .

# 提交更改
COMMIT_MSG="自动更新 $(date '+%Y-%m-%d %H:%M:%S')"
echo "💾 提交更改: $COMMIT_MSG"
git commit -m "$COMMIT_MSG

📊 更新内容:
- 门店数据可视化系统文件修改
- 自动同步到GitHub仓库

🚀 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# 推送到远程仓库
echo "📤 推送到GitHub..."
git push

# 检查推送结果
if [ $? -eq 0 ]; then
    echo "✅ 代码已成功同步到GitHub!"
    echo "🌐 查看仓库: https://github.com/hueyluox/-les-bb"
else
    echo "❌ 推送失败，请检查网络连接和认证信息"
    exit 1
fi

# 显示最新提交
echo ""
echo "📋 最新提交信息:"
git log --oneline -1

echo ""
echo "🎉 自动保存完成!"