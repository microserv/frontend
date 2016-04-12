from editor_backend.settings.base import *


try:
    from editor_backend.settings.local import *
except ImportError:
        print('Local settings file not found.')
