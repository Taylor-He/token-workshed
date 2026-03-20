#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VERSION="${1:-0.0.4}"
RUNTIME_VERSION="${2:-0.2.6}"
PYTHON_BOOTSTRAP_VERSION="${3:-3.12.8}"

APP_NAME="token-workshed.app"
APP_PATH="$ROOT_DIR/dist/$APP_NAME"
OUT_PKG="$ROOT_DIR/dist/token-workshed-${VERSION}-installer.pkg"
PYTHON_PKG_URL="https://www.python.org/ftp/python/${PYTHON_BOOTSTRAP_VERSION}/python-${PYTHON_BOOTSTRAP_VERSION}-macos11.pkg"

if [[ ! -d "$APP_PATH" ]]; then
  echo "Error: missing app bundle: $APP_PATH"
  echo "Build the .app first, then run this script."
  exit 1
fi

BUILD_DIR="$ROOT_DIR/build/pkg"
COMP_DIR="$BUILD_DIR/components"
ROOTS_DIR="$BUILD_DIR/pkgroots"
SCRIPTS_DIR="$BUILD_DIR/scripts"
DIST_FILE="$BUILD_DIR/distribution.xml"

rm -rf "$BUILD_DIR"
mkdir -p "$COMP_DIR" "$ROOTS_DIR" "$SCRIPTS_DIR/runtime"

cat >"$SCRIPTS_DIR/runtime/postinstall" <<POSTINSTALL
#!/bin/bash
set -euo pipefail

APP_SUPPORT_DIR="/Library/Application Support/token-workshed"
RUNTIME_DIR="\$APP_SUPPORT_DIR/runtime"
VENV_DIR="\$RUNTIME_DIR/.venv"
RUNTIME_VERSION="$RUNTIME_VERSION"
PYTHON_BOOTSTRAP_VERSION="$PYTHON_BOOTSTRAP_VERSION"
PYTHON_PKG_URL="$PYTHON_PKG_URL"
LOG_FILE="/var/log/token-workshed-install.log"

mkdir -p "\$APP_SUPPORT_DIR"
touch "\$LOG_FILE"
exec >>"\$LOG_FILE" 2>&1

echo "=============================="
echo "token-workshed runtime postinstall started at \$(date)"
echo "=============================="

if [[ "\$(uname -m)" != "arm64" ]]; then
  echo "ERROR: arm64 is required for vllm-mlx runtime."
  exit 1
fi

python_is_compatible() {
  local candidate="\$1"
  [[ -x "\$candidate" ]] || return 1
  "\$candidate" - <<'PY' >/dev/null 2>&1
import sys
raise SystemExit(0 if sys.version_info >= (3, 10) else 1)
PY
}

find_python_bin() {
  local candidate
  for candidate in \
    /opt/homebrew/bin/python3 \
    /usr/local/bin/python3 \
    /Library/Frameworks/Python.framework/Versions/3.12/bin/python3 \
    /Library/Frameworks/Python.framework/Versions/3.11/bin/python3 \
    /usr/bin/python3
  do
    if python_is_compatible "\$candidate"; then
      echo "\$candidate"
      return 0
    fi
  done
  return 1
}

install_python_bootstrap() {
  local pkg_file="/private/tmp/token-workshed-python-\${PYTHON_BOOTSTRAP_VERSION}.pkg"
  echo "Python >=3.10 not found. Installing Python \${PYTHON_BOOTSTRAP_VERSION}..."
  /usr/bin/curl -fL "\$PYTHON_PKG_URL" -o "\$pkg_file"
  /usr/sbin/installer -pkg "\$pkg_file" -target /
  /bin/rm -f "\$pkg_file"
}

PYTHON_BIN="\$(find_python_bin || true)"
if [[ -z "\$PYTHON_BIN" ]]; then
  install_python_bootstrap
  PYTHON_BIN="\$(find_python_bin || true)"
fi

if [[ -z "\$PYTHON_BIN" ]]; then
  echo "ERROR: Python >=3.10 is required but not available after bootstrap install."
  exit 1
fi

