function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function getCookie(name) {
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) === ' ') {
          cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name + "=") === 0) {
          return cookie.substring(name.length + 1, cookie.length);
      }
  }
  return "";
}


export function logout() {
    // Supprime les données utilisateur du localStorage
    deleteCookie("userData")
    console.log('Déconnexion réussie, les données utilisateur ont été supprimées.');
    
    // Recharge la page pour mettre à jour l'état du lien
    location.reload();
  }
  
  // Initialiser le lien de navigation au chargement du DOM
  
  document.addEventListener('DOMContentLoaded', function () {
    // Vérifie si des données utilisateur existent dans le localStorage
    const userDataString = getCookie("userData");
    const navItem = document.querySelector('.appBar_navItem');
    const h2 = document.querySelector('#portfolio h2');
    var filtresDiv = document.querySelector('.filtres');
  
    
    if (navItem) {
      if (userDataString) {
        // Si l'utilisateur est connecté, remplacer "login" par "logout"
        navItem.textContent = 'logout';
        navItem.href = '#'; // Remplace le lien par un #
        navItem.addEventListener('click', logout);
        // ajout du bouton modifier et texte
        const editSpan = document.createElement('span');
        editSpan.innerHTML = '<a class="edit-icon" href="#modal"> <i class="fa-regular fa-pen-to-square"></i> modifier</a>';
        editSpan.classList.add('edit-icon');
        h2.insertAdjacentElement('afterend', editSpan);
        filtresDiv.style.display = 'none';
         // Crée un espace pour compenser la perte de filtresDiv
        const spaceDiv = document.createElement('div');
        spaceDiv.style.height = '60px'; 
        spaceDiv.classList.add('compensation-space');
         filtresDiv.insertAdjacentElement('afterend', spaceDiv);
      } else {
        // Si l'utilisateur n'est pas connecté, afficher "login"
        navItem.textContent = 'login';
        navItem.href = './login.html';
      }
    }
  });

