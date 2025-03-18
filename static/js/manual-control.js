document.addEventListener('DOMContentLoaded', function() {
    // Referencia al socket global (definido en main.js)
    const socket = io();
    
    // Crear el panel de control manual si es necesario
    function setupManualCounters() {
        fetch('/config_data')
            .then(response => response.json())
            .then(config => {
                // Comprobar si alguna plataforma está en modo manual
                let hasManualPlatforms = false;
                
                // Contenedor principal para controles manuales
                let controlsContainer = document.getElementById('manual-controls-container');
                
                // Si no existe, crear el contenedor
                if (!controlsContainer) {
                    controlsContainer = document.createElement('div');
                    controlsContainer.id = 'manual-controls-container';
                    controlsContainer.className = 'manual-controls-container';
                    document.body.appendChild(controlsContainer);
                    
                    // Estilos para el contenedor
                    controlsContainer.style.position = 'fixed';
                    controlsContainer.style.bottom = '20px';
                    controlsContainer.style.right = '20px';
                    controlsContainer.style.backgroundColor = '#f0f0f0';
                    controlsContainer.style.padding = '15px';
                    controlsContainer.style.borderRadius = '8px';
                    controlsContainer.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                    controlsContainer.style.zIndex = '1000';
                    
                    // Título del panel
                    const title = document.createElement('h3');
                    title.textContent = 'Control Manual de Vistas';
                    title.style.margin = '0 0 10px 0';
                    title.style.fontSize = '16px';
                    controlsContainer.appendChild(title);
                }
                
                // Limpiar controles anteriores
                const existingControls = controlsContainer.querySelectorAll('.platform-manual-control');
                existingControls.forEach(control => control.remove());
                
                // Crear controles para cada plataforma en modo manual
                for (const platform in config.platforms) {
                    const platformConfig = config.platforms[platform];
                    
                    if (platformConfig.enabled && platformConfig.mode === 'manual') {
                        hasManualPlatforms = true;
                        
                        // Crear control para esta plataforma
                        const controlDiv = document.createElement('div');
                        controlDiv.className = 'platform-manual-control';
                        controlDiv.style.display = 'flex';
                        controlDiv.style.alignItems = 'center';
                        controlDiv.style.margin = '10px 0';
                        
                        // Etiqueta con nombre de la plataforma
                        const label = document.createElement('span');
                        label.textContent = platform.charAt(0).toUpperCase() + platform.slice(1) + ':';
                        label.style.marginRight = '10px';
                        label.style.fontWeight = 'bold';
                        controlDiv.appendChild(label);
                        
                        // Botón para decrementar
                        const decrementBtn = document.createElement('button');
                        decrementBtn.textContent = '-';
                        decrementBtn.style.width = '30px';
                        decrementBtn.style.height = '30px';
                        decrementBtn.style.fontSize = '18px';
                        decrementBtn.style.margin = '0 5px';
                        decrementBtn.style.cursor = 'pointer';
                        controlDiv.appendChild(decrementBtn);
                        
                        // Campo para mostrar/editar el valor
                        const countInput = document.createElement('input');
                        countInput.type = 'number';
                        countInput.min = '0';
                        countInput.value = platformConfig.manual_count;
                        countInput.style.width = '60px';
                        countInput.style.textAlign = 'center';
                        countInput.style.fontSize = '16px';
                        countInput.style.margin = '0 5px';
                        controlDiv.appendChild(countInput);
                        
                        // Botón para incrementar
                        const incrementBtn = document.createElement('button');
                        incrementBtn.textContent = '+';
                        incrementBtn.style.width = '30px';
                        incrementBtn.style.height = '30px';
                        incrementBtn.style.fontSize = '18px';
                        incrementBtn.style.margin = '0 5px';
                        incrementBtn.style.cursor = 'pointer';
                        controlDiv.appendChild(incrementBtn);
                        
                        // Event listeners
                        const updateCount = (newValue) => {
                            // Garantizar que el valor sea al menos 0
                            newValue = Math.max(0, newValue);
                            countInput.value = newValue;
                            
                            // Enviar actualización al servidor
                            fetch('/update_manual_count', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    platform: platform,
                                    count: newValue
                                })
                            }).catch(error => console.error('Error updating count:', error));
                        };
                        
                        decrementBtn.addEventListener('click', () => {
                            updateCount(parseInt(countInput.value) - 1);
                        });
                        
                        incrementBtn.addEventListener('click', () => {
                            updateCount(parseInt(countInput.value) + 1);
                        });
                        
                        countInput.addEventListener('change', () => {
                            updateCount(parseInt(countInput.value));
                        });
                        
                        // Añadir el control al contenedor
                        controlsContainer.appendChild(controlDiv);
                    }
                }
                
                // Mostrar u ocultar el panel según sea necesario
                controlsContainer.style.display = hasManualPlatforms ? 'block' : 'none';
            })
            .catch(error => console.error('Error loading configuration:', error));
    }
    
    // Configurar controles al cargar la página
    setupManualCounters();
    
    // Reconfigurar cuando se actualice la configuración
    socket.on('config_updated', setupManualCounters);
});
