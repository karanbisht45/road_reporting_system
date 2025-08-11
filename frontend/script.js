document.getElementById("reportForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const location = document.getElementById("location").value;
    const description = document.getElementById("description").value;
    const photo = document.getElementById("photo").files[0];

    alert(`Report submitted!\nLocation: ${location}\nDescription: ${description}\nPhoto: ${photo.name}`);

    // Later we will send this to backend using fetch() with FormData
});
