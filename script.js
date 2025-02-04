data.mushrooms.forEach(mushroom => {
    // This loop creates a card for every entry in the JSON array
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        ${mushroom.imagePath ? `
        <img src="${mushroom.imagePath}" 
             alt="${mushroom.commonName}" 
             class="card-image">` : ''}
        <h2>${mushroom.commonName}</h2>
        <p class="scientific-name">${mushroom.scientificName}</p>
    `;
    
    card.addEventListener('click', () => showPanel(mushroom));
    grid.appendChild(card);
}); 