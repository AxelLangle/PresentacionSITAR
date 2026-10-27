import os
import sys
import time
import threading
import webbrowser
import http.server
import socketserver

# Lista de puertos candidatos (8080, 8000, 3000, etc.) + 0 (puerto dinámico asignado por el SO)
CANDIDATE_PORTS = [8080, 8000, 3000, 5000, 8888, 4200, 9000, 3333, 80, 0]


def get_base_path():
    if getattr(sys, 'frozen', False):
        return os.path.dirname(sys.executable)
    return os.path.dirname(os.path.abspath(__file__))


BASE_PATH = get_base_path()
DIRECTORY = os.path.join(BASE_PATH, "out")
PUBLIC_FALLBACK_DIR = os.path.join(BASE_PATH, "public")


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
        '.js': 'application/javascript',
        '.css': 'text/css',
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        pass  # Evitar ruido o crash por sys.stderr en modo portable

    def translate_path(self, path):
        fs_path = super().translate_path(path)
        # Si el usuario colocó un video o recurso nuevo en public/ sin copiarlo a out/, servirlo desde public/
        if not os.path.exists(fs_path) and os.path.isdir(PUBLIC_FALLBACK_DIR):
            rel = os.path.relpath(fs_path, DIRECTORY)
            alt_path = os.path.join(PUBLIC_FALLBACK_DIR, rel)
            if os.path.exists(alt_path):
                return alt_path
        return fs_path

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


def get_preferred_port_and_host():
    """Lee puerto/host opcional desde argumentos CLI, variable de entorno o archivo puerto.txt."""
    host = "127.0.0.1"
    preferred_port = None

    # 1. Variable de entorno SITAR_PORT
    env_port = os.environ.get("SITAR_PORT", "").strip()
    if env_port.isdigit():
        preferred_port = int(env_port)

    # 2. Archivo opcional puerto.txt junto al ejecutable
    port_file = os.path.join(BASE_PATH, "puerto.txt")
    if os.path.isfile(port_file):
        try:
            with open(port_file, "r", encoding="utf-8") as f:
                content = f.read().strip()
                if content.isdigit():
                    preferred_port = int(content)
        except OSError:
            pass

    # 3. Argumentos de línea de comandos (ej. PresentacionSITAR.exe 8080 o --port 8080 o --public)
    args = sys.argv[1:]
    i = 0
    while i < len(args):
        arg = args[i]
        if arg in ("--public", "--lan"):
            host = "0.0.0.0"
        elif arg in ("--port", "-p") and i + 1 < len(args) and args[i + 1].isdigit():
            preferred_port = int(args[i + 1])
            i += 1
        elif arg in ("--host", "-H") and i + 1 < len(args):
            host = args[i + 1]
            i += 1
        elif arg.isdigit():
            preferred_port = int(arg)
        i += 1

    return host, preferred_port


def bind_available_server(host, preferred_port=None):
    """
    Intenta levantar el servidor HTTP probando primero el puerto preferido,
    luego la lista de puertos estándar y finalmente el puerto 0 (asignado por el SO).
    Si el host 0.0.0.0 es bloqueado por el Firewall, cae automáticamente a 127.0.0.1.
    """
    ports_to_try = []
    if preferred_port is not None:
        ports_to_try.append(preferred_port)
    for p in CANDIDATE_PORTS:
        if p not in ports_to_try:
            ports_to_try.append(p)

    hosts_to_try = [host] if host == "127.0.0.1" else [host, "127.0.0.1"]

    last_error = None
    for h in hosts_to_try:
        for port in ports_to_try:
            try:
                httpd = ThreadingHTTPServer((h, port), NextJsStaticRouteHandler)
                actual_port = httpd.server_address[1]
                return httpd, h, actual_port
            except (OSError, PermissionError) as err:
                last_error = err
                continue

    raise RuntimeError(f"No se pudo abrir ningún puerto local. Último error: {last_error}")


if __name__ == "__main__":
    print("=" * 64)
    print("   Iniciando Presentación SITAR (Servidor Portable Resiliente)   ")
    print("=" * 64)

    if not os.path.isdir(DIRECTORY):
        print("\n[ERROR] No se encontró la carpeta 'out' junto a este ejecutable.")
        print("Asegúrese de copiar la carpeta 'out' completa y colocarla aquí.")
        input("\nPresione ENTER para salir...")
        sys.exit(1)

    host, preferred_port = get_preferred_port_and_host()

    try:
        httpd, bound_host, active_port = bind_available_server(host, preferred_port)
    except RuntimeError as e:
        print(f"\n[ERROR CRÍTICO] {e}")
        input("\nPresione ENTER para salir...")
        sys.exit(1)

    server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    server_thread.start()

    url = f"http://127.0.0.1:{active_port}"
    print(f"\n[+] Interfaz vinculada : {bound_host} (Loopback seguro contra Firewall)")
    print(f"[+] Puerto activo      : {active_port}")
    print(f"[+] URL Presentación   : {url}")
    print(f"[+] URL Vista Comité   : {url}/comite/")
    print("[+] Abriendo navegador automáticamente...")

    time.sleep(0.4)
    webbrowser.open(url)

    while True:
        print("\n" + "=" * 64)
        print(" CONTROLES RÁPIDOS:")
        print("  • Presione [ENTER] vacío       --> Cerrar presentación y salir")
        print("  • Escriba  'a' + [ENTER]       --> Volver a abrir el navegador")
        print("  • Escriba un puerto (ej. 5000) --> Cambiar de puerto al instante")
        print("  • Escriba  '0' + [ENTER]       --> Asignar puerto libre del SO")
        print("=" * 64)

        try:
            cmd = input("Opción > ").strip().lower()
        except (KeyboardInterrupt, EOFError):
            break

        if cmd == "":
            break
        elif cmd == "a":
            webbrowser.open(url)
        elif cmd.isdigit():
            new_req_port = int(cmd)
            try:
                new_httpd, new_host, new_port = bind_available_server(bound_host, new_req_port)
                httpd.shutdown()
                httpd.server_close()
                httpd = new_httpd
                active_port = new_port
                url = f"http://127.0.0.1:{active_port}"
                threading.Thread(target=httpd.serve_forever, daemon=True).start()
                print(f"\n[+] Servidor cambiado exitosamente al puerto {active_port}: {url}")
                webbrowser.open(url)
            except RuntimeError as err:
                print(f"\n[!] No se pudo cambiar al puerto {new_req_port}: {err}")

    print("\nCerrando el servidor... ¡Éxito en el congreso!")
    try:
        httpd.shutdown()
        httpd.server_close()
    except Exception:
        pass
    sys.exit(0)
