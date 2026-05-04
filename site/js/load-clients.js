// Client logos data
const clientLogos = [
    { name: 'Thermax', logo: '/img/clients/client-01.png' },
    { name: 'Ion Exchange', logo: '/img/clients/client-02.png' },
    { name: 'Aquatech', logo: '/img/clients/client-04.png' },
    { name: 'Reliance Industries', logo: '/img/clients/client-05.png' },
    { name: 'JSW', logo: '/img/clients/client-06.png' },
    { name: 'General Electric', logo: '/img/clients/client-07.png' },
    { name: 'CGPL', logo: '/img/clients/client-10.png' },
    { name: 'TATA Power', logo: '/img/clients/client-11.png' },
    { name: 'Kandla Port Trust', logo: '/img/clients/client-12.png' }
];

// Populate grid
function loadClientLogos() {
    const grid = document.getElementById('logoGrid');
    if (!grid) return;
    grid.innerHTML = '';
    
    clientLogos.forEach((client) => {
        const card = document.createElement('div');
        card.className = 'logo-card';
        card.setAttribute('data-client', client.name);
        card.setAttribute('role', 'listitem');
        
        const img = document.createElement('img');
        img.src = client.logo;
        img.alt = client.name;
        img.loading = 'lazy';
        
        card.appendChild(img);
        grid.appendChild(card);
    });
}

// Load on page ready
document.addEventListener('DOMContentLoaded', loadClientLogos);
