// product model dropdown 
const productModels = [
  "IPhone 13 Pro Max/256GB/Black",
  "IPhone 13 Pro Max/256GB/Silver",
  "IPhone 13 Pro Max/512GB/Black",
  "IPhone 13 Pro Max/512GB/Silver",
  "Samsung Galaxy S22 Ultra/128GB/Black",
  "Samsung Galaxy S22 Ultra/128GB/Phantom Silver",
  "Samsung Galaxy S22 Ultra/256GB/Black",
  "Samsung Galaxy S22 Ultra/256GB/Phantom Silver",
  "Samsung Galaxy S22/128GB/Black",
  "Samsung Galaxy S22/128GB/Phantom Silver",
  "Samsung Galaxy S22/256GB/Black",
  "Samsung Galaxy S22/256GB/Phantom Silver",
  "Sony Xperia 1 III/256GB/Black",
  "Sony Xperia 1 III/256GB/Frosted Purple",
  "Sony Xperia 5 III/128GB/Black",
  "Sony Xperia 5 III/128GB/Pink",
  "Google Pixel 6 Pro/128GB/Stormy Black",
  "Google Pixel 6 Pro/128GB/Sorta Sunny",
  "Google Pixel 6/128GB/Kinda Coral",
  "Google Pixel 6/128GB/Stormy Black",
  "OnePlus 9 Pro/256GB/Stellar Black",
  "OnePlus 9 Pro/256GB/Pine Green",
  "OnePlus 9/128GB/Winter Mist",
  "OnePlus 9/128GB/Arctic Sky",
  "Xiaomi Mi 11 Ultra/256GB/Ceramic Black",
  "Xiaomi Mi 11 Ultra/256GB/Cosmic Silver",
  "Xiaomi Mi 11/128GB/Midnight Gray",
  "Xiaomi Mi 11/128GB/Horizon Blue",
  "Oppo Find X3 Pro/256GB/Gloss Black",
  "Oppo Find X3 Pro/256GB/Blue"

];

//dropdown
const productModelDropdown = document.getElementById("product-model");
productModels.forEach((model) => {
  const option = document.createElement("option");
  option.value = model;
  option.text = model;
  productModelDropdown.add(option);
});

//sumbit button
function submitOrder() {
  // get references to each input field
  var customerName = document.getElementById("customer-name").value;
  var customerContact = document.getElementById("customer-contact").value;
  var customerAddress = document.getElementById("customer-address").value;
  var deliveryDate = document.getElementById("delivery-date").value;
  var productModel = document.getElementById("product-model").value;
  var productQty = document.getElementById("product-qty").value;

  // Check any input field is empty
  if (customerName === "" || customerContact === "" || customerAddress === "" || deliveryDate === "" || productModel === "" || productQty === "") {
    alert("Please fill in all fields.");
    return;
  }

  // check product quantity is < 0
  if (productQty < 0) {
    alert("Product quantity cannot be less than zero.");
    return;
  }

  // display  confirma message
  var confirmed = confirm("Are you sure you want to submit the order?");
  if (!confirmed) {
    return;
  }

  // create a JSON data
  var orderData = {
    customer: {
      name: customerName,
      contact: customerContact,
      address: customerAddress
    },
    delivery: {
      date: deliveryDate
    },
    product: {
      model: productModel,
      qty: productQty
    }
  };

  // Convert JSON data to string
  var json = JSON.stringify(orderData);
  console.log(orderData);
  $.ajax({
    type: "POST",
    url: "http://localhost:6969/",
    data: json,
    contentType: "application/json",
    success: function (response) {
      console.log(response);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("Error:", textStatus, errorThrown);
    },
  });
}
