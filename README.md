# Count-Viewer-Live 2

Aplicación web para mostrar en tiempo real el número de espectadores en diferentes plataformas de streaming (YouTube, Twitch, Facebook, TikTok y Zoom). Ideal para eventos en vivo que transmiten simultáneamente en múltiples plataformas.

## Características

- **Monitoreo multi-plataforma**: Seguimiento simultáneo de espectadores en 5 plataformas populares
- **Doble modalidad**: Integración con APIs oficiales o control manual de contadores
- **Actualizaciones en tiempo real**: Los contadores se actualizan automáticamente mediante WebSockets
- **Panel de control personalizable**: Configura colores, tamaños y opciones de visualización
- **Interfaz intuitiva**: Panel visual fácil de usar y configurar

## Requisitos previos

- Python 3.7+
- Navegador web moderno
- Conexión a Internet (para el modo API)
- Credenciales de API para cada plataforma (opcional)

## Instalación

1. Clona este repositorio:
   ```
   git clone https://github.com/tu-usuario/count-viewer-live-2.git
   cd count-viewer-live-2
   ```

2. Instala las dependencias:
   ```
   pip install -r requirements.txt
   ```

3. Inicia la aplicación:
   ```
   python app.py
   ```

4. Abre en tu navegador:
   ```
   http://localhost:5000
   ```

## Configuración

1. Accede a la página de configuración:
   ```
   http://localhost:5000/config
   ```

2. Para cada plataforma, puedes:
   - Activar/desactivar el seguimiento
   - Elegir entre modo API o modo manual
   - Configurar credenciales de API (si corresponde)
   - Establecer contadores manuales iniciales

### Obtención de credenciales API

**YouTube**: [Consola de Desarrolladores de Google](https://console.developers.google.com/)
**Twitch**: [Portal de Desarrolladores de Twitch](https://dev.twitch.tv/)
**Facebook**: [Portal de Desarrolladores de Facebook](https://developers.facebook.com/)
**TikTok**: [TikTok for Developers](https://developers.tiktok.com/)
**Zoom**: [Marketplace de Zoom](https://marketplace.zoom.us/)

## Uso

La interfaz principal muestra:
- Contadores individuales para cada plataforma activada
- Un contador total combinando todos los espectadores
- Panel de control manual (si hay plataformas en modo manual)

Para plataformas en modo manual, Para plataformas en modo API, los contadores se actualizan automáticamente cada pocos segundos.