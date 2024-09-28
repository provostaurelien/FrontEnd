import { filtre } from "./index.js";

  // Fonction pour fermer la modale
  function closeModal() {
    // Retire la classe pour masquer la modale
    modal.classList.remove("visible");
    modalwindow.classList.remove("visible");
    modalaccueil.classList.remove("visible");
    modalajoutphoto.classList.remove("visible");
    //appel de la fonction filtre pour actualiser les images ajoutées ou supprimées :
    filtre();
  }

document.addEventListener("DOMContentLoaded", function () {
  // Sélectionne l'élément de la modale et le lien d'ouverture
  const modal = document.getElementById("modal");
  const modalwindow = document.querySelector(".modal-window");
  const modalaccueil = document.querySelector(".modal-accueil");
  const modalajoutphoto = document.querySelector(".modal-ajout-photo");
  const openModalLink = document.querySelector('a[href="#modal"]');
  const closeModalIcons = modal.querySelectorAll(".fa-xmark");
  const btnajoutphoto = document.querySelector(".ajoutPhoto");
  const flecheretour = document.querySelector(".fa-arrow-left");

  // Fonction pour ouvrir la modale ou revenir à la page d'accueil de la modale
  function openModal(event) {
    event.preventDefault(); // Empêche le comportement par défaut du lien
    modal.classList.add("visible"); // Ajoute la classe pour reprise du background
    modalwindow.classList.add("visible"); // Ajoute la classe pour affichage fenetre
    modalaccueil.classList.add("visible"); // Ajoute la classe pour ajout du contenu d'accueil
    modalajoutphoto.classList.remove("visible");
  }

  // Fonction pour basculer sur la page ajout photo de la modale
  function Modalpage2(event) {
    modalaccueil.classList.remove("visible"); // Masque le contenu de la page d'accueil
    modalajoutphoto.classList.add("visible"); // Ajoute la classe pour visualisation du formulaire
  }



  // Ajoute l'événement de clic pour ouvrir la modale, if réajouter pour éviter erreur d'existence hors mode admin
  if (openModalLink) {
    openModalLink.addEventListener("click", openModal);
  }

  // Ajoute l'événement pour accéder au formulaire d'ajout photo

  btnajoutphoto.addEventListener("click", Modalpage2);

  // Ajoute l'événement de retour à la page 1 de la modale en cliquant sur la flèche

  flecheretour.addEventListener("click", openModal);

  // Ajoute l'événement de clic pour fermer la modale (sur la croix de fermeture)
  closeModalIcons.forEach((icon) => {
    icon.addEventListener("click", closeModal);
  });

  // Ferme la modale en cliquant en dehors de la fenêtre modale
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });
});

// Gestion de l'affichage des images dans la galerie photo

async function RecuperationImagesModal() {
  try {
    // Récupération via l'API
    const response = await fetch(`http://localhost:5678/api/works`);
    const images = await response.json();
    return images; // Ne fait que retourner les images
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
  }
}

