const display = document.getElementById("display");

let expression = "";

// Update display
function updateDisplay() {
  display.value = expression || "0";
}

// Add input
function append(value) {
  if (value === "." && getLastNumber().includes(".")) return;
  expression += value;
  updateDisplay();
}

// Get last number (for decimal control)
function getLastNumber() {
  let parts = expression.split(/[\+\-\*\/]/);
  return parts[parts.length - 1];
}

// Set operator
function setOperator(op) {
  if (expression === "") return;

  let lastChar = expression.slice(-1);

  if ("+-*/".includes(lastChar)) {
    expression = expression.slice(0, -1) + op;
  } else {
    expression += op;
  }

  updateDisplay();
}

// Clear
function clearDisplay() {
  expression = "";
  updateDisplay();
}

// Delete last
function deleteLast() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

// Percentage logic
function percentage() {
  if (expression === "") return;

  let num = parseFloat(getLastNumber());
  let percent = num / 100;

  expression = expression.replace(/(\d+\.?\d*)$/, percent);
  updateDisplay();
}

// Calculate (safe parser)
function calculate() {
  try {
    let result = compute(expression);
    expression = result.toString();
    updateDisplay();
  } catch {
    display.value = "Error";
    expression = "";
  }
}

// Custom calculation logic
function compute(exp) {
  let tokens = exp.match(/(\d+\.?\d*|[\+\-\*\/])/g);

  // First pass (* and /)
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === "*" || tokens[i] === "/") {
      let a = parseFloat(tokens[i - 1]);
      let b = parseFloat(tokens[i + 1]);
      let result = tokens[i] === "*" ? a * b : a / b;

      tokens.splice(i - 1, 3, result.toString());
      i--;
    }
  }

  // Second pass (+ and -)
  let result = parseFloat(tokens[0]);

  for (let i = 1; i < tokens.length; i += 2) {
    let op = tokens[i];
    let num = parseFloat(tokens[i + 1]);

    if (op === "+") result += num;
    if (op === "-") result -= num;
  }

  return result;
}

updateDisplay();


// ⌨️ Keyboard support
document.addEventListener("keydown", (e) => {
  if (!isNaN(e.key)) append(e.key);
  if (e.key === ".") append(".");
  if (["+", "-", "*", "/"].includes(e.key)) setOperator(e.key);
  if (e.key === "Enter") calculate();
  if (e.key === "Backspace") deleteLast();
  if (e.key === "Escape") clearDisplay();
});