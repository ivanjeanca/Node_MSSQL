const express = require('express')
const router = express.Router()
const srv = require('../services/orders')

router.get('/', srv.getAllOrders)
router.get('/:id', srv.getOrder)
router.get('/current/order', srv.getCurrentOrder)
router.post('/', srv.newOrder)
router.put('/:id', srv.updateOrder)
router.delete('/:id', srv.deleteOrder)

module.exports = router