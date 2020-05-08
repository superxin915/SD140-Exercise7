const searchForm = document.querySelector(`#search`);
const movieList = document.querySelector(`.titles-wrapper`);
const paginationEle = document.querySelector(`.pagination`);
const pages = document.querySelector(`.page-number`);
const inputField = searchForm.querySelector(`input`);

let pageNumber = 1;
let total;

searchForm.addEventListener(`submit`, event => {
  getMovieList(inputField.value);
  pagination(pageNumber);
  event.preventDefault();
})

paginationEle.addEventListener(`click`, event => {
  if (event.target.closest(`button`).id === `previous`) {
    pageNumber--;
    getMovieList(inputField.value, pageNumber);
    pagination(pageNumber);
  } else if (event.target.closest(`button`).id === `next`){
    pageNumber++;
    getMovieList(inputField.value, pageNumber);
    pagination(pageNumber);
  }
})

pages.addEventListener(`click`, event => {
  if (event.target.tagName === `LI` && !event.target.classList.contains(`current-page`)) {
    pageNumber = parseInt(event.target.innerText);
    getMovieList(inputField.value, pageNumber);
    pagination(pageNumber);
  }
})

function getMovieList(keyword, page = 1) {
  fetch(`https://www.omdbapi.com/?s=${keyword}&page=${page}&apikey=36969425`)
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
        fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=36969425`)
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

  buildPageNumber(page);
}

function buildPageNumber(page) {
  let pageStr = ``;

  if (page - 5 < 0) {
    for (let x = 1; x <= 10; x++){
      if (x === page) {
        pageStr += `<li class="current-page">${x}</li>`;
      } else {
        pageStr += `<li>${x}</li>`;
      }
    }
  } else if (page + 5 > total){
    for (let x = total - 9; x <= total; x++){
      if (x === page) {
        pageStr += `<li class="current-page">${x}</li>`;
      } else {
        pageStr += `<li>${x}</li>`;
      }
    }
  } else {
    for (let x = page - 4; x <= page + 4; x++){
      if (x === page) {
        pageStr += `<li class="current-page">${x}</li>`;
      } else {
        pageStr += `<li>${x}</li>`;
      }
    }
  }

  pages.innerHTML = pageStr;
}