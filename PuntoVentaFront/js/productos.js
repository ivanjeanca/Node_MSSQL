let products = null;
let customers = null;

document.addEventListener("DOMContentLoaded", async function (event) {
  let tabla = `
    <table>
      <tr>
        <th>#</th>
        <th>Producto</th>
        <th>Marca</th>
        <th>Precio Compra</th>
        <th>Precio Venta</th>
        <th>Inventario</th>
        <th colspan="2">Acciones</th>
      </tr>
    `;

  products = await getAllProducts();

  if (products != null) {
    for (let i = 0; i < products.length; i++) {
      tabla += `<tr>
              <td>
                <input class="form-control" type="text" value="${products[i].id_producto}" id="id${i}" readonly/>
              </td>
              <td>
              <input class="form-control" type="text" value="${products[i].producto}" id="producto${i}"/>
              </td>
              <td>
                <input class="form-control" type="text" value="${products[i].marca}" id="marca${i}"/>
              </td>
              <td>
                <input class="form-control" type="text" value="${products[i].precio_compra}" id="precio-compra${i}"/>
              </td>
              <td>
                <input class="form-control" type="text" value="${products[i].precio_venta}" id="precio-venta${i}"/>
              </td> 
              <td>
                <input class="form-control" type="text" value="${products[i].inventario}" id="inventario${i}"/>
              </td>
              <td><button class="btn btn-primary" type="button" onclick="editProduct(${i})">Guardar</button></td>
              <td><button class="btn btn-danger" type="button" onclick="deleteProduct(${i})">Borrar</button></td>
              </tr>`;
    }
  }
  document.getElementById("productos").innerHTML = tabla;
});

async function getAllProducts() {
  try {
    let response = await fetch(`http://localhost:3000/api/products`);
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

async function addProduct() {
  let producto = document.getElementById("producto").value;
  let marca = document.getElementById("marca").value;
  let precioCompra = document.getElementById("precio-compra").value;
  let precioVenta = document.getElementById("precio-venta").value;
  let inventario = document.getElementById("inventario").value;

  try {
    if (
      producto == null ||
      marca == null ||
      precioCompra == null ||
      precioVenta == null ||
      inventario == null
    ) {
      alert("se requieren todos los datos");
    } else {
      newProd = {
        producto: producto,
        marca: marca,
        precio_compra: parseInt(precioCompra),
        precio_venta: parseInt(precioVenta),
        inventario: parseInt(inventario),
      };
      let res = await insertProduct(newProd);
      alert(res.message);
      location.href="./productos.html"
    }
  } catch (error) {
    alert("Hay un problema con los datos");
  }
}

async function editProduct(row) {
  let id = document.getElementById("id" + row).value;
  let producto = document.getElementById("producto" + row).value;
  let marca = document.getElementById("marca" + row).value;
  let precioCompra = document.getElementById("precio-compra" + row).value;
  let precioVenta = document.getElementById("precio-venta" + row).value;
  let inventario = document.getElementById("inventario" + row).value;

  let newProd;
  try {
    if (
      id == null ||
      producto == null ||
      marca == null ||
      precioCompra == null ||
      precioVenta == null ||
      inventario == null
    ) {
      alert("se requieren todos los datos");
    } else {
      newProd = {
        producto: producto,
        marca: marca,
        precio_compra: parseInt(precioCompra),
        precio_venta: parseInt(precioVenta),
        inventario: parseInt(inventario),
      };
      let res = await updateProduct(id, newProd);
      alert(res.message);
    }
  } catch (error) {
    alert("Hay un problema con los datos");
  }
}

async function deleteProduct(row) {
  let id = document.getElementById("id" + row).value;
  console.log(id)
  try {
    if (
      id == null
    ) {
      alert("se requieren todos los datos");
    } else {
      let res = await delProduct(parseInt(id));
      alert(res.message);
      location.href="./productos.html"
    }
  } catch (error) {
    alert("Hay un problema con los datos");
  }
}

async function insertProduct(data) {
  try {
    let response = await fetch(`http://localhost:3000/api/products/`, {
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

async function updateProduct(id, data) {
  try {
    let response = await fetch(`http://localhost:3000/api/products/${id}`, {
      method: "PUT",
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

async function delProduct(id) {
  try {
    let response = await fetch(`http://localhost:3000/api/products/${id}`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
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
