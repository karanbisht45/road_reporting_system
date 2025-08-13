document.getElementById("reportForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("location", document.getElementById("location").value);
    formData.append("description", document.getElementById("description").value);
    formData.append("photo", document.getElementById("photo").files[0]);

    try {
        const response = await fetch("http://localhost:5000/api/reports", {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            alert("✅ Report submitted successfully!");
            document.getElementById("reportForm").reset();
        } else {
            alert("❌ Failed to submit report.");
        }
    } catch (err) {
        console.error(err);
        alert("⚠ Could not connect to backend. Make sure the server is running.");
    }
});
