const searchForm = document.querySelector(`#search`);
const movieList = document.querySelector(`.titles-wrapper`);

searchForm.addEventListener(`submit`, event => {
  const inputField = searchForm.querySelector(`input`);
  getMovieList(inputField.value);
  event.preventDefault();
})

function getMovieList(keyword) {
  fetch(`http://www.omdbapi.com/?s=${keyword}&apikey=36969425`)
    .then(data => {
      if (data.ok) {
        return data.json();
      } else {
        throw new Error(`CUO!`);
      }
    })
    .then(list => {
      movieList.innerHTML = ``;
      list.Search.forEach(movie => {
        fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=36969425`)
          .then(data => {
            if (data.ok) {
              return data.json();
            } else {
              throw new Error(`CUO!`);
            }
          })
          .then(movieDetail => {
            loadContent(movieDetail);
          });
      });
    });
}

function loadContent(movieDetail) {  
  movieList.insertAdjacentHTML(`beforeend`, `
  <div class="movie">
    <img src=${movieDetail.Poster}>
    <div class="overlay">
      <div class="title">${movieDetail.Title}</div>
      <div class="rating">${movieDetail.imdbRating}/10</div>
      <div class="plot">${movieDetail.Plot}</div>
    </div>
  </div>
  `);
}