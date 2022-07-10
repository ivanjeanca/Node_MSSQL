const sql = require('mssql');
const connection = require("../database/connection")

const getAllCustomers = async (req, res) => {
    try {
        const pool = await connection.getConnection();
        const result = await pool.request().query('SELECT * FROM cliente');
        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const getCustomer = async (req, res) => {
    try {
        const pool = await connection.getConnection();
        const result = await pool
            .request()
            .input("id_cliente", req.params.id)
            .query('SELECT * FROM cliente where id_cliente = @id_cliente');
        return res.status(200).json(result.recordset[0]);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const newCustomer = async (req, res) => {
    let { nombre, apellidos, telefono, email, direccion } = req.body;

    if (nombre == null || apellidos == null) {
        return res.status(400).json({ message: "Se requieren los campos nombre, apellidos obligatoriamente." });
    }

    try {
        const pool = await connection.getConnection();

        await pool
            .request()
            .input("nombre", sql.VarChar, nombre)
            .input("apellidos", sql.VarChar, apellidos)
            .input("telefono", sql.VarChar, telefono)
            .input("email", sql.VarChar, email)
            .input("direccion", sql.VarChar, direccion)
            .query('INSERT INTO cliente (nombre, apellidos, telefono, email, direccion) VALUES (@nombre, @apellidos, @telefono, @email, @direccion)');

        res.status(200).json({ message: `Cliente agregado correctamente` })
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const updateCustomer = async (req, res) => {
    let { nombre, apellidos, telefono, email, direccion } = req.body;

    if (nombre == null || apellidos == null) {
        return res.status(400).json({ message: "Se requieren los campos nombre, apellidos obligatoriamente." });
    }

    try {
        const pool = await connection.getConnection();

        await pool
            .request()
            .input("nombre", sql.VarChar, nombre)
            .input("apellidos", sql.VarChar, apellidos)
            .input("telefono", sql.VarChar, telefono)
            .input("email", sql.VarChar, email)
            .input("direccion", sql.VarChar, direccion)
            .input("id_cliente", req.params.id)
            .query('UPDATE cliente SET nombre = @nombre, apellidos = @apellidos, telefono = @telefono, email = @email, direccion = @direccion WHERE id_cliente = @id_cliente');

        res.status(200).json({ message: `Cliente actualizado correctamente` })
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const deleteCustomer = async (req, res) => {
    try {
        const pool = await connection.getConnection();

        const result = await pool
            .request()
            .input("id_cliente", req.params.id)
            .query("delete from cliente where id_cliente = @id_cliente");

        if (result.rowsAffected[0] === 0) return res.sendStatus(404);

        res.status(200).json({ message: `Cliente eliminado correctamente` })
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

module.exports = {
    getAllCustomers,
    getCustomer,
    newCustomer,
    updateCustomer,
    deleteCustomer
}