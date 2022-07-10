const express = require('express')
const router = express.Router()
const srv = require('../services/products')

router.get('/', srv.getAllProducts)
router.get('/all/available', srv.getAvailableProducts)
router.get('/:id', srv.getProduct)
router.post('/', srv.newProduct)
router.put('/:id', srv.updateProduct)
router.delete('/:id', srv.deleteProduct)

module.exports = router