#!/usr/bin/env python3
# SPDX-License-Identifier: Apache-2.0
"""Desktop app entrypoint for token-workshed macOS .app packaging.

Launches token-workshed desktop UI with a default model when no model argument is provided.
"""

from __future__ import annotations

import os
import multiprocessing as mp
import sys

def _run_python_c_payload_if_needed() -> bool:
    """Emulate `python -c ...` for multiprocessing helper subprocesses."""
    try:
        c_index = sys.argv.index("-c")
    except ValueError:
        return False

    if c_index + 1 >= len(sys.argv):
        return False

    code = sys.argv[c_index + 1]
    globals_dict: dict[str, object] = {"__name__": "__main__", "__file__": "<string>"}
    exec(code, globals_dict, globals_dict)
    return True


if __name__ == "__main__":
    mp.freeze_support()

    if _run_python_c_payload_if_needed():
        raise SystemExit(0)

    from vllm_mlx.desktop_ui import main

    main()
