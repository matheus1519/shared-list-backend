const express = require('express')  

const routes = express.Router();  

let notes = ''

routes.get('/notes', (request, response) => {
    return response.json({ note: notes })
})

routes.post('/notes', (request, response) => {
    const { note } = request.body

    if (note === undefined) {
      return response.status(404).json({ message: 'not found proprety "note"'})
    }

    notes = note

    request.io.emit('newNotes', notes)

    return response.status(201).json({ message: 'success'})
})

module.exports = routes;