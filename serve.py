import os
import http.server
import socketserver
import webbrowser
import sys

# Lista de puertos candidatos (intenta primero 8080, 8000, 3000, 3333 y cae a puerto dinámico 0 si están bloqueados)
CANDIDATE_PORTS = [8080, 8000, 3000, 5000, 8888, 3333, 80, 0]
DIRECTORY = "out"
PUBLIC_FALLBACK_DIR = "public"


class ThreadingHTTPServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


class NextJsStaticRouteHandler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        '.mkv': 'video/webm',
        '.mp4': 'video/mp4',
        '.webm': 'video/webm',
        '.mp3': 'audio/mpeg',
        '.svg': 'image/svg+xml',
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def translate_path(self, path):
        fs_path = super().translate_path(path)
        if not os.path.exists(fs_path) and os.path.isdir(PUBLIC_FALLBACK_DIR):
            rel = os.path.relpath(fs_path, os.path.abspath(DIRECTORY))
            alt_path = os.path.join(os.path.abspath(PUBLIC_FALLBACK_DIR), rel)
            if os.path.exists(alt_path):
                return alt_path
        return fs_path

    # Sobrescribimos do_GET para manejar las "rutas limpias" de Next.js
    # Ej: si alguien entra a /mobile o /mobile/, servimos su HTML en lugar de listar el directorio
    def do_GET(self):
        url_parts = self.path.split('?', 1)
        clean_url = url_parts[0]
        query = ('?' + url_parts[1]) if len(url_parts) > 1 else ''

        fs_path = self.translate_path(clean_url)
        fs_path_no_slash = fs_path.rstrip('/\\')

        if os.path.isdir(fs_path):
            index_file = os.path.join(fs_path, 'index.html')
            if not os.path.exists(index_file) and os.path.exists(fs_path_no_slash + '.html'):
                self.path = clean_url.rstrip('/') + '.html' + query
        elif not os.path.exists(fs_path) and not clean_url.endswith('/'):
            if os.path.exists(fs_path_no_slash + '.html'):
                self.path = clean_url + '.html' + query

        return super().do_GET()


def parse_args():
    host = "127.0.0.1"
    preferred_port = None
    open_browser = False

    args = sys.argv[1:]
    i = 0
    while i < len(args):
        arg = args[i]
        if arg in ("--public", "--lan", "--azure"):
            host = "0.0.0.0"
        elif arg in ("--open", "-o"):
            open_browser = True
        elif arg in ("--port", "-p") and i + 1 < len(args) and args[i + 1].isdigit():
            preferred_port = int(args[i + 1])
            i += 1
        elif arg.isdigit():
            preferred_port = int(arg)
        i += 1

    return host, preferred_port, open_browser


if __name__ == "__main__":
    if not os.path.isdir(DIRECTORY):
        print(f"❌ Error: No se encontró la carpeta '{DIRECTORY}'.")
        print("Asegúrate de haber configurado `output: 'export'` en next.config.ts y haber ejecutado 'npm run build'.")
        sys.exit(1)

    host, preferred_port, open_browser = parse_args()
    ports_to_try = ([preferred_port] if preferred_port is not None else []) + [
        p for p in CANDIDATE_PORTS if p != preferred_port
    ]
    hosts_to_try = [host] if host == "127.0.0.1" else [host, "127.0.0.1"]

    httpd = None
    bound_host = host
    active_port = None

    for h in hosts_to_try:
        for port in ports_to_try:
            try:
                httpd = ThreadingHTTPServer((h, port), NextJsStaticRouteHandler)
                bound_host = h
                active_port = httpd.server_address[1]
                break
            except (OSError, PermissionError):
                continue
        if httpd is not None:
            break

    if httpd is None:
        print("❌ No fue posible vincular ningún puerto local.")
        sys.exit(1)

    url = f"http://127.0.0.1:{active_port}"
    print("✅ Servidor Python exponiendo la presentación en HTTP.")
    print(f"🌐 Interfaz: {bound_host} | Puerto activo: {active_port}")
    print(f"🔗 URL Presentación: {url}")
    print(f"📱 URL Vista Comité: {url}/comite/")
    print(f"📂 Sirviendo archivos estáticos desde: ./{DIRECTORY}/")
    print("Presiona Ctrl+C para detener el servidor.")

    if open_browser:
        webbrowser.open(url)

    try:
        with httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nCerrando servidor...")
        sys.exit(0)
