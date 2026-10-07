import os
import http.server
import socketserver
import sys

# El puerto 80 es el estándar para tráfico web (HTTP)
PORT = 80
DIRECTORY = "out"

class NextJsStaticRouteHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    # Sobrescribimos do_GET para manejar las "rutas limpias" de Next.js
    # Ej: si alguien entra a /acerca, le servimos /acerca.html internamente
    def do_GET(self):
        path = self.translate_path(self.path)
        # Si el archivo exacto no existe y la ruta no tiene extensión...
        if not os.path.exists(path) and not self.path.endswith('/'):
            # Verificamos si existe el equivalente con .html
            if os.path.exists(path + '.html'):
                self.path += '.html'
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
