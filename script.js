// Convert to module pattern
const MushroomUI = (() => {
  const DOM = {
    grid: document.getElementById('mushroomGrid'),
    panel: document.getElementById('contentPanel'),
    content: document.getElementById('panelContent')
  };

  // Template generators
  const cardTemplate = ({ imagePath, commonName, scientificName }) => `
    <div class="card">
      ${imagePath ? `<img src="${imagePath}" alt="${commonName}" class="card-image" loading="lazy">` : ''}
      <h2>${commonName}</h2>
      <p class="scientific-name">${scientificName}</p>
    </div>
  `;

  const panelTemplate = (mushroom) => `
    <h2>${mushroom.commonName}</h2>
    <p class="scientific-name">${mushroom.scientificName}</p>
    ${mushroom.imagePath ? `<img src="${mushroom.imagePath}" alt="${mushroom.commonName}" class="card-image">` : ''}
    ${mushroom.alternateNames && mushroom.alternateNames.length ? `
      <div class="detail-section">
        <h3>Alternate Names</h3>
        <p>${mushroom.alternateNames.join(', ')}</p>
      </div>` : ''}
    ${mushroom.flavorProfile ? `
      <div class="detail-section">
        <h3>Flavor Profile</h3>
        <p>${mushroom.flavorProfile.description}</p>
        ${mushroom.flavorProfile.sources && mushroom.flavorProfile.sources.length
          ? `<ul>${mushroom.flavorProfile.sources.map(src => `<li><a href="${src.url}" target="_blank">${src.reference}</a></li>`).join('')}</ul>`
          : '' }
      </div>` : ''}
    ${mushroom.cultivationTips ? `
      <div class="detail-section">
        <h3>Cultivation Tips</h3>
        <p>${mushroom.cultivationTips}</p>
      </div>` : ''}
    ${mushroom.healthBenefits ? `
      <div class="detail-section">
        <h3>Health Benefits</h3>
        <p>${mushroom.healthBenefits.description}</p>
        ${mushroom.healthBenefits.studies && mushroom.healthBenefits.studies.length
          ? `<ul>${mushroom.healthBenefits.studies.map(study => `
              <li>
                <strong>${study.title}</strong>: <a href="${study.url}" target="_blank">${study.url}</a><br>
                ${study.summary}
              </li>
            `).join('')}</ul>`
          : '' }
      </div>` : ''}
    ${mushroom.folkloreHistory ? `
      <div class="detail-section">
        <h3>Folklore History</h3>
        <p>${mushroom.folkloreHistory.description}</p>
        ${mushroom.folkloreHistory.sources && mushroom.folkloreHistory.sources.length
          ? `<ul>${mushroom.folkloreHistory.sources.map(src => `<li><a href="${src.url}" target="_blank">${src.reference}</a></li>`).join('')}</ul>`
          : '' }
      </div>` : ''}
    ${mushroom.recipes && mushroom.recipes.length ? `
      <div class="detail-section">
        <h3>Recipes</h3>
        <ul>
          ${mushroom.recipes.map(recipe => `<li><a href="${recipe.url}" target="_blank">${recipe.name}</a> — ${recipe.description}</li>`).join('')}
        </ul>
      </div>` : ''}
    ${mushroom.identificationFeatures ? `
      <div class="detail-section">
        <h3>Identification Features</h3>
        <p>Spore Print: ${mushroom.identificationFeatures.sporePrint}</p>
        <p>Cap Texture: ${mushroom.identificationFeatures.capTexture}</p>
      </div>` : ''}
    ${mushroom.etsyLink ? `
      <div class="detail-section">
        <h3>Buy on Etsy</h3>
        <p><a href="${mushroom.etsyLink}" target="_blank">${mushroom.etsyLink}</a></p>
      </div>` : ''}
  `;

  // Event delegation for cards
  function handleCardClick(e) {
    const card = e.target.closest('.card');
    if (card) {
      const mushroom = JSON.parse(decodeURIComponent(card.dataset.mushroom));
      showPanel(mushroom);
    }
  }

  function showPanel(mushroom) {
    DOM.content.innerHTML = panelTemplate(mushroom);
    DOM.panel.classList.add('active');
  }

  function closePanel() {
    DOM.panel.classList.remove('active');
  }

  // Public methods
  return {
    init: async () => {
      try {
        const response = await fetch('mushrooms.json');
        const data = await response.json();
        
        DOM.grid.innerHTML = data.mushrooms.map(mushroom => {
          const card = cardTemplate(mushroom);
          return card.replace('<div class="card">', 
            `<div class="card" data-mushroom="${encodeURIComponent(JSON.stringify(mushroom))}">`);
        }).join('');
        
        DOM.grid.addEventListener('click', handleCardClick);
        document.querySelector('.close-btn').addEventListener('click', closePanel);

      } catch (error) {
        DOM.grid.innerHTML = `<div class="error">Failed to load mushroom data</div>`;
      }
    }
  };
})();

document.addEventListener('DOMContentLoaded', MushroomUI.init);

// Expose closePanel to global scope so inline onclick works
window.closePanel = MushroomUI.closePanel; 