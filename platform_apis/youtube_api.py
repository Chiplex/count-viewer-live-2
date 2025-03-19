import googleapiclient.discovery
import googleapiclient.errors

class YouTubeAPI:
    def __init__(self, credentials):
        self.api_key = credentials.get('api_key')
        self.video_id = credentials.get('video_id')
        self.api_service_name = "youtube"
        self.api_version = "v3"
        self.youtube = None
        
        if self.api_key:
            try:
                self.youtube = googleapiclient.discovery.build(
                    self.api_service_name, self.api_version, developerKey=self.api_key)
            except Exception as e:
                print(f"Error al inicializar YouTube API: {e}")
    
    def update_credentials(self, credentials):
        self.api_key = credentials.get('api_key')
        self.video_id = credentials.get('video_id')
        
        if self.api_key:
            try:
                self.youtube = googleapiclient.discovery.build(
                    self.api_service_name, self.api_version, developerKey=self.api_key)
            except Exception as e:
                print(f"Error al inicializar YouTube API: {e}")
                self.youtube = None
    
    def get_viewer_count(self):
        if not self.youtube or not self.video_id:
            return 0
        
        try:
            # Obtener estadísticas del video en directo
            request = self.youtube.videos().list(
                part="liveStreamingDetails",
                id=self.video_id
            )
            response = request.execute()
            
            if not response.get('items'):
                return 0
                
            live_details = response['items'][0].get('liveStreamingDetails', {})
            return int(live_details.get('concurrentViewers', 0))
        except Exception as e:
            print(f"Error obteniendo datos de YouTube: {e}")
            return 0
            
    def set_video_id(self, video_id):
        self.video_id = video_id
