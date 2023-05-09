
const urlParams = new URLSearchParams(window.location.search);
const showtimeId = urlParams.get('showtimeId');


 $(document).ready(function() {
  $('#buy-ticket').on('click', function() {
    $('.dialog').fadeIn();
    $('#step1').addClass('active');
    $('#seat-selection').show(); // show the seat selection when the buy button is clicked
  });

  $('#next-step1').on('click', function() {
    $('#step1').removeClass('active');
    $('#step2').addClass('active');
  });

  $('#prev-step2').on('click', function() {
    $('#step2').removeClass('active');
    $('#step1').addClass('active');
  });

  $('#next-step2').on('click', function() {
    $('#step2').removeClass('active');
    $('#step3').addClass('active');
  });

  $('#prev-step3').on('click', function() {
    $('#step3').removeClass('active');
    $('#step2').addClass('active');
  });

  $('#close-dialog').on('click', function() {
    $('.dialog').fadeOut();
  });
});
const nextButton2 = document.getElementById('next-step2');
  nextButton2.addEventListener('click', ticketInfor);

function ticketInfor() {
  const seatNumbers = JSON.parse(localStorage.getItem('seatNumbers'));
  console.log('seatNumbers:', seatNumbers);
        
    
        fetch(`http://localhost:4000/showtime?showtimeId=${showtimeId}`)
    .then(response => response.json())
    .then(data => {
        // Assign fetched data to variables
        const idmovies = data[0].idmovies;
        const title = data[0].title;
        const runtime = data[0].runtime;
        const des = data[0].des;
        const images = `data:${data[0].type};base64,${data[0].data}`;
        const showtime = data[0].showtime_id;
        const price = data[0].showtime_price;
        const start = data[0].showtime_start;
        const date = data[0].showtime_date.substring(0, 10);
        const theater = data[0].showtime_theater;

        // Create ticket HTML using interpolated variables
        const ticketHtml = `
            <div class="ticket" id="ticket">
                <div class="left">
                    <div class="image"> 
                        <p class="admit-one">
                            <span>ADMIT ONE</span>
                            <span>ADMIT ONE</span>
                            <span>ADMIT ONE</span>
                        </p>
                        <div class="ticket-number">
                            
                        </div><img src="${images}" alt="${title} class='image'">
                       
                    </div>
                    <div class="ticket-info">
                        <p class="date">
                            <span class="nov-10">${date}</span>
                        </p>
                        <div class="show-name">
                            <h1>${title}</h1>
                            <h2>${des}</h2>
                        </div>
                        <div class="time">
                          <p>${start} <span>TO</span> TBD </p>
                            <p> ${runtime} minutes and price ${price}$</p>
                        </div>
                    </div>
                    </div>
                    <div class="right">
                        <p class="admit-one">
                            <span>ADMIT ONE</span>
                            <span>ADMIT ONE</span>
                            <span>ADMIT ONE</span>
                        </p>
                        <div class="right-info-container">
                         
                            
                            <div class="barcode">
                                  <h1>Seat:${seatNumbers}</h1>
                            <canvas id="barcode"></canvas>
                        
                            </div>
                         </div>
                    </div>
                </div>`;

        // Add ticket HTML to the DOM
        const ticketContainer = document.getElementById("ticket-container");
        ticketContainer.innerHTML = ticketHtml;
//console.log(seatNumbers,"ticketHtml");
        // Generate barcode
        var barcodeCanvas = document.getElementById("barcode");
        var randomNum = Math.floor(Math.random() * 900000000) + 100000000; // generate a random 9-digit number
        JsBarcode(barcodeCanvas, randomNum.toString());

        const printBtn = document.getElementById('next-step3');
printBtn.addEventListener('click', function() {
  const doc = new jsPDF();
 console.log("Print button clicked");
  doc.addHTML(document.getElementById('ticket-container'), function() {
    doc.save("ticket.pdf");
  });
});

  }).catch(error => {
              // Handle errors
              console.error("error",error);
            });
        
          }
   
   