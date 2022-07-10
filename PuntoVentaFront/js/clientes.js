let products = null;
let customers = null;

document.addEventListener("DOMContentLoaded", async function (event) {
  let tabla = `
    <table>
      <tr>
        <th>#</th>
        <th>Nombres</th>
        <th>Apellidos</th>
        <th>E-mail</th>
        <th>Teléfono</th>
        <th>Dirección</th>
        <th>Acción</th>
        <th colspan="2">Acciones</th>
      </tr>
    `;

  customers = await getAllCustomers();

  if (customers != null) {
    for (let i = 0; i < customers.length; i++) {
      tabla += `<tr>
              <td>
                <input class="form-control" type="text" value="${customers[i].id_cliente}" id="id${i}" readonly/>
              </td>
              <td>
              <input class="form-control" type="text" value="${customers[i].nombre}" id="nombre${i}"/>
              </td>
              <td>
                <input class="form-control" type="text" value="${customers[i].apellidos}" id="apellidos${i}"/>
              </td>
              <td>
                <input class="form-control" type="text" value="${customers[i].email != null ? customers[i].email : "" }" id="email${i}"/>
              </td>
              <td>
                <input class="form-control" type="text" value="${customers[i].telefono != null ? customers[i].telefono : "" }" id="telefono${i}"/>
              </td> 
              <td>
                <input class="form-control" type="text" value="${customers[i].direccion != null ? customers[i].direccion : "" }" id="direccion${i}"/>
              </td>
              <td><button class="btn btn-primary" type="button" onclick="editCustomer(${i})">Guardar</button></td>
              <td><button class="btn btn-danger" type="button" onclick="deleteCustomer(${i})">Borrar</button></td>
              </tr>`;
    }
  }
  document.getElementById("clientes").innerHTML = tabla;
});

async function getAllCustomers() {
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

async function addCustomer() {
  let nombre = document.getElementById("nombre").value;
  let apellidos = document.getElementById("apellidos").value;
  let email = document.getElementById("email").value;
  let telefono = document.getElementById("telefono").value;
  let direccion = document.getElementById("direccion").value;

  try {
    if (
      nombre == null ||
      apellidos == null
    ) {
      alert("se requieren todos los datos");
    } else {
      newCust = {
        nombre: nombre,
        apellidos: apellidos,
        email: email,
        telefono: telefono,
        direccion: direccion,
      };
      let res = await insertCustomer(newCust);
      alert(res.message);
      location.href="./clientes.html"
    }
  } catch (error) {
    alert("Hay un problema con los datos");
  }
}

async function editCustomer(row) {
  let id = document.getElementById("id" + row).value;
  let nombre = document.getElementById("nombre" + row).value;
  let apellidos = document.getElementById("apellidos" + row).value;
  let email = document.getElementById("email" + row).value;
  let telefono = document.getElementById("telefono" + row).value;
  let direccion = document.getElementById("direccion" + row).value;

  let newCust;
  try {
    if (
      id == null ||
      nombre == null ||
      apellidos == null
    ) {
      alert("se requieren todos los datos");
    } else {
      newCust = {
        nombre: nombre,
        apellidos: apellidos,
        email: email,
        telefono: telefono,
        direccion: direccion,
      };
      let res = await updateCustomer(id, newCust);
      alert(res.message);
    }
  } catch (error) {
    alert("Hay un problema con los datos");
  }
}

async function deleteCustomer(row) {
  let id = document.getElementById("id" + row).value;
  console.log(id)
  try {
    if (
      id == null
    ) {
      alert("se requieren todos los datos");
    } else {
      let res = await delCustomer(parseInt(id));
      alert(res.message);
      location.href="./clientes.html"
    }
  } catch (error) {
    alert("Hay un problema con los datos");
  }
}

async function insertCustomer(data) {
  try {
    let response = await fetch(`http://localhost:3000/api/customers/`, {
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

async function updateCustomer(id, data) {
  try {
    let response = await fetch(`http://localhost:3000/api/customers/${id}`, {
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

async function delCustomer(id) {
  try {
    let response = await fetch(`http://localhost:3000/api/customers/${id}`, {
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
