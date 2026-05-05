// Client logos data
const clientLogos = [
    { name: 'Thermax', logo: '/img/clients/custom/thermax-new-2.png' },
    { name: 'Ion Exchange', logo: '/img/clients/custom/ion-exchange-new.png' },
    { name: 'Mannesmann', logo: '/img/clients/custom/mannesmann-new.png' },
    { name: 'Aquatech', logo: '/img/clients/aquatech-new.png' },
    { name: 'Reliance Industries', logo: '/img/clients/custom/reliance-new-2.png' },
    { name: 'JSW', logo: '/img/clients/jsw-new.png' },
    { name: 'General Electric', logo: '/img/clients/custom/ge-new.png' },
    { name: 'Arvind', logo: '/img/clients/custom/arvind-new.png' },
    { name: 'ESSAR', logo: '/img/clients/custom/essar-new.png' },
    { name: 'CGPL', logo: '/img/clients/custom/cgpl-new-2.png' },
    { name: 'TATA Power', logo: '/img/clients/custom/tata-power-new-2.png' },
    { name: 'Kandla Port Trust', logo: '/img/clients/custom/kandla-new.png' },
    { name: 'ABB', logo: '/img/clients/custom/abb-new.png' },
    { name: 'NTPC', logo: '/img/clients/custom/ntpc-new.png' },
    { name: 'Adani', logo: '/img/clients/custom/adani-new-2.png' },
    { name: 'Somany', logo: '/img/clients/custom/somany-new.png' },
    { name: 'Indo Dutch', logo: '/img/clients/custom/indo-dutch-new.png' },
    { name: 'BEIL', logo: '/img/clients/custom/beil-new.png' }
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
