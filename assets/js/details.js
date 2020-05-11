//API KEY.
const API_KEY = config.API_KEY;

//Spinner.
const spinner = document.querySelector(".spinner");
const container = document.querySelector(".container");
spinner.style.display = "none";
container.style.display = "none";

//Gets the movie ID stored in the Session storage and uses it to display information about
//the movie that has that ID.
function getMovie(){
	spinner.style.display = "block";
	setTimeout(() => {
		spinner.style.display = "none";
		container.style.display = "block";
	}, 1000);
	
	let movieId = sessionStorage.getItem("movieId");

	const movieInfo = axios.get("https://api.themoviedb.org/3/movie/"+movieId+'?api_key='+API_KEY+'&language=en-US');
	const movieCast = axios.get("https://api.themoviedb.org/3/movie/"+movieId+'/credits?api_key='+API_KEY)
	Promise.all([movieInfo, movieCast])
		.then( ([movieInfoResponse, movieCastResponse]) =>{
			const movie = movieInfoResponse.data;
			const cast = movieCastResponse.data.cast;
			const genres = movieInfoResponse.data.genres;
			cast.length = 5;

			//Grab the popularity parameter from the data and rounds it to a whole number%.
			popularity = movieInfoResponse.data.popularity;
			popularity = Math.floor(popularity)

			//Revenue - dynamically make it format itself into a standard looking currency.
			let revenue = movieInfoResponse.data.revenue;
			revenue = new Intl.NumberFormat('de-DE', {style: 'currency', currency: 'EUR'}).format(revenue);
			
			let output = `
			<div class="moviePage">
			<div class="poster" ><img data-aos:"flip-left" src="http://image.tmdb.org/t/p/w300/${movie.poster_path}"></div>
			<div class="info">
				<b><h2 style="color: whitesmoke">${movie.title}</h2></b><hr>
				<h4 style="color: #f9ca24">Plot:</h4><p style="color: whitesmoke"> ${movie.overview}</p>
				<ul >
					<li> <b style="color:#f9ca24">Cast:</b> <span style="color: whitesmoke">`;
					for (let i = 0; i < cast.length; i++) {
						if (i != cast.length - 1) {
							output += `${cast[i].name}, `;
						} else {
							output += `${cast[i].name}.`;
						}
					}
					output += `</span></li>
					<li><b style="color:#f9ca24">Genres:</b> <span style="color: whitesmoke">`;
					for(let i = 0; i < genres.length; i++){
						if ( i != genres.length -1){
							output += `${genres[i].name}, `;
						} else {
							output += `${genres[i].name}.`;
						}
					}
					output += `</span></li>
		
					<li><b style="color:#f9ca24">Rating: </b><span style="color:whitesmoke"> ${movie.vote_average} / 10 </span><span id="smallText" style="color: whitesmoke">( ${movie.vote_count} votes)</span></li>
					
					<li> <b style="color:#f9ca24"> Runtime: </b><span style="color:whitesmoke">${movie.runtime} minutes</span></li>
					<li><b style="color:#f9ca24"> Release Date:</b></strong><span style="color:whitesmoke"> ${movie.release_date}</span></li>
					
					<li><b style="color:#f9ca24">Revenue:</b> <span style="color:whitesmoke">${revenue}</span></li>
					<li><b style="color:#f9ca24">Production House:</b><span style="color:whitesmoke"> ${movie.production_companies[0].name}</span></li>
					<li><b style="color:#f9ca24">IMDB link: </b><a href="https://www.imdb.com/title/${movie.imdb_id}" target="_blank"><span style="color:skyblue">click here</span></a></li>
					
				</ul>
				
				<div class="buttons">
					
				</div>
			</div>
		</div>`;

		//Targets the "movie" element and appends the output to it.
		const info = document.getElementById("movie");
		info.innerHTML = output;

		})
		//If there is an error, show this.
		.catch ((err)=>{
			let output = "";
			output += `<h1 id="errorTitle" style="color:whitesmoke">Oops!</h1>
			<p id="errorText" style="color:whitesmoke">No information available right now! </p>
			<div class="buttons errorBack">
				
			</div>`;
			// Hide elements if theres an error.
			let info = document.getElementById("movie");
			info.innerHTML = output;
			document.getElementById("rec_title").style.display = 'none';
			document.querySelector(".page").style.display = "none";
			document.getElementById("recommended").style.display = "none";
			document.getElementById("trailer").style.display = "none";
			document.getElementById("trailer_title").style.display = "none";
			document.getElementById("rec_title").style.display = "none";
		});

		//Gets the trailer link from youtube.
		axios.get("https://api.themoviedb.org/3/movie/"+movieId+'/videos?api_key='+API_KEY+'&language=en-US')
			.then((response)=>{
				//Targets the first item in the results Array, that hold the "key" parameter.
				let trailer = response.data.results;

				// RANDOM NUMBER FOR TRAILER OUTPUT (ON EVERY PAGE LOAD, A DIFFERENT TRAILER WILL SHOW).
				let min = 0;
				// -1 so it takes into account if theres only 1 item in the trailer length( at position 0).
				let max = trailer.length - 1;
				min = Math.ceil(min);
				max = Math.floor(max);
				let trailerNumber = Math.floor(Math.random() * (max-min +1)) + min;

				let output = `
					<div class="video">
					<iframe width="620" height="400" src="https://www.youtube.com/embed/${trailer[trailerNumber].key}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
					</div>`;
				// Display the trailer.
				let video = document.getElementById("trailer");
				video.innerHTML = output;
			})

			.catch ((err)=>{
				// Error message.
				let trailerOutput = document.getElementById("trailer");
				document.getElementById("trailer_title").style.display = "none";
				trailerOutput.innerHTML =
				 `<div class="trailer_error">
					<h3 style="color:whitesmoke">Oops! </h3>
					<br>
					<p style="color: whitesmoke">No trailer available at this moment.</p>
				 </div>`;
			});

		//Gets similar movies to the current one.
		axios.get("https://api.themoviedb.org/3/movie/"+movieId+'/recommendations?api_key='+API_KEY+'&language=en-US&page=1')
			.then ((response)=>{
				const movie = response.data.results;
				//Set the movie length (output) to 4.
				movie.length = 4;
				let output = "";
				for(let i = 0; i < movie.length; i++){
					output += `
					<div class="card">
					<div class="overlay">
					<div class="addBtn"><span><i class="material-icons watch" onclick="addToList('${movie[i].id}')">visibility</i></span></div>
					
					
					<div class="movie" style="bottom:10%"> 
					<p><b> ${movie[i].title}</b></p>
						<p id="p_rating">Rating: <span>${movie[i].vote_average} / 10  <i class="material-icons star">star_rate</i></span> </p>
					  
						<p> Release date: <span>${movie[i].release_date}</span></p>
					
						<a style="background-color: rgba(199, 1, 1,0.7); color: #f9ca24; border-radius: 10px 0 10px 0; display=inline" onclick="movieSelected('${movie[i].id}')" href="#"><i class="fa fa-info"> </i>&nbsp Info</a>
						
				</div>
				</div>
						<div class="card_img">
							<img src="http://image.tmdb.org/t/p/w400/${movie[i].poster_path}" onerror="this.onerror=null;this.src='../images/imageNotFound.png';">
						</div>
					</div>
					`;
				}
				//Target "recommended" and output the similar movies into it.
				let recommended = document.getElementById("recommended");
				recommended.innerHTML = output;
				// Hide the previous page button of the first page.
				document.getElementById("prev").style.display = "none";
			})
			//If there is an error, it logs it in the console.
			.catch ((err)=>{
				let recommended = document.getElementById("recommended");
				document.getElementById("rec_title").style.display = "none";
				document.querySelector(".page").style.display = "none";
				recommended.innerHTML =
				 `<div class="recommendations_error">
				 
					<br>
				 </div>`;
			})
}


