// ===== Helper =====
function getToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged in.");
    return null;
  }
  return token;
}

// ===== Submit Report =====
document.getElementById("reportForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const token = getToken();
  if (!token) return;

  const formData = new FormData();
  formData.append("description", document.getElementById("description").value);
  formData.append("location", document.getElementById("location").value);
  const photoFile = document.getElementById("photo").files[0];
  if (photoFile) formData.append("photo", photoFile);

  try {
    const res = await fetch("http://localhost:5000/api/reports", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    // Try parsing JSON safely
    let data;
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (res.ok) {
      alert("Report submitted successfully!");
      loadReports();
    } else if (res.status === 403) {
      alert("Session expired. Please login again.");
      localStorage.removeItem("token");
      window.location.href = "login.html";
    } else {
      alert(data.message || "Failed to submit report.");
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    alert("Unexpected error during report submission.");
  }
});


// ===== Fetch Reports =====
/*async function loadReports() {
  const token = getToken();
  if (!token) return;

  try {
    const res = await fetch("http://localhost:5000/api/reports", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const reports = await res.json();

    const container = document.getElementById("reportsContainer");
    container.innerHTML = "";
    reports.forEach(r => {
      const div = document.createElement("div");
      div.className = "report";
      div.innerHTML = `
        <h3>${r.userId?.username || "Anonymous"}</h3>
        <p>${r.description}</p>
        <p><b>Location:</b> ${r.location}</p>
        ${r.photo ? `<img src="http://localhost:5000/uploads/${r.photo}" width="200">` : ""}
        <p><i>${new Date(r.date).toLocaleString()}</i></p>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    alert("Failed to load reports.");
  }
}

document.addEventListener("DOMContentLoaded", loadReports);
*/