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

        // await collection.createIndex({"geometry.coordinates": "2dsphere"})

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

        const coordinates = await collection.find({
            $or: [
                {
                    geometry: {
                        $geoWithin: {
                            $geometry: {
                                type: 'Polygon',
                                coordinates: [
                                    [
                                        [-180, 90],
                                        [-180, -90],
                                        [180, -90],
                                        [180, 90],
                                        [-180, 90]
                                    ]
                                ],
                                crs: {
                                    type: "name",
                                    properties: { name: "urn:x-mongodb:crs:strictwinding:EPSG:4326" }
                                }
                            }
                        }
                    }
                },
                {
                    geometry: {
                        $geoIntersects: {
                            $geometry: {
                                type: 'Polygon',
                                coordinates: [
                                    [
                                        [-180, 90],
                                        [-180, -90],
                                        [180, -90],
                                        [180, 90],
                                        [-180, 90]
                                    ]
                                ],
                                crs: {
                                    type: "name",
                                    properties: { name: "urn:x-mongodb:crs:strictwinding:EPSG:4326" }
                                }
                            }
                        }
                    }
                }
            ]
        }).toArray();

        console.log(coordinates);
        res.json(coordinates);
    }
    run();
});

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});
