var http = require('http'),
    qs = require('querystring'),
    fs = require('fs'),
    url = require('url'),
    port = 8080

// Add more movies! (For a technical challenge, use a file, database, or even an API!)
var movies = ['Jaws', 'Jaws 2', 'Jaws 3', 'Doctor Strange']
var filteredMovies = [];

var server = http.createServer(function(req, res) {
    var uri = url.parse(req.url)
        //Make a query variable
    var query = uri.query;
    console.log(query);
    // Note we no longer have an index.html file, but we handle the cases since that's what the browser will request
    // You'll need to modify the below to account for POSTs
    switch (uri.pathname) {
        case '/':
            //if there is nothing in the search, return all the movies
            filteredMovies = movies;
            sendIndex(res);
            break;
        case '/index.html':
            //same as base case
            filteredMovies = movies;
            sendIndex(res);
            break;
        case '/year':
            if (query && req.method === "GET") { // Search
                handleSearch(res, uri);
            } else {
                sendIndex(res);
            }
            break;
        case '/add':
            addMovie(res, req, movies);
            break;
        case '/delete':
            deleteMovie(res, req, movies);
            break;
        case '/style.css':
            sendFile(res, 'style.css', 'text/css');
            break;
        case '/js/scripts.js':
            sendFile(res, 'scripts.js', 'text/javascript');
            break;
        default:
            res.end('404 not found');
    }

})

server.listen(process.env.PORT || port);
console.log('listening on' + port);

// You'll be modifying this function for the search / query part
function handleSearch(res, uri) {
    var contentType = 'text/html';
    var query = uri.query;

    res.writeHead(200, { 'Content-type': contentType });
    // PROCESS THE URI TO FILTER MOVIES ARRAY BASED ON THE USER INPUT
    //Filter the query string
    if (query) {
        //Parse the query
        var data = qs.parse(query);
        //filter
        filterMovies(data.search, movies);
        //res = filterSearchQuery(qs);
        sendIndex(res);
    } else {
        console.log("Cannot find any movies.");
    }
}

//Function for filtering movies
//Takes in a search query and a list of movies
//
function filterMovies(searchQuery, movies) {
    //Create a new variable called filterMovie list
    var filteredMovieList = [];

    movies.forEach(function(movie) {
        //If the movie (not case dependent) has all characters in the search query,
        if (movie.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1) {
            //Add to the list of filtered movies
            filteredMovieList.push(movie);
        } else {
            console.log("Nothing to search");
        }
    });
    console.log(filteredMovieList);
    filteredMovies = filteredMovieList;
    console.log(filteredMovies);
}

//Function for adding a movie to the list of movies
//takes in a request, response and a list of movies
function addMovie(res, req, movies) {
    //Var for changed movie list
    var addedMovie;
    var firstLetter = '';
    var notFirstLetter = '';
    //Get data from the post request
    var postData = '';
    req.on('data', function(i) {
        postData += i;
    });
    req.on('end', function(i) {
        var data = qs.parse(postData);
        console.log(data);
        //get the first letter of the post data
        firstLetter = data.add[0];
        //assign the rest of the string
        notFirstLetter = data.add.substring(1, data.add.length);
        if (firstLetter != firstLetter.toUpperCase()) {
            addedMovie = firstLetter.toUpperCase() + notFirstLetter;
            //test
            console.log(addedMovie);
        } else {
            addedMovie = firstLetter + notFirstLetter;
            console.log(addedMovie);
        }
        //Add the movie to the list of movies
        movies.push(addedMovie);
        console.log(movies);
        filteredMovies = movies;
        //Load the page again
        sendIndex(res);
    });


    //Check if the movie is in the list already
    //Iterate through the list of movies
    /*movies.forEach(function(movie) {
        //If the movie is not in the list, add it to the empty list
        if (movie.toLowerCase() !== data.add.toLowerCase()) {
            addedList.push(addQuery);
        } else {
            //Return an error to assert your dominance
            console.log("This movie is already in the list.");
        }
    });*/
    //console.log(addedList);
    //sendIndex(res)
}


//Function for deleting a movie from the list of movies
function deleteMovie(res, req, movies) {
    //Var for changed movie list
    var deletedMovie;
    var firstLetter = '';
    var notFirstLetter = '';
    //Get data from the post request
    var postData = '';
    req.on('data', function(i) {
        postData += i;
    });
    req.on('end', function(i) {
        var data = qs.parse(postData);
        console.log(data);
        //get the first letter of the post data
        firstLetter = data.delete[0];
        //assign the rest of the string
        notFirstLetter = data.delete.substring(1, data.delete.length);
        if (firstLetter != firstLetter.toUpperCase()) {
            deletedMovie = firstLetter.toUpperCase() + notFirstLetter;
            //test
            console.log(deletedMovie);
        } else {
            deletedMovie = firstLetter + notFirstLetter;
            console.log(deletedMovie);
        }
        //Add the movie to the list of movies
        movies.splice(deletedMovie);
        console.log(movies);
        filteredMovies = movies;
        //Load the page again
        sendIndex(res);
    });

    //Check if the movie is in the list or not though iteration
    /*movies.forEach(function(movie) {
        //If the movie is in the list, delete it
        if (movie.toLowerCase() === deleteQuery.toLowerCase()) {
            deletedList = delete movies[movie];
            console.log("Deleted List is: \n");
            console.log(deletedList);
        } else {
            console.log("ERROR! The movie is not in the list.");
        }
    });*/
}

// Note: consider this your "index.html" for this assignment
// You'll be modifying this function
function sendIndex(res) {
    var contentType = 'text/html',
        html = ''

    html = html + '<html>'

    html = html + '<head>'
        // You could add a CSS and/or js call here...
    html = html + '    <meta charset="utf-8">'
    html = html + '    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">'
    html = html + '    <meta name="description" content="">'
    html = html + '    <meta name="author" content="">'
    html = html + '    <link rel="icon" href="">'
    html = html + ''
    html = html + '    <title>Billionaire Search</title>'
    html = html + ''
    html = html + '    <!-- Bootstrap core CSS -->'
    html = html + '    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css" integrity="sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M" crossorigin="anonymous">'
    html = html + '    <link href="https://fonts.googleapis.com/css?family=Lobster" rel="stylesheet">'
    html = html + '    <link rel="stylesheet" href="/style.css">'
    html = html + '</head>'

    html = html + '<body style="background: lightblue;">'
    html = html + '<div class="container-fluid">'
    html = html + '<h1>Billionaire Search!</h1>'
    html = html + '</div>'

    html = html + '<div class="container" id="forms">'
        // SEARCH by year FOR Billionaire IN LIST
    html = html + '<form action="" method="get">'
    html = html + '<input type="text" name="year" placeholder="Type a year to search..." />'
    html = html + '<button class="btn btn-primary" type="submit">Search</button>'
    html = html + '</form>'

    // SEARCH by rank FOR Billionaire IN LIST
    html = html + '<form action="" method="get">'
    html = html + '<input type="text" name="rank" placeholder="Type a rank to search..." />'
    html = html + '<button class="btn btn-primary" type="submit">Search</button>'
    html = html + '</form>'

    // SEARCH by gender FOR Billionaire IN LIST
    html = html + '<form action="" method="get">'
    html = html + '<input type="text" name="gender" placeholder="Type a gender to search..." />'
    html = html + '<button class="btn btn-primary" type="submit">Search</button>'
    html = html + '</form>'

    html = html + '</div>'

    html = html + '<div class="container">'
    html = html + '<h2>Billionaire List</h2>'
        //Start list of movies here
    html = html + '<ul>'
        // Note: the next line is fairly complex. 
        // The `map` function and `join` functions are VERY useful for working
        // with arrays, so I encourage you to tinker with the line below
        // and read up on the functions it uses.
        //
        // You may want to modify this function to accept a list of "filtered" movies...
    html = html + filteredMovies.map(function(d) { return '<li>' + d + '</li>' }).join(' ')
    html = html + '</ul>'
    html = html + '</div>'
        //End list of movies here
        //Put Bootstrap javascript files here
    html = html + '<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>'
    html = html + '<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js" integrity="sha384-b/U6ypiBEHpOf/4+1nzFpr53nxSS+GLCkfwBdFNTxtclqqenISfwAzpKaMNFNmj4" crossorigin="anonymous"></script>'
    html = html + '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/js/bootstrap.min.js" integrity="sha384-h0AbiXch4ZDo7tp9hKZ4TsHbi047NrKGLO3SEJAg45jXxnGIfYzk4Si90RDIqNm1" crossorigin="anonymous"></script>'
    html = html + '</body>'
    html = html + '</html>'

    res.writeHead(200, { 'Content-type': contentType });
    res.end(html, 'utf-8');
}

function sendFile(res, filename, contentType) {
    contentType = contentType || 'text/html';

    fs.readFile(filename, function(error, content) {
        res.writeHead(200, { 'Content-type': contentType });
        res.end(content, 'utf-8');
    })

}