const display = document.getElementById("display");
const buttons = document.querySelectorAll(".buttons button");
const modeButtons = document.querySelectorAll(".mode");

let current = "0";
let memory = 0;
let operator = null;
let inputMode = "DEC";

const parseInput = (value) => {
  switch (inputMode) {
    case "BIN": return parseInt(value, 2);
    case "OCT": return parseInt(value, 8);
    case "HEX": return parseInt(value, 16);
    default: return parseFloat(value);
  }
};

const formatOutput = (value) => {
  switch (inputMode) {
    case "BIN": return Math.floor(value).toString(2);
    case "OCT": return Math.floor(value).toString(8);
    case "HEX": return Math.floor(value).toString(16).toUpperCase();
    default: return value.toString();
  }
};

modeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    inputMode = btn.textContent;
    current = "0";
    memory = 0;
    operator = null;
    display.textContent = current;
  });
});

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const value = btn.textContent;

    if (!isNaN(value) || (inputMode === "HEX" && /^[A-F]$/.test(value)) || value === ".") {
      current = current === "0" ? value : current + value;
    } else if (["C", "CE"].includes(value)) {
      current = "0";
    } else if (value === "⌫") {
      current = current.slice(0, -1) || "0";
    } else if (["+", "-", "x", "÷"].includes(value)) {
      memory = parseInput(current);
      operator = value;
      current = "";
    } else if (value === "=") {
      let result = 0;
      switch (operator) {
        case "+": result = memory + parseInput(current); break;
        case "-": result = memory - parseInput(current); break;
        case "x": result = memory * parseInput(current); break;
        case "÷": result = memory / parseInput(current); break;
      }
      current = formatOutput(result);
    } else if (value === "+/-") {
      current = formatOutput(parseInput(current) * -1);
    }

    display.textContent = current;
  });
});
