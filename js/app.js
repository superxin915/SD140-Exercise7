const searchForm = document.querySelector(`#search`);
const movieList = document.querySelector(`.titles-wrapper`);
const paginationEle = document.querySelector(`.pagination`);
const inputField = searchForm.querySelector(`input`);

let pageNumber = 1;
let total;

searchForm.addEventListener(`submit`, event => {
  getMovieList(inputField.value);
  pagination(pageNumber);
  event.preventDefault();
})

paginationEle.addEventListener(`click`, event => {
  if (event.target.id === `prev` || event.target.classList.contains(`fa-chevron-left`)) {
    pageNumber--;
    getMovieList(inputField.value, pageNumber);
    pagination(pageNumber);
  } else if (event.target.id === `next` || event.target.classList.contains(`fa-chevron-right`)){
    pageNumber++;
    getMovieList(inputField.value, pageNumber);
    pagination(pageNumber);
  }
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
      total = Math.ceil(list.totalResults / 10);
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

function pagination(page) {
  const prevBtn = document.querySelector(`#prev`);
  const nextBtn = document.querySelector(`#next`);

  if (page == 1) {
    prevBtn.style.display = `none`;
    nextBtn.style.display = `inherit`;
  } else if (page == total){
    prevBtn.style.display = `inherit`;
    nextBtn.style.display = `none`;
  } else {
    prevBtn.style.display = `inherit`;
    nextBtn.style.display = `inherit`;
  }
}