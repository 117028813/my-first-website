let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let fs = require('fs')
let MongoClient = require('mongodb').MongoClient
let DB_CONN_STR = 'mongodb://localhost/test'

// let movies = [
//   {id: 1, name: '速度与激情8', rating: 7.2},
//   {id: 2, name: '攻壳机动队', rating: 6.6},
//   {id: 3, name: '金刚狼：殊死一战', rating: 8.3}
// ]
let movies

// fs.readFile('./movies.json', 'utf8', (err, data) => {
//   if (err) {
//     throw err
//   } else {
//     movies = JSON.parse(data)
//   }
// })


MongoClient.connect(DB_CONN_STR, (err, db) => {
  db.collection('movies').find().toArray((err, result) => {
    movies = result
    db.close()
  })
})


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
    // fs.writeFile('./movies.json', JSON.stringify(movies), (err) => {
    //   if (err) throw err
    //   console.log('The file has been saved')
    // })

    MongoClient.connect(DB_CONN_STR, (err, db) => {
      db.collection('movies').remove({id:id}, (err, result) => {
        db.close()
      })
    })
  }
})


app.post('/movies/add', function (req, res) {
  let id = movies.length ? movies[movies.length-1].id + 1 : 1
  let movie = {id: id, name: req.body.name, rating: parseFloat(req.body.rating)}
  movies.push(movie)
  res.send(movies)
  // fs.writeFile('./movies.json', JSON.stringify(movies), (err) => {
  //   if (err) throw err
  //   console.log('The file has been saved')
  // })

  MongoClient.connect(DB_CONN_STR, (err, db) => {
    db.collection('movies').insert(movie, (err, result) => {
      db.close()
    })
  })
})


app.listen(3000)