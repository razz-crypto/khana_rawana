const SUPABASE_URL = "https://gbxsvtgywvriqamealjd.supabase.co";
const SUPABASE_KEY = "sb_publishable_QibRh0OGQlnj0xYsrPVmiA_4BkDQH1a";
let cart = [];
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      name: name,
      price: price,
      quantity: 1
    });
  }

  updateCart();
  alert(name + " added to your cart!");
}

function updateCart() {
  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  document.getElementById("cartCount").textContent =
    totalItems;
}

function showCart() {
  if (cart.length === 0) {
    alert("Your cart is empty! Please select some food.");
    return;
  }

  let message = "YOUR KHANA RAWANA ORDER\n\n";
  let total = 0;

  cart.forEach(item => {
    const amount = item.price * item.quantity;
    total += amount;

    message += item.name + " x " + item.quantity +
      " = ₹" + amount + "\n";
  });

  message += "\nTotal Amount: ₹" + total;
  alert(message);
}

function filterFood(category) {
  const cards = document.querySelectorAll(".food-card");

  cards.forEach(card => {
    const matches =
      category === "all" ||
      card.dataset.category === category;

    card.classList.toggle("hidden", !matches);
  });
}
document.getElementById("orderForm")
  .addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const payment = document.getElementById("payment").value;

    const items = cart.map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const message = document.getElementById("orderMessage");

    const { error } = await supabase
      .from("orders")
      .insert([{
        customer_name: name,
        phone: phone,
        address: address,
        items: items,
        total_amount: total,
        status: "pending"
      }]);

    if (error) {
      console.error(error);
      message.textContent = "Order save nahi hua. Dobara try karein.";
      return;
    }

    message.textContent =
      "Thank you, " + name + "! Aapka order successfully place ho gaya.";

    cart = [];
    updateCart();
  });
