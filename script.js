
const themeBtn = document.getElementById("themeBtn");
const page = document.documentElement;
 
// 1. start with the saved choice, or the device setting
let theme = "light";
if (window.matchMedia("(prefers-color-scheme: dark)").matches) theme = "dark";
 
try {
  const saved = localStorage.getItem("uok-theme");
  if (saved) theme = saved;
} catch (e) {}
 
// 2. apply the theme and update the button text
function applyTheme() {
  page.dataset.theme = theme;
  themeBtn.textContent = theme === "dark" ? "[ Light ]" : "[ Dark ]";
  try { localStorage.setItem("uok-theme", theme); } catch (e) {}
}
applyTheme();
 
// 3. switch on click
themeBtn.addEventListener("click", function () {
  theme = theme === "dark" ? "light" : "dark";
  applyTheme();
});


// ---------- 1. Menu open / close ----------
const menu = document.getElementById("menu");
const menuBtn = document.getElementById("menuBtn");

menuBtn.addEventListener("click", function () {
  menu.classList.toggle("open");
  menuBtn.textContent = menu.classList.contains("open") ? "[ Close ]" : "[ Menu ]";
});

menu.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    menu.classList.remove("open");
    menuBtn.textContent = "[ Menu ]";
  });
});


const searchBox = document.getElementById("search");
const chips = document.querySelectorAll(".chip");
const rows = document.querySelectorAll(".row");
const noResult = document.getElementById("noResult");
let currentFilter = "all";

function filterFaculties() {
  const text = searchBox.value.toLowerCase();
  let shown = 0;

  rows.forEach(function (row) {
    const matchesText = row.textContent.toLowerCase().includes(text);
    const matchesType = currentFilter === "all" || row.dataset.type === currentFilter;

    if (matchesText && matchesType) {
      row.classList.remove("hidden");
      shown++;
    } else {
      row.classList.add("hidden");
    }
  });

  noResult.style.display = shown === 0 ? "block" : "none";
}

searchBox.addEventListener("input", filterFaculties);

chips.forEach(function (chip) {
  chip.addEventListener("click", function () {
    chips.forEach(function (c) { c.classList.remove("active"); });
    chip.classList.add("active");
    currentFilter = chip.dataset.filter;
    filterFaculties();
  });
});


// ---------- 3. Admission countdown ----------
const deadline = new Date("2027-01-15T23:59:59+05:00");   // sample date
const countdownNumbers = document.querySelectorAll("#countdown strong");

function updateCountdown() {
  let diff = deadline - new Date();
  if (diff < 0) diff = 0;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const mins = Math.floor(diff / (1000 * 60)) % 60;
  const secs = Math.floor(diff / 1000) % 60;

  const values = [days, hours, mins, secs];
  countdownNumbers.forEach(function (box, i) {
    box.textContent = String(values[i]).padStart(2, "0");
  });
}
updateCountdown();
setInterval(updateCountdown, 1000);


// ---------- 4. Contact form validation ----------
const form = document.getElementById("form");

function showError(input, message) {
  input.nextElementSibling.textContent = message;
  return message === "";
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const message = document.getElementById("message");

  const okName = showError(name, name.value.trim().length < 3 ? "Please enter your name." : "");
  const okEmail = showError(email, /^\S+@\S+\.\S+$/.test(email.value) ? "" : "Please enter a valid email.");
  const okMessage = showError(message, message.value.trim().length < 10 ? "Message is too short." : "");

  if (okName && okEmail && okMessage) {
    form.reset();
    document.getElementById("success").textContent = "Thank you! Your message has been sent.";
  }
});


// ---------- 5. GSAP animations ----------
gsap.registerPlugin(ScrollTrigger);

// hero text slides up line by line
gsap.from(".line span", { yPercent: 110, duration: 1.1, stagger: 0.15, ease: "power4.out" });
gsap.from(".hero-bottom", { opacity: 0, y: 20, duration: 0.8, delay: 0.8 });

// everything with class "reveal" fades in when scrolled into view
gsap.utils.toArray(".reveal").forEach(function (item) {
  gsap.from(item, {
    y: 50,
    opacity: 0,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: { trigger: item, start: "top 90%" }
  });
});

document.querySelectorAll(".count").forEach(function (el) {
  const counter = { value: 0 };
  gsap.to(counter, {
    value: Number(el.dataset.end),
    duration: 2,
    ease: "power2.out",
    scrollTrigger: { trigger: el, start: "top 90%", once: true },
    onUpdate: function () {
      const n = Math.round(counter.value);
      el.textContent = el.dataset.end === "1951" ? n : n.toLocaleString();
    }
  });
});


const quiz = document.getElementById("quiz");
const resultBox = document.getElementById("result");
const resultList = document.getElementById("resultList");

const facultyNames = {
  science: "Science", arts: "Arts", pharmacy: "Pharmacy", law: "Law",
  management: "Management", education: "Education",
  islamic: "Islamic Learning", cs: "Computer Science"
};

const answers = {};

quiz.addEventListener("click", function (e) {
  const option = e.target.closest(".option");
  if (!option) return;

  const question = option.parentElement;

  question.querySelectorAll(".option").forEach(function (o) { o.classList.remove("selected"); });
  option.classList.add("selected");
  answers[question.dataset.q] = option.dataset.points;

  if (Object.keys(answers).length === 3) showResult();
});

function showResult() {
  const scores = {};

  Object.values(answers).forEach(function (points) {
    points.split(",").forEach(function (pair) {
      const parts = pair.split(":");
      scores[parts[0]] = (scores[parts[0]] || 0) + Number(parts[1]);
    });
  });

  const top = Object.keys(scores).sort(function (a, b) { return scores[b] - scores[a]; }).slice(0, 2);

  resultList.innerHTML = top.map(function (key, i) {
    return '<div class="result-row"><span class="mono">(0' + (i + 1) + ')</span><h3>' + facultyNames[key] + '</h3></div>';
  }).join("");

  resultBox.classList.add("show");
  gsap.from(".result-row", { y: 30, opacity: 0, stagger: 0.15, duration: 0.6 });
}

document.getElementById("retake").addEventListener("click", function () {
  Object.keys(answers).forEach(function (k) { delete answers[k]; });
  quiz.querySelectorAll(".option").forEach(function (o) { o.classList.remove("selected"); });
  resultBox.classList.remove("show");
});
