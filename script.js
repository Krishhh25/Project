const form = document.getElementById("form");
const table = document.getElementById("tableData");
const submitBtn = document.getElementById("submitBtn");

// 1. YOUR LIVE RENDER URL (Change this to your actual Render link if different)
const API_URL = "https://project-n85r.onrender.com/feedback";

// --- FUNCTION: Load data from database when page opens ---
async function loadData() {
    try {
        // Pointing to Render instead of localhost
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Server not responding");
        
        const data = await response.json();
        
        table.innerHTML = ""; // Clear table
        data.forEach(item => {
            renderRow(item);
        });
    } catch (error) {
        console.error("Load Error:", error);
        // If it fails, it's usually because Render is "sleeping"
    }
}

// Helper to add a row to the table
function renderRow(item) {
    const row = `
        <tr>
            <td>${item.name}</td>
            <td>${item.age}</td>
            <td>${item.route}</td>
            <td class="feedback-cell">${item.feedback}</td>
        </tr>
    `;
    table.insertAdjacentHTML('beforeend', row);
}

// --- EVENT: Handle Form Submission ---
form.addEventListener("submit", async function(e) {
    e.preventDefault();
    
    // Disable button to prevent double-clicks
    submitBtn.disabled = true;
    submitBtn.innerText = "Sending...";

    const formData = {
        name: document.getElementById("name").value,
        age: parseInt(document.getElementById("age").value),
        route: document.getElementById("route").value || 'N/A', // Captures 24A as text
        feedback: document.getElementById("feedback").value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const savedData = await response.json();
            renderRow(savedData); // Add to table visually
            form.reset();
            submitBtn.innerText = "Success!";
            submitBtn.style.backgroundColor = "#28a745";
        } else {
            const errorData = await response.json();
            alert("Database Error: " + errorData.error);
        }
    } catch (error) {
        console.error("Submit Error:", error);
        alert("Server is waking up. Please wait 30 seconds and try again.");
    }

    // Reset button after 3 seconds
    setTimeout(() => {
        submitBtn.innerText = "Submit Feedback";
        submitBtn.style.backgroundColor = ""; 
        submitBtn.disabled = false;
    }, 3000);
});

// Load everything when the browser opens
window.onload = loadData;
