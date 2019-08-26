const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

// for instructors to add new topics
router.post('/', (req, res) => {
    const entry = req.body;
    const table = req.query.name;
    console.log(table); 
    const query = `INSERT INTO ${table} ("signal", "claimed") VALUES ($1, $2);`;
    pool.query(query, [entry.signal, entry.claimed]).then((results) => {
        res.sendStatus(201);
    }).catch((error) => {
        console.log('Error posting signals', error); 
        res.sendStatus(500);
    })
})
router.put('/', (req, res) => {
    // to allow an instructor to edit the signal
    const entry = req.body;
    const query = `UPDATE "signals" SET "topic" = $1 WHERE "id" = $2;`;
    pool.query(query, [entry.signal, entry.id]).then((result) => {
        res.sendStatus(201);
    }).catch((error) => {
        console.log('Error editing signal', error);
        res.sendStatus(500);
    })
})
router.put('/claim', (req, res) => {
    // if a signal is already claimed, don't let a user claim it. if it isn't, allow them to.
    const claim = req.body;
    const table = req.query.name; 
    console.log('claim: ' + claim)
    for (let item in claim){
        console.log(item)
    }
    (async () => {
        const client = await pool.connect();
        try {
            let query = `SELECT * FROM ${table} WHERE "id" = $1;`;
            let result = await client.query(query, [claim.id]);
            if(result.rows[0].claimed){
                console.log('Already claimed');
                await client.query('COMMIT');
                res.sendStatus(403);
            } else {
                query = `UPDATE ${table} SET "student" = $1, "email" = $2, "claimed" = $3 WHERE "id" = $4 AND "claimed" = false;`;
                await client.query(query, [claim.student, claim.email, claim.claimed, claim.id]);
                await client.query('COMMIT');
                res.sendStatus(201);
            }
    } catch (error) {
        console.log('ROLLBACK', error);
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
    })().catch((error) => {
        console.log('CATCH', error);
        res.sendStatus(500);
    })
});

router.get('/', (req, res) => {
    const table = req.query.name; 
    const query = `SELECT * FROM ${table};`;
    pool.query(query).then((results) => {
        res.send(results.rows);
    }).catch((error) => {
        console.log(`Error getting ${table}`, error); 
        res.sendStatus(500);
    })
})
router.delete('/', (req, res) => {
    // to allow an instructor to edit the signal
    const entry = req.body;
    const query = `DELETE FROM "signals" WHERE "id" = $1;`;
    pool.query(query, [entry.id]).then((result) => {
        res.sendStatus(200);
    }).catch((error) => {
        console.log('Error deleting signal', error);
        res.sendStatus(500);
    })
})
module.exports = router;