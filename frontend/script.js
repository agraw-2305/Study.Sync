const API_URL = 'http://localhost:5000';

document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const inputText = document.getElementById('inputText');
    const contentType = document.getElementById('contentType');
    const output = document.getElementById('output');

    generateBtn.addEventListener('click', async () => {
        const text = inputText.value.trim();
        
        if (!text) {
            showError('Please enter some text to generate content.');
            return;
        }

        await generateContent(text, contentType.value);
    });
});

async function generateContent(text, type) {
    const output = document.getElementById('output');
    
    try {
        output.innerHTML = '<p class="loading">Generating your content... ⏳</p>';
        
        const response = await fetch(`${API_URL}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                type: type
            })
        });

        if (!response.ok) {
            throw new Error('Failed to generate content');
        }

        const data = await response.json();
        
        if (data.success) {
            displayContent(data, type);
        } else {
            showError(data.error || 'An error occurred');
        }
        
    } catch (error) {
        showError('Failed to connect to the server. Make sure the backend is running.');
        console.error('Error:', error);
    }
}

function displayContent(data, type) {
    const output = document.getElementById('output');
    
    let html = `<div class="success">✓ ${type.charAt(0).toUpperCase() + type.slice(1)} generated successfully!</div>`;
    html += `<div style="margin-top: 20px;">`;
    html += `<h3>Result:</h3>`;
    html += `<p>${data.content}</p>`;
    html += `</div>`;
    
    output.innerHTML = html;
}

function showError(message) {
    const output = document.getElementById('output');
    output.innerHTML = `<div class="error">✗ ${message}</div>`;
}
