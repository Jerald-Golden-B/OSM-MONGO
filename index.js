const express = require("express");
const app = express();
const path = require('path');
const { MongoClient } = require('mongodb');
app.use(express.static(path.join(__dirname)));
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const uri = 'mongodb://localhost:27017';
const dbName = 'MAP';
const collectionName = 'DATA';
const client = new MongoClient(uri);



app.post("/get", (req, res) => {
    let boxCoordinates = req.body.coordinates;
    console.log(boxCoordinates);

    async function run() {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const coordinates = await collection.find({
            $or: [
                {
                    geometry: {
                        $geoWithin: {
                            $geometry: {
                                type: 'Polygon',
                                coordinates: [
                                    boxCoordinates
                                ],
                                crs: {
                                    type: "name",
                                    properties: { name: "urn:x-mongodb:crs:strictwinding:EPSG:4326" }
                                }
                            }
                        }
                    }
                },
                // {
                //     geometry: {
                //         $geoIntersects: {
                //             $geometry: {
                //                 type: 'Polygon',
                //                 coordinates: [
                //                     boxCoordinates
                //                 ],
                //                 crs: {
                //                     type: "name",
                //                     properties: { name: "urn:x-mongodb:crs:strictwinding:EPSG:4326" }
                //                 }
                //             }
                //         }
                //     }
                // }
            ]
        }).toArray();

        // console.log(coordinates);
        res.json(coordinates);
    }
    run();
});

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});
