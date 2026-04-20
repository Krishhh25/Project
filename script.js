const form = document.getElementById("form");
const table = document.getElementById("tableData");
const submitBtn = document.getElementById("submitBtn");

const API_URL = "https://project-n85r.onrender.com/feedback";

async function loadData() {
    table.innerHTML = `<tr><td colspan="4" style="text-align:center;"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>`;
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        table.innerHTML = ""; 
        if (data.length === 0) {
            table.innerHTML = "<tr><td colspan='4' style='text-align:center;'>No feedback found.</td></tr>";
        } else {
            data.forEach(item => renderRow(item));
        }
    } catch (error) {
        table.innerHTML = "<tr><td colspan='4' style='text-align:center; color:red;'>Connection failed.</td></tr>";
    }
}

function renderRow(item) {
    const row = `
        <tr>
            <td>${item.name}</td>
            <td>${item.age}</td>
            <td><strong>${item.route}</strong></td>
            <td class="feedback-cell">${item.feedback}</td>
        </tr>`;
    table.insertAdjacentHTML('beforeend', row);
}

form.addEventListener("submit", async function(e) {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.innerText = "Sending...";

    const formData = {
        name: document.getElementById("name").value,
        age: document.getElementById("age").value,
        route: document.getElementById("route").value || 'General',
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
        }
    } catch (error) {
        alert("Error submitting feedback.");
    }

    setTimeout(() => {
        submitBtn.innerText = "Submit Feedback";
        submitBtn.disabled = false;
    }, 3000);
});

window.onload = loadData;
