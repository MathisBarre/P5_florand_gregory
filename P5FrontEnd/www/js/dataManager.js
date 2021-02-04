class DataManager {

  produits = null;

  constructor(src) {
    this.src = src;
  }

  /**
   * récupère tous les produits de l'api
   *
   * @return  {Array}  Les renvoient sous forme de tableau
   */
  async getAllProducts() {
    if (this.produits !== null) return this.produits;
    const data = await fetch(this.src);
    this.produits = await data.json();
    return this.produits;
  }

  /**
   * récupère l'id du produit désiré et applique la méthode extractFromArray
   *
   * @param   {string}  productId  id du produit à retourner
   *
   * @return  {object}             retourne l'objet correspondant à l'id
   */
  async getProduct(productId) {
    if (this.produits === null) await this.getAllProducts();
    return this.extractFromArray(productId);
  }

  /**
   * extrait et affiche un objet par rapport à l'id du produit
   *
   * @param   {String}  productId  id du produit à retourner
   *
   * @return  {Object}             retourne l'objet correspondant à l'id
   */
  extractFromArray(productId) {
    for (let i = 0, size = this.produits.length; i < size; i++) {
      if (this.produits[i]._id === productId) return this.produits[i];
    }
    return {};
  }

  /**
   * sauvegarde le contenu du panier (cart.js) dans le localStorage
   *
   * @param   {object}  cart  contenu de l'objet panier
   *
   * @return  {[type]}        [return description]
   */
  saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  /**
   * recherche si le panier est déjà présent dans le localStorage
   *
   * @return  {object}  soit un tableau vide s'il ne trouve rien, soit objet cart qui est stocké dans le localStorage
   */
  getCart() {
    return localStorage.getItem("cart") === null ? [] : JSON.parse(localStorage.getItem("cart"));
  }

  /**
   * Envoie une requête POST à l'api avec les infos nécessaires à la commande
   *
   * @param   {string}  contactItems  comprend l'objet "contact" et "products"
   *
   * @return  {object}                contient l'objet "contact", "products" et "orderId"
   * @return  {[type]}                ensuite, sauvegarde les infos de contact dans le localStorage  et redirige vers la page confirmation en faisant passé l'orderId par les paramètres de l'url
   */
  postOrder(contactItems) {
    fetch("http://localhost:3000/api/teddies/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      mode: "cors",
      body: contactItems

    }).then(response => {
      return response.json();

    }).then(r => {
      localStorage.setItem("contact", JSON.stringify(r.contact));
      window.location.assign("./confirmation.html?orderId=" + r.orderId);
    })
  }
}