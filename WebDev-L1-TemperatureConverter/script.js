
const form = document.getElementById("converter-form");
const temperatureInput = document.getElementById("temperature");
const fromUnit = document.getElementById("from-unit");
const toUnit = document.getElementById("to-unit");
const swapButton = document.getElementById("swap-units");

const errorMessage = document.getElementById("error-message");
const resultValue = document.getElementById("result-value");
const resultUnit = document.getElementById("result-unit");
const resultDescription = document.getElementById("result-description");

const unitNames = {
  C: "Celsius",
  F: "Fahrenheit",
  K: "Kelvin"
};

const unitSymbols = {
  C: "°C",
  F: "°F",
  K: "K"
};

// Convert any supported unit to Celsius first.
function toCelsius(value, unit) {
  if (unit === "C") return value;
  if (unit === "F") return (value - 32) * 5 / 9;
  return value - 273.15;
}

// Convert Celsius to the requested unit.
function fromCelsius(value, unit) {
  if (unit === "C") return value;
  if (unit === "F") return value * 9 / 5 + 32;
  return value + 273.15;
}

function formatNumber(value) {
  // Avoid displaying negative zero caused by floating-point rounding.
  if (Math.abs(value) < 0.0000000001) value = 0;

  return Number(value.toFixed(6)).toLocaleString("en-US", {
    maximumFractionDigits: 6,
    useGrouping: false
  });
}

function showError(message) {
  errorMessage.textContent = message;
  resultValue.textContent = "—";
  resultUnit.textContent = unitSymbols[toUnit.value];
  resultDescription.textContent = "Please correct the input and try again.";
}

function clearError() {
  errorMessage.textContent = "";
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  clearError();

  const rawValue = temperatureInput.value.trim();
  const value = Number(rawValue);
  const sourceUnit = fromUnit.value;
  const targetUnit = toUnit.value;

  if (rawValue === "" || !Number.isFinite(value)) {
    showError("Please enter a valid numeric temperature.");
    temperatureInput.focus();
    return;
  }

  // Absolute zero is 0 K, or -273.15 °C.
  const celsiusValue = toCelsius(value, sourceUnit);

  if (celsiusValue < -273.15 - 0.000000001) {
    showError("Temperature cannot be below absolute zero (-273.15 °C).");
    temperatureInput.focus();
    return;
  }

  // Normalize tiny floating-point differences at absolute zero.
  const safeCelsius = Math.max(-273.15, celsiusValue);
  const convertedValue = fromCelsius(safeCelsius, targetUnit);

  resultValue.textContent = formatNumber(convertedValue);
  resultUnit.textContent = unitSymbols[targetUnit];
  resultDescription.textContent =
    `${formatNumber(value)} ${unitSymbols[sourceUnit]} = ` +
    `${formatNumber(convertedValue)} ${unitSymbols[targetUnit]}`;

  clearError();
});

swapButton.addEventListener("click", function () {
  const previousFrom = fromUnit.value;

  fromUnit.value = toUnit.value;
  toUnit.value = previousFrom;

  // Recalculate using the swapped units if an input exists.
  if (temperatureInput.value.trim() !== "") {
    form.requestSubmit();
  } else {
    clearError();
    resultValue.textContent = "—";
    resultUnit.textContent = unitSymbols[toUnit.value];
    resultDescription.textContent = "Enter a temperature to convert.";
  }
});

// Keep the displayed result unit in sync with the selected target.
toUnit.addEventListener("change", function () {
  clearError();
  resultUnit.textContent = unitSymbols[toUnit.value];

  if (temperatureInput.value.trim() !== "") {
    form.requestSubmit();
  } else {
    resultValue.textContent = "—";
    resultDescription.textContent = "Enter a temperature to convert.";
  }
});

fromUnit.addEventListener("change", function () {
  clearError();

  if (temperatureInput.value.trim() !== "") {
    form.requestSubmit();
  } else {
    resultValue.textContent = "—";
    resultUnit.textContent = unitSymbols[toUnit.value];
    resultDescription.textContent = "Enter a temperature to convert.";
  }
});
