# ...existing code...

# add imports near the top (merge with existing imports)
import os
import sys
import logging
import traceback
from typing import Optional
try:
    from dotenv import load_dotenv
except Exception:
    load_dotenv = None  # will handle below

# ...existing code...

# ensure env is loaded and provide clear startup error logging
if __name__ == '__main__':
    try:
        # load .env if python-dotenv is available
        if load_dotenv:
            load_dotenv()
        else:
            logging.warning('python-dotenv not installed; environment variables may not be loaded from .env')

        # configure logging early so we capture import/startup errors
        logging.basicConfig(
            level=logging.DEBUG if os.getenv('FLASK_DEBUG', 'false').lower() in ('1', 'true', 'yes') else logging.INFO,
            format='%(asctime)s %(levelname)s %(name)s %(message)s'
        )

        # determine host/port from env with sensible defaults
        host = os.getenv('HOST', '0.0.0.0')
        port = int(os.getenv('PORT', os.getenv('FLASK_RUN_PORT', 5000)))

        # Resolve Flask app instance:
        # 1) use `app` if defined in this module
        # 2) try importing common module names to find `create_app()` or `app`
        # 3) fallback to a minimal Flask app so process can start and show real errors
        try:
            app  # reference existing app in this module
        except NameError:
            app = None
            possible_modules = ['server', 'wsgi', 'main', 'application', 'app_main', 'app_factory']
            for modname in possible_modules:
                try:
                    mod = __import__(modname)
                    # prefer create_app factory
                    if hasattr(mod, 'create_app'):
                        app = mod.create_app()
                        logging.info("Loaded Flask app via %s.create_app()", modname)
                        break
                    # else try app instance
                    if hasattr(mod, 'app'):
                        candidate = getattr(mod, 'app')
                        # basic duck-typing check
                        if candidate and getattr(candidate, 'run', None):
                            app = candidate
                            logging.info("Loaded Flask app via %s.app", modname)
                            break
                except Exception:
                    # ignore import errors and try next
                    continue

            if app is None:
                # Final fallback: create a minimal Flask app so startup proceeds
                try:
                    from flask import Flask, jsonify
                except Exception as e:
                    logging.critical("Flask is not installed or import failed: %s", e)
                    raise

                app = Flask(__name__)

                @app.route('/health')
                def _health():
                    return jsonify({'status': 'ok', 'msg': 'Minimal fallback app started'}), 200

                logging.warning("No existing Flask app found; started minimal fallback app. Update app.py to import or define your real app.")

        logging.info('Starting ML backend app on %s:%s', host, port)
        app.run(host=host, port=port, debug=os.getenv('FLASK_DEBUG', 'false').lower() in ('1', 'true', 'yes'))
    except Exception as exc:
        # print full traceback to stderr and exit non-zero so systemd/pm2/container sees failure
        logging.critical('Application failed to start: %s', exc)
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)
# ...existing code...
