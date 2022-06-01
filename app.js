const express = require('express')
const {Router} = express

const app = express()
const router = Router()

app.use( '/api/products', router )
app.use('/static', express.static(__dirname + '/public'))

// Import
const Container = require('./class')
const DB = 'products.json'

const container = new Container (DB)

//Middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//Routes
router.get('/', (req, res) => {
    const data = container.getAll()
    res.json(data) 
})

router.get('/:id', (req, res) => {
    const id = req.params.id
    const product = container.getByID(id)
    if(product === undefined) {
        res.send('error: Producto no hallado')
    } else {
        res.json(product)
    }
})

router.post('/', (req, res) => {
    const product = req.body
    container.save(product)
    container.write()

    res.json(product)
    res.json('Producto agregado')
})

router.put('/:id', (req, res) => {
    const id = Number(req.params.id)
    const product = req.body
    
    const data = container.getAll()

    idx = container.getID(id)
    if ( idx > data.length ){
        res.send('El producto que desea editar no existe')
    } else {
        data.splice( idx, 1, {...product, ...{id: id }})
        res.json( product )
    }
})

router.delete('/:id', (req, res) => {
    const id = Number(req.params.id)
    container.deleteByID(id)
    res.send("Eliminado con exito")
})

// Server listening
const server = app.listen(8080, () => { console.log( "Server listening..." ) })
server.on('error', e => { console.log( "Error on server", e ) })