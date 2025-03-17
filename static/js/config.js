document.addEventListener('DOMContentLoaded', function() {
    // Gestionar el envío del formulario
    const configForm = document.getElementById('config-form');
    
    configForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Recolectar datos de configuración
        const config = {
            platforms: {
                youtube: {
                    enabled: document.getElementById('youtube-enabled').checked,
                    credentials: {
                        api_key: document.getElementById('youtube-api-key').value,
                        video_id: document.getElementById('youtube-video-id').value
                    }
                },
                twitch: {
                    enabled: document.getElementById('twitch-enabled').checked,
                    credentials: {
                        client_id: document.getElementById('twitch-client-id').value,
                        client_secret: document.getElementById('twitch-client-secret').value,
                        channel_name: document.getElementById('twitch-channel-name').value
                    }
                },
                facebook: {
                    enabled: document.getElementById('facebook-enabled').checked,
                    credentials: {
                        access_token: document.getElementById('facebook-access-token').value,
                        live_video_id: document.getElementById('facebook-live-video-id').value
                    }
                },
                tiktok: {
                    enabled: document.getElementById('tiktok-enabled').checked,
                    credentials: {
                        username: document.getElementById('tiktok-username').value,
                        api_key: document.getElementById('tiktok-api-key').value
                    }
                },
                zoom: {
                    enabled: document.getElementById('zoom-enabled').checked,
                    credentials: {
                        api_key: document.getElementById('zoom-api-key').value,
                        api_secret: document.getElementById('zoom-api-secret').value,
                        meeting_id: document.getElementById('zoom-meeting-id').value
                    }
                }
            },
            display: {
                update_interval: parseInt(document.getElementById('update-interval').value),
                font_size: parseInt(document.getElementById('font-size').value),
                background_color: document.getElementById('background-color').value
            }
        };
        
        // Enviar configuración al servidor
        fetch('/save_config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(config)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Configuración guardada correctamente');
            } else {
                alert('Error al guardar la configuración');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al guardar la configuración');
        });
    });
    
    // Mostrar/ocultar campos de credenciales según el estado del checkbox
    const platformCheckboxes = document.querySelectorAll('input[type="checkbox"][id$="-enabled"]');
    platformCheckboxes.forEach(checkbox => {
        // Configurar el estado inicial
        const platform = checkbox.id.replace('-enabled', '');
        const credentialsDiv = document.getElementById(`${platform}-credentials`);
        credentialsDiv.style.display = checkbox.checked ? 'block' : 'none';
        
        // Añadir event listener para cambios
        checkbox.addEventListener('change', function() {
            credentialsDiv.style.display = this.checked ? 'block' : 'none';
        });
    });
});
