document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("display");
  const memoryStatus = document.getElementById("memory-status");
  const buttons = document.querySelectorAll(".buttons button");
  const memoryButtons = document.querySelectorAll(".memory-buttons button");
  const menuToggle = document.querySelector(".menu-toggle");
  const modal = document.getElementById("modal");
  const closeModal = document.querySelector(".close");
  const fontSizeInput = document.getElementById("fontSize");
  const saveSettingsButton = document.querySelector("#settings button");
  const screen = document.querySelector(".screen");

  // Calculator State
  let current = "0";
  let memory = [];
  let operator = null; 
  let previousValue = null; 

  // Utility Functions
  function parseInput(value) {
    value = value.toString().trim();
    if (value === "" || value === "Error") return 0;
    return parseFloat(value) || 0; 
  }

  function updateDisplay(value) {
    display.textContent = value;
    display.scrollLeft = display.scrollWidth; 
  }

  // Core Calculator Functions
  function performOperation() {
    if (previousValue !== null && operator !== null) {
      const currentValue = parseInput(current);
      switch (operator) {
        case "+":
          current = (previousValue + currentValue).toString();
          break;
        case "-":
          current = (previousValue - currentValue).toString();
          break;
        case "*":
          current = (previousValue * currentValue).toString();
          break;
        case "/":
          current =
            currentValue === 0
              ? "Error"
              : (previousValue / currentValue).toString();
          break;
      }
      previousValue = null;
      operator = null;
      updateDisplay(current);
    }
  }

  function toggleSign() {
    current = (-parseInput(current)).toString();
    updateDisplay(current);
  }

  function calculatePercentage() {
    current = (parseInput(current) / 100).toString();
    updateDisplay(current);
  }

  function clearAll() {
    current = "0";
    previousValue = null;
    operator = null;
    updateDisplay(current);
  }

  function clearEntry() {
    current = "0";
    updateDisplay(current);
  }

  function deleteLastDigit() {
    current = current.slice(0, -1) || "0";
    updateDisplay(current);
  }

  // Conversion Functions
  function convertToBinary() {
    current = parseInt(parseInput(current)).toString(2);
    updateDisplay(current);
  }

  function convertToOctal() {
    current = parseInt(parseInput(current)).toString(8);
    updateDisplay(current);
  }

  function convertToHex() {
    current = parseInt(parseInput(current)).toString(16).toUpperCase();
    updateDisplay(current);
  }

  // Memory Functions
  function updateMemoryStatus() {
    const memoryDisplay = document.getElementById("memory-display");
    memoryDisplay.textContent = ""; // Clear existing content

    memory.forEach((value) => {
      const memoryItem = document.createElement("div");
      memoryItem.className = "memory-item";
      memoryItem.textContent = value.toLocaleString();
      memoryDisplay.appendChild(memoryItem);
    });
  }

  function toggleMemoryDropdown() {
    const dropdown = document.getElementById("memory-status");
    dropdown.style.display =
      dropdown.style.display === "block" ? "none" : "block";
    if (dropdown.style.display === "block") updateMemoryStatus();
  }

  function hideMemoryDropdown() {
    const dropdown = document.getElementById("memory-status");
    dropdown.style.display = "none";
  }

  function memoryClear() {
    memory = [];
    updateMemoryStatus();
  }

  function memoryRecall() {
    if (memory.length > 0) {
      current = memory[memory.length - 1].toString();
      updateDisplay(current);
    }
  }

  function memoryAdd() {
    if (memory.length > 0) {
      memory[memory.length - 1] += parseInput(current);
    } else {
      memory.push(parseInput(current));
    }
    updateMemoryStatus();
  }

  function memorySubtract() {
    if (memory.length > 0) {
      memory[memory.length - 1] -= parseInput(current);
    } else {
      memory.push(-parseInput(current));
    }
    updateMemoryStatus();
  }

  function memoryStore() {
    memory.push(parseInput(current));
    updateMemoryStatus();
  }

  // Input Functions
  function inputDigit(digit) {
    current = current === "0" || current === "Error" ? digit : current + digit;
    updateDisplay(current);
  }

  function inputDecimal() {
    if (!current.includes(".")) {
      current += ".";
      updateDisplay(current);
    }
  }

  // Event Listeners for Buttons
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.textContent.trim();
      if (!isNaN(value)) {
        inputDigit(value);
      } else if (value === ".") {
        inputDecimal();
      } else if (value === "CE") {
        clearEntry();
      } else if (value === "C") {
        clearAll();
      } else if (value === "⌫") {
        deleteLastDigit();
      } else if (value === "+/-") {
        toggleSign();
      } else if (value === "%") {
        calculatePercentage();
      } else if (value === "BIN") {
        convertToBinary();
      } else if (value === "OCT") {
        convertToOctal();
      } else if (value === "HEX") {
        convertToHex();
      } else if (["+", "-", "*", "/"].includes(value)) {
        if (previousValue === null) {
          previousValue = parseInput(current);
          operator = value;
          current = "0";
        } else {
          performOperation();
          operator = value;
        }
      } else if (value === "=") {
        performOperation();
      }
    });
  });

  memoryButtons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const value = btn.textContent.trim();
      switch (value) {
        case "MC":
          memoryClear();
          break;
        case "MR":
          memoryRecall();
          break;
        case "M+":
          memoryAdd();
          break;
        case "M-":
          memorySubtract();
          break;
        case "MS":
          memoryStore();
          break;
        case "M∨":
          toggleMemoryDropdown();
          break;
      }
      event.stopPropagation();
    });
  });

  // Modal and Settings
  menuToggle.addEventListener("click", () => (modal.style.display = "block"));
  closeModal.addEventListener("click", () => (modal.style.display = "none"));
  window.addEventListener("click", (event) => {
    if (event.target === modal) modal.style.display = "none";
  });

  function loadSettings() {
    const fontSize = localStorage.getItem("fontSize") || "36";
    const isLightMode = localStorage.getItem("lightMode") === "true";
    fontSizeInput.value = fontSize;
    applyFontSize(fontSize);
    document.getElementById("lightMode").checked = isLightMode;
    document.body.classList.toggle("light-mode", isLightMode);
    document.querySelector(".calculator").classList.toggle("light-mode", isLightMode);
    document.querySelectorAll("span").forEach(button => button.classList.toggle("light-mode", isLightMode));
    document.querySelectorAll("button").forEach(button => button.classList.toggle("light-mode", isLightMode));
    document.querySelectorAll(".top-func").forEach(button => button.classList.toggle("light-mode", isLightMode));
    document.querySelectorAll(".modal-content").forEach(modal => modal.classList.toggle("light-mode", isLightMode));
    document.querySelectorAll(".tab-button").forEach(tabButton => tabButton.classList.toggle("light-mode", isLightMode));
    document.querySelectorAll(".tab-content").forEach(tabContent => tabContent.classList.toggle("light-mode", isLightMode));
    document.querySelector("#settings button").classList.toggle("light-mode", isLightMode);
    document.querySelector("body").classList.toggle("light-mode", isLightMode);
  }

  function applyFontSize(fontSize) {
    screen.style.fontSize = `${fontSize}px`;
  }

  fontSizeInput.addEventListener("input", () => {
    const fontSize = fontSizeInput.value;
    applyFontSize(fontSize);
  });

  document.getElementById("lightMode").addEventListener("change", (e) => {
    const isLightMode = e.target.checked;
    document.body.classList.toggle("light-mode", isLightMode);
    document.querySelector(".calculator").classList.toggle("light-mode", isLightMode);
    document.querySelectorAll("span").forEach(button => button.classList.toggle("light-mode", isLightMode));
    document.querySelectorAll("button").forEach(button => button.classList.toggle("light-mode", isLightMode));
    document.querySelectorAll(".top-func").forEach(button => button.classList.toggle("light-mode", isLightMode));
    document.querySelectorAll(".modal-content").forEach(modal => modal.classList.toggle("light-mode", isLightMode));
    document.querySelectorAll(".tab-button").forEach(tabButton => tabButton.classList.toggle("light-mode", isLightMode));
    document.querySelectorAll(".tab-content").forEach(tabContent => tabContent.classList.toggle("light-mode", isLightMode));
    document.querySelector("#settings button").classList.toggle("light-mode", isLightMode);
    document.querySelector(".body").classList.toggle("light-mode", isLightMode);
  });

  function saveSettings() {
    const fontSize = fontSizeInput.value;
    const isLightMode = document.getElementById("lightMode").checked;
    localStorage.setItem("fontSize", fontSize);
    localStorage.setItem("lightMode", isLightMode);
    alert("Settings saved!");
  }

  saveSettingsButton.addEventListener("click", saveSettings);

  // Tab Navigation
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => {
      const tabId = button.getAttribute("data-tab");
      openTab(tabId);
    });
  });

  function openTab(tabId) {
    document.querySelectorAll(".tab-content").forEach((tab) => {
      tab.style.display = "none";
    });
    document.querySelectorAll(".tab-button").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.getElementById(tabId).style.display = "block";
    document
      .querySelector(`.tab-button[data-tab="${tabId}"]`)
      .classList.add("active");
  }

  loadSettings();
  updateDisplay(current);
  updateMemoryStatus();
  openTab("help");
});
