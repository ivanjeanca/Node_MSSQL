const sql = require('mssql');
const connection = require("../database/connection")

const getAllOrders = async (req, res) => {
    try {
        const pool = await connection.getConnection();
        const result = await pool.request().query('SELECT * FROM venta');
        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const getOrder = async (req, res) => {
    try {
        const pool = await connection.getConnection();
        const result = await pool
            .request()
            .input("id_venta", req.params.id)
            .query('SELECT * FROM venta where id_venta = @id_venta');
        return res.status(200).json(result.recordset[0]);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const getCurrentOrder = async (req, res) => {
    try {
        const pool = await connection.getConnection();
        const result = await pool.request().query('select max(id_venta) + 1 as id_venta from venta');
        res.status(200).json(result.recordset[0].id_venta != null ? result.recordset[0].id_venta : 1);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const newOrder = async (req, res) => {
    let { id_venta, id_cliente, id_producto, cantidad } = req.body;

    if ( id_venta == null || id_cliente == null || id_producto == null || cantidad == null || cantidad <= 0) {
        return res.status(400).json({ message: "Se requieren todos los campos" });
    }

    try {
        const pool = await connection.getConnection();
        const result = await pool
            .request()
            .input("id_venta", sql.Int, id_venta)
            .input("id_cliente", sql.Int, id_cliente)
            .input("id_producto", sql.Int, id_producto)
            .input("cantidad", sql.Int, cantidad)
            .query('Declare @Result int EXEC new_order @id_venta, @id_cliente, @id_producto, @cantidad, @Result OUTPUT select @Result as result')

        if(result.recordset[0].result >= 0)
            res.status(200).json({ message: `Venta generada correctamente`, inventory: result.recordset[0].result })
        else
            res.status(200).json({ message: `No hay suficientes unidades en inventario`, inventory: result.recordset[0].result })
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const updateOrder = async (req, res) => {
    let { id_cliente, id_producto, cantidad } = req.body;

    if (id_cliente == null || id_producto == null || cantidad == null || cantidad <= 0) {
        return res.status(400).json({ message: "Se requieren todos los campos" });
    }

    try {
        const pool = await connection.getConnection();

        await pool
            .request()
            .input("id_cliente", sql.Int, id_cliente)
            .input("id_producto", sql.Int, id_producto)
            .input("cantidad", sql.Int, cantidad)
            .input("id_venta", req.params.id)
            .query('UPDATE venta SET id_cliente = @id_cliente, id_producto = @id_producto, cantidad = @cantidad WHERE id_venta = @id_venta');

        res.status(200).json({ message: `Venta actualizada correctamente` })
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const deleteOrder = async (req, res) => {
    try {
        const pool = await connection.getConnection();

        const result = await pool
            .request()
            .input("id_venta", req.params.id)
            .query("delete from venta where id_venta = @id_venta");

        if (result.rowsAffected[0] === 0) return res.sendStatus(404);

        return res.sendStatus(204)
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

module.exports = {
    getAllOrders,
    getOrder,
    getCurrentOrder,
    newOrder,
    updateOrder,
    deleteOrder
}