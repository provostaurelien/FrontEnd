async function envoiLogin() {
  document
    .getElementById("loginForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault(); // Empêche la soumission du formulaire

      const mail = document.getElementById("mail").value;
      const password = document.getElementById("password").value;

      console.log("mail:", mail);
      console.log("Mot de passe:", password);

      // Vérification de l'adresse e-mail avec regex
      const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

          // Supprimer le message d'erreur précédent s'il existe
          const errorElement = document.getElementById("errorMail");
          if (errorElement) {
            errorElement.remove();
          }
    
          if (!emailRegex.test(mail)) {
            const container = document.getElementById("mail");
            const errorConnexion = document.createElement("p");
            errorConnexion.id = "errorMail"; // Attribuer un id au message d'erreur
            errorConnexion.textContent = "Veuillez entrer une adresse e-mail valide.";
            errorConnexion.style.color = "red"; // Changer la couleur du texte en rouge
    
            // Insérer le message après le champ e-mail
            container.insertAdjacentElement("afterend", errorConnexion);
            return; // Empêche la suite de l'exécution si l'e-mail est invalide
          }

      try {
        const response = await fetch(`http://localhost:5678/api/users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: mail,
            password: password,
          }),
        });

        // Vérifiez la réponse du serveur
        if (response.ok) {
          const data = await response.json();
          // stocker la response dans le local storage
          localStorage.setItem("userData", JSON.stringify(data));
          // Rediriger vers la page index
          window.location.href = "./index.html";
        } else {
          console.error(
            "Erreur lors de la requête:",
            response.status,
            response.statusText
          );
          // Vérifier si un message d'erreur existe déjà avec une boucle if
          if (!document.getElementById("errorConnexion")) {
            const container = document.getElementById("password");
            const errorConnexion = document.createElement("p");
            errorConnexion.id = "errorConnexion"; // Attribuer un id au message d'erreur
            errorConnexion.textContent = `Erreur dans l’identifiant ou le mot de passe`;

            // Insérer le message après l'élément de mot de passe
            container.insertAdjacentElement("afterend", errorConnexion);
          }
        }
      } catch (error) {
        console.error("Erreur réseau ou autre:", error);
      }
    });
}

// Appel des fonctions
envoiLogin();
