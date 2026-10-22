class ShopByWidth extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('click', this.onCardClick.bind(this));
    window.addEventListener('popstate', () => this.syncActiveCards(window.location.search));
  }

  get filteringSupported() {
    return typeof FacetFiltersForm !== 'undefined' && Boolean(document.getElementById('ProductGridContainer'));
  }

  onCardClick(event) {
    const card = event.target.closest('a.shop-by-width__card');
    if (!card || !this.filteringSupported) return;

    const cardUrl = new URL(card.href, window.location.origin);
    if (cardUrl.pathname !== window.location.pathname) return;

    event.preventDefault();

    let searchParams;
    if (card.dataset.filterParam) {
      const params = new URLSearchParams(window.location.search);
      const isActive = card.classList.contains('shop-by-width__card--active');

      params.delete(card.dataset.filterParam);
      params.delete('page');
      if (!isActive) params.append(card.dataset.filterParam, card.dataset.filterValue);

      searchParams = params.toString();
    } else {
      searchParams = cardUrl.search.slice(1);
    }

    this.syncActiveCards(searchParams);
    FacetFiltersForm.renderPage(searchParams);
  }

  syncActiveCards(searchParams) {
    const applied = new URLSearchParams(searchParams);
    this.querySelectorAll('a.shop-by-width__card[data-filter-param]').forEach((card) => {
      const isApplied = applied.getAll(card.dataset.filterParam).includes(card.dataset.filterValue);
      card.classList.toggle('shop-by-width__card--active', isApplied);
    });
  }
}

customElements.define('shop-by-width', ShopByWidth);