// Take user to details page.
function movieSelected(id){
	sessionStorage.setItem("movieId", id);
	location.replace("/details");
	return false;
}

//Page number.
let pageNum = 1;

//Previous page for recommended.
const prev = document.getElementById("prev");
prev.addEventListener("click", ()=>{
	pageNum--;
	recommendedPage(pageNum);
})

//Next page for recommended.
const next = document.getElementById("next");
next.addEventListener("click", ()=>{
	pageNum++;
	recommendedPage(pageNum);
})

//Recommended page change.
function recommendedPage(pageNum){
	let movieId = sessionStorage.getItem("movieId");
	axios.get("https://api.themoviedb.org/3/movie/"+movieId+'/recommendations?api_key='+API_KEY+'&language=en-US&page='+pageNum)
	.then ((response)=>{
				let movie = response.data.results;
				movie.length = 4;
				let output = "";
				for(let i = 0; i < movie.length; i++) {
					output += `<div class="card">
					<div class="overlay">
					<div class="addBtn"><span><i class="material-icons watch" onclick="addToList('${movie[i].id}')">visibility</i></span></div>
					
					
					<div class="movie" style="bottom:10%"> 
					<p><b> ${movie[i].title}</b></p>
						<p id="p_rating">Rating: <span>${movie[i].vote_average} / 10  <i class="material-icons star">star_rate</i></span> </p>
					  
						<p> Release date: <span>${movie[i].release_date}</span></p>
					
						<a style="background-color: rgba(199, 1, 1,0.7); color: #f9ca24; border-radius: 10px 0 10px 0; display=inline" onclick="movieSelected('${movie[i].id}')" href="#"><i class="fa fa-info"> </i>&nbsp Info</a>
						
				</div>
				</div>
					<div class="card_img">
						<img src="http://image.tmdb.org/t/p/w300/${movie[i].poster_path}" onerror="this.onerror=null;this.src='../images/imageNotFound.png';">
					</div>
					</div>`;
				}
				let recommended = document.getElementById("recommended");
				recommended.innerHTML = output;
				let totalPages = response.data.total_pages;
				
				if (pageNum >= 2) {
					document.getElementById("prev").style.display = "flex";
				}
				
				if( pageNum === totalPages) {
					document.getElementById("next").style.display = "none";
				} else if (pageNum === 1){
					document.getElementById("prev").style.display = "none";
					document.getElementById("next").style.display = "flex";
				}
			})
	//If there is an error, it logs it in the console.
	.catch ((err)=>{
		console.log(err);
	})
}

function addToList(id){
	console.log(id);
	$.ajax({
	  url: "/details",
	  data:{
		q: id,
	  },
	  type: "POST", // if you want to send data via the "data" property change this to "POST". This can be omitted otherwise
	  success: function(responseData) {
		  console.log(responseData)
	  },
	  error: console.error
	});

}