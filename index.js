const express = require("express");
const app = express();
const path = require('path');
const { MongoClient } = require('mongodb');
app.use(express.static(path.join(__dirname)));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const uri = 'mongodb://localhost:27017';
const dbName = 'MAP';
const collectionName = 'DATA';
const client = new MongoClient(uri);



app.get("/get", (req, res) => {
    
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
        res.json(coordinates1);
    }
    run();
});

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});
