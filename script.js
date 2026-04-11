const form = document.getElementById("form");
const table = document.getElementById("tableData");
const submitBtn = document.getElementById("submitBtn");

// CHANGE THIS TO YOUR ACTUAL RENDER URL
const API_URL = "https://project-n85r.onrender.com/feedback";

async function loadData() {
    // Show a clear loading message while Render "wakes up"
    table.innerHTML = `
        <tr>
            <td colspan="4" style="text-align:center; padding: 20px; color: #666;">
                <i class="fas fa-spinner fa-spin"></i> Loading server... This may take time.
            </td>
        </tr>`;

    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error("Server is having trouble responding.");
        }

        const data = await response.json();
        
        table.innerHTML = ""; // Clear the loading message
        
        if (data.length === 0) {
            table.innerHTML = "<tr><td colspan='4' style='text-align:center;'>No feedback found yet.</td></tr>";
        } else {
            data.forEach(item => renderRow(item));
        }
    } catch (error) {
        console.error("Load Error:", error);
        table.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center; color: #dc3545; padding: 20px;">
                    <i class="fas fa-exclamation-circle"></i> 
                    Connection failed. Please refresh the page in a few seconds.
                </td>
            </tr>`;
    }
}
function renderRow(item) {
    const row = `
        <tr>
            <td>${item.name}</td>
            <td>${item.age}</td>
            <td><strong>${item.route}</strong></td>
            <td class="feedback-cell">${item.feedback}</td>
        </tr>
    `;
    table.insertAdjacentHTML('beforeend', row);
}

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
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const savedData = await response.json();
            renderRow(savedData);
            form.reset();
            submitBtn.innerText = "Success!";
            submitBtn.style.backgroundColor = "#28a745";
        } else {
            const err = await response.json();
            alert("Database Error: " + err.error);
        }
    } catch (error) {
        alert("Server waking up... please wait 30 seconds.");
    }

    setTimeout(() => {
        submitBtn.innerText = "Submit Feedback";
        submitBtn.style.backgroundColor = "";
        submitBtn.disabled = false;
    }, 3000);
});

window.onload = loadData;
