let express = require('express')
let app = express()
let bodyParser = require('body-parser')


let movies = [
  {id: 1, name: '速度与激情8', rating: 7.2},
  {id: 2, name: '攻壳机动队', rating: 6.6},
  {id: 3, name: '金刚狼：殊死一战', rating: 8.3}
]


app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))


app.get('/movies', function (req, res) {
  res.send(movies)
})


app.get('/movies/:id', function (req, res) {
  let id = parseInt(req.params.id)
  let removeIndex = movies.map(function (movie) {
    return parseInt(movie.id)
  }).indexOf(id)

  if (removeIndex === -1) {
    res.send('this id is not exits in movies')
  } else {
    movies.splice(removeIndex, 1)
    res.send(movies)
  }
})


app.post('/movies/add', function (req, res) {
  let id = movies[movies.length-1].id + 1
  let movie = {id: id, name: req.body.name, rating: parseInt(req.body.rating)}
  movies.push(movie)
  res.send(movies)
})


app.listen(3000)