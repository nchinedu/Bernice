// Load environment variables
require('dotenv').config();

// Use environment variables
const GIST_ID = process.env.GITHUB_GIST_ID;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

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
        await saveToGist(result);
        await displayHistory();
    } catch (error) {
        console.error('Error saving to Gist:', error);
    }
}

async function saveToGist(newCalculation) {
    try {
        const response = await axios.get(`https://api.github.com/gists/${GIST_ID}`);
        const content = JSON.parse(response.data.files['calculations.json'].content);
        content.calculations.push(newCalculation);

        await axios.patch(`https://api.github.com/gists/${GIST_ID}`, {
            files: {
                'calculations.json': {
                    content: JSON.stringify(content, null, 2)
                }
            }
        }, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

async function displayHistory() {
    try {
        const response = await axios.get(`https://api.github.com/gists/${GIST_ID}`);
        const content = JSON.parse(response.data.files['calculations.json'].content);
        
        const historyHTML = content.calculations
            .slice(-5)
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