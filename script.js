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
    ${['flavorProfile', 'cultivationTips', 'healthBenefits', 'recipes'].map(section => `
      <div class="detail-section">
        <h3>${section.replace(/([A-Z])/g, ' $1').trim()}</h3>
        <p>${typeof mushroom[section] === 'object' ? mushroom[section].description : mushroom[section]}</p>
        ${section === 'recipes' ? `<ul>${mushroom.recipes.map(r => `<li>${r}</li>`).join('')}</ul>` : ''}
      </div>
    `).join('')}
  `;

  // Event delegation for cards
  function handleCardClick(e) {
    const card = e.target.closest('.card');
    if (card) {
      const mushroom = JSON.parse(card.dataset.mushroom);
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
            `<div class="card" data-mushroom='${JSON.stringify(mushroom)}'>`);
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