const $ = document.querySelector.bind(document);

const mainInput = $("#main-input");
const mainButton = $("#main-button");
const mainCard = $("#main-card");
const mainCardContent = $("#main-card-content");
const userDetails = $("#user-details");

const userName = $("#user-name");
const userImg = $("#user-img");
const userBio = $("#user-bio");
const userUrl = $('#user-url');

const reposContainer = $("#repos-container");

const API_URL = 'https://api.github.com';

const api = (function() {

  const getUser = function(userName) {
    return fetch(`${API_URL}/users/${userName}`).then(response => response.json());
  }

  const getRepos = function(repos_url) {
    return fetch(`${repos_url}`).then(response => response.json());
  }

  return {
    getUser,
    getRepos
  }
})();


mainButton.addEventListener("click", function() {
  const userName = mainInput.value;

  mainButton.innerHTML = `
    <div class="spinner-grow spinner-grow-sm" role="status">
      <span class="sr-only">Carregando...</span>
    </div>
    Pesquisando
  `;

  api.getUser(userName).then(response => {
    if(response.message == "Not Found") {
      alert("Esse usuário não foi encontrado");
      mainButton.innerHTML = "Pesquisar";
      return;
    }
    
    showUser(response);
  });
  
});

function showUser(user) {
  console.log("mostrar User", user);

  
  userName.innerHTML = user.name;
  userImg.src = user.avatar_url;
  userBio.innerHTML = user.bio;
  userUrl.setAttribute("href", user.html_url);

  api.getRepos(user.repos_url).then(response => {
    for(repo of response) {
      console.log(repo);
      reposContainer.innerHTML += `
        <div class="custom-card">
          <div class="d-flex justify-content-between">
            <h5>${repo.name}</h5>
            <small>${moment(repo.updated_at).fromNow()}</small>
          </div>
          <p class="mb-1">${repo.description}</p>
          <a href="html_url"><small>${repo.html_url}</small></a>
        </div>
      `;
    }
  });



  mainCard.style.minWidth = '800px';

  mainCardContent.style.opacity = '0';
  setTimeout(() => {
    mainCardContent.style.display = 'none';

    userDetails.classList.remove('d-none');

    setTimeout(() => {
      userDetails.classList.remove('hidden');
    }, 200);


  }, 600);
}


function main() {
  
  if(! mainInput.value) {
    mainButton.setAttribute("disabled", "disabled");
  } else {
    mainButton.removeAttribute("disabled");
  }

  
  requestAnimationFrame(() => main());
}

main();