echo "Using Python: \$PYTHON_BIN"
"\$PYTHON_BIN" -V || true
"\$PYTHON_BIN" -m ensurepip --upgrade || true

mkdir -p "\$RUNTIME_DIR"

# If an old/incompatible venv already exists (e.g. python3.9), recreate it.
if [[ -x "\$VENV_DIR/bin/python3" ]]; then
  if ! "\$VENV_DIR/bin/python3" - <<'PY' >/dev/null 2>&1
import sys
raise SystemExit(0 if sys.version_info >= (3, 10) else 1)
PY
  then
    echo "Removing incompatible existing venv at \$VENV_DIR"
    rm -rf "\$VENV_DIR"
  fi
fi

if [[ ! -x "\$VENV_DIR/bin/python3" ]]; then
  echo "Creating venv at \$VENV_DIR"
  "\$PYTHON_BIN" -m venv "\$VENV_DIR"
fi

echo "Upgrading pip/setuptools/wheel..."
"\$VENV_DIR/bin/python3" -m pip install --upgrade --retries 6 --timeout 120 pip setuptools wheel

echo "Installing vllm-mlx==\${RUNTIME_VERSION} ..."
"\$VENV_DIR/bin/python3" -m pip install --upgrade --retries 6 --timeout 120 "vllm-mlx==\${RUNTIME_VERSION}"

mkdir -p /usr/local/bin
ln -sf "\$VENV_DIR/bin/vllm-mlx" /usr/local/bin/token-workshed

cat >"\$APP_SUPPORT_DIR/runtime-info.txt" <<INFO
vllm-mlx=\${RUNTIME_VERSION}
venv=\$VENV_DIR
python=\$PYTHON_BIN
INFO

echo "Runtime installation completed at \$(date)"
POSTINSTALL
chmod +x "$SCRIPTS_DIR/runtime/postinstall"

pkgbuild \
  --nopayload \
  --scripts "$SCRIPTS_DIR/runtime" \
  --identifier "com.taylorhe.tokenworkshed.runtime" \
  --version "$VERSION" \
  --install-location "/" \
  "$COMP_DIR/token-workshed-runtime.pkg"

mkdir -p "$ROOTS_DIR/ui/Applications"
cp -R "$APP_PATH" "$ROOTS_DIR/ui/Applications/"

pkgbuild \
  --root "$ROOTS_DIR/ui" \
  --identifier "com.taylorhe.tokenworkshed.ui" \
  --version "$VERSION" \
  --install-location "/" \
  "$COMP_DIR/token-workshed-ui.pkg"

cat >"$DIST_FILE" <<DISTXML
<?xml version="1.0" encoding="utf-8"?>
<installer-gui-script minSpecVersion="2">
  <title>token-workshed Installer</title>
  <domains enable_anywhere="false" enable_currentUserHome="false" enable_localSystem="true"/>
  <options customize="never" require-scripts="true" hostArchitectures="arm64,x86_64"/>
  <choices-outline>
    <line choice="runtime"/>
    <line choice="ui"/>
  </choices-outline>
  <choice id="runtime" title="token-workshed Runtime" description="Install token-workshed runtime (vllm-mlx backend) into a dedicated virtual environment.">
    <pkg-ref id="com.taylorhe.tokenworkshed.runtime"/>
  </choice>
  <choice id="ui" title="token-workshed UI" description="Install the token-workshed desktop app into /Applications.">
    <pkg-ref id="com.taylorhe.tokenworkshed.ui"/>
  </choice>
  <pkg-ref id="com.taylorhe.tokenworkshed.runtime" version="$VERSION" onConclusion="none">token-workshed-runtime.pkg</pkg-ref>
  <pkg-ref id="com.taylorhe.tokenworkshed.ui" version="$VERSION" onConclusion="none">token-workshed-ui.pkg</pkg-ref>
</installer-gui-script>
DISTXML

productbuild \
  --distribution "$DIST_FILE" \
  --package-path "$COMP_DIR" \
  "$OUT_PKG"

echo "Built installer: $OUT_PKG"
