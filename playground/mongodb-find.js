// const MongoClient = require('mongodb').MongoClient
const { MongoClient, ObjectID } = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, client) => {
    if(err) {
        return console.log('Unable to connect to mongodb server')
    }
    console.log('Connected to mongodb server')
    const db = client.db('TodoApp')

    // db.collection('Todos').find({
    //     _id: new ObjectID('5b3f03f00d23e9b0253a78dd')
    // }).toArray().then((docs) => {
    //     console.log('Todos')
    //     console.log(JSON.stringify(docs, undefined, 2))
    // }, (err) => {
    //     console.log('unable to fetch todos ', err)
    // })

    db.collection('Users').find({
        name: 'Buzo'
    }).count().then((count) => {
        console.log('Todos count: ', count)
    }, (err) => {
        console.log('unable to fetch todos ', err)
    })

    // client.close()
})