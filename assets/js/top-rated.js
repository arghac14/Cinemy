
const API_KEY = config.API_KEY;

console.log(API_KEY)
const spinner = document.querySelector(".spinner");
const container = document.querySelector(".showcase");
spinner.style.display = "none";
container.style.display = "none";

// Pages.
const pages = document.querySelector(".pages");
//pages.style.display = "none";

// Run "getMovies()" on page load.
window.onload = function getMovies(){
	spinner.style.display = "block";
	setTimeout(() => {
		spinner.style.display = "none";
		container.style.display = "flex";
		pages.style.display = "flex";
	}, 1000);

	//Get the API.
	axios.get("https://api.themoviedb.org/3/movie/top_rated?api_key="+API_KEY+'&language=en-US&page=1')
		.then( (response) =>{
			let movie = response.data.results;
			let output = "";

			//Appends to the output the info for each fetched result.
			for(let i = 0; i < movie.length; i++){
				let id = response.data.results[i].id;
				id = JSON.stringify(id);
				let favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
				if(favoriteMovies.indexOf(id) === -1){
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
					</div>`;
				} else {
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
				</div>`;
				}
			}

			//Append the output to "movies" element.
			let movieInfo = document.getElementById("movies");
			movieInfo.innerHTML = output;

			//Display pages buttons.
            let totalPages = response.data.total_pages;
			let pages = document.querySelector(".pages");
            if(totalPages < 2){
				pages.style.display = "none";
			} else if (pageNum === 1){
				prev.style.display = "none";
				next.style.display = "block";
			}
		})

		//If theres an error, logs the error in console.
		.catch ((err)=>{
			console.log(err);
		})
}

//Takes the user to detailed info page.
function movieSelected(id){
	sessionStorage.setItem("movieId", id);
	window.location.replace("/details");
	return false;
}

//Creates a variable for the page number to make it dynamic.
let pageNum = 1;

//Targets the pages button with "prev" id, and goes backwards one page.
const prev = document.getElementById("prev");
prev.addEventListener("click", ()=>{
	pageNum--;
	window.scrollTo(0,0);
	search(pageNum);
})

//Go forward 1 page
const next = document.getElementById("next");
next.addEventListener("click", ()=>{
	pageNum++;
	window.scrollTo(0,0);
	search(pageNum);
})

//Display the movies after the user changed the page by clicking previous/next button.
function search(pageNum){
	axios.get("https://api.themoviedb.org/3/movie/top_rated?api_key="+API_KEY+'&language=en-US&page='+pageNum)
		.then((response)=>{
			let movie = response.data.results;
			let output = "";
			for(let i = 0; i < movie.length; i++){
				let id = response.data.results[i].id;
				id = JSON.stringify(id);
				let favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
				if(favoriteMovies.indexOf(id) === -1){
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
					</div>`;
				} else {
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
						<img src="http://image.tmdb.org/t/p/w400/${movie[i].poster_path}" onerror="this.onerror=null;this.src='../images/imageNotFound.png';">
					</div>
				</div>`;
				}
			}

			let movieInfo = document.getElementById("movies");
			movieInfo.innerHTML = output;

			//Show the pages buttons after movies are listed.
			let totalPages = response.data.total_pages;
			let pages = document.querySelector(".pages");
			pages.style.display = "flex";

            if(pageNum >= 2){
				prev.style.display = "block";
			} else if ( pageNum === totalPages){
				next.style.display = "none";
			} else if ( pageNum === 1) {
				prev.style.display = "none";
			}
		})
		.catch ((err)=>{
			console.log(err);
		})
}
function addToList(id){
	console.log(id);
	$.ajax({
	  url: "/top-rated",
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