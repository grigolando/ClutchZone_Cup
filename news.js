// script.js

async function loadNews() {
    const response = await fetch('news.json');
    const news = await response.json();
    displayNews(news);

    // Category buttons
    const buttons = document.querySelectorAll('.categories button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const category = button.dataset.category;
            const filtered = category === 'All' ? news : news.filter(n => n.category === category);
            displayNews(filtered);
        });
    });

    // Search functionality
    document.getElementById('searchInput').addEventListener('input', e => {
        const value = e.target.value.toLowerCase();
        const filtered = news.filter(n => n.title.toLowerCase().includes(value));
        displayNews(filtered);
    });
}

function displayNews(news) {
    const container = document.getElementById('newsContainer');
    container.innerHTML = '';
    news.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('news-item');
        card.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="news-content">
                <p class="category">${item.category}</p>
                <h3>${item.title}</h3>
                <div class="news-meta">
                    <span>${item.author}</span>
                    <span>${item.date}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

loadNews();
