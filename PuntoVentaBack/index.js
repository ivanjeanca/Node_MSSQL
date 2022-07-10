const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const port = 3000

const corsConfig = {
  origin: '*',
  optionsSuccessStatus: 200
}
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors(corsConfig))

const productsAPI = require('./routes/products')
const customersAPI = require('./routes/customers')
const ordersAPI = require('./routes/orders')

app.use('/api/products', productsAPI)
app.use('/api/customers', customersAPI)
app.use('/api/orders', ordersAPI)

app.listen(port, () => {
  console.log(`Aplicación ejecutándose en el puerto ${ port }.`)
})