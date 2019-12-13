// NPM dependencies and Express router function.
require("dotenv").config();
var express = require('express');
var router = express.Router();
var request = require('request');
var keys = require('../keys')

// Data model definition
var db = require('../models');

// GET route calls useing Sequelize's findAll method.
// This route hands the data it receives to handlebars so index can be rendered.
router.get('/', function(req, res) {
    db.Movie.findAll({
        order: [['movie_name', 'ASC']]

    }).then(function(data) {
        var hbsObject = {
            movies: data
        };
        res.render('index', hbsObject);
    });
});

router.get('/year', function(req, res) {
    db.Movie.findAll({
        order: [['movie_year', 'DESC']]

    }).then(function(data) {
        var hbsObject = {
            movies: data
        };
        res.render('index', hbsObject);
    });
});

router.get('/rating', function(req, res) {
    db.Movie.findAll({
        order: [['movie_ratingImdb', 'DESC']]

    }).then(function(data) {
        var hbsObject = {
            movies: data
        };
        res.render('index', hbsObject);
    });
});

// var queryUrl = import("./keys")
// var options = import("./keys")
// POST route which calls Sequelize's create method with the movie name given.
router.post('/api/new/movie', function(req, res) {
    
    var movieName = req.body.name;

    // console.log(`API KEY: ${keys.OMDB_API_KEY}`);
    // keys.imdb_api_key

    var queryUrl = `http://omdbapi.com/?apikey=${keys.OMDB_API_KEY}&t=${movieName}`;    
    request(queryUrl, function(error, response, body) {
       

        if (!error && JSON.parse(body).Response !== 'False') {
            console.log(JSON.parse(body));

            var imdbId = JSON.parse(body);
            

            console.log(imdbId);    

            var videos = "";

            var options = {
                method: 'GET',
                url: 'https://api.themoviedb.org/3/movie/' + imdbId + '/videos',
                qs: {
                    language: 'en-US',
                    api_key: keys.IMDB_API_KEY
                },
                body: '{}'
            };

            request(options, function(error, response, result) {

                if (error) res.redirect('/');


                if (!JSON.parse(result).results) {
                    // res.send('SOMETHING WENT WRONG');
                    res.redirect('/')
                } else {
                    videos = JSON.parse(result).results[0].key;
                    console.log(videos);
                    db.Movie.create({
                        movie_name: JSON.parse(body).Title,
                        movie_poster: JSON.parse(body).Poster,
                        movie_genre: JSON.parse(body).Genre,
                        movie_time: JSON.parse(body).Runtime,
                        movie_plot: JSON.parse(body).Plot,
                        movie_director: JSON.parse(body).Director,
                        movie_actors: JSON.parse(body).Actors,
                        movie_year: JSON.parse(body).Year,
                        movie_trailer: videos,
                        movie_ratingImdb: JSON.parse(body).Ratings[0].Value,
                        movie_ratingRotten: JSON.parse(body).Ratings[1].Value

                    }).then(function() {
                        res.redirect('/');
                    });

                }
            });

        } else {
            console.log("\nOops...Something didn't work with movie search. Try again...");
            res.redirect('/');
        }
    });
});


// update method to label movie as watched.
router.put('/api/new/watched/:id', function(req, res) {

    var watched = true;
    var ID = req.params.id;

    db.Movie.update({
        watched: watched,

    }, { where: { id: ID } }).then(function() {
        res.redirect('/');
    });
});


// PUT (update) route which calls Sequelize's update method to label movie as not yet watched .
router.put('/:id', function(req, res) {
    var watched = false;
    var ID = req.params.id;

    db.Movie.update({
        watched: watched,

    }, { where: { id: ID } }).then(function() {
        res.redirect('/');
    });
});

// Removing a movie
router.delete('/api/new/delete/:id', function(req, res) {

    var ID = req.params.id;

    db.Movie.destroy({
        where: { id: ID }
    }).then(function() {
        res.redirect('/');
    });
});

module.exports = router;