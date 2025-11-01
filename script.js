// SELECTORS
let addBtn = document.querySelector("#addBtn");
let formCard = document.querySelector(".form-card");
let profileCard = document.querySelector(".profile-card");
let closeFormBtn = document.querySelector("#closeFormBtn");
let controlLeft = document.querySelector(".controls-left");
let callForm = document.querySelector("#callForm");
let cardList = document.querySelector(".card-list");
let colorIndicator = document.querySelector(".color-indicators");
let prevBtn = document.querySelector("#prevBtn");
let nextBtn = document.querySelector("#nextBtn");

let imageUrl = document.querySelector("#imageUrl");
let fullName = document.querySelector("#fullName");
let homeTown = document.querySelector("#homeTown");
let purpose = document.querySelector("#purpose");

let createBtn = document.querySelector(".btn-create");

let currentIndex = 0;  // Tracks current top card
let allTasks = [];     // All tasks loaded from localStorage


// Show the form on Add button
addBtn.addEventListener("click", function () {
  cardList.style.display = "none";
  formCard.style.display = "block";
  controlLeft.style.display = "none";
  colorIndicator.style.display = "none";
});

// Hide form on Close button
closeFormBtn.addEventListener("click", function () {
  formCard.style.display = "none";
  cardList.style.display = "block";
  controlLeft.style.display = "flex";
  colorIndicator.style.display = "initial";
});

// Validate URL format
function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Validate form fields
function validateForm() {
  let isValid = true;
  if (imageUrl.value.trim() === "") {
    showError(imageUrl, "Image URL is required");
    isValid = false;
  } else if (!isValidURL(imageUrl.value.trim())) {
    showError(imageUrl, "Please enter a valid URL");
    isValid = false;
  } else {
    removeError(imageUrl);
  }

  if (fullName.value.trim() === "") {
    showError(fullName, "Full name is required");
    isValid = false;
  } else if (fullName.value.trim().length < 2) {
    showError(fullName, "Name must be at least 2 characters");
    isValid = false;
  } else {
    removeError(fullName);
  }

  if (homeTown.value.trim() === "") {
    showError(homeTown, "Home town is required");
    isValid = false;
  } else {
    removeError(homeTown);
  }

  if (purpose.value.trim() === "") {
    showError(purpose, "Purpose is required");
    isValid = false;
  } else {
    removeError(purpose);
  }

  if (isValid) {
    createBtn.disabled = false;
    createBtn.style.opacity = "1";
    createBtn.style.cursor = "pointer";
  } else {
    createBtn.disabled = true;
    createBtn.style.opacity = "0.5";
    createBtn.style.cursor = "not-allowed";
  }

  return isValid;
}

// Show error message
function showError(input, message) {
  input.style.borderColor = "#ef4444";
  let existingError = input.parentElement.querySelector(".error-message");
  if (existingError) existingError.remove();

  let errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;
  errorDiv.style.color = "#ef4444";
  errorDiv.style.fontSize = "12px";
  errorDiv.style.marginTop = "4px";
  input.parentElement.appendChild(errorDiv);
}

// Remove error message
function removeError(input) {
  input.style.borderColor = "#e0e0e0";
  let existingError = input.parentElement.querySelector(".error-message");
  if (existingError) existingError.remove();
}

// Real-time validation on input
formCard.addEventListener("input", function () {
  validateForm();
});

[imageUrl, fullName, homeTown, purpose].forEach(input => {
  input.addEventListener("blur", function () {
    validateForm();
  });
});

// Initial disabled state
createBtn.disabled = true;
createBtn.style.opacity = "0.5";
createBtn.style.cursor = "not-allowed";

// Save to localStorage
function savetoLocalStorage(obj) {
  if (localStorage.getItem("tasks") === null) {
    let oldTask = [];
    oldTask.push(obj);
    localStorage.setItem("tasks", JSON.stringify(oldTask));
  } else {
    let oldTask = localStorage.getItem("tasks");
    oldTask = JSON.parse(oldTask);
    oldTask.push(obj);
    localStorage.setItem("tasks", JSON.stringify(oldTask));
  }
}

