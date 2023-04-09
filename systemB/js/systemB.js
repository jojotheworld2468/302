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

$(document).ready(function () {
  loadOrders();

  // send selected row to db
  $("#send-to-db").click(function () {
    var selectedOrders = [];
    var selectedRows = [];

   //loop table row
    $("tbody tr").each(function () {
      var checkbox = $(this).find("input[type='checkbox']");
      if (checkbox.prop("checked")) {
        //check row data
        var rowData = {
          customer: {
            name: $(this).find("td:eq(1)").text(),
            contact: $(this).find("td:eq(2)").text(),
            address: $(this).find("td:eq(3)").text()
          },
          delivery: {
            date: $(this).find("td:eq(4)").text()
          },
          product: {
            model: $(this).find("td:eq(5)").text(),
            qty: $(this).find("td:eq(6)").text()
          }
        };
        selectedOrders.push(rowData);
        selectedRows.push($(this));
      }
    });
    
    if (selectedOrders.length === 0) {
      alert("Please select at least one order to send to the database.");
      return;
    }
  
    if (confirm("Are you sure you want to send the selected data to the database?")) {
      $.ajax({
        type: "POST",
        url: "http://localhost:6969/send-to-db",
        data: JSON.stringify(selectedOrders),
        contentType: "application/json",
        success: function (response) {
          alert("Data sent failed");

          // Remove selected rows from the table
          selectedRows.forEach(function (row) {
            row.remove();
          });
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log("Error:", textStatus, errorThrown);
        },
      });
    }
  });
});

// Function to enable real-time refresh (polling)
function setupRealtimeRefresh() {
  refreshIntervalId = setInterval(function () {
    loadOrders();
  }, 500000); // Refreshes seconds
}


// Enable real-time refresh
var refreshIntervalId = setupRealtimeRefresh();
