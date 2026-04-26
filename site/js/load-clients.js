// Client logos data
const clientLogos = [
    { name: 'Thermax', logo: '/img/clients/thermax.svg' },
    { name: 'Ion Exchange', logo: '/img/clients/ion-exchange.svg' },
    { name: 'Mannesmann', logo: '/img/clients/mannesmann.svg' },
    { name: 'Aquatech', logo: '/img/clients/aquatech.svg' },
    { name: 'Reliance Industries', logo: '/img/clients/reliance.svg' },
    { name: 'JSW', logo: '/img/clients/jsw.svg' },
    { name: 'GE', logo: '/img/clients/ge.svg' },
    { name: 'Arvind', logo: '/img/clients/arvind.svg' },
    { name: 'ESSAR', logo: '/img/clients/essar.svg' },
    { name: 'CGPL', logo: '/img/clients/cgpl.svg' },
    { name: 'TATA Power', logo: '/img/clients/tata-power.svg' },
    { name: 'Kandla Port Trust', logo: '/img/clients/kandla-port.svg' }
];

// Populate grid
function loadClientLogos() {
    const grid = document.getElementById('logoGrid');
    if (!grid) return;
    
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
