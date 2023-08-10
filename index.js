const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors')
app.use(express.static('build'))

morgan.token('postData', (req) => {
    if (req.method === 'POST') {
      return JSON.stringify(req.body);
    }
    return '';
  });
  
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :postData')); // Use custom token in morgan
  

const bodyparser = require('body-parser');

app.use(express.json());



app.use(cors())

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons',(request,response) => {
  response.json(persons);
});

app.get('/api/persons/:id',(request,response) =>{
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id)
    
    if(person){
        response.json(person)
    }
    else{
        response.status(404).end();
    }
})

app.get('/info',(request,response) => {

    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short'
      };

    const timestamp = new Date().toLocaleString('en-US', options); // Get the current timestamp
    const entriesCount = persons.length;
    const info =`Phonebook has info for ${entriesCount} people<br/> ${timestamp}`
    //const info = `Request received at: ${timestamp}<br/>Entries in phonebook: ${entriesCount}`;
    response.send(info)
})

const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }

app.post('/api/persons',(request,response) =>{
    const body = request.body;
    if (!body.name || !body.number) {
        console.log(body.name)
        console.log(body.number)
        return response.status(400).json({ error: 'Name and number are required' });
      }
    
      const existingPerson = persons.find((person) => person.name === body.name);
      if (existingPerson) {
        return response.status(400).json({ error: 'Name must be unique' });
      }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }
    
    
    persons = persons.concat(person);
    response.json(person)
})

app.delete('/api/persons/:id',(request,response) =>{
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);

    response.status(204).end()
})


const PORT = 3001
app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`)
})