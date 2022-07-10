let products = null;
let customers = null;
let rows = 7;
document.addEventListener("DOMContentLoaded", async function (event) {
  setCustomers();

  let tabla = `
    <table>
      <tr>
        <th>#</th>
        <th>Producto</th>
        <th>Marca</th>
        <th>Cantidad</th>
        <th>Precio</th>
        <th>Total</th>
      </tr>
    `;

  products = await getProducts();

  if (products != null) {
    for (let i = 0; i < rows; i++) {
      tabla += `<tr>
              <th>${i + 1}</th>
              <td>
                <select name="prod" id="prod${i}" class="form-select" onchange="displayQty(${i})">  
                  <option value="" selected></option>`;
      for (let j = 0; j < products.length; j++) {
        tabla += `<option value="${products[j].id_producto}">${products[j].producto}</option>`;
      }
      tabla += `
                </select>
              </td>
              <td>
                <input class="form-control" type="text" value="" readonly id="marca${i}"/>
              </td>
              <td>
                <select name="cant" id="cant${i}" class="form-select" onchange="calculateRow(${i})">
                  <option value="" selected></option>
                </select>
              </td>
              <td>
                <input class="form-control" type="text" value="" readonly id="precio${i}"/>
              </td>
              <td>
                <input class="form-control" type="text" value="" readonly id="total${i}"/>
              </td> </tr>`;
    }
    tabla += `<tr>
                    <th colspan="5">SUBTOTAL</th>
                    <th><input class="form-control" type="text" value="" readonly id="subtotal"/></th>
                  </tr>`;
  }
  document.getElementById("productos").innerHTML = tabla;
});

async function setCustomers() {
  customers = await getCustomers();
  let customerList = `<option value=""></option>`;
  if (customers != null) {
    for (let i = 0; i < customers.length; i++) {
      customerList += `<option value=${customers[i].id_cliente}>${customers[i].nombre} ${customers[i].apellidos}</option>`;
    }
  }
  document.getElementById("cliente").innerHTML = customerList;
}

async function getCustomers() {
  try {
    let response = await fetch(`http://localhost:3000/api/customers`);
    let data = await response.json();
    return data;
  } catch (error) {
    if (error == "TypeError: Failed to fetch") {
      console.log("No se pudo conectar con el servidor.");
    } else {
      console.log(error);
    }
  }
}

async function getProducts() {
  try {
    let response = await fetch(`http://localhost:3000/api/products/all/available`);
    let data = await response.json();
    return data;
  } catch (error) {
    if (error == "TypeError: Failed to fetch") {
      console.log("No se pudo conectar con el servidor.");
    } else {
      console.log(error);
    }
  }
}

function displayQty(row) {
  let idProd = document.getElementById("prod" + row).value;
  let prod = null;

  if (idProd != "") {
    for (let i = 0; i < products.length; i++) {
      if (products[i].id_producto == idProd) {
        prod = products[i];
      }
    }

    let qty = "";
    for (let i = 1; i <= prod.inventario; i++) {
      qty += `<option value=${i}>${i}</option>`;
    }

    document.getElementById("marca" + row).value = prod.marca;
    document.getElementById("cant" + row).innerHTML = qty;
    document.getElementById("precio" + row).value = prod.precio_venta;
    document.getElementById("total" + row).value = prod.precio_venta;
  } else {
    document.getElementById("marca" + row).value = "";
    document.getElementById("cant" + row).innerHTML = "";
    document.getElementById("precio" + row).value = "";
    document.getElementById("total" + row).value = "";
  }

  calculateTotal();
}

function calculateRow(row) {
  let qty = document.getElementById("cant" + row).value;
  let price = document.getElementById("precio" + row).value;
  document.getElementById("total" + row).value = qty * price;

  calculateTotal();
}

function calculateTotal() {
  let total = 0;
  for (let i = 0; i < rows; i++) {
    if (document.getElementById("total" + i).value != "") {
      total += parseInt(document.getElementById("total" + i).value);
    }
  }

  document.getElementById("subtotal").value = total;
}

function updateCustomerContact() {
  let idCust = document.getElementById("cliente").value;
  let cust = null;
  for (let i = 0; i < customers.length; i++) {
    if (customers[i].id_cliente == idCust) {
      cust = customers[i];
    }
  }
  document.getElementById("telefono").value =
    cust.telefono != null ? cust.telefono : "-";
  document.getElementById("correo").value =
    cust.email != null ? cust.email : "-";
  document.getElementById("direccion").value =
    cust.direccion != null ? cust.direccion : "-";
}

async function checkout() {
  let idCust = document.getElementById("cliente").value;
  let products = [];
  if (idCust != "") {
    let idOrder = await getLastOrder();
    for (let i = 0; i < rows; i++) {
      let idProd = document.getElementById("prod" + i).value;
      let cant = document.getElementById("cant" + i).value;
      if (idProd != "" && cant != "") {
        products.push({
          id_venta: idOrder,
          id_cliente: parseInt(idCust),
          id_producto: parseInt(idProd),
          cantidad: parseInt(cant),
        });
      }
    }
    if (products.length == 0) {
      alert("No hay productos por comprar");
    } else {
      let errores = "",
        correctas = "";
      for (let i = 0; i < products.length; i++) {
        let result = await placeOrder(products[i]);
        console.log(result)
        if (result.inventory < 0) {
          errores += ", #" + (i + 1);
        } else {
          correctas += ", #" + (i + 1);
        }
      }
      let msgAlert = "";
      if (correctas != "") {
        msgAlert += "Ventas correctas: " + correctas.slice(2, correctas.length) + "\n";
      }
      if (errores != "") {
        msgAlert +=
          "No se pudieron realizar las ventas por falta de inventario: " +
          errores.slice(2, errores.length);
      }
      alert(msgAlert)
    }
  } else {
    alert("Se requiere seleccionar un cliente");
  }
}

async function getLastOrder() {
  try {
    let response = await fetch(
      `http://localhost:3000/api/orders/current/order`
    );
    let data = await response.json();
    return data;
  } catch (error) {
    if (error == "TypeError: Failed to fetch") {
      console.log("No se pudo conectar con el servidor.");
    } else {
      console.log(error);
    }
  }
}

async function placeOrder(data) {
  try {
    console.log(data);
    let response = await fetch(`http://localhost:3000/api/orders/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    let responseData = await response.json();
    return responseData;
  } catch (error) {
    if (error == "TypeError: Failed to fetch") {
      console.log("No se pudo conectar con el servidor.");
    } else {
      console.log(error);
    }
  }
}
