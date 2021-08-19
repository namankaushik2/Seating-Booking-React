const schema = require("../DatabaseSchema/schema");
const MongoClient = require('mongodb').MongoClient;
const uri = schema.URI;

// Seats Booking function
function booking(seat) {

    const data = new Promise((resolve, reject) => {
        MongoClient.connect(uri, function (err, db) {
            if (err) reject()
            try{
                // Update the seating arrangements
                db.db('seatsArrangement').collection('seats').find({'_id':1}).toArray((err, result)=>{
                    var flag=1
                    // Decrease the seats per row based on the seats booked.
                    // Per row seats booked, when user books more than the present seats in the row
                    for(i in result[0].seats){
                        if(result[0].seats[i][1] >= seat){
                            result[0].seats[i][1] = result[0].seats[i][1] - seat
                            result[0].remaining_seats -= seat
                            flag=0
                            break
                        }
                    }
                    // Remaining seats left in above rows, seats booking
                    if(flag==1){
                        var i=0
                        do{
                            if(result[0].seats[i][1]>seat){result[0].seats[i][1] -= seat;result[0].remaining_seats -= seat;seat=0
                            }else{seat -= result[0].seats[i][1];result[0].remaining_seats -= result[0].seats[i][1];result[0].seats[i][1]=0}
                            i++;
                        }while(seat>0&&i<12);
                    }
                    // Send the updated seats to the frontEnd for Refresh
                    db.db('seatsArrangement').collection('seats').findOneAndUpdate({'_id':1},{$set:{'seats':result[0].seats,'remaining_seats':result[0].remaining_seats}},{returnOriginal: false}, function(err, res) {
                        if(err) reject()
                        resolve([res.value.seats,res.value.remaining_seats])
                    })
                })
            }catch(err){
                reject()
            }
        });
    })
    return data
}

module.exports.Booking = booking;