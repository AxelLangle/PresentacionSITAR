import os
import http.server
import socketserver
import sys

# Usamos el puerto 3333 según tu configuración de Azure
PORT = 3333
DIRECTORY = "out"

class NextJsStaticRouteHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

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

if __name__ == "__main__":
    if not os.path.isdir(DIRECTORY):
        print(f"❌ Error: No se encontró la carpeta '{DIRECTORY}'.")
        print("Asegúrate de haber configurado `output: 'export'` en next.config.ts y haber ejecutado 'npm run build'.")
        sys.exit(1)

    # socketserver.TCPServer.allow_reuse_address evita el error "Address already in use" al reiniciar rápido
    socketserver.TCPServer.allow_reuse_address = True
    
    try:
        with socketserver.TCPServer(("0.0.0.0", PORT), NextJsStaticRouteHandler) as httpd:
            print(f"✅ Servidor Python exponiendo la presentación en HTTP.")
            print(f"🌐 Escuchando en todas las interfaces (0.0.0.0) en el puerto: {PORT}")
            print(f"📂 Sirviendo archivos estáticos desde: ./{DIRECTORY}/")
            print("Presiona Ctrl+C para detener el servidor.")
            httpd.serve_forever()
    except PermissionError:
        print(f"❌ Permiso denegado para usar el puerto {PORT}.")
        print("En Linux/Ubuntu, los puertos por debajo del 1024 requieren permisos de administrador.")
        print("Ejecuta el script con sudo: sudo python3 serve.py")
        sys.exit(1)
