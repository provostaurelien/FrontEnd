// Fonction de récupération des images depuis l'API


async function RecuperationImages() {
    try {
        // Faire une requête à l'API
        const response = await fetch(`http://localhost:5678/api/works`);

        // Convertir la réponse en JSON
        const images = await response.json();

       
       // Création du contenu html avec maintien de la structure déja existante
       
        const container = document.querySelector(".gallery");


        for(let i= 0; i<images.length; i++)  { 

            const fig = document.createElement("figure");

            const imgelement = document.createElement("img");
            imgelement.src = images[i].imageUrl;
            imgelement.alt = images[i].title;

            const figcaption = document.createElement("figcaption");
            figcaption.innerText = images[i].title;

            fig.appendChild(imgelement);
            fig.appendChild(figcaption);
            container.appendChild(fig);
            
        }




    } catch (error) {
        // Gérer les erreurs réseau
        console.error("Erreur lors de la récupération des données :", error);
    }
}









// Appeler les fonctions sur la page
RecuperationImages();





