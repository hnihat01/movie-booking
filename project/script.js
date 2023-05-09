

const container = document.querySelector(".container");
const seats = document.querySelectorAll(".row .seat:not(.sold)");
const count = document.getElementById("count");
const total = document.getElementById("total");
const movieSelect = document.getElementById("movie");


update();
// let ticketPrice = +movieSelect.value;

// Save selected movie index and price
// function setMovieData(movieIndex, moviePrice) {
//   localStorage.setItem("selectedMovieIndex", movieIndex);
//  // localStorage.setItem("selectedMoviePrice", moviePrice);
// }


function updateSelectedCount() {
  const selectedSeats = document.querySelectorAll(".row .seat.sold");
  const seatsIndex = [...selectedSeats].map((seat) =>
    [...seats].indexOf(seat)
  );
  localStorage.setItem("selectedSeats", JSON.stringify(seatsIndex));
  const selectedSeatsCount = selectedSeats.length;
  // count.innerText = selectedSeatsCount;
  // total.innerText = selectedSeatsCount * ticketPrice;

  // Add this block of code to convert selected seats to sold state
  selectedSeats.forEach((seat) => {
    seat.classList.remove("selected");
    seat.classList.add("sold");
  });

 // setMovieData(movieSelect.selectedIndex, movieSelect.value);
}

// Get data from localstorage and populate UI
// Movie select event
// movieSelect.addEventListener("change", (e) => {
//   ticketPrice = +e.target.value;
//   setMovieData(e.target.selectedIndex, e.target.value);
//   updateSelectedCount();
// });

// Seat click event
container.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("seat") &&
    !e.target.classList.contains("sold")
  ) {
    e.target.classList.toggle("selected");

    updateSelectedCount();
  }
});


// Initial count and total set
updateSelectedCount();


