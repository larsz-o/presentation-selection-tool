const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

router.get('/', (req, res) => {
    const term = req.body;
    const query = `SELECT * FROM "term" ORDER BY "id" LIMIT 1;`;
    pool.query(query).then((results) =>{
        res.send(results.rows)
    }).catch((error) => {
        console.log('Error getting terms', error);
        res.sendStatus(500); 
    })
})
router.post('/', (req, res) => {
    const term = req.body;
    const query = `INSERT INTO "term" ("semester", "year") VALUES ($1, $2);`;
    pool.query(query, [term.term, term.year]).then((results) =>{
        res.sendStatus(201);
    }).catch((error) => {
        console.log('Error updating term', error);
        res.sendStatus(500); 
    })
})
module.exports = router;