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
  }

  // Ajoute l'événement de clic pour ouvrir la modale
    openModalLink.addEventListener('click', openModal);
  

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