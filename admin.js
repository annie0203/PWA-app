
const supabaseUrl = "https://vjoanfxwcpsqvapcnvsf.supabase.co";

const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqb2FuZnh3Y3BzcXZhcGNudnNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2MjY0OTUsImV4cCI6MjEwMDIwMjQ5NX0.DiwNlNNdFoFUWjDG6zJwTGAmQG7FhrCGzNqzZsnSfHE";

const client = window.supabase.createClient(supabaseUrl, supabaseKey);
let allBookings = [];
    async function checkLogin() {
    const { data } = await client.auth.getUser();

    if (!data.user) {
        alert("Please login first!");
        window.location.href = "login.html";
    }
}
checkLogin();

async function loadBookings() {

    const { data, error } = await client
        .from("car booking")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.error("Error:", error);
        return;
    }

    console.log("Data:", data);
    allBookings = data;
    document.getElementById("totalBookings").innerHTML = data.length;

const pending = data.filter(booking => booking.status === "pending").length;

document.getElementById("pendingBookings").innerHTML = pending;

    const table = document.getElementById("bookingTable");
    table.innerHTML = "";

    data.forEach((booking) => {
        console.log("Booking Object:",booking);
        console.log("Booking ID:",booking.id)

        table.innerHTML += `
            <tr>
                <td>${booking.created_at || ""}</td>
                <td>${booking.name || ""}</td>
                <td>${booking.email || ""}</td>
                <td>${booking.car || ""}</td>
                <td>${booking.pickup || ""}</td>
                <td>${booking.status || "Pending"}</td>
                
                <td>
               <td>
    ${
        booking.status === "pending"
        ? `
            <button onclick="console.log('Button ID:', '${booking.id}'); approveBooking('${booking.id}')">
    Approve
</button>
            <button onclick="rejectBooking('${booking.id}')">Reject</button>
          `
        : booking.status
    }
</td>
                </td>
            </tr>
        `;

    });

}

loadBookings();

async function approveBooking(id) {

    console.log("Approving ID:", id);

    const { data, error } = await client
        .from("car booking")
        .update({ status: "approved" })
        .eq("id", Number(id))
        .select();

    console.log("Update Data:",data);
    console.log("Error:", error);

    if (error) {
        alert(error.message);
        return;
    }

    alert("Booking Approved");
    loadBookings();
}

async function rejectBooking(id) {

    const { data, error } = await client
        .from("car booking")
        .update({ status: "rejected" })
        .eq("id", Number(id))
        .select();

    console.log(data);
    console.log(error);

    if (error) {
        alert(error.message);
        return;
    }

    alert("Booking Rejected");
    loadBookings();
}
async function logout() {

    const { error } = await client.auth.signOut();

    if (error) {
        alert(error.message);
        return;
    }

    alert("Logged out successfully");

    window.location.href = "login.html";
}
function searchBookings() {

    const searchText = document
        .getElementById("search")
        .value
        .toLowerCase();

    const rows = document.querySelectorAll("#bookingTable tr");

    rows.forEach((row) => {

        if (row.innerText.toLowerCase().includes(searchText)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }

    });

}
function filterBookings() {

    const filter = document.getElementById("statusFilter").value;

    const rows = document.querySelectorAll("#bookingTable tr");

    rows.forEach((row) => {

        if (filter === "all") {
            row.style.display = "";
            return;
        }

        const status = row.cells[5].innerText.toLowerCase();

        if (status === filter) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }

    });

}