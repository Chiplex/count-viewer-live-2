import requests
import time
import jwt

class ZoomAPI:
    def __init__(self, credentials):
        self.api_key = credentials.get('api_key')
        self.api_secret = credentials.get('api_secret')
        self.meeting_id = credentials.get('meeting_id')
        
    def update_credentials(self, credentials):
        self.api_key = credentials.get('api_key')
        self.api_secret = credentials.get('api_secret')
        self.meeting_id = credentials.get('meeting_id')
        
    def _generate_jwt_token(self):
        if not self.api_key or not self.api_secret:
            return None
            
        try:
            # Crear un token JWT que expira en 1 hora
            expiration = int(time.time()) + 3600
            
            payload = {
                'iss': self.api_key,
                'exp': expiration
            }
            
            token = jwt.encode(payload, self.api_secret, algorithm='HS256')
            return token
        except Exception as e:
            print(f"Error generando token JWT para Zoom: {e}")
            return None
    
    def get_viewer_count(self):
        if not self.meeting_id:
            return 0
            
        token = self._generate_jwt_token()
        if not token:
            return 0
            
        try:
            url = f"https://api.zoom.us/v2/metrics/meetings/{self.meeting_id}/participants"
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            
            response = requests.get(url, headers=headers)
            data = response.json()
            
            # Contar participantes activos
            # Este es un enfoque simplificado, la API de Zoom proporciona información más detallada
            participants = data.get('participants', [])
            active_participants = [p for p in participants if p.get('status') == 'in_meeting']
            return len(active_participants)
            
        except Exception as e:
            print(f"Error obteniendo datos de Zoom: {e}")
            return 0
