import { logout } from "./admin.js";

async function RecuperationImages() {
  try {
    const response = await fetch(`http://localhost:5678/api/works`);
    const images = await response.json();

    const container = document.querySelector(".gallery");

    for (let i = 0; i < images.length; i++) {
      const fig = document.createElement("figure");

      const imgelement = document.createElement("img");
      imgelement.src = images[i].imageUrl;
      imgelement.alt = images[i].title;
      imgelement.className = images[i].category.name;

      const figcaption = document.createElement("figcaption");
      figcaption.innerText = images[i].title;

      fig.appendChild(imgelement);
      fig.appendChild(figcaption);
      container.appendChild(fig);
    }

    return images; // Retourne les images
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
  }
}

// Fonction générique pour filtrer et afficher les images
function afficherImagesFiltrees(images, categorie) {
  let imagesFiltrees;
  //Gestion des catégories avec if pour le bouton tous
  if (categorie) {
    imagesFiltrees = images.filter(function (image) {
      return image.category.name === categorie;
    });
  } else {
    imagesFiltrees = images;
  }

  const container = document.querySelector(".gallery");
  container.innerHTML = ""; // Vide le contenu existant

  // Ajouter les images filtrées au DOM
  imagesFiltrees.forEach(function (image) {
    const fig = document.createElement("figure");

    const imgelement = document.createElement("img");
    imgelement.src = image.imageUrl;
    imgelement.alt = image.title;
    imgelement.className = image.category.name;

    const figcaption = document.createElement("figcaption");
    figcaption.innerText = image.title;

    fig.appendChild(imgelement);
    fig.appendChild(figcaption);
    container.appendChild(fig);
  });
}

// Fonction pour gérer le clic sur les boutons et mettre à jour la classe "active"
function gererCliqueBouton(button, images, categorie) {
  button.addEventListener("click", function () {
    // Supprimer la classe active de tous les boutons
    const boutons = document.querySelectorAll(".btn");
    boutons.forEach(function (act) {
      act.classList.remove("active");
    });

    // Ajouter la classe active au bouton cliqué
    button.classList.add("active");

    // Afficher les images filtrées
    afficherImagesFiltrees(images, categorie);
  });
}

async function filtre() {
  const images = await RecuperationImages();

  const btnObjets = document.querySelector(".Objets");
  const btnAppartements = document.querySelector(".Appartements");
  const btnHotels = document.querySelector(".HotelsRestaurants");
  const btnTous = document.querySelector(".Tous");

  // Gérer les clics pour chaque bouton en appelant la fonction précéndente pour le button active
  gererCliqueBouton(btnObjets, images, "Objets");
  gererCliqueBouton(btnAppartements, images, "Appartements");
  gererCliqueBouton(btnHotels, images, "Hotels & restaurants");
  gererCliqueBouton(btnTous, images, null); // null pour afficher toutes les images
}

// Appel des fonctions
RecuperationImages();
filtre();