// Form submit handler
callForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (validateForm()) {
    let formData = {
      imageUrl: imageUrl.value.trim(),
      fullName: fullName.value.trim(),
      homeTown: homeTown.value.trim(),
      purpose: purpose.value.trim(),
      category: document.querySelector('input[name="category"]:checked').value,
    };

    savetoLocalStorage(formData);

    // Reset form and UI
    callForm.reset();
    formCard.style.display = "none";
    cardList.style.display = "block";
    controlLeft.style.display = "flex";
    colorIndicator.style.display = "initial";

    alert("Call note created successfully!");

    loadTasksAndRender();
  }
});

// Render cards stack with currentIndex
function showCards(baseIndex) {
  cardList.innerHTML = "";
  if (allTasks.length === 0) return;

  // Show up to 3 cards starting at baseIndex downward
  for (let offset = 0; offset < 3; offset++) {
    const i = baseIndex - offset;
    if (i < 0) break;

    const task = allTasks[i];
    const cardWrapper = document.createElement("div");
    cardWrapper.classList.add("card-wrapper");

    // Build card content
    const profileCard = document.createElement("div");
    profileCard.classList.add("profile-card");

    const profileHeader = document.createElement("div");
    profileHeader.classList.add("profile-header");

    const avatar = document.createElement("div");
    avatar.classList.add("avatar");
    const img = document.createElement("img");
    img.src = task.imageUrl || "https://via.placeholder.com/64";
    img.alt = task.fullName || "Profile";
    avatar.appendChild(img);

    const name = document.createElement("h1");
    name.classList.add("name");
    name.textContent = task.fullName;

    profileHeader.appendChild(avatar);
    profileHeader.appendChild(name);

    // Profile info
    const profileInfo = document.createElement("div");
    profileInfo.classList.add("profile-info");

    const infoRow1 = document.createElement("div");
    infoRow1.classList.add("info-row");

    const label1 = document.createElement("span");
    label1.classList.add("label");
    label1.textContent = "Home town";

    const value1 = document.createElement("span");
    value1.classList.add("value");
    value1.textContent = task.homeTown;

    infoRow1.appendChild(label1);
    infoRow1.appendChild(value1);

    const infoRow2 = document.createElement("div");
    infoRow2.classList.add("info-row");

    const label2 = document.createElement("span");
    label2.classList.add("label");
    label2.textContent = "Bookings";

    const value2 = document.createElement("span");
    value2.classList.add("value");
    value2.textContent = task.category;

    infoRow2.appendChild(label2);
    infoRow2.appendChild(value2);

    profileInfo.appendChild(infoRow1);
    profileInfo.appendChild(infoRow2);

    // Actions
    const actions = document.createElement("div");
    actions.classList.add("actions");

    const callBtn = document.createElement("button");
    callBtn.classList.add("btn", "btn-primary");
    callBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
      </svg> Call`;

    const messageBtn = document.createElement("button");
    messageBtn.classList.add("btn", "btn-secondary");
    messageBtn.textContent = "Message";

    actions.appendChild(callBtn);
    actions.appendChild(messageBtn);

    profileCard.appendChild(profileHeader);
    profileCard.appendChild(profileInfo);
    profileCard.appendChild(actions);

    cardWrapper.appendChild(profileCard);

    // Styling for stacking and animation
    cardWrapper.style.position = "absolute";
    cardWrapper.style.left = 0;
    cardWrapper.style.top = 0;
    cardWrapper.style.width = "100%";
    cardWrapper.style.zIndex = 3 - offset;
    cardWrapper.style.transform = `translateY(${offset * 20}px) scale(${1 - offset * 0.04})`;
    cardWrapper.style.boxShadow = offset === 0 ? "0 10px 40px rgba(0,0,0,0.10)" : "none";
    cardWrapper.style.opacity = "1";

    cardList.appendChild(cardWrapper);
  }
}

// Show previous card
function showPrevious() {
  if(allTasks.length === 0) return;
  currentIndex = (currentIndex - 1 + allTasks.length) % allTasks.length;
  showCards(currentIndex);
}

// Show next card
function showNext() {
  if(allTasks.length === 0) return;
  currentIndex = (currentIndex + 1) % allTasks.length;
  showCards(currentIndex);
}

// Load tasks initially and show cards
function loadTasksAndRender() {
  allTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  currentIndex = allTasks.length - 1; // show latest card on load
  showCards(currentIndex);
}

// Setup prev/next click handlers
prevBtn.addEventListener("click", showPrevious);
nextBtn.addEventListener("click", showNext);

// Initial load
loadTasksAndRender();
