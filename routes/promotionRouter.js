const { application } = require('express');
const express = require ('express');
const Promotion = require ('../models/promotion');
const promotionRouter = express.Router();
const authenticate = require('../authenticate');
const cors = require('./cors');


promotionRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

.get(cors.cors, (req, res, next) => {
    Promotion.find()
    .then(promotions => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotion.create(req.body)
    .then(promotion => {
        console.log('Partner Created', promotion)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
        res
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotion');
})
.delete(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
    Promotion.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

promotionRouter.route('/:promotionId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

.get(cors.cors, (req, res, next) => {
    Promotion.findById(req.params.promotionId)
    .then(promotion => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /promotion/${req.params.promotionId}`);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.write(`Updating the promotion: ${req.params.promotionId}\n`);
    res.end(`Will update the promotion: ${req.body.name} with description: ${req.params.description}`)
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Promotion.findByIdAndDelete(req.params.promotionId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = promotionRouter;

