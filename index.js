const express = require("express");
const app = express();
app.use(express.static("App"));
const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017';
const dbName = 'MAP';
const collectionName = 'DATA';
const client = new MongoClient(uri);


async function run() {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const coordinates = await collection.findOne({
        features: [{
            geometry: {
                $geoIntersects: {
                    $geometry: {
                        type: "Point",
                        coordinates: [
                            -109.99966285694285, 53.465628031282392
                        ]
                    }
                }
            }
        }]
    })
    console.log(coordinates);

    // const coordinates1 = await collection.findOne({
    //     loc: {
    //         $geoWithin: {
    //             $geometry: {
    //                 type: "Polygon",
    //                 coordinates: [[
    //                     [-73.95, 40.80],
    //                     [-73.94, 40.79],
    //                     [-73.97, 40.76],
    //                     [-73.98, 40.76],
    //                     [-73.95, 40.80]
    //                 ]]
    //             }
    //         }
    //     }
    // });
    // console.log(coordinates1);

    // const coordinates2 = await collection.findOne({
    //     loc: {
    //         $geoIntersects: {
    //             $geometry: {
    //                 type: "Point",
    //                 coordinates: [
    //                     -73.97, 40.77,
    //                 ]
    //             }
    //         }
    //     }
    // });
    // console.log(coordinates2);
}
run();


app.get("/", (req, res) => {
    res.render("index");
});

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});
