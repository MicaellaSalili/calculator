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

  let current = "0";
  let memory = [];
  let operator = null;
  let previousValue = null;
  let equation = ""; 
  let memoryValue = 0;

  function parseInput(value) {
    value = value.toString().trim();
    if (value === "" || value === "Error") return 0;
    return parseFloat(value) || 0;
  }

  function updateDisplay(value) {
    const display = document.getElementById("display");
    display.innerHTML = `
      <div style="font-size: 0.5em; color: gray; text-align: right;">
        ${equation || ""}
      </div>
      <div style="font-size: 1.2em; text-align: right;">
        ${value}
      </div>
    `;
    display.scrollLeft = display.scrollWidth;
  }

  document.querySelector('.top-func:nth-child(1)').addEventListener('click', () => {
    memoryValue = 0;
    updateDisplay('0'); 
  });

  document.querySelector('.top-func:nth-child(2)').addEventListener('click', () => {
    // MR: Recall memory
    updateDisplay(memoryValue);
  });

  document.querySelector('.top-func:nth-child(3)').addEventListener('click', () => {
    // M+: Add to memory
    const currentValue = parseFloat(document.getElementById('display').textContent) || 0;
    memoryValue += currentValue;
    updateDisplay(memoryValue); 
  });

  document.querySelector('.top-func:nth-child(4)').addEventListener('click', () => {
    // M-: Subtract from memory
    const currentValue = parseFloat(document.getElementById('display').textContent) || 0;
    memoryValue -= currentValue;
    updateDisplay(memoryValue);
  });

  document.querySelector('.top-func:nth-child(5)').addEventListener('click', () => {
    // MS: Store current value in memory
    const currentValue = parseFloat(document.getElementById('display').textContent) || 0;
    memoryValue = currentValue;
    updateDisplay(memoryValue); // Show the stored value
  });

  document.querySelector('.top-func:nth-child(6)').addEventListener('click', () => {
    // M∨: View memory
    const display = document.getElementById('display');
    display.innerHTML = `
      <div id="memory-status">
        <div class="memory-item">${memoryValue || 'No memory stored'}</div>
      </div>
    `;
  });

  // Core Calculator Functions
  function calculate(a, b, operator) {
    switch (operator) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "*":
        return a * b;
      case "/":
        return b === 0 ? "Error" : a / b;
      default:
        return 0;
    }
  }

  function performOperation() {
    if (previousValue !== null && operator !== null) {
      const currentValue = parseInput(current);
      const result = calculate(previousValue, currentValue, operator);
      equation = `${previousValue} ${operator} ${currentValue} = ${result}`; // Update the equation with the result

      current = result.toString();
      previousValue = null;
      operator = null;

      updateDisplay(current);
    }
  }

  function toggleSign() {
    const negatedValue = (-parseInput(current)).toString();
    equation = equation.replace(current, negatedValue); // Update the equation with the negated value
    current = negatedValue;
    updateDisplay(current);
  }

  function calculatePercentage() {
    current = (parseInput(current) / 100).toString();
    updateDisplay(current);
  }

  function clearAll() {
    current = "0";
    equation = ""; // Clear the equation
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
    equation = equation.slice(0, -1); // Remove the last character from the equation
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
    memoryDisplay.textContent = ""; 

    memory.forEach((value) => {
      const memoryItem = document.createElement("div");
      memoryItem.className = "memory-item";
      memoryItem.textContent = value.toLocaleString();
      memoryDisplay.appendChild(memoryItem);
    });
  }

  function toggleMemoryDropdown() {
    if (display.getAttribute("data-mode") === "memory") {
      // Restore the original display
      updateDisplay(current);
      display.setAttribute("data-mode", "default");
    } else {
      // Replace the screen content with memory status
      const memoryContent = memory.length
        ? memory
            .map((value) => `<div class="memory-item">${value}</div>`)
            .join("")
        : "<div class='memory-item'>No memory stored</div>";

      display.innerHTML = `
        <div id="memory-status">
          ${memoryContent}
        </div>
      `;
      display.setAttribute("data-mode", "memory");
    }
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
    } else {
      console.warn("No memory to recall."); 
    }
  }

  function memoryAdd() {
    if (operator !== null && previousValue !== null) {
      // If an operator is present, throw an error
      current = "Error";
      updateDisplay(current);
      return;
    }

    const currentValue = parseInput(current);
    if (memory.length > 0) {
      memory[memory.length - 1] += currentValue;
    } else {
      memory.push(currentValue);
    }
    current = "0"; // Clear the current input
    updateDisplay(current); // Update the display to show the cleared state
    updateMemoryStatus();
  }

  function memorySubtract() {
    if (operator !== null && previousValue !== null) {
      // If an operator is present, throw an error
      current = "Error";
      updateDisplay(current);
      return;
    }

    const currentValue = parseInput(current);
    if (memory.length > 0) {
      memory[memory.length - 1] -= currentValue;
    } else {
      memory.push(-currentValue);
    }
    current = "0"; // Clear the current input
    updateDisplay(current); // Update the display to show the cleared state
    updateMemoryStatus();
  }

  function memoryStore() {
    memory.push(parseInput(current));
    updateMemoryStatus();
  }

  function inputDigit(digit) {
    if (current === "0" || current === "Error") {
      current = digit;
    } else {
      current += digit;
    }
    equation += digit; 
    updateDisplay(current);
  }

  function inputDecimal() {
    if (!current.includes(".")) {
      current += ".";
      equation += ".";
      updateDisplay(current);
    }
  }

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
        if (current !== "Error") {
          equation += ` ${value} `;
          previousValue = parseInput(current);
          operator = value;
          current = "0";
        } else {
          performOperation();
          operator = value;
          updateDisplay(value);
        }
      } else if (value === "=") {
        performOperation(); // Use the performOperation function to calculate the result
      } else if (value === "C") {
        clearAll();
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
        default:
          console.error("Unknown memory button action:", value);
      }
      event.stopPropagation(); 
    });
  });

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
    document
      .querySelector(".calculator")
      .classList.toggle("light-mode", isLightMode);
    document
      .querySelectorAll("button")
      .forEach((button) => button.classList.toggle("light-mode", isLightMode));
    document
      .querySelectorAll(".top-func")
      .forEach((button) => button.classList.toggle("light-mode", isLightMode));
    document
      .querySelectorAll("span")
      .forEach((button) => button.classList.toggle("light-mode", isLightMode));
    document
      .querySelectorAll(".modal-content")
      .forEach((modal) => modal.classList.toggle("light-mode", isLightMode));
    document
      .querySelectorAll(".tab-button")
      .forEach((tabButton) =>
        tabButton.classList.toggle("light-mode", isLightMode)
      );
    document
      .querySelectorAll(".tab-content")
      .forEach((tabContent) =>
        tabContent.classList.toggle("light-mode", isLightMode)
      );
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
    document
      .querySelector(".calculator")
      .classList.toggle("light-mode", isLightMode);
    document
      .querySelectorAll("button")
      .forEach((button) => button.classList.toggle("light-mode", isLightMode));
    document
      .querySelectorAll(".top-func")
      .forEach((button) => button.classList.toggle("light-mode", isLightMode));
    document
      .querySelectorAll("span")
      .forEach((button) => button.classList.toggle("light-mode", isLightMode));
    document
      .querySelectorAll(".modal-content")
      .forEach((modal) => modal.classList.toggle("light-mode", isLightMode));
    document
.querySelectorAll(".tab-button").forEach((tabButton) =>tabButton.classList.toggle("light-mode", isLightMode));
    document.querySelectorAll(".tab-content").forEach((tabContent) => tabContent.classList.toggle("light-mode", isLightMode));
  });

  function saveSettings() {
    const fontSize = fontSizeInput.value;
    const isLightMode = document.getElementById("lightMode").checked;
    localStorage.setItem("fontSize", fontSize);
    localStorage.setItem("lightMode", isLightMode);
  }
  saveSettingsButton.addEventListener("click", saveSettings);

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
