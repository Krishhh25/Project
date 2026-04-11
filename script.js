const form = document.getElementById("form");
const table = document.getElementById("tableData");
const submitBtn = document.getElementById("submitBtn");

// CHANGE THIS TO YOUR ACTUAL RENDER URL
const API_URL = "https://project-n85r.onrender.com/feedback";

async function loadData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        table.innerHTML = ""; 
        data.forEach(item => renderRow(item));
    } catch (error) {
        console.error("Load Error:", error);
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
