// ---------- 1. CNIC auto format: 42000-0000000-0 ----------
document.querySelectorAll(".cnic").forEach(function (input) {
  input.addEventListener("input", function () {
    const digits = input.value.replace(/\D/g, "").slice(0, 13);
    let result = digits.slice(0, 5);
    if (digits.length > 5) result += "-" + digits.slice(5, 12);
    if (digits.length > 12) result += "-" + digits.slice(12);
    input.value = result;
  });
});


// ---------- 2. Show / hide password ----------
const passInput = document.getElementById("password");
const showBtn = document.getElementById("showPass");

showBtn.addEventListener("click", function () {
  const hidden = passInput.type === "password";
  passInput.type = hidden ? "text" : "password";
  showBtn.textContent = hidden ? "Hide" : "Show";
});


// ---------- 3. Forms ----------

document.querySelectorAll(".demo-form").forEach(function (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    form.querySelector(".message").textContent =
      "Form is valid. Connect this to the real portal server to continue.";
  });
});

// open the recovery box when "Forgot password?" is clicked
document.querySelector('a[href="#recover"]').addEventListener("click", function (e) {
  e.preventDefault();
  document.getElementById("recover").open = true;
});


// ---------- 4. GSAP intro ----------
gsap.from(".side > *", { x: -40, opacity: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" });
gsap.from(".main > *", { y: 30, opacity: 0, duration: 0.8, stagger: 0.08, delay: 0.2, ease: "power3.out" });
