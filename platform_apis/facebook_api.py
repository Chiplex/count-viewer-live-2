import requests

class FacebookAPI:
    def __init__(self, credentials):
        self.access_token = credentials.get('access_token')
        self.live_video_id = credentials.get('live_video_id')
    
    def update_credentials(self, credentials):
        self.access_token = credentials.get('access_token')
        self.live_video_id = credentials.get('live_video_id')
    
    def get_viewer_count(self):
        if not self.access_token or not self.live_video_id:
            return 0
        
        try:
            url = f"https://graph.facebook.com/v13.0/{self.live_video_id}"
            params = {
                'fields': 'live_views',
                'access_token': self.access_token
            }
            
            response = requests.get(url, params=params)
            data = response.json()
            
            return data.get('live_views', 0)
        except Exception as e:
            print(f"Error obteniendo datos de Facebook: {e}")
            return 0
