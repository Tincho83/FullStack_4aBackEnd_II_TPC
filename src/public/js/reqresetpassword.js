const loginForm = document.getElementById('resetpassForm');

const e_mail = document.getElementById('email');
const btnSubmitMail = document.getElementById('resetpassmail-btn');

btnSubmitMail.addEventListener("click", async (event) => {
    event.preventDefault();
    let email = e_mail.value;

    if (!email) {
        alert('Please enter your email');
        return;
    }

    let body = { email };

    let response = await fetch("/api/sessions/resetpasswordmail", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    let data = await response.json();
    if (response.status >= 400) {
        alert(data.error);
    } else {
        alert("Reset password link sent to your email. Valid to 60min.");
        setTimeout(() => {            
            window.location.href = `/login`;
        }, 32);
    }
})