
const params = new URLSearchParams(window.location.search);
const movieId = params.get('movieId');
const moviesContainer = document.querySelector('#common');
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
fetch(`http://localhost:4000/movieInfo?movieId=${movieId}`)
  .then(response => response.json())
  .then(movies => {
    // Loop through all the movies and generate HTML for each one
    movies.forEach(movie => {
      const monthIndex = parseInt(movie.date1.substring(5, 7)) - 1; // subtract 1 since array is 0-indexed
      const monthName = monthNames[monthIndex];

const img = document.createElement('img');
img.src = `data:${movie.type};base64,${movie.data}`;


const img1 = document.createElement('img');
img1.src = `data:${movie.type1};base64,${movie.data1}`;



   // Update the HTML code to use the correct property names
   const infoDiv = document.createElement('div');
infoDiv.innerHTML = `
<div class="movie-card">
  
  <div class="container">
    
    <a href="#"><img src="data:${movie.type};base64,${movie.data}" alt="cover" class="cover" /></a>
        
    <div class="hero">
            
      <div class="details">
      
        <div class="title1">${movie.title} <span>PG-13</span></div>

        <div class="title2">${movie.runtime} MIN, ${movie.des}</div>    
        
        <fieldset class="rating">
    <input type="radio" id="star5" name="rating" value="5" /><label class = "full" for="star5" title="Awesome - 5 stars"></label>
    <input type="radio" id="star4half" name="rating" value="4 and a half" /><label class="half" for="star4half" title="Pretty good - 4.5 stars"></label>
    <input type="radio" id="star4" name="rating" value="4" checked /><label class = "full" for="star4" title="Pretty good - 4 stars"></label>
    <input type="radio" id="star3half" name="rating" value="3 and a half" /><label class="half" for="star3half" title="Meh - 3.5 stars"></label>
    <input type="radio" id="star3" name="rating" value="3" /><label class = "full" for="star3" title="Meh - 3 stars"></label>
    <input type="radio" id="star2half" name="rating" value="2 and a half" /><label class="half" for="star2half" title="Kinda bad - 2.5 stars"></label>
    <input type="radio" id="star2" name="rating" value="2" /><label class = "full" for="star2" title="Kinda bad - 2 stars"></label>
    <input type="radio" id="star1half" name="rating" value="1 and a half" /><label class="half" for="star1half" title="Meh - 1.5 stars"></label>
    <input type="radio" id="star1" name="rating" value="1" /><label class = "full" for="star1" title="Sucks big time - 1 star"></label>
    <input type="radio" id="starhalf" name="rating" value="half" /><label class="half" for="starhalf" title="Sucks big time - 0.5 stars"></label>
  </fieldset>
        
        <span class="likes">109 likes</span>
        
      </div> <!-- end details -->
      
    </div> <!-- end hero -->
    
    <div class="description">
      
      <div class="column1">
        <span class="tag">action</span>
        <span class="tag">fantasy</span>
        <span class="tag">adventure</span>
      </div> <!-- end column1 -->
      
      <div class="column2">
        
        <a href="buy-ticket.html?showtimeId=${movie.idshowtimes1}&data-id=${movie.idmovies}">
              <button><b><i class="fas fa-film" ></i> ${monthName} ${movie.date1.substring(8, 10)}<i class="fas fa-fw"></i>
 <i class="far fa-clock"></i>${movie.time1}<i class="fas fa-fw"></i><i class="fas fa-theater-masks"></i> Theater ${movie.theater1}<i class="fas fa-fw"></i><i class="fas fa-money-bill"></i> price ${movie.price1}$</b></button>
              </a>
              <a href="buy-ticket.html?showtimeId=${movie.idshowtimes2}&data-id=${movie.idmovies}">
                <button><b><i class="fas fa-film" ></i> ${monthName} ${movie.date2.substring(8, 10)}<i class="fas fa-fw"></i>
 <i class="far fa-clock"></i>${movie.time2}<i class="fas fa-fw"></i><i class="fas fa-theater-masks"></i> Theater ${movie.theater2}<i class="fas fa-fw"></i><i class="fas fa-money-bill"></i> price ${movie.price2}$</b></button>  </a>
        
      </div> <!-- end column2 -->
    </div> <!-- end description -->
    
   
  </div> <!-- end container -->
</div> <!-- end movie-card -->`

      const movieContainer = infoDiv.querySelector('.hero');
movieContainer.style.background = `url(data:${movie.type1};base64,${movie.data1}) no-repeat center/cover`;


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