const API_BASE = "https://api.example.com/currencies/latest";

const selectors = document.querySelectorAll(".currency-selector select");
const submitBtn = document.querySelector("form button");
const fromSelect = document.querySelector(".from select");
const toSelect = document.querySelector(".to select");
const message = document.querySelector(".message");

for (let select of selectors) {
  for (let code in currencyData) {
    let newOption = createOption(code);
    if (select.name === "from" && code === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && code === "INR") {
      newOption.selected = true;
    }
    select.appendChild(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlagImage(evt.target);
  });
}

function createOption(code) {
  let newOption = document.createElement("option");
  newOption.innerText = code;
  newOption.value = code;
  return newOption;
}

const fetchExchangeRate = async () => {
  let amountInput = document.querySelector(".amount input");
  let amountValue = amountInput.value || 1;

  const apiUrl = `${API_BASE}/${fromSelect.value.toLowerCase()}/${toSelect.value.toLowerCase()}`;
  try {
    let response = await fetch(apiUrl);
    let data = await response.json();
    let rate = data[toSelect.value.toLowerCase()];

    let finalAmount = amountValue * rate;
    updateMessage(
      `${amountValue} ${fromSelect.value} = ${finalAmount} ${toSelect.value}`
    );
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    updateMessage("Error fetching data");
  }
};

function updateMessage(text) {
  message.innerText = text;
}

const updateFlagImage = (element) => {
  let currencyCode = element.value;
  let countryCode = currencyData[currencyCode];
  let flagSource = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let flagImg = element.parentElement.querySelector("img");
  flagImg.src = flagSource;
};

submitBtn.addEventListener("click", (evt) => {
  evt.preventDefault();
  fetchExchangeRate();
});

window.addEventListener("load", () => {
  fetchExchangeRate();
});
