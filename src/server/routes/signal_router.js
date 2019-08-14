const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

router.post('/', (req, res) => {
    const entry = req.body;
    const query = `INSERT INTO "signals" ("signal", "claimed") VALUES ($1, $2);`;
    pool.query(query, [entry.signal, entry.claimed]).then((results) => {
        res.sendStatus(201);
    }).catch((error) => {
        console.log('Error posting signals', error); 
    })
})
router.put('/claim', (req, res) => {
    const claim = req.body;
    const query = `UPDATE "signals" SET "student" = $1, "email" = $2, "claimed" = $3 WHERE "id" = $4 AND "claimed" = false;`;
    pool.query(query, [claim.student, claim.email, claim.claimed, claim.id]).then((result) => {
        res.sendStatus(201);
    }).catch((error) => {
        console.log('Error claiming signal', error);
    })
})
router.get('/', (req, res) => {
    const query = `SELECT * FROM "signals";`;
    pool.query(query).then((results) => {
        res.send(results.rows);
    }).catch((error) => {
        console.log('Error getting signals', error); 
    })
})

module.exports = router;