function update() {
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get('data-id');
  console.log(`Movie ID: ${movieId}`); 
  const showtimeId = urlParams.get('showtimeId');
  console.log(`showtime ID: ${showtimeId}`);
  const buyButton = document.getElementById('buy-button');
  const seats = document.querySelectorAll('.row .seat');
  fetch(`http://localhost:4000/sold?showtimeId=${showtimeId}`)
  .then(response => response.json())
  .then(data => {
    const soldSeats = data;
    const soldRowNumbers = soldSeats.map(seat => seat.seat_row);
    console.log('Sold seat row numbers:', soldRowNumbers);

for (let i = 0; i < seats.length; i++) {
  const seat = seats[i];
if (soldRowNumbers.includes(i) ){
    seat.classList.remove('available');
    seat.classList.add('sold');
    seat.disabled = true; } else {
    seat.classList.remove('sold');
    seat.classList.add('available');
    seat.disabled = false; }} }).catch(error => {
    console.error('Error fetching sold seats:', error); });
  buyButton.addEventListener('click', () => {
    // Get all the selected seats
    const selectedSeats = document.querySelectorAll('.row .seat.selected');
    const seatNumbers = [...selectedSeats].map((seat) => {
      return [...seats].indexOf(seat);
    });
    console.log("seat:",seatNumbers);
    
  
    // Send the seatsIndex as JSON to the server
    fetch('http://localhost:4000/seats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ movieId: movieId, showtimeId: showtimeId, seatNumbers: seatNumbers })
    })
    .then(response => {
      console.log('Seats saved successfully!');
      localStorage.setItem('seatNumbers', JSON.stringify(seatNumbers));
      // Redirect to proba.html
     // window.location.href = 'proba.html';
    //  window.location.reload(); // Reload the page after successful save
    })
    .catch(error => {
      console.error('Error saving seats:', error);
    });});
  seats.forEach((seat) => {
    seat.addEventListener('click', () => {
      // Toggle the 'selected' class on the seat
      seat.classList.toggle('selected');
    });
    // Add a click event listener to each seat without row
    seat.addEventListener('click', () => {
      // Toggle the 'selected' class on the seat without row
      seat.classList.toggle('selected');
    });
  });}

  document.getElementById("next-step1").addEventListener("click", function(event) {
    event.preventDefault(); // prevent the form from submitting normally
    var formData = new FormData(document.getElementById("myForm"));
    var fname = formData.get('fname');
    var lname = formData.get('lname');
    var email = formData.get('email');
    var pnumber = formData.get('phone');
    fetch('http://localhost:4000/customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fname: fname, lname: lname, email: email, pnumber: pnumber })
    })
    .then(response => {
      console.log('Customer data  saved successfully!');
      //  window.location.reload(); // Reload the page after successful save
    })
    .catch(error => {
      console.error('Error saving data:', error);
    });
  });
  
 
  
    //   function ticketInfor() {
    //     const urlParams = new URLSearchParams(window.location.search);
    //     const showtimeId = urlParams.get('showtimeId');
    //     console.log(`Showtime ID: ${showtimeId}`);
    //     const ticketButton = document.getElementById('next-step2');
    //     ticketButton.addEventListener('click', () => {
    //       fetch(`http://localhost:4000/showtime?showtimeId=${showtimeId}`)
    // .then(response => response.json())
    // .then(data => {
    //     // Assign fetched data to variables
    //     const idmovies = data[0].idmovies;
    //     const title = data[0].title;
    //     const runtime = data[0].runtime;
    //     const des = data[0].des;
    //     const images = `data:${data[0].type};base64,${data[0].data}`;
    //     const showtime = data[0].showtime_id;
    //     const price = data[0].showtime_price;
    //     const start = data[0].showtime_start;
    //     const date = data[0].showtime_date.substring(0, 10);
    //     const theater = data[0].showtime_theater;

    //     // Check variable values
    //     console.log('Fetched Data:', idmovies, title, runtime, des, showtime, price, start, date, theater);

    //     // Update the HTML elements with fetched data
    //     const titleElement = document.querySelector('.show-name h1');
    //     const runtimeElement = document.querySelector('.time p:first-of-type');
    //     const dateElement = document.querySelector('.date .nov-10');
    //     const theaterElement = document.querySelector('.time p:last-of-type');
    //     const priceElement = document.querySelector('.right-info-container p:first-of-type');
    //     const imageElement = document.querySelector('.image img');
    //     const descriptionElement = document.querySelector('.show-name h2');
    //     const startElement = document.querySelector('.time p:first-of-type');

    //     titleElement.textContent = title;
    //     runtimeElement.textContent = `${runtime} min`;
    //     dateElement.textContent = date;
    //     theaterElement.textContent = theater;
    //     priceElement.textContent = `$${price.toFixed(2)}`;
    //     imageElement.src = images;
    //     descriptionElement.textContent = des;
    //     startElement.textContent = `Start time: ${start}`;

    //     // Create ticket HTML using interpolated variables
    //     const ticketHtml = `
    //         <div class="ticket">
    //             <div class="left">
    //                 <div class="image">
    //                     <p class="admit-one">
    //                         <span>ADMIT ONE</span>
    //                         <span>ADMIT ONE</span>
    //                         <span>ADMIT ONE</span>
    //                     </p>
    //                     <div class="ticket-number">
    //                         <p>#20231304</p>
    //                     </div>
    //                     <img src="${images}" alt="${title}">
    //                 </div>
    //                 <div class="ticket-info">
    //                     <p class="date">
    //                         <span class="nov-10">${date}</span>
    //                     </p>
    //                     <div class="show-name">
    //                         <h1>${title}</h1>
    //                         <h2>${des}</h2>
    //                     </div>
    //                     <div class="time">
    //                         <p>${start} <span>TO</span> TBD</p>
    //                         <p>${runtime} minutes</p>
    //                         <span class="separator"></span>
    //                     </div>
    //                 </div>
    //                 </div>
    //                 <div class="right">
    //                     <p class="admit-one">
    //                         <span>ADMIT ONE</span>
    //                         <span>ADMIT ONE</span>
    //                         <span>ADMIT ONE</span>
    //                     </p>
    //                     <div class="right-info-container">
    //                         <div class="show-name">
    //                             <h1>${title}</h1>
    //                         </div>
    //                         <div class="time">
    //                             <p>${date}</p>
    //                             <p>${start} <span>TO</span> TBD</p>
    //                         </div>
    //                         <div class="barcode">
    //                             <img src="https://i.imgur.com/HMAAsVO.png" alt="QR code">
    //                         </div>
    //                         <p class="ticket-number">#20231304</p>
    //                     </div>
    //                 </div>
    //             </div>`;
    //             const ticketContainer = document.getElementById('ticket-container');
    //             ticketContainer.innerHTML = ticketHtml;
                
    //         })
    //         .catch(error => {
    //           // Handle errors
    //           console.error("error");
    //         });
    //     })
    //   }
    //   ticketInfor();
   
  