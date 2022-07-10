const express = require('express')
const router = express.Router()
const srv = require('../services/customers')

router.get('/', srv.getAllCustomers)
router.get('/:id', srv.getCustomer)
router.post('/', srv.newCustomer)
router.put('/:id', srv.updateCustomer)
router.delete('/:id', srv.deleteCustomer)

module.exports = router