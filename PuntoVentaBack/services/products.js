const sql = require('mssql');
const connection = require("../database/connection")

const getAllProducts = async (req, res) => {
    try {
        const pool = await connection.getConnection();
        const result = await pool.request().query('SELECT * FROM producto');
        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const getAvailableProducts = async (req, res) => {
    try {
        const pool = await connection.getConnection();
        const result = await pool.request().query('SELECT * FROM producto where inventario > 0');
        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const getProduct = async (req, res) => {
    try {
        const pool = await connection.getConnection();
        const result = await pool
            .request()
            .input("id_producto", req.params.id)
            .query('SELECT * FROM producto where id_producto = @id_producto');
        return res.status(200).json(result.recordset[0]);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const newProduct = async (req, res) => {
    let { producto, marca, precio_compra, precio_venta, inventario } = req.body;
    
    if (producto == null || marca == null || precio_compra == null || precio_venta == null || inventario == null) {
        return res.status(400).json({ message: "Se requieren todos los campos" });
    }

    try {
        const pool = await connection.getConnection();

        await pool
            .request()
            .input("producto", sql.VarChar, producto)
            .input("marca", sql.VarChar, marca)
            .input("precio_compra", sql.Money, precio_compra)
            .input("precio_venta", sql.Money, precio_venta)
            .input("inventario", sql.Int, inventario)
            .query('INSERT INTO producto (producto, marca, precio_compra, precio_venta, inventario) VALUES (@producto, @marca, @precio_compra, @precio_venta, @inventario)');

        res.status(200).json({ message: `Producto agregado correctamente` })
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const updateProduct = async (req, res) => {
    let { producto, marca, precio_compra, precio_venta, inventario } = req.body;
    
    if (producto == null || marca == null || precio_compra == null || precio_venta == null || inventario == null) {
        return res.status(400).json({ message: "Se requieren todos los campos" });
    }

    try {
        const pool = await connection.getConnection();

        await pool
            .request()
            .input("producto", sql.VarChar, producto)
            .input("marca", sql.VarChar, marca)
            .input("precio_compra", sql.Money, precio_compra)
            .input("precio_venta", sql.Money, precio_venta)
            .input("inventario", sql.Int, inventario)
            .input("id_producto", req.params.id)
            .query('UPDATE producto SET producto = @producto, marca = @marca, precio_compra = @precio_compra, precio_venta = @precio_venta, inventario = @inventario WHERE id_producto = @id_producto');

        res.status(200).json({ message: `Producto actualizado correctamente` })
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const deleteProduct = async (req, res) => {
    try {
        const pool = await connection.getConnection();

        const result = await pool
            .request()
            .input("id_producto", req.params.id)
            .query("delete from producto where id_producto = @id_producto");

        if (result.rowsAffected[0] === 0) return res.sendStatus(404);

        res.status(200).json({ message: `Producto eliminado correctamente` })
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

module.exports = {
    getAllProducts,
    getAvailableProducts,
    getProduct,
    newProduct,
    updateProduct,
    deleteProduct
}