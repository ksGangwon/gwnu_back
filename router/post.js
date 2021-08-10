import express from 'express';

const router = express.Router();

const data = {
        username: 'text'
    };

router.get('/', (req, res, next) => {
    res.status(201).json({username:'bryan'});
});

router.post('/', (req, res, next) => {
    res.status(201).json(data);
});

router.put('/', (req, res, next) => {
    res.status(201).json(data);
});

router.delete('/', (req, res, next) => {
    res.status(204);
});

export default router;