const { MongoClient, ObjectID } = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, client) => {
    if(err) {
        return console.log('Unable to connect to mongodb server')
    }
    console.log('Connected to mongodb server')
    const db = client.db('TodoApp')

    // db.collection('Todos').deleteMany({text: 'lookup chiropractor'})
    //     .then((result) => {
    //         console.log(result)
    //     })

    // db.collection('Todos').deleteOne({text: 'lookup chiropractor'})
    // .then((result) => {
    //     console.log(result)
    // })

    db.collection('Users').findOneAndDelete({name: 'Bobby'})
        .then((result) => {
            console.log(result)
        })

    // client.close()
})