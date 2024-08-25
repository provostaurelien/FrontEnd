async function RecuperationImages() {
    try {
        const response = await fetch(`http://localhost:5678/api/works`);
        const images = await response.json();

        const container = document.querySelector(".gallery");

        for(let i= 0; i<images.length; i++)  { 
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
    container.innerHTML = ''; // Vide le contenu existant

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

async function filtre() {
    const images = await RecuperationImages(); // Récupère les images

    // Ajouter des écouteurs d'événements sur chaque bouton de filtre
    document.querySelector(".btnTous").addEventListener("click", function() {
        afficherImagesFiltrees(images);
    });

    document.querySelector(".btnObjets").addEventListener("click", function() {
        afficherImagesFiltrees(images, "Objets");
    });

    document.querySelector(".btnAppartements").addEventListener("click", function() {
        afficherImagesFiltrees(images, "Appartements");
    });

    document.querySelector(".btnHotelsRestaurants").addEventListener("click", function() {
        afficherImagesFiltrees(images, "Hotels & restaurants");
    });
}


// Appel des fonctions
RecuperationImages();
filtre()





