// Appel API pour récupération des filtres
export async function recupererCategories() {
    try {
      const response = await fetch("http://localhost:5678/api/categories");
      const categories = await response.json();
      return categories; // Retourne les catégories pour pouvoir les réutiliser
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
      throw error; // Propager l'erreur pour qu'elle soit gérée ailleurs si nécessaire
    }
  }

// Appel API pour récupération des images

  export async function recupererImages() {
    try {
      const response = await fetch("http://localhost:5678/api/works");
      const images = await response.json();
      return images; // Retourne les images pour les réutiliser
    } catch (error) {
      console.error("Erreur lors de la récupération des images :", error);
      throw error; // Propager l'erreur pour gestion éventuelle
    }
  }