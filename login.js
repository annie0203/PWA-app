const supabaseUrl = "https://vjoanfxwcpsqvapcnvsf.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqb2FuZnh3Y3BzcXZhcGNudnNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2MjY0OTUsImV4cCI6MjEwMDIwMjQ5NX0.DiwNlNNdFoFUWjDG6zJwTGAmQG7FhrCGzNqzZsnSfHE";

const client = window.supabase.createClient(supabaseUrl, supabaseKey);

async function login() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data, error } = await client.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        alert(error.message);
        return;
    }

    alert("Login Successful");

    window.location.href = "admin.html";
}