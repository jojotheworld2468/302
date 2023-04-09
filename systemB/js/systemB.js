function loadOrders() {
  //request order
  $.ajax({
    type: "GET",
    url: "http://localhost:6969/",
    success: function (data) {
      console.log(data);
      var orders = data;
      var tableHtml = "";
      console.log(typeof orders);
      //loop orders
      for (var key in orders) {
        if (orders.hasOwnProperty(key)) {
          var order = orders[key];
          //delete T
          var formattedDate = order.delivery.date.replace("T", " ");
          tableHtml += "<tr data-order='" + JSON.stringify(order).replace(/'/g, "&#39;") + "'>";
          tableHtml += "<td><input type='checkbox'></td>";
          tableHtml += "<td>" + order.customer.name + "</td>";
          tableHtml += "<td>" + order.customer.contact + "</td>";
          tableHtml += "<td>" + order.customer.address + "</td>";
          tableHtml += "<td>" + formattedDate + "</td>";
          tableHtml += "<td>" + order.product.model + "</td>";
          tableHtml += "<td>" + order.product.qty + "</td>";
          tableHtml += "</tr>";
        }
      }
      //insert table
      $("tbody").html(tableHtml);
      //add event
      $("#filterInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("tbody tr").filter(function () {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
      });

      // Stop refreshing when checkbox clicked
      $("input[type='checkbox']").click(function () {
        clearInterval(refreshIntervalId);
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("Error:", textStatus, errorThrown);
    },
  });
}



// Function to enable real-time refresh (polling)
function setupRealtimeRefresh() {
  refreshIntervalId = setInterval(function () {
    loadOrders();
  }, 500000); // Refreshes seconds
}


// Enable real-time refresh
var refreshIntervalId = setupRealtimeRefresh();
