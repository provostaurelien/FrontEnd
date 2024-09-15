import { filtre } from './index.js'; 

document.addEventListener('DOMContentLoaded', function () {
    // Sélectionne l'élément de la modale et le lien d'ouverture
    const modal = document.getElementById('modal');
    const modalwindow = document.querySelector('.modal-window');
    const modalaccueil = document.querySelector('.modal-accueil');
    const modalajoutphoto = document.querySelector('.modal-ajout-photo');
    const openModalLink = document.querySelector('a[href="#modal"]');
    const closeModalIcons = modal.querySelectorAll('.fa-xmark');
    const btnajoutphoto = document.querySelector('.ajoutPhoto');
    const flecheretour = document.querySelector('.fa-arrow-left');
  
    // Fonction pour ouvrir la modale ou revenir à la page d'accueil de la modale
    function openModal(event) {
      event.preventDefault(); // Empêche le comportement par défaut du lien
      modal.classList.add('visible'); // Ajoute la classe pour reprise du background
      modalwindow.classList.add('visible'); // Ajoute la classe pour affichage fenetre
      modalaccueil.classList.add('visible'); // Ajoute la classe pour ajout du contenu d'accueil
      modalajoutphoto.classList.remove('visible')
    }

    // Fonction pour basculer sur la page ajout photo de la modale
    function Modalpage2(event) {
        modalaccueil.classList.remove('visible'); // Masque le contenu de la page d'accueil
        modalajoutphoto.classList.add('visible'); // Ajoute la classe pour visualisation du formulaire
      }


      // Fonction pour fermer la modale
  function closeModal() {
    // Retire la classe pour masquer la modale
    modal.classList.remove('visible'); 
    modalwindow.classList.remove('visible')
    modalaccueil.classList.remove('visible')
    modalajoutphoto.classList.remove('visible')
    //appel de la fonction filtre pour actualiser les images ajoutées ou supprimées :
    filtre();
  }

  // Ajoute l'événement de clic pour ouvrir la modale, if réajouter pour éviter erreur d'existence hors mode admin
  if (openModalLink){
    openModalLink.addEventListener('click', openModal); }
  

  // Ajoute l'événement pour accéder au formulaire d'ajout photo

    btnajoutphoto.addEventListener('click', Modalpage2);

  // Ajoute l'événement de retour à la page 1 de la modale en cliquant sur la flèche 

    flecheretour.addEventListener('click', openModal);


  // Ajoute l'événement de clic pour fermer la modale (sur la croix de fermeture)
  closeModalIcons.forEach(icon => {
    icon.addEventListener('click', closeModal);
  }); 

  // Ferme la modale en cliquant en dehors de la fenêtre modale
  modal.addEventListener('click', function (event) {
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
  images.forEach((image) => {
    const fig = document.createElement("figure");
    const imgelement = document.createElement("img");
    imgelement.src = image.imageUrl;
    imgelement.alt = image.title;
    imgelement.id = image.id;
    imgelement.className = image.category.name;
    const trashIcon = document.createElement('i');
    trashIcon.classList.add('fa-solid', 'fa-trash-can', 'trash-icon');

        // Ajouter un événement de clic sur l'icône de la corbeille
        trashIcon.addEventListener('click', async function () { 
          // Confirmation avant suppression (facultatif)
            try {
              // Récupération des données stockées dans localStorage
      const userData = JSON.parse(localStorage.getItem('userData'));
              // Extraction du token depuis les données récupérées
      const token = userData?.token;
      console.log(token)
         // Envoyer une requête DELETE à l'API avec l'ID de l'image
              const response = await fetch(`http://localhost:5678/api/works/${image.id}`, {
                method: 'DELETE',
          // Ajout du token dans le header
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
              },
              });
    
              // Vérifier si la suppression est réussie
              if (response.ok) {
                // Supprimer l'élément figure du DOM
                fig.remove();
                console.log(`Image avec ID ${image.id} supprimée avec succès.`);
              } else {
                console.error("Erreur lors de la suppression de l'image :", response.statusText);
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
console.log (localStorage.getItem('userData'))
afficherImagesModal();

// Supression des images du dom


