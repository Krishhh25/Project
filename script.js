const form = document.getElementById("form");
const table = document.getElementById("tableData");
const submitBtn = document.getElementById("submitBtn");

// --- FUNCTION: Load data from database when page opens ---
async function loadData() {
    try {
        const response = await fetch('http://localhost:3000/feedback');
        const data = await response.json();
        
        table.innerHTML = ""; // Clear table
        data.forEach(item => {
            renderRow(item);
        });
    } catch (error) {
        console.error("Load Error:", error);
    }
}

// Helper to add a row to the table
function renderRow(item) {
    const row = `
        <tr>
            <td>${item.name}</td>
            <td>${item.age}</td>
            <td>${item.route}</td>
            <td>${item.feedback}</td>
        </tr>
    `;
    table.insertAdjacentHTML('beforeend', row);
}

// --- EVENT: Handle Form Submission ---
form.addEventListener("submit", async function(e) {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.innerText = "Sending...";

    const formData = {
        name: document.getElementById("name").value,
        age: document.getElementById("age").value,
        route: document.getElementById("route").value || 'N/A',
        feedback: document.getElementById("feedback").value
    };

    try {
        const response = await fetch('http://localhost:3000/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const savedData = await response.json();
            renderRow(savedData); // Add to table visually
            form.reset();
            submitBtn.innerText = "Success!";
        }
    } catch (error) {
        alert("Server is offline. Check your CMD.");
    }

    setTimeout(() => {
        submitBtn.innerText = "Submit Feedback";
        submitBtn.disabled = false;
    }, 2000);
});

// Load everything when the browser opens
window.onload = loadData;