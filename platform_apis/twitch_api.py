import requests

class TwitchAPI:
    def __init__(self, credentials):
        self.client_id = credentials.get('client_id')
        self.client_secret = credentials.get('client_secret')
        self.channel_name = credentials.get('channel_name')
        self.access_token = None
        
        if self.client_id and self.client_secret:
            self._get_access_token()
    
    def update_credentials(self, credentials):
        self.client_id = credentials.get('client_id')
        self.client_secret = credentials.get('client_secret')
        self.channel_name = credentials.get('channel_name')
        
        if self.client_id and self.client_secret:
            self._get_access_token()
    
    def _get_access_token(self):
        try:
            url = "https://id.twitch.tv/oauth2/token"
            payload = {
                'client_id': self.client_id,
                'client_secret': self.client_secret,
                'grant_type': 'client_credentials'
            }
            response = requests.post(url, data=payload)
            data = response.json()
            self.access_token = data.get('access_token')
        except Exception as e:
            print(f"Error al obtener token de Twitch: {e}")
            self.access_token = None
    
    def get_viewer_count(self):
        if not self.access_token or not self.channel_name:
            return 0
        
        try:
            headers = {
                'Client-ID': self.client_id,
                'Authorization': f'Bearer {self.access_token}'
            }
            
            # Primero obtener el ID del usuario por nombre de canal
            url = f"https://api.twitch.tv/helix/users?login={self.channel_name}"
            response = requests.get(url, headers=headers)
            data = response.json()
            
            if not data.get('data'):
                return 0
                
            user_id = data['data'][0]['id']
            
            # Luego obtener información del stream
            url = f"https://api.twitch.tv/helix/streams?user_id={user_id}"
            response = requests.get(url, headers=headers)
            data = response.json()
            
            if not data.get('data'):
                return 0
                
            return data['data'][0].get('viewer_count', 0)
        except Exception as e:
            print(f"Error obteniendo datos de Twitch: {e}")
            return 0