// fonction pour afficher les fonctions dans le DOM et suppression des images
function afficherImages(images) {
  // Définition de l'emplacement
  const container = document.querySelector(".gallery-modal");
  //Nettoyage du conteneur, pour éviter doublon à l'ajout d'une nouvelle image
  container.innerHTML = "";

  images.forEach((image) => {
    const fig = document.createElement("figure");
    const imgelement = document.createElement("img");
    imgelement.src = image.imageUrl;
    imgelement.alt = image.title;
    imgelement.id = image.id;
    imgelement.className = image.category.name;
    const trashIcon = document.createElement("i");
    trashIcon.classList.add("fa-solid", "fa-trash-can", "trash-icon");

    // Ajouter un événement de clic sur l'icône de la corbeille
    trashIcon.addEventListener("click", async function () {
      // Confirmation avant suppression (facultatif)
      try {
        // Récupération des données stockées dans localStorage
        const userData = JSON.parse(localStorage.getItem("userData"));
        // Extraction du token depuis les données récupérées
        const token = userData?.token;
        console.log(token);
        // Envoyer une requête DELETE à l'API avec l'ID de l'image
        const response = await fetch(
          `http://localhost:5678/api/works/${image.id}`,
          {
            method: "DELETE",
            // Ajout du token dans le header
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Vérifier si la suppression est réussie
        if (response.ok) {
          // Supprimer l'élément figure du DOM
          fig.remove();
          console.log(`Image avec ID ${image.id} supprimée avec succès.`);
        } else {
          console.error(
            "Erreur lors de la suppression de l'image :",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Erreur lors de la requête DELETE :", error);
      }
    });

    // Placement dans le DOM dans les emplacements définis
    fig.appendChild(imgelement);
    fig.appendChild(trashIcon);
    container.appendChild(fig);
  });
}

//Appel des fonctions créées ci dessus en simulatanés

async function afficherImagesModal() {
  const images = await RecuperationImagesModal();
  if (images) {
    afficherImages(images);
  }
}

// Appel de la fonction
console.log(localStorage.getItem("userData"));
afficherImagesModal();

//  code formulaire modal page 2

// Récupération des catégories à partir de l'API et insertion dans le DOM
async function recupererCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();

    const selectCategorie = document.getElementById("categorie");

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      selectCategorie.appendChild(option);
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error);
  }
}

//Modification du div photo upload, suppression des éléments puis ajout de la photo chargée

document
  .getElementById("photo-upload-input")
  .addEventListener("change", function (event) {
    const label = document.querySelector(".photo-label");
    const file = event.target.files[0]; // Récupère le fichier uploadé

    // Supprime tous les éléments enfants du label
    while (label.firstChild) {
      label.removeChild(label.firstChild);
    }

    // Vérifie si un fichier a été sélectionné
    if (file) {
      const reader = new FileReader();

      // Lorsque le fichier est chargé, affiche l'image
      reader.onload = function (e) {
        const img = document.createElement("img");
        img.src = e.target.result;
        img.style.maxWidth = "100%"; // Ajuste la largeur maximale à 100%
        img.style.height = "auto"; // Garde l'aspect ratio de l'image

        // Ajoute l'image au label
        label.appendChild(img);
      };

      // Lis le fichier comme URL de données (base64)
      reader.readAsDataURL(file);
    }
  });

// Vérifie si tous les champs (photo, titre, catégorie) sont remplis
function verifierFormulaireComplet() {
  const photoInput = document.getElementById("photo-upload-input");
  const titreInput = document.getElementById("Titre");
  const categorieInput = document.getElementById("categorie");

  return (
    photoInput.files.length > 0 &&
    titreInput.value.trim() !== "" &&
    categorieInput.value !== ""
  );
}

// Ajout de la classe .complete pour le bouton Valider si le formulaire est complet
function gererBoutonValider() {
  const erreurDiv = document.getElementById('erreur-formulaire');
  const boutonValider = document.querySelector(
    '.modal-ajout-photo input[type="submit"]'
  );

  if (verifierFormulaireComplet()) {
    boutonValider.classList.add("complete");
    erreurDiv.innerHTML = '';
  } else {
    boutonValider.classList.remove("complete");
  }
}

// Gestion des erreurs lors de la soumission si des champs sont vides, fonction alerte à revoir
function afficherErreurFormulaire() {
  const erreurDiv2 = document.getElementById('erreur-formulaire');
  
  // Réinitialiser le message d'erreur à chaque soumission
  erreurDiv2.innerHTML = '';

  if (!verifierFormulaireComplet()) {
     // Créer le message d'erreur et l'ajouter au DOM
    const messageErreur = document.createElement('p');
    messageErreur.textContent = "Veuillez remplir tous les champs avant de soumettre.";
    messageErreur.style.color = 'red'; // Optionnel si vous voulez spécifier la couleur ici aussi

    // Ajouter le message d'erreur sous la catégorie
    erreurDiv2.appendChild(messageErreur);
  }
}

// Envoi du formulaire si le bouton a la classe .complete
async function envoyerFormulaire(event) {
  const boutonValider = document.querySelector(
    '.modal-ajout-photo input[type="submit"]'
  );

  if (!boutonValider.classList.contains("complete")) {
    event.preventDefault();
    afficherErreurFormulaire();
    return;
  }

  event.preventDefault();

  const formData = new FormData();
  const photoInput = document.getElementById("photo-upload-input");
  const titreInput = document.getElementById("Titre");
  const categorieInput = document.getElementById("categorie");

  formData.append("image", photoInput.files[0]);
  formData.append("title", titreInput.value);
  formData.append("category", categorieInput.value);

  console.log("Contenu du FormData :");
  formData.forEach((value, key) => {
    console.log(key + ":", value);
  });

  try {
    // Récupération des données stockées dans localStorage
    const userData2 = JSON.parse(localStorage.getItem("userData"));
    const token2 = userData2?.token;

    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token2}`,
      },
      body: formData,
    });

    if (response.status === 201) {
      
      // Insérer la nouvelle image dans le DOM (par exemple dans la galerie)
      afficherImagesModal(); // Recharger les images après ajout
      // Vider le contenu du formulaire après la soumission réussie
      photoInput.value = ""; // Réinitialiser le champ photo
      titreInput.value = ""; // Réinitialiser le champ titre
      categorieInput.selectedIndex = 0; // Réinitialiser la catégorie à l'option par défaut
      // Réinitialiser le label du champ photo (réafficher icône, texte, etc.)
      const label = document.querySelector(".photo-label");
      while (label.firstChild) {
        label.removeChild(label.firstChild);
      }

      const icon = document.createElement("i");
      icon.classList.add("fa-regular", "fa-image"); // Assure-toi que les classes sont correctes
      label.appendChild(icon);

      const span = document.createElement("span");
      span.textContent = "Ajouter une photo";
      label.appendChild(span);

      const p = document.createElement("p");
      p.textContent = "jpg, png : 4mo max";
      label.appendChild(p);

      // Désactiver le bouton si le formulaire est vide après la réinitialisation
      boutonValider.classList.remove("complete");
      // Appel de la fonction pour fermer la modale 
      closeModal();
    } else {
      console.error("Erreur lors de l'ajout :", response.statusText);
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi du formulaire :", error);
  }
}

// Ajout des listeners
document.addEventListener("DOMContentLoaded", function () {
  recupererCategories();

  const photoInput = document.getElementById("photo-upload-input");
  const titreInput = document.getElementById("Titre");
  const categorieInput = document.getElementById("categorie");
  const boutonValider = document.querySelector(
    '.modal-ajout-photo input[type="submit"]'
  );

  photoInput.addEventListener("change", gererBoutonValider);
  titreInput.addEventListener("input", gererBoutonValider);
  categorieInput.addEventListener("change", gererBoutonValider);

  boutonValider.addEventListener("click", envoyerFormulaire);
});
