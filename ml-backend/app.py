# ...existing code...

# add imports near the top (merge with existing imports)
import os
import sys
import logging
import traceback
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

        # resolve Flask app instance: either `app` in this module or create_app()
        try:
            app  # reference existing app
        except NameError:
            if 'create_app' in globals():
                app = create_app()
            else:
                raise RuntimeError("No Flask `app` instance or `create_app()` factory found in app.py")

        logging.info('Starting ML backend app on %s:%s', host, port)
        app.run(host=host, port=port, debug=os.getenv('FLASK_DEBUG', 'false').lower() in ('1', 'true', 'yes'))
    except Exception as exc:
        # print full traceback to stderr and exit non-zero so systemd/pm2/container sees failure
        logging.critical('Application failed to start: %s', exc)
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)
# ...existing code...
