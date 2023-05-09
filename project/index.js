const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Inside the movies.forEach loop:

  //const moviesContainer = document.querySelector('#movies-container');
  const slideshowContainer = document.querySelector('.slideshow-container');
  fetch('http://localhost:4000/common')
  .then(response => response.json())
  .then(movies => {
    movies.forEach((movie, index) => {
      const monthIndex = parseInt(movie.date1.substring(5, 7)) - 1; // subtract 1 since array is 0-indexed
      const monthName = monthNames[monthIndex];
      const infoDiv = document.createElement('div');

      infoDiv.innerHTML = `
        <div class="movie_card" id="bright">
          <div class="info_section">
            <div class="movie_header">
            <a href="movie.html?movieId=${movie.idmovies}"> 
              <img class="locandina" src="data:${movie.type};base64,${movie.data}"/>
              ${createNumberedHeaders(index)} <h1>${movie.title}</h1>
              </a>
              <h4>${movie.runtime} min, ${movie.des}</h4>
              
            </div>
            <div class="movie_desc">
              <a href="buy-ticket.html?showtimeId=${movie.idshowtimes1}&data-id=${movie.idmovies}">
              <button><b><i class="fas fa-film" ></i>${monthName} ${movie.date1.substring(8, 10)}</i><br><i class="far fa-clock"></i>${movie.time1}<br><i class="fas fa-theater-masks"></i> Theater ${movie.theater1}<br><i class="fas fa-money-bill"></i>  price ${movie.price1}$</b></button>
              </a>
              <a href="buy-ticket.html?showtimeId=${movie.idshowtimes2}&data-id=${movie.idmovies}">
                <button><b><i class="fas fa-film" ></i>${monthName} ${movie.date2.substring(8, 10)}</i><br><i class="far fa-clock"></i>${movie.start_time2}<br><i class="fas fa-theater-masks"></i> Theater ${movie.theater2}<br><i class="fas fa-money-bill"></i>  price ${movie.price2}$</b></button>
              </a>
             </div>
          </div>
          <div class="blur_back bright_back"></div>
        </div>
      `;

      const brightBack = infoDiv.querySelector('.bright_back');
      brightBack.style.backgroundImage = `url(data:${movie.type1};base64,${movie.data1})`;

      // Append the infoDiv to the moviesContainer
      slideshowContainer.appendChild(infoDiv);

    });
  
    function createNumberedHeaders(index) {
  return `<h1> TOP #${index + 1}</h1>`;
}

const slides = document.querySelectorAll('.movie_card');
let slideIndex = 0;

function showSlides() {
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = 'none';
  }
  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }
  slides[slideIndex - 1].style.display = 'block';
  setTimeout(showSlides, 2000); // Change image every 2 seconds
}

showSlides();
    // Add event listeners to all the movie buttons
    const buttons = document.querySelectorAll('.movie-id');
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const movieId = button.getAttribute('data-id');
        console.log(`Clicked on movie with ID: ${movieId}`);
      });
    });
  });
  
  const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const searchResults = document.getElementById('searchResults');
const resultList = searchResults.querySelector('.result-list');
let movieIdToOpen = null;

async function searchMovies() {
  const searchTerm = searchInput.value.trim().toUpperCase();
  try {
    const response = await fetch(`http://localhost:4000/movie?searchTerm=${searchTerm}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const movies = await response.json();
    let html = '';
    movies.forEach(movie => {
      html += `<li class="result-item" data-id="${movie.idmovies}">
        <img src="data:${movie.type};base64,${movie.data}" alt="${movie.title}">
        <div>
          <h2>${movie.title}</h2>
          <p>${movie.des}</p> 
        </div>
      </li>`;
    });
    resultList.innerHTML = html;
    searchResults.style.display = 'block';
  } catch (error) {
    console.error(error);
  }
}
searchButton.addEventListener('click', searchMovies);
searchInput.addEventListener('input', searchMovies);

searchInput.addEventListener('blur', () => {
  setTimeout(() => {
    searchResults.style.display = 'none';
  }, 100);
});

searchResults.addEventListener('mousedown', (event) => {
  const resultItem = event.target.closest('.result-item');
  if (resultItem) {
    movieIdToOpen = resultItem.dataset.id;
  } else {
    movieIdToOpen = null;
  }
});
searchResults.addEventListener('click', searchMovies);
searchResults.addEventListener('click', (event) => {

  const resultItem = event.target.closest('.result-item');
  if (resultItem) {
    const movieId = resultItem.dataset.id;
    const url = `/project/movie.html?movieId=${movieId}`;
    window.location.href = url;
  }
});
window.addEventListener('load', function() {
    document.querySelector('.result-list').classList.add('visible');
  });

  const moviesContainer = document.querySelector('#common');

  fetch('http://localhost:4000/movies')
    .then(response => response.json())
    .then(movies => {
      // Loop through all the movies and generate HTML for each one
      movies.forEach(movie => {
        // Create an image element and set its source to the movie's image data
        const img = document.createElement('img');
        img.src = `data:${movie.type};base64,${movie.data}`;
        const showtime1 = movie.idshowtimes1;
        const monthIndex = parseInt(movie.date1.substring(5, 7)) - 1; // subtract 1 since array is 0-indexed
        const monthName = monthNames[monthIndex];
     // Update the HTML code to use the correct property names
     const infoDiv = document.createElement('div');
   infoDiv.innerHTML =`<div class="container">
    <div class="cellphone-container">    
        <div class="movie">       
          <div class="movie-img">
    <img src='data:${movie.type};base64,${movie.data}' height='260px' width='200px'>
    <div class="movie-img-overlay">
      <a href="buy-ticket.html?showtimeId=${movie.showtime1_id}&data-id=${movie.idmovies}">
      <button><b><i class="fas fa-film" ></i>${monthName} ${movie.date1.substring(8, 10)}</i><br><i class="far fa-clock"></i>${movie.start_time1}<br><i class="fas fa-theater-masks"></i> Theater ${movie.theater1}<br><i class="fas fa-money-bill"></i>  price ${movie.price1}$</b></button>      </a>
      <a href="buy-ticket.html?showtimeId=${movie.showtime2_id}&data-id=${movie.idmovies}">
        <button><b><i class="fas fa-film" ></i>${monthName} ${movie.date2.substring(8, 10)}</i><br><i class="far fa-clock"></i>${movie.start_time2}<br><i class="fas fa-theater-masks"></i> Theater ${movie.theater2}<br><i class="fas fa-money-bill"></i>  price ${movie.price2}$</b></button>
        </a>
    </div>
  </div>
  
          <div class="text-movie-cont">
            <div class="mr-grid">
              <div class="col1">
            <a href="movie.html?movieId=${movie.idmovies}">   <h1 class='movieh1'>${movie.title}</h1></a>
                <ul class="movie-gen">
                  <li>${movie.runtime}min  /</li>
                  <li>${movie.des}</li>
                </ul>
              </div>
            </div>
    </div>
  </div>
  
  `
  //   <h2>id: ${movie.idmovies}</h2>
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
  
  // `;
  //console.log(showtime1,"showtime1");
        // Append the image and info div to the movies container
       // moviesContainer.appendChild(img);
        moviesContainer.appendChild(infoDiv);
      });
  
      // Add event listeners to all the movie buttons
      const buttons = document.querySelectorAll('.movie-id');
      buttons.forEach(button => {
        button.addEventListener('click', () => {
          const movieId = button.getAttribute('data-id');
          console.log(`Clicked on movie with ID: ${movieId}`);
        });
      });
    });
    