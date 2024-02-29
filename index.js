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
    
    // const coordinates = await collection.find({
    //     geometry: {
    //         $geoIntersects: {
    //             $geometry: {
    //                 type: "Point",
    //                 coordinates: [
    //                     -109.99966285694285, 53.46562803128239
    //                 ]
    //             }
    //         }
    //     }
    // }).toArray();
    // console.log(coordinates);

    const coordinates1 = await collection.find({
        geometry: {
            $geoWithin: {
                $geometry: {
                    type: "Polygon",
                    coordinates: [[
                        [-111.40479608562224, 34.96467921321002],
                        [-113.22068511462602, -72.56307011151927],
                        [-17.160152709499144, -71.65489653547726],
                        [-20.24716544421895, 36.05448819734188],
                        [-111.40479608562224, 34.96467921321002]
                    ]]
                }
            }
        }
    }).toArray();
    console.log(coordinates1);


    // const coordinates1 = await collection.find({
    //     geometry: {
    //         $geoWithin: {
    //             $geometry: {
    //                 type: "Polygon",
    //                 coordinates: [[
    //                     [-109.99966285694285, 53.465628031282392],
    //                     [-109.99943214404341, 48.993082694652713],
    //                     [-114.06251701583469, 48.993082694652713],
    //                     [-114.73402338910687, 49.587201369660278],
    //                     [-114.99279537163449, 50.545033437448694],
    //                     [-116.67403322873736, 51.790685340435289],
    //                     [-118.22102364419568, 52.386100402211071],
    //                     [-118.80367259220323, 53.153396574059229],
    //                     [-119.89384048046952, 53.515549908186784],
    //                     [-120.00000686635538, 60.001087264965378],
    //                     [-110.0000254057848, 60.001087264965378],
    //                     [-109.99966285694285, 53.465628031282392]
    //                 ]]
    //             }
    //         }
    //     }
    // }).toArray();
    // console.log(coordinates1);



}
run();


app.get("/", (req, res) => {
    res.render("index");
});

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});
