const searchForm = document.querySelector(`#search`);
const movieList = document.querySelector(`.titles-wrapper`);
let pageNumber;

searchForm.addEventListener(`submit`, event => {
  const inputField = searchForm.querySelector(`input`);
  getMovieList(inputField.value);
  pagination();
  event.preventDefault();
})

function getMovieList(keyword, page = 1) {
  fetch(`http://www.omdbapi.com/?s=${keyword}&page=${page}&apikey=36969425`)
    .then(data => {
      if (data.ok) {
        return data.json();
      } else {
        throw new Error(`Fail to get data from OMDB.`);
      }
    })
    .then(list => {
      movieList.innerHTML = ``;
      pageNumber = Math.ceil(list.totalResults / 10);
      list.Search.forEach(movie => {
        fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=36969425`)
          .then(data => {
            if (data.ok) {
              return data.json();
            } else {
              throw new Error(`Fail to get data from OMDB.`);
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

function pagination(page = 1) {

}