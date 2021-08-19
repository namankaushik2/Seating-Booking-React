const schema = require("../DatabaseSchema/schema");
const MongoClient = require('mongodb').MongoClient;
const uri = schema.URI;

// Refersh to seats to un-booked
function seatsUpdate() {
    // Connect to MongoDB cluster
    const data = new Promise((resolve, reject) => {
        MongoClient.connect(uri, function (err, db) {
            if (err) reject()
            try{
                // Delete the documents stored and Insert the fresh arrangements
                db.db("seatsArrangement").collection("seats").deleteOne({})
                db.db("seatsArrangement").collection("seats").insertOne({'_id':1,'seats':[[7,7],[7,7],[7,7],[7,7],[7,7],[7,7],[7,7],[7,7],[7,7],[7,7],[7,7],[3,3]],'remaining_seats':80,'total_seats':80,'seats_per_row':7}, function(err, result){
                    resolve(result.ops[0])
                });
            }catch(err){
                reject()
            }
        });
    })
    return data
}

module.exports.SeatsUpdate = seatsUpdate;
