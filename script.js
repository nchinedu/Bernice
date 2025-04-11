async function calculate() {
    const username = document.getElementById('username').value;
    const microSize = parseFloat(document.getElementById('microSize').value);
    const magnification = parseFloat(document.getElementById('magnification').value);

    if (!username || !microSize || !magnification) {
        alert('Please fill in all fields');
        return;
    }

    const realSize = microSize / magnification;
    
    const result = {
        username,
        microSize,
        magnification,
        realSize,
        timestamp: new Date().toISOString()
    };

    document.getElementById('result').innerHTML = `
        <p>Real Size: ${realSize.toFixed(4)} mm</p>
    `;

    try {
        saveToLocalStorage(result);
        await displayHistory();
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

function saveToLocalStorage(newCalculation) {
    try {
        // Get existing calculations or initialize empty array
        const existingData = JSON.parse(localStorage.getItem('calculations')) || [];
        existingData.push(newCalculation);
        
        // Save back to localStorage
        localStorage.setItem('calculations', JSON.stringify(existingData));
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayHistory() {
    try {
        const calculations = JSON.parse(localStorage.getItem('calculations')) || [];
        
        const historyHTML = calculations
            .slice(-5) // Get last 5 calculations
            .reverse() // Show newest first
            .map(calc => `
                <div class="history-item">
                    <p>User: ${calc.username}</p>
                    <p>Real Size: ${calc.realSize.toFixed(4)} mm</p>
                    <p>Date: ${new Date(calc.timestamp).toLocaleDateString()}</p>
                </div>
            `)
            .join('');

        document.getElementById('history').innerHTML = `
            <h3>Recent Calculations</h3>
            ${historyHTML}
        `;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Load history when page loads
window.onload = displayHistory;