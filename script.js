document.getElementById("bookingForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const message = document.getElementById("message");

    const bookingData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        car: document.getElementById("car").value,
        seats: document.getElementById("seats").value,
        pickup: document.getElementById("pickup").value,
        returnDate: document.getElementById("return").value
    };

    // IMPORTANT:
    // Put your n8n PRODUCTION webhook URL here.
    const webhookUrl = "http://192.168.5.251:5678/webhook-test/car-booking";

    try {
        message.innerHTML = "Booking... ";
        message.style.color = "blue";

        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bookingData)
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
            throw new Error("Server returned " + response.status);
        }

        // Read response as text instead of JSON.
        // This prevents "Unexpected end of JSON input"
        // when n8n returns an empty response.
       const responseText = await response.text();

console.log("n8n response:", responseText);

let result = {};

if (responseText.trim()) {
    try {
        result = JSON.parse(responseText);
    } catch (error) {
        console.log("n8n returned non-JSON:", responseText);
    }
}

console.log("Booking result:", result);

const bookingId = result.bookingId || result.bookings || "Received";

localStorage.setItem(
    "bookingResponse",
    JSON.stringify({
        ...result,
        bookingId: bookingId
    })
);


        // Save the booking information
        localStorage.setItem(
            "bookingData",
            JSON.stringify(bookingData)
        );

        // Save n8n response if there is one
        localStorage.setItem(
            "bookingResponse",
            responseText
        );

        // Go to confirmation page
        window.location.href = "confirmation.html";

    } catch (error) {
        console.error("Booking error:", error);

        message.innerHTML = "Booking failed: " + error.message;
        message.style.color = "red";
    }
});


// ===============================
// SERVICE WORKER
// ===============================

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {

        navigator.serviceWorker.register("./service_worker.js")
            .then((registration) => {
                console.log(
                    "Service Worker registered:",
                    registration.scope
                );
            })
            .catch((error) => {
                console.error(
                    "Service Worker registration failed:",
                    error
                );
            });

    });
}


// ===============================
// PWA INSTALL BUTTON
// ===============================

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (event) => {

    event.preventDefault();

    deferredPrompt = event;

    const installBtn = document.getElementById("installBtn");

    if (installBtn) {
        installBtn.style.display = "block";
    }
});


const installBtn = document.getElementById("installBtn");

if (installBtn) {

    installBtn.addEventListener("click", async () => {

        if (!deferredPrompt) {
            return;
        }

        deferredPrompt.prompt();

        const result = await deferredPrompt.userChoice;

        console.log("Install result:", result);

        deferredPrompt = null;

        installBtn.style.display = "none";
    });

}

