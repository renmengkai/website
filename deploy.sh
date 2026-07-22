#!/usr/bin/env bash
#
# deploy.sh — 一键更新阿里云服务器上的网站
#
# 做的事：把当前源码 rsync 到服务器 → 依赖有变更才 npm ci → 服务器上构建
#          → pm2 平滑重启 → 健康检查。全程不碰服务器上的 .env（电话号等在里面）。
#
# 用法：
#   ./deploy.sh              # 正式部署
#   ./deploy.sh --dry-run    # 只预览 rsync 会传哪些文件，不动服务器
#
# 认证（二选一，脚本本身不含任何密码）：
#   1) 推荐 · SSH 密钥（一次性配置后真正“一键”）：
#        ssh-keygen -t ed25519 -C deploy     # 若还没有密钥
#        ssh-copy-id root@8.141.107.241       # 把公钥装到服务器
#      之后直接 ./deploy.sh 即可，无需密码。
#   2) 临时 · 密码（需先装 sshpass：apt/brew install sshpass）：
#        SSH_PASSWORD='服务器密码' ./deploy.sh
#
# 常用可覆盖变量（一般不用改）：
#   SERVER_HOST / SERVER_USER / SERVER_PORT / REMOTE_DIR / PM2_APP
#   APP_HOST / APP_PORT / SSH_KEY(私钥路径)
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# ---- 配置（可用环境变量覆盖）----
SERVER_HOST="${SERVER_HOST:-8.141.107.241}"
SERVER_USER="${SERVER_USER:-root}"
SERVER_PORT="${SERVER_PORT:-22}"
REMOTE_DIR="${REMOTE_DIR:-/var/www/website}"
PM2_APP="${PM2_APP:-website}"
APP_HOST="${APP_HOST:-127.0.0.1}"
APP_PORT="${APP_PORT:-4321}"
SSH_KEY="${SSH_KEY:-}"

DRY_RUN=0
[ "${1:-}" = "--dry-run" ] || [ "${1:-}" = "-n" ] && DRY_RUN=1

log() { printf '\033[1;36m▶ %s\033[0m\n' "$*"; }
die() { printf '\033[1;31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

# ---- 组装认证 ----
command -v ssh   >/dev/null || die "缺少 ssh"
command -v rsync >/dev/null || die "缺少 rsync"

ssh_opts=(-o StrictHostKeyChecking=accept-new -o ConnectTimeout=30
          -o ServerAliveInterval=10 -o ServerAliveCountMax=6 -p "$SERVER_PORT")
[ -n "$SSH_KEY" ] && ssh_opts+=(-i "$SSH_KEY")

auth=()
if [ -z "$SSH_KEY" ] && [ -n "${SSH_PASSWORD:-}" ]; then
  command -v sshpass >/dev/null || die "用密码登录需要 sshpass（apt/brew install sshpass），或改用 SSH 密钥"
  auth=(sshpass -p "$SSH_PASSWORD")
fi

run_ssh() { "${auth[@]}" ssh "${ssh_opts[@]}" "${SERVER_USER}@${SERVER_HOST}" "$@"; }
rsh="ssh ${ssh_opts[*]}"
[ ${#auth[@]} -gt 0 ] && rsh="sshpass -p ${SSH_PASSWORD} ${rsh}"

# ---- 1. rsync 源码 ----
# 关键：排除 .env / .deploy-lock-hash / dist / node_modules，
#       让 --delete 不会误删服务器上的运行时文件；public/cms 已随 git 跟踪会同步。
log "同步源码到 ${SERVER_USER}@${SERVER_HOST}:${REMOTE_DIR}"
rsync_flags=(-az --delete --human-readable
  --exclude='.git' --exclude='node_modules' --exclude='dist'
  --exclude='.env' --exclude='.deploy-lock-hash' --exclude='.claude'
  --exclude='sanity/node_modules' --exclude='sanity/dist')
[ "$DRY_RUN" = 1 ] && rsync_flags+=(--dry-run --itemize-changes)

rsync "${rsync_flags[@]}" -e "$rsh" ./ "${SERVER_USER}@${SERVER_HOST}:${REMOTE_DIR}/"

if [ "$DRY_RUN" = 1 ]; then
  log "dry-run 结束（未改动服务器）。"
  exit 0
fi

# ---- 2-4. 服务器上：装依赖(按需) → 构建 → 重启 → 健康检查 ----
log "服务器上构建并重启（依赖无变更会跳过安装）"
run_ssh "REMOTE_DIR='${REMOTE_DIR}' PM2_APP='${PM2_APP}' APP_HOST='${APP_HOST}' APP_PORT='${APP_PORT}' bash -s" <<'REMOTE'
set -euo pipefail
cd "$REMOTE_DIR"

newhash="$(md5sum package-lock.json | awk '{print $1}')"
oldhash="$(cat .deploy-lock-hash 2>/dev/null || echo none)"
if [ "$newhash" != "$oldhash" ]; then
  echo "[server] package-lock 有变更 → npm ci"
  npm ci
  echo "$newhash" > .deploy-lock-hash
else
  echo "[server] 依赖无变更 → 跳过 npm ci"
fi

echo "[server] astro build"
NODE_OPTIONS=--max-old-space-size=1536 npm run build

echo "[server] pm2 重启 $PM2_APP"
if pm2 describe "$PM2_APP" >/dev/null 2>&1; then
  pm2 reload "$PM2_APP" --update-env
else
  HOST="$APP_HOST" PORT="$APP_PORT" pm2 start dist/server/entry.mjs --name "$PM2_APP" --update-env
fi
pm2 save >/dev/null

sleep 2
code="$(curl -s -o /dev/null -w '%{http_code}' "http://$APP_HOST:$APP_PORT/")"
echo "[server] 健康检查 http://$APP_HOST:$APP_PORT/ → $code"
[ "$code" = "200" ] || { echo "[server] 健康检查未通过"; exit 1; }
REMOTE

log "部署完成 ✅  https://mengkai.ren"
