import { filtre } from "./index.js";

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("modal");
  const modalwindow = document.querySelector(".modal-window");
  const modalaccueil = document.querySelector(".modal-accueil");
  const modalajoutphoto = document.querySelector(".modal-ajout-photo");
  const openModalLink = document.querySelector('a[href="#modal"]');
  const closeModalIcons = modal.querySelectorAll(".fa-xmark");
  const btnajoutphoto = document.querySelector(".ajoutPhoto");
  const flecheretour = document.querySelector(".fa-arrow-left");

  // Fonction utilitaire pour gérer les classes
  function toggleClasses(elements, className, action = "add") {
    elements.forEach(el => el?.classList[action](className));
  }

  // Ouvrir la modale (accueil)
  function openModal(event) {
    event.preventDefault();
    toggleClasses([modal, modalwindow, modalaccueil], "visible");
    modalajoutphoto.classList.remove("visible");
  }

  // Bascule vers la page d'ajout de photo
  function openAddPhotoPage() {
    toggleClasses([modalaccueil], "visible", "remove");
    modalajoutphoto.classList.add("visible");
  }

  // Fermer la modale
  function closeModal() {
    toggleClasses([modal, modalwindow, modalaccueil, modalajoutphoto], "visible", "remove");
    filtre(); // Actualise les images
  }

  // Gestion des événements de la modale
  openModalLink?.addEventListener("click", openModal);
  btnajoutphoto?.addEventListener("click", openAddPhotoPage);
  flecheretour?.addEventListener("click", openModal);
  closeModalIcons.forEach(icon => icon.addEventListener("click", closeModal));

  // Fermeture en cliquant en dehors de la modale
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  // Récupération des images et affichage
  async function RecuperationImagesModal() {
    try {
      const response = await fetch(`http://localhost:5678/api/works`);
      return response.json();
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  }

  // Affichage des images dans la galerie
  function afficherImages(images) {
    const container = document.querySelector(".gallery-modal");
    container.innerHTML = ""; // Nettoyage

    images.forEach((image) => {
      const fig = document.createElement("figure");
      const img = document.createElement("img");
      img.src = image.imageUrl;
      img.alt = image.title;
      img.id = image.id;
      img.className = image.category.name;

      const trashIcon = document.createElement("i");
      trashIcon.classList.add("fa-solid", "fa-trash-can", "trash-icon");

      // Gestion de la suppression d'image
      trashIcon.addEventListener("click", async () => supprimerImage(image.id, fig));
      fig.append(img, trashIcon);
      container.appendChild(fig);
    });
  }

  // Suppression d'image via l'API
  async function supprimerImage(id, element) {
    try {
      const { token } = JSON.parse(localStorage.getItem("userData")) || {};
      const response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) element.remove();
      else console.error("Erreur lors de la suppression :", response.statusText);
    } catch (error) {
      console.error("Erreur lors de la requête DELETE :", error);
    }
  }

  // Chargement et affichage des images
  async function afficherImagesModal() {
    const images = await RecuperationImagesModal();
    if (images) afficherImages(images);
  }

  // Initialisation
  afficherImagesModal();

  // Gestion du formulaire d'ajout de photo
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

  // Gestion du chargement de photo dans le formulaire
  const photoInput = document.getElementById("photo-upload-input");
  photoInput.addEventListener("change", function (event) {
    const label = document.querySelector(".photo-label");
    const file = event.target.files[0];

    label.innerHTML = ""; // Nettoyage

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.src = e.target.result;
        img.style.maxWidth = "100%";
        img.style.height = "auto";
        label.appendChild(img);
      };
      reader.readAsDataURL(file);
    }
  });

  // Vérification du formulaire
  function verifierFormulaireComplet() {
    const titreInput = document.getElementById("Titre");
    const categorieInput = document.getElementById("categorie");

    return (
      photoInput.files.length > 0 &&
      titreInput.value.trim() !== "" &&
      categorieInput.value !== ""
    );
  }

  // Gestion de l'état du bouton de validation
  function gererBoutonValider() {
    const erreurDiv = document.getElementById('erreur-formulaire');
    const boutonValider = document.querySelector('.modal-ajout-photo input[type="submit"]');

    if (verifierFormulaireComplet()) {
      boutonValider.classList.add("complete");
      erreurDiv.innerHTML = '';
    } else {
      boutonValider.classList.remove("complete");
    }
  }

  // Soumission du formulaire
  async function envoyerFormulaire(event) {
    const boutonValider = document.querySelector('.modal-ajout-photo input[type="submit"]');
    if (!boutonValider.classList.contains("complete")) {
      event.preventDefault();
      afficherErreurFormulaire();
      return;
    }

    event.preventDefault();
    const formData = new FormData();
    formData.append("image", photoInput.files[0]);
    formData.append("title", document.getElementById("Titre").value);
    formData.append("category", document.getElementById("categorie").value);

    try {
      const { token } = JSON.parse(localStorage.getItem("userData")) || {};
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.status === 201) {
        alert("Ajout réussi");
        afficherImagesModal(); // Rafraîchit les images
        resetFormulaire();
      } else {
        console.error("Erreur lors de l'ajout :", response.statusText);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire :", error);
    }
  }

  // Réinitialise le formulaire après soumission
  function resetFormulaire() {
    photoInput.value = "";
    document.getElementById("Titre").value = "";
    document.getElementById("categorie").selectedIndex = 0;

    const label = document.querySelector(".photo-label");
    label.innerHTML = `
      <i class="fa-regular fa-image"></i>
      <span>Ajouter une photo</span>
      <p>jpg, png : 4mo max</p>
    `;

    document.querySelector('.modal-ajout-photo input[type="submit"]').classList.remove("complete");
  }

  // Gestion des événements du formulaire
  recupererCategories();
  photoInput.addEventListener("change", gererBoutonValider);
  document.getElementById("Titre").addEventListener("input", gererBoutonValider);
  document.getElementById("categorie").addEventListener("change", gererBoutonValider);
  document.querySelector('.modal-ajout-photo input[type="submit"]').addEventListener("click", envoyerFormulaire);
});
