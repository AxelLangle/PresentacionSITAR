import os
import http.server
import socketserver
import threading
import webbrowser
import time
import sys

PORT = 3333

def get_base_path():
    if getattr(sys, 'frozen', False):
        # The application is frozen, exe directory
        datadir = os.path.dirname(sys.executable)
    else:
        # The application is not frozen
        datadir = os.path.dirname(__file__)
    return datadir

DIRECTORY = os.path.join(get_base_path(), "out")

class NextJsStaticRouteHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        pass # Evitar crash por sys.stderr en modo windowed

    def do_GET(self):
        path = self.translate_path(self.path)
        if not os.path.exists(path) and not self.path.endswith('/'):
            if os.path.exists(path + '.html'):
                self.path += '.html'
        return super().do_GET()

def start_server():
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("0.0.0.0", PORT), NextJsStaticRouteHandler) as httpd:
        httpd.serve_forever()

if __name__ == "__main__":
    if not os.path.isdir(DIRECTORY):
        print(f"Error: No se encontro la carpeta 'out' en el mismo lugar que el ejecutable.")
        print(f"Asegurese de copiar la carpeta 'out' junto a este archivo .exe")
        sys.exit(1)

    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()

    time.sleep(0.5)
    webbrowser.open(f"http://localhost:{PORT}")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        sys.exit(0)
