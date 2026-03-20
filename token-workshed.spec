# -*- mode: python ; coding: utf-8 -*-
from PyInstaller.utils.hooks import collect_data_files
from PyInstaller.utils.hooks import collect_submodules

datas = []
hiddenimports = ['webview']
datas += collect_data_files('vllm_mlx')
datas += collect_data_files('mlx')
datas += collect_data_files('mlx_vlm')
hiddenimports += collect_submodules('vllm_mlx')
hiddenimports += collect_submodules('mlx')
hiddenimports += collect_submodules('mlx_lm')
hiddenimports += collect_submodules('mlx_vlm')


a = Analysis(
    ['scripts/token_workshed_app_entry.py'],
    pathex=['/Users/taylorhe/Downloads/vllm-mlx-main'],
    binaries=[],
    datas=datas,
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='token-workshed',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
coll = COLLECT(
    exe,
    a.binaries,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='token-workshed',
)
app = BUNDLE(
    coll,
    name='token-workshed.app',
    icon=None,
    bundle_identifier=None,
)
