const pizzaImage = document.getElementById("pizza-image");
const toppingImages = document.querySelectorAll(".toppings-list img");
const pizzaSizeSelect = document.getElementById("pizza-size");
const recipeList = document.getElementById("recipe-list");
const pizzaTotal = document.getElementById("pizza-total");
const placeOrderButton = document.getElementById("place-order");
const pizzaBoxOpen = document.getElementById("pizza-box-open");
const pizzaBoxClosed = document.getElementById("pizza-box-closed");
const pizzaContainer = document.getElementById("pizza-container");

const selectedToppings = {
  sauce: false,
  cheese: false,
  extras: [],
};

pizzaSizeSelect.value = "medium";

const ingredientPrices = {
  dough: 5,
  sauce: 2,
  cheese: 3,
  pepperoni: 5,
  sausage: 5,
  "bell-pepper": 3,
  olives: 4,
  fungi: 4,
};

const pizzaSizePrices = {
  small: 0,
  medium: 5,
  large: 9,
};

const comboMap = {
  pepperoni: "img/pepperoni-pizza.png",
  sausage: "img/sausage-pizza.png",
  "bell-pepper": "img/bell-pepper-pizza.png",
  olives: "img/olive-pizza.png",
  fungi: "img/special-pizza.png",

  "pepperoni-sausage": "img/classic-meat-pizza.png",
  "bell-pepper-pepperoni": "img/bell-pepper-pepperoni-pizza.png",
  "bell-pepper-sausage": "img/bell-pepper-sausage-olive-pizza.png",
  "bell-pepper-olives": "img/bell-pepper-sausage-olive-pizza.png",
  "pepperoni-olives": "img/pepperoni-olive-pizza.png",
  "sausage-olives": "img/sausage-olive-pizza.png",

  "bell-pepper-pepperoni-sausage":
    "img/bell-pepper-pepperoni-sausage-pizza.png",
  "bell-pepper-pepperoni-olives": "img/bell-pepper-pepperoni-olive-pizza.png",
  "bell-pepper-sausage-olives": "img/bell-pepper-sausage-olive-pizza.png",
  "pepperoni-sausage-olives": "img/supreme-pizza.png",
  "bell-pepper-pepperoni-sausage-olives": "img/supreme-pizza.png",

  "sausage-olives-fungi": "img/bell-pepper-sausage-olive-fungi-pizza.png",
  "bell-pepper-sausage-olives-fungi":
    "img/bell-pepper-sausage-olive-fungi-pizza.png",
  "bell-pepper-pepperoni-olives-fungi": "img/special-pizza.png",
  "bell-pepper-pepperoni-sausage-olives-fungi": "img/special-pizza.png",
};

const toppingOrder = ["bell-pepper", "pepperoni", "sausage", "olives", "fungi"];

function normalizeExtras(extras) {
  return [...extras].sort(function (a, b) {
    return toppingOrder.indexOf(a) - toppingOrder.indexOf(b);
  });
}

function getRecipeItems() {
  const recipe = [{ name: "Dough", price: ingredientPrices.dough }];

  if (selectedToppings.sauce) {
    recipe.push({ name: "Tomato sauce", price: ingredientPrices.sauce });
  }

  if (selectedToppings.cheese) {
    recipe.push({ name: "Cheese", price: ingredientPrices.cheese });
  }

  selectedToppings.extras.forEach(function (topping) {
    const label = topping
      .split("-")
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");

    recipe.push({ name: label, price: ingredientPrices[topping] });
  });

  return recipe;
}

function updateRecipe() {
  const recipe = getRecipeItems();
  const total = recipe.reduce(function (sum, item) {
    return sum + item.price;
  }, 0);

  const pizzaSizeTotal = pizzaSizePrices[pizzaSizeSelect.value] || 0;
  const grandTotal = total + pizzaSizeTotal + 3;

  recipeList.innerHTML = "";
  recipe.forEach(function (item) {
    const li = document.createElement("li");
    const nameSpan = document.createElement("span");
    nameSpan.textContent = item.name;
    const priceSpan = document.createElement("span");
    priceSpan.textContent = `$${item.price.toFixed(2)}`;
    li.appendChild(nameSpan);
    li.appendChild(priceSpan);
    recipeList.appendChild(li);
  });

  pizzaTotal.textContent = `Total: $${grandTotal.toFixed(2)}`;
}

function updatePizza() {
  if (!selectedToppings.sauce) {
    pizzaImage.src = "img/dough.png";
    return;
  }

  if (!selectedToppings.cheese) {
    pizzaImage.src = "img/sauce-pizza.png";
    return;
  }

  if (selectedToppings.extras.length === 0) {
    pizzaImage.src = "img/cheese-pizza.png";
    return;
  }

  const extrasKey = normalizeExtras(selectedToppings.extras).join("-");
  pizzaImage.src = comboMap[extrasKey] || "img/all-in-one-pizza.png";
}

toppingImages.forEach(function (image) {
  image.addEventListener("click", function () {
    const topping = image.id;

    if (topping === "tomato-sauce") {
      selectedToppings.sauce = !selectedToppings.sauce;

      if (!selectedToppings.sauce) {
        selectedToppings.cheese = false;
        selectedToppings.extras = [];
      }

      updatePizza();
      updateRecipe();
      return;
    }

    if (topping === "cheese") {
      if (!selectedToppings.sauce) {
        return;
      }

      selectedToppings.cheese = !selectedToppings.cheese;

      if (!selectedToppings.cheese) {
        selectedToppings.extras = [];
      }

      updatePizza();
      updateRecipe();
      return;
    }

    if (!selectedToppings.sauce || !selectedToppings.cheese) {
      alert("Please add tomato sauce and cheese first.");
      return;
    }

    const index = selectedToppings.extras.indexOf(topping);

    if (index >= 0) {
      selectedToppings.extras.splice(index, 1);
    } else {
      selectedToppings.extras.push(topping);
    }

    updatePizza();
    updateRecipe();
  });
});

pizzaSizeSelect.addEventListener("change", updateRecipe);

placeOrderButton.addEventListener("click", function () {
  const status = document.createElement("p");
  status.textContent = "Your pizza is on the way!";
  status.style.color = "#9f251f";
  status.style.fontWeight = "bold";
  status.style.marginTop = "12px";

  const existingStatus = document.getElementById("delivery-status");
  if (existingStatus) {
    existingStatus.remove();
  }

  status.id = "delivery-status";
  placeOrderButton.insertAdjacentElement("afterend", status);
});

pizzaContainer.addEventListener("click", function () {
  const isOpenVisible = window.getComputedStyle(pizzaBoxOpen).display !== "none";

  pizzaBoxOpen.style.display = isOpenVisible ? "none" : "block";
  pizzaBoxClosed.style.display = isOpenVisible ? "block" : "none";
});

updateRecipe();
updatePizza();
