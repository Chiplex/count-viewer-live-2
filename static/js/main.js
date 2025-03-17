document.addEventListener('DOMContentLoaded', function() {
    // Conectar al servidor WebSocket
    const socket = io();
    
    // Escuchar actualizaciones de conteo
    socket.on('update_counts', function(counts) {
        updateCounters(counts);
    });
    
    // Actualizar contadores en la UI
    function updateCounters(counts) {
        let totalCount = 0;
        
        // Actualizar cada contador de plataforma
        for (const platform in counts) {
            const count = counts[platform];
            const countElement = document.getElementById(`${platform}-count`);
            
            if (countElement) {
                countElement.textContent = formatNumber(count);
                
                // Añadir efecto de actualización
                countElement.classList.add('updated');
                setTimeout(() => {
                    countElement.classList.remove('updated');
                }, 1000);
                
                totalCount += count;
            }
        }
        
        // Actualizar contador total
        const totalCountElement = document.getElementById('total-count');
        totalCountElement.textContent = formatNumber(totalCount);
        
        // Añadir efecto de actualización al total
        totalCountElement.classList.add('updated');
        setTimeout(() => {
            totalCountElement.classList.remove('updated');
        }, 1000);
    }
    
    // Formatear números grandes (ejemplo: 1000 -> 1,000)
    function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }
});
