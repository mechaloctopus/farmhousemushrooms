document.addEventListener('DOMContentLoaded', function() {
  fetch('mushrooms.json')
    .then(response => response.json())
    .then(data => {
      const grid = document.getElementById('mushroom-grid');
      const content = document.getElementById('mushroom-content');
      
      data.mushrooms.forEach(mushroom => {
        // Create grid item
        const cardHtml = `
          <div class="col l4">
            <a class="grid__item card medium hoverable" href="#${mushroom.id}">
              <div class="card-content">
                <span class="card-title">${mushroom.commonName}</span>
                <p class="scientific-name">${mushroom.scientificName}</p>
              </div>
              <div class="card-action">
                <span class="time-frame">${mushroom.timeFrame}</span>
              </div>
            </a>
          </div>`;
        grid.insertAdjacentHTML('beforeend', cardHtml);
        
        // Create content item
        const contentHtml = `
          <article class="content__item" id="${mushroom.id}">
            <div class="mushroom-header">
              <span class="category category--full">${mushroom.scientificName}</span>
              <h2 class="title title--full">${mushroom.commonName}</h2>
            </div>
            
            <div class="mushroom-content">
              <img class="featured-image" src="${mushroom.imagePath}" alt="${mushroom.commonName}">
              
              ${mushroom.alternateNames.length ? `
              <section class="detail-section">
                <h3>Also Known As</h3>
                <div class="chip-container">
                  ${mushroom.alternateNames.map(name => `<div class="chip">${name}</div>`).join('')}
                </div>
              </section>` : ''}
              
              <section class="detail-section">
                <h3>Flavor Profile</h3>
                <p>${mushroom.flavorProfile.description}</p>
              </section>
              
              ${mushroom.recipes.length ? `
              <section class="detail-section">
                <h3>Culinary Uses</h3>
                <ul class="recipes-list">
                  ${mushroom.recipes.map(recipe => `<li>${recipe}</li>`).join('')}
                </ul>
              </section>` : ''}
              
              <section class="detail-section">
                <h3>Health Benefits</h3>
                <p>${mushroom.healthBenefits.description}</p>
                ${mushroom.healthBenefits.studies.length ? `
                <div class="studies">
                  <h4>Key Studies:</h4>
                  <ul>
                    ${mushroom.healthBenefits.studies.map(study => `
                    <li><a href="${study.url}" target="_blank">${study.title}</a></li>
                    `).join('')}
                  </ul>
                </div>` : ''}
              </section>
              
              ${mushroom.etsyLink ? `
              <section class="detail-section">
                <h3>Purchase Options</h3>
                <a href="${mushroom.etsyLink}" class="etsy-link" target="_blank">
                  <i class="fa fa-shopping-cart"></i> Find on Etsy
                </a>
              </section>` : ''}
              
              <section class="detail-section">
                <h3>Cultivation Notes</h3>
                <p>${mushroom.cultivationTips}</p>
              </section>
              
              ${mushroom.folkloreHistory.description ? `
              <section class="detail-section">
                <h3>History & Folklore</h3>
                <p>${mushroom.folkloreHistory.description}</p>
              </section>` : ''}
            </div>
          </article>`;
        content.insertAdjacentHTML('beforeend', contentHtml);
      });

      // Content toggle logic
      document.querySelectorAll('.grid__item').forEach(item => {
        item.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = this.getAttribute('href').substring(1);
          document.querySelectorAll('.content__item').forEach(article => {
            article.classList.remove('active');
          });
          document.getElementById(targetId).classList.add('active');
          document.querySelector('.content').classList.add('show-content');
        });
      });

      // Close button handler
      document.querySelector('.close-button').addEventListener('click', () => {
        document.querySelector('.content').classList.remove('show-content');
        document.querySelectorAll('.content__item').forEach(article => {
          article.classList.remove('active');
        });
      });
    })
    .catch(error => console.error('Error loading mushroom data:', error));
}); 