

const express=require('express')
const bodyParser = require('body-parser');
const mysql2 = require('mysql2/promise');
const cors = require('cors');
const mysql = require('mysql');
const app=express();


const path = require('path');

const mime = require('mime');

app.use(express.static('public'));

const{createPool}=require('mysql')

const pool=createPool({
    host:"localhost",
    user:"root",
    password:"123456",
    database:'cinema',
    connectionLimit:10,
    waitForConnections: true,
    queueLimit: 0
})

module.exports = pool;
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

app.get('/movies', async (req, res) => {
    try {
        const connection = await mysql2.createConnection({
            host: 'localhost',
            user: 'root',
            password: '123456',
            database:'cinema',
            connectionLimit:10,
            waitForConnections: true,
            queueLimit: 0
          });
      const [rows, fields] = await connection.execute(`SELECT 
      movies.idmovies, 
      movies.title, 
      movies.runtime, 
      movies.des, 
      movies.images, 
      MAX(showtimes1.idshowtimes) AS idshowtimes1, 
      MAX(showtimes1.start_time) AS start_time1, 
	   MAX(showtimes1.show_date) AS date1,
      MAX(showtimes1.price) AS price1, 
      MAX(showtimes1.theater) AS theater1,
        MAX(showtimes1.show_date) AS date1,
        MAX(showtimes2.show_date) AS date2, 
      MAX(showtimes2.idshowtimes) AS idshowtimes2, 
      MAX(showtimes2.start_time) AS start_time2, 
	  MAX(showtimes2.show_date) AS date2,
      MAX(showtimes2.price) AS price2, 
      MAX(showtimes2.theater) AS theater2  
    FROM 
      cinema.showtimes AS showtimes1 
      JOIN cinema.showtimes AS showtimes2 ON showtimes1.idmovies = showtimes2.idmovies AND showtimes1.idshowtimes < showtimes2.idshowtimes
      JOIN cinema.movies AS movies ON movies.idmovies = showtimes1.idmovies 
    GROUP BY 
      movies.idmovies, 
      movies.title, 
      movies.runtime, 
      movies.des, 
      movies.images, 
      showtimes1.idshowtimes;`);
      const movies = [];
// Iterate over the rows array and group the data by movie
rows.forEach(row => {
  let movieIndex = movies.findIndex(movie => movie.idmovies === row.idmovies);
  movies.push({
    idmovies: row.idmovies,
    title: row.title,
    runtime: row.runtime,
    des: row.des,
    data: row.images.toString('base64'),
    type: 'image/png',
    showtime1_id: row.idshowtimes1,
    price1: row.price1,
    start_time1: row.start_time1,
    showtime1_date:row.date1,
    theater1: row.theater1,
    date1: row.date1,
    date2: row.date2,
    showtime2_id: row.idshowtimes2,
    start_time2: row.start_time2,
    showtime2_date:row.date2,
    theater2: row.theater2,
    price2: row.price2,
  });
  // <h2>id: ${movie.idmovies}</h2>
//   <p>title: ${movie.title}</p>
//   <p>runtime: ${movie.runtime}</p>
//   <p>description: ${movie.des}</p> 
// <p>idshowtimes: ${movie.idshowtimes1}- start_time: ${movie.start_time1} - theater: ${movie.theater1} - price: ${movie.price1} </p>
// <p>idshowtimes: ${movie.idshowtimes2}-start_time 2: ${movie.start_time2} - theater 2: ${movie.theater2}- price: ${movie.price2}</p>

//   <a href="proba.html?showtimeId=${movie.idshowtimes1}&data-id=${movie.idmovies}">
//   <button>${movie.start_time1}</button>
// </a>
// <a href="proba.html?showtimeId=${movie.idshowtimes2}&data-id=${movie.idmovies}">
//   <button>${movie.start_time2}</button>
// </a>


});

      // Send the array of objects as JSON with the Content-Type header set to application/json
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(movies));
    } catch (err) {
      console.error(err);
      res.status(500).send('Error');
    }
  });


  
app.get('/movie', async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm;
  //  console.log(searchTerm);
      const connection = await mysql2.createConnection({
          host: 'localhost',
          user: 'root',
          password: '123456',
          database:'cinema',
          connectionLimit:10,
          waitForConnections: true,
          queueLimit: 0,
          namedPlaceholders: true // enable named placeholders
        });
    const [rows, fields] = await connection.execute(`  SELECT 
    movies.idmovies, 
    movies.title, 
    movies.runtime, 
    movies.des, 
    movies.images, 
    MAX(showtimes1.idshowtimes) AS idshowtimes1, 
    MAX(showtimes1.start_time) AS start_time1, 
    MAX(showtimes1.show_date) AS date1,
    MAX(showtimes1.price) AS price1, 
    MAX(showtimes1.theater) AS theater1,
    MAX(showtimes2.idshowtimes) AS idshowtimes2, 
    MAX(showtimes2.start_time) AS start_time2, 
    MAX(showtimes2.show_date) AS date2,
    MAX(showtimes2.price) AS price2, 
    MAX(showtimes2.theater) AS theater2  
  FROM 
    cinema.showtimes AS showtimes1 
    JOIN cinema.showtimes AS showtimes2 ON showtimes1.idmovies = showtimes2.idmovies AND showtimes1.idshowtimes < showtimes2.idshowtimes
    JOIN cinema.movies AS movies ON movies.idmovies = showtimes1.idmovies 
    WHERE movies.title LIKE ?
  GROUP BY 
    movies.idmovies, 
    movies.title, 
    movies.runtime, 
    movies.des, 
    movies.images, 
    showtimes1.idshowtimes;`,[`%${searchTerm}%`]);
 
    const movies = [];
// Iterate over the rows array and group the data by movie
rows.forEach(row => {
let movieIndex = movies.findIndex(movie => movie.idmovies === row.idmovies);
movies.push({
  idmovies: row.idmovies,
  title: row.title,
  runtime: row.runtime,
  des: row.des,
  data: row.images.toString('base64'),
  type: 'image/png',
  showtime1_id: row.idshowtimes1,
  showtime1_price: row.price1,
  showtime1_start: row.start_time1,
  showtime1_date:row.date1,
  showtime1_theater: row.theater1,
  showtime2_id: row.idshowtimes2,
  showtime2_start: row.start_time2,
  showtime2_date:row.date2,
  showtime2_theater: row.theater2,
  showtime2_price: row.price2,
});


});
//console.log(movies)
    // Send the array of objects as JSON with the Content-Type header set to application/json
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(movies));
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

app.get('/showtime', async (req, res) => {
  try {
    const showtimeId = req.query.showtimeId;
  //  console.log(searchTerm);
      const connection = await mysql2.createConnection({
          host: 'localhost',
          user: 'root',
          password: '123456',
          database:'cinema',
          connectionLimit:10,
          waitForConnections: true,
          queueLimit: 0,
          namedPlaceholders: true // enable named placeholders
        });
    const [rows, fields] = await connection.execute(`SELECT  movies.idmovies, movies.title, movies.runtime, movies.des, movies.images, showtimes.idshowtimes, showtimes.start_time,showtimes.price, showtimes.theater, showtimes.show_date AS date from showtimes join movies on movies.idmovies=showtimes.idmovies where showtimes.idshowtimes=?
    `,[showtimeId]);
 
    const movies = [];
// Iterate over the rows array and group the data by movie
rows.forEach(row => {
let movieIndex = movies.findIndex(movie => movie.idmovies === row.idmovies);
movies.push({
  idmovies: row.idmovies,
  title: row.title, 
  runtime: row.runtime,
  des: row.des,
  data: row.images.toString('base64'),
  type: 'image/png',
  showtime_id: row.idshowtimes,
  showtime_price: row.price,
  showtime_start: row.start_time,
  showtime_date:row.date,
  showtime_theater: row.theater
});
});
//console.log(movies)
    // Send the array of objects as JSON with the Content-Type header set to application/json
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(movies));
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

app.get('/movieInfo', async (req, res) => {
  try {
    const movieId = req.query.movieId;
    //console.log(movieId);
      const connection = await mysql2.createConnection({
          host: 'localhost',
          user: 'root',
          password: '123456',
          database:'cinema',
          connectionLimit:10,
          waitForConnections: true,
          queueLimit: 0,
          namedPlaceholders: true // enable named placeholders
        });
    const [rows, fields] = await connection.execute(`  SELECT 
    movies.idmovies, 
    movies.title, 
    movies.runtime, 
    movies.des, 
    movies.images, 
    movies.backie,
    MAX(showtimes1.idshowtimes) AS idshowtimes1, 
    MAX(showtimes1.start_time) AS start_time1, 
    MAX(showtimes1.show_date) AS date1,
    MAX(showtimes1.price) AS price1, 
    MAX(showtimes1.theater) AS theater1,
    MAX(showtimes2.idshowtimes) AS idshowtimes2, 
    MAX(showtimes2.start_time) AS start_time2, 
    MAX(showtimes2.show_date) AS date2,
    MAX(showtimes2.price) AS price2, 
    MAX(showtimes2.theater) AS theater2  
  FROM 
    cinema.showtimes AS showtimes1 
    JOIN cinema.showtimes AS showtimes2 ON showtimes1.idmovies = showtimes2.idmovies AND showtimes1.idshowtimes < showtimes2.idshowtimes
    JOIN cinema.movies AS movies ON movies.idmovies = showtimes1.idmovies 
    WHERE movies.idmovies= ?
  GROUP BY 
    movies.idmovies, 
    movies.title, 
    movies.runtime, 
    movies.des, 
    movies.images, 
    showtimes1.idshowtimes;`,[movieId]);
 
    const movies = [];
// Iterate over the rows array and group the data by movie
rows.forEach(row => {
let movieIndex = movies.findIndex(movie => movie.idmovies === row.idmovies);
movies.push({
  idmovies: row.idmovies,
  title: row.title,
  runtime: row.runtime,
  des: row.des,
  data: row.images.toString('base64'),
  type: 'image/png',
  data1: row.backie.toString('base64'),
  type1: 'image/jpeg',
  idshowtimes1: row.idshowtimes1,
  price1: row.price1,
  time1: row.start_time1,
  date1:row.date1,
  theater1: row.theater1,
 idshowtimes2: row.idshowtimes2,
  time2: row.start_time2,
  date2:row.date2,
  theater2: row.theater2,
  price2: row.price2,
});


});
//console.log(movies)
    // Send the array of objects as JSON with the Content-Type header set to application/json
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(movies));
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

  app.get('/favicon.ico', (req, res) => res.status(204));

  app.get('/sold', async (req, res) => {
    try {
      // Extract the movie ID from the query parameter
      const showtimeId = req.query.showtimeId;
      console.log(`Movie Id: ${showtimeId}`);
      // Fetch the sold seats data for the given movie ID
      const connection = await mysql2.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'cinema'
      });
      const [rows, fields] = await connection.execute("SELECT * FROM seats WHERE idshowtime = ?", [showtimeId]);
  
      // Convert the database rows to an array of objects
      const soldSeats = rows.map(row => ({
        seat_row: row.seat_row
      }));
  console.log(soldSeats);
      // Send the sold seats data as JSON
      res.json(soldSeats);
    } catch (error) {
      console.error('Error fetching sold seats:', error);
      res.status(500).send('Internal server error');
    }
  });

  app.get('/common', async (req, res) => {
    try {
      // Extract the movie ID from the query parameter
   //   const showtimeId = req.query.showtimeId;
    //  console.log(`Movie Id: ${showtimeId}`);
      // Fetch the sold seats data for the given movie ID
      const connection = await mysql2.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'cinema'
      });
      const [rows, fields] = await connection.execute(`
      SELECT 
        movies.idmovies, 
        movies.title, 
        movies.runtime, 
        movies.des, 
        movies.images, 
        movies.backie,
        MAX(showtimes1.idshowtimes) AS idshowtimes1, 
        MAX(showtimes1.start_time) AS start_time1, 
        MAX(showtimes1.price) AS price1, 
        MAX(showtimes1.theater) AS theater1,
        MAX(showtimes1.show_date) AS date1,
        MAX(showtimes2.show_date) AS date2, 
        MAX(showtimes2.idshowtimes) AS idshowtimes2, 
        MAX(showtimes2.start_time) AS start_time2, 
        MAX(showtimes2.price) AS price2, 
        MAX(showtimes2.theater) AS theater2  

      FROM 
        cinema.showtimes AS showtimes1 
        JOIN cinema.showtimes AS showtimes2 ON showtimes1.idmovies = showtimes2.idmovies AND showtimes1.idshowtimes < showtimes2.idshowtimes
        JOIN cinema.movies AS movies ON movies.idmovies = showtimes1.idmovies 
        JOIN (
          SELECT idmovie, COUNT(*) as count
          FROM cinema.seats
          GROUP BY idmovie
          ORDER BY count DESC
        ) AS most_sold_movie ON movies.idmovies = most_sold_movie.idmovie
      WHERE 
        showtimes1.idmovies = most_sold_movie.idmovie
      GROUP BY 
        movies.idmovies, 
        movies.title, 
        movies.runtime, 
        movies.des, 
        movies.images, 
        showtimes1.idshowtimes
      ORDER BY most_sold_movie.count DESC LIMIT 5;
    `);
  
      // Convert the database rows to an array of objects
      const common = rows.map(row => ({
        idmovies: row.idmovies,
        title: row.title,
        runtime: row.runtime,
        des: row.des,
        data: row.images.toString('base64'),
        type: 'image/png',
        data1: row.backie.toString('base64'),
        type1: 'image/jpeg',
        idshowtimes1: row.idshowtimes1,
        time1: row.start_time1,
        price1: row.price1,
        theater1: row.theater1,
        date1: row.date1,
        date2: row.date2,
        idshowtimes2: row.idshowtimes2,
        start_time2: row.start_time2,
        price2: row.price2,
        theater2: row.theater2
      }));
   //  console.log(common);
      // Send the sold seats data as JSON
      res.json(common);
    } catch (error) {
      console.error('Error fetching sold seats:', error);
      res.status(500).send('Internal server error');
    }
  });
  
  app.post('/seats', (req, res) => {
    const { movieId, showtimeId, seatNumbers } = req.body;
   
    console.log('Received seats:', seatNumbers, 'for movie:', movieId, 'showtime id',showtimeId);
  
    // Use the connection pool to execute the insert query
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error getting database connection:', err);
        res.status(500).send('Error saving seats');
      } else {
        // Construct the SQL query
        const sql = 'INSERT INTO cinema.seats (seat_row,idmovie, idshowtime) VALUES ?';
  
        // Map the seat numbers to an array of arrays
        const seatValues = seatNumbers.map(seatNumber => [seatNumber,movieId, showtimeId]);
  
        // Use the connection to execute the query with the seats data
        connection.query(sql, [seatValues], (error, results, fields) => {
          connection.release(); // Release the connection back to the pool
  
          if (error) {
            console.error('Error saving seats:', error);
            res.status(500).send('Error saving seats');
          } else {
            console.log('Seats saved successfully!');
            res.status(200).send('Seats saved successfully!');
          }
        });
      }
    });
  });
  app.post('/customer',( req, ress)=>{

    const { fname, lname, email,pnumber } = req.body;
   
    //console.log('name:', fname, lname, 'email ',email,'number',pnumber);
     // do something with the form data
    
     pool.query('INSERT INTO cinema.customers (customer_fname, customer_lname, customer_email,phone_number) VALUES (?,?,?,?) ',
     [ fname, lname, email, pnumber], (error, results, fields) => {
       if (error) {
           console.error(error);
           ress.sendStatus(500);
       } else {
           console.log(results);
           ress.sendStatus(200);
       }
   });
   
  });
  
  
/*
app.post('/seats', (req, res) => {
  const seatsIndex = req.body;
  console.log('Received seats:', seatsIndex);
  const seats = seatsIndex.map(({ rowIndex, seatIndex }) => ({
    row: rowIndex,
    number: seatIndex,
  }));

  // Use the connection pool to execute the insert query
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting database connection:', err);
      res.status(500).send('Error saving seats');
    } else {
      // Construct the SQL query
      const sql = 'INSERT INTO cinema.seats ( seat_row, number) VALUES (?)';

      // Use the connection to execute the query with the seats data
      connection.query(sql, seats.map(seat => [seat.row, seat.number]), (error, results, fields) => {
        connection.release(); // Release the connection back to the pool

        if (error) {
          console.error('Error saving seats:', error);
          res.status(500).send('Error saving seats');
        } else {
          console.log('Seats saved successfully!');
        //  res.status(200).send('Seats saved successfully!');
        }
      });
    }
  });
  res.status(200).send('Seats saved successfully!');
});
*/
  app.listen(4000,()=>{console.log("listening on port 4000")});
