document.addEventListener('DOMContentLoaded', function() {
  // Initialize Materialize components
  M.AutoInit();
  
  // Load mushroom data
  fetch('mushrooms.json')
    .then(response => response.json())
    .then(data => initializeMushrooms(data.mushrooms))
    .catch(error => console.error('Error:', error));

  function initializeMushrooms(mushrooms) {
    const grid = document.getElementById('mushroom-grid');
    const content = document.getElementById('mushroom-content');

    // Clear existing content
    grid.innerHTML = '';
    content.innerHTML = '';

    mushrooms.forEach(mushroom => {
      // Create grid card
      const cardHtml = `
        <div class="col l4 s6">
          <a class="grid__item card hoverable" href="#${mushroom.id}">
            <div class="card-content">
              <span class="card-title">${mushroom.commonName}</span>
              <p class="scientific-name">${mushroom.scientificName}</p>
            </div>
          </a>
        </div>`;
      grid.insertAdjacentHTML('beforeend', cardHtml);

      // Create content article
      const contentHtml = `
        <article class="content__item" id="${mushroom.id}">
          <span class="category">${mushroom.scientificName}</span>
          <h2 class="title title--full">${mushroom.commonName}</h2>
          <div class="meta">
            <img class="meta__avatar" src="${mushroom.imagePath}" alt="${mushroom.commonName}">
            <div class="mushroom-details">
              ${createDetailSection('Flavor Profile', mushroom.flavorProfile.description)}
              ${createDetailList('Alternate Names', mushroom.alternateNames)}
              ${createDetailList('Recipes', mushroom.recipes)}
              ${createDetailSection('Cultivation', mushroom.cultivationTips)}
              ${mushroom.etsyLink ? `
              <div class="purchase-section">
                <a href="${mushroom.etsyLink}" class="btn waves-effect waves-light" target="_blank">
                  <i class="fa fa-shopping-cart left"></i>Purchase
                </a>
              </div>` : ''}
            </div>
          </div>
        </article>`;
      content.insertAdjacentHTML('beforeend', contentHtml);
    });

    // Add click handlers
    document.querySelectorAll('.grid__item').forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        showContentArticle(targetId);
      });
    });

    // Close button handler
    document.querySelector('.content .close-button').addEventListener('click', hideContent);
  }

  function createDetailSection(title, content) {
    return `
      <div class="detail-section">
        <h3>${title}</h3>
        <p>${content}</p>
      </div>`;
  }

  function createDetailList(title, items) {
    if (!items.length) return '';
    return `
      <div class="detail-section">
        <h3>${title}</h3>
        <ul class="browser-default">
          ${items.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>`;
  }

  function showContentArticle(id) {
    document.querySelectorAll('.content__item').forEach(article => {
      article.classList.remove('active');
    });
    const target = document.getElementById(id);
    if (target) {
      target.classList.add('active');
      document.querySelector('.content').classList.add('active');
    }
  }

  function hideContent() {
    document.querySelector('.content').classList.remove('active');
  }
}); 