from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO
import json
import os
import threading
import time
from platform_apis.youtube_api import YouTubeAPI
from platform_apis.twitch_api import TwitchAPI
from platform_apis.facebook_api import FacebookAPI
from platform_apis.tiktok_api import TikTokAPI
from platform_apis.zoom_api import ZoomAPI

app = Flask(__name__)
app.config['SECRET_KEY'] = 'contador-visualizaciones-secreto'
socketio = SocketIO(app, async_mode='threading', cors_allowed_origins="*")  # Cambiado a 'threading' para evitar problemas con eventlet

# Cargar configuración
def load_config():
    config_path = os.path.join('config', 'settings.json')
    if os.path.exists(config_path):
        with open(config_path, 'r') as f:
            return json.load(f)
    return {
        'platforms': {
            'youtube': {'enabled': False, 'mode': 'api', 'manual_count': 0, 'credentials': {}},
            'twitch': {'enabled': False, 'mode': 'api', 'manual_count': 0, 'credentials': {}},
            'facebook': {'enabled': False, 'mode': 'api', 'manual_count': 0, 'credentials': {}},
            'tiktok': {'enabled': False, 'mode': 'api', 'manual_count': 0, 'credentials': {}},
            'zoom': {'enabled': False, 'mode': 'api', 'manual_count': 0, 'credentials': {}}
        },
        'display': {
            'update_interval': 5,
            'font_size': 24,
            'background_color': '#00FF00'
        }
    }

# Guardar configuración
def save_config(config):
    os.makedirs('config', exist_ok=True)
    with open(os.path.join('config', 'settings.json'), 'w') as f:
        json.dump(config, f, indent=2)

config = load_config()

# Inicializar APIs
api_instances = {
    'youtube': YouTubeAPI(config['platforms']['youtube'].get('credentials', {})),
    'twitch': TwitchAPI(config['platforms']['twitch'].get('credentials', {})),
    'facebook': FacebookAPI(config['platforms']['facebook'].get('credentials', {})),
    'tiktok': TikTokAPI(config['platforms']['tiktok'].get('credentials', {})),
    'zoom': ZoomAPI(config['platforms']['zoom'].get('credentials', {}))
}

# Rutas
@app.route('/')
def index():
    return render_template('index.html', config=config)

@app.route('/config')
def config_page():
    return render_template('config.html', config=config)

# Ruta para obtener datos de configuración
@app.route('/config_data')
def config_data():
    return jsonify(config)

@app.route('/save_config', methods=['POST'])
def save_config_route():
    global config
    try:
        # Registrar la solicitud recibida
        print("Datos recibidos:", request.json)
        
        new_config = request.json
        config = new_config
        save_config(config)
        
        # Actualizar instancias de API con nuevas credenciales
        for platform, api in api_instances.items():
            api.update_credentials(config['platforms'][platform].get('credentials', {}))
        
        # Notificar a los clientes que se actualizó la configuración
        socketio.emit('config_updated', {})
        
        return jsonify({'status': 'success'})
    
    except Exception as e:
        # Registrar el error detallado en la consola
        import traceback
        print("ERROR EN SAVE_CONFIG:")
        print(traceback.format_exc())
        
        # Y devolver información útil al cliente
        return jsonify({
            'status': 'error', 
            'message': str(e),
            'traceback': traceback.format_exc()
        }), 500

# Función para obtener visualizaciones en tiempo real
def get_viewer_counts():
    counts = {}
    for platform, api in api_instances.items():
        if config['platforms'][platform]['enabled']:
            try:
                # Usar el valor manual o la API según el modo configurado
                if config['platforms'][platform].get('mode') == 'manual':
                    counts[platform] = config['platforms'][platform].get('manual_count', 0)
                else:
                    counts[platform] = api.get_viewer_count()
            except Exception as e:
                print(f"Error obteniendo datos de {platform}: {e}")
                counts[platform] = 0
    return counts

# Ruta para actualizar conteo manual en tiempo real
@app.route('/update_manual_count', methods=['POST'])
def update_manual_count():
    data = request.json
    platform = data.get('platform')
    count = data.get('count')
    
    if platform in config['platforms'] and config['platforms'][platform].get('mode') == 'manual':
        config['platforms'][platform]['manual_count'] = count
        save_config(config)
        # Emitir evento de actualización a todos los clientes
        socketio.emit('update_counts', get_viewer_counts())
        return jsonify({'status': 'success'})
    
    return jsonify({'status': 'error', 'message': 'Plataforma no válida o no en modo manual'})

# Actualización en tiempo real
def background_update():
    while True:
        viewer_counts = get_viewer_counts()
        socketio.emit('update_counts', viewer_counts)
        time.sleep(config['display']['update_interval'])

@socketio.on('connect')
def handle_connect():
    viewer_counts = get_viewer_counts()
    socketio.emit('update_counts', viewer_counts)

@app.route('/debug')
def debug():
    assert False, "Debugging"

if __name__ == '__main__':
    # Asegurar que el directorio de configuración existe
    os.makedirs('config', exist_ok=True)
    
    # Iniciar hilo de actualización
    update_thread = threading.Thread(target=background_update)
    update_thread.daemon = True
    update_thread.start()
    
    # Iniciar servidor con configuración modificada
    socketio.run(app, host='0.0.0.0', port=5000, debug=True, allow_unsafe_werkzeug=True)
