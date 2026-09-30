"""Compatibilidade: delega a galeria ao sincronizador v122."""
from pathlib import Path
import runpy

runpy.run_path(str(Path(__file__).resolve().with_name('sync-goblins122.py')), run_name='__main__')
