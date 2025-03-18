document.addEventListener('DOMContentLoaded', function() {
    // Gestionar el envío del formulario
    const configForm = document.getElementById('config-form');
    
    // Gestionar botones de incremento y decremento
    document.querySelectorAll('.increment-count').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            input.value = parseInt(input.value) + 1;
        });
    });
    
    document.querySelectorAll('.decrement-count').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.nextElementSibling;
            const newValue = parseInt(input.value) - 1;
            input.value = newValue < 0 ? 0 : newValue;
        });
    });
    
    // Gestionar cambios en los selectores de modo
    document.querySelectorAll('.mode-radio').forEach(radio => {
        radio.addEventListener('change', function() {
            const platform = this.name.split('-')[0];
            const credentialsDiv = document.getElementById(`${platform}-credentials`);
            const manualDiv = document.getElementById(`${platform}-manual-controls`);
            
            if (this.value === 'api') {
                credentialsDiv.style.display = 'block';
                manualDiv.style.display = 'none';
            } else {
                credentialsDiv.style.display = 'none';
                manualDiv.style.display = 'block';
            }
        });
    });
    
    configForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Recolectar datos de configuración
        const config = {
            platforms: {
                youtube: {
                    enabled: document.getElementById('youtube-enabled').checked,
                    mode: document.querySelector('input[name="youtube-mode"]:checked').value,
                    manual_count: parseInt(document.getElementById('youtube-manual-count').value),
                    credentials: {
                        api_key: document.getElementById('youtube-api-key').value,
                        video_id: document.getElementById('youtube-video-id').value
                    }
                },
                twitch: {
                    enabled: document.getElementById('twitch-enabled').checked,
                    mode: document.querySelector('input[name="twitch-mode"]:checked').value,
                    manual_count: parseInt(document.getElementById('twitch-manual-count').value),
                    credentials: {
                        client_id: document.getElementById('twitch-client-id').value,
                        client_secret: document.getElementById('twitch-client-secret').value,
                        channel_name: document.getElementById('twitch-channel-name').value
                    }
                },
                facebook: {
                    enabled: document.getElementById('facebook-enabled').checked,
                    mode: document.querySelector('input[name="facebook-mode"]:checked').value,
                    manual_count: parseInt(document.getElementById('facebook-manual-count').value),
                    credentials: {
                        access_token: document.getElementById('facebook-access-token').value,
                        live_video_id: document.getElementById('facebook-live-video-id').value
                    }
                },
                tiktok: {
                    enabled: document.getElementById('tiktok-enabled').checked,
                    mode: document.querySelector('input[name="tiktok-mode"]:checked').value,
                    manual_count: parseInt(document.getElementById('tiktok-manual-count').value),
                    credentials: {
                        username: document.getElementById('tiktok-username').value,
                        api_key: document.getElementById('tiktok-api-key').value
                    }
                },
                zoom: {
                    enabled: document.getElementById('zoom-enabled').checked,
                    mode: document.querySelector('input[name="zoom-mode"]:checked').value,
                    manual_count: parseInt(document.getElementById('zoom-manual-count').value),
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
        const modeDiv = document.getElementById(`${platform}-mode-selector`);
        const credentialsDiv = document.getElementById(`${platform}-credentials`);
        const manualDiv = document.getElementById(`${platform}-manual-controls`);
        
        // Verificar si están visibles basado en el modo actual y el estado del checkbox
        if (checkbox.checked) {
            const mode = document.querySelector(`input[name="${platform}-mode"]:checked`).value;
            credentialsDiv.style.display = mode === 'api' ? 'block' : 'none';
            manualDiv.style.display = mode === 'manual' ? 'block' : 'none';
        } else {
            credentialsDiv.style.display = 'none';
            manualDiv.style.display = 'none';
        }
        
        // Añadir event listener para cambios
        checkbox.addEventListener('change', function() {
            const mode = document.querySelector(`input[name="${platform}-mode"]:checked`).value;
            if (this.checked) {
                modeDiv.style.display = 'block';
                credentialsDiv.style.display = mode === 'api' ? 'block' : 'none';
                manualDiv.style.display = mode === 'manual' ? 'block' : 'none';
            } else {
                modeDiv.style.display = 'none';
                credentialsDiv.style.display = 'none';
                manualDiv.style.display = 'none';
            }
        });
    });
});
