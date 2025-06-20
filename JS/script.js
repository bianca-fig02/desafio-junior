const API_BASE = "https://www.freetogame.com/api/games"; 
const API_DETAILS = "https://www.freetogame.com/api/game?id=";
const CORS_PROXY = "https://corsproxy.io/?"; // Proxy mais confiável

function searchGames() {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    const resultsDiv = document.getElementById('results');

    if (!query) {
        resultsDiv.innerHTML = '<p>Por favor, digite o nome do jogo.</p>';
        return;
    }

    const encodedBaseURL = encodeURIComponent(API_BASE);

    fetch(`${CORS_PROXY}${encodedBaseURL}`)
        .then(response => {
            if (!response.ok) throw new Error("Resposta não OK");
            return response.text();
        })
        .then(data => {
            try {
                const games = JSON.parse(data);
                const filtered = games.filter(game =>
                    game.title.toLowerCase().includes(query)
                );

                if (filtered.length === 0) {
                    resultsDiv.innerHTML = '<p>Nenhum jogo encontrado.</p>';
                    return;
                }

                resultsDiv.innerHTML = '';

                filtered.forEach((game, index) => {
                    const gameHTML = `
                        <div class="game" onclick="getGameDetails(${game.id})">
                            <strong>${index + 1}. ${game.title}</strong><br>
                            Plataforma: ${game.platform}<br>
                            Lançamento: ${game.release_date || 'Desconhecido'}<br>
                            Gênero: ${game.genre}
                        </div>`;
                    resultsDiv.innerHTML += gameHTML;
                });
            } catch (err) {
                console.error("Erro ao analisar JSON:", err);
                resultsDiv.innerHTML = '<p>Erro ao processar os dados da API.</p>';
            }
        })
        .catch(error => {
            console.error("Erro na requisição:", error);
            resultsDiv.innerHTML = '<p>Erro ao buscar jogos. Tente novamente.</p>';
        });
}

function getGameDetails(id) {
    const encodedDetailsURL = encodeURIComponent(`${API_DETAILS}${id}`);
    
    fetch(`${CORS_PROXY}${encodedDetailsURL}`)
        .then(response => {
            if (!response.ok) throw new Error("Detalhes: resposta não OK");
            return response.text();
        })
        .then(data => {
            try {
                const game = JSON.parse(data);
                const detailsHTML = `
                    <div class="game-details">
                        <h3>🎮 ${game.title}</h3>
                        <img src="${game.thumbnail}" alt="Capa do jogo" style="max-width: 200px;"><br><br>
                        <p><strong>Plataforma:</strong> ${game.platform}</p>
                        <p><strong>Lançamento:</strong> ${game.release_date}</p>
                        <p><strong>Gênero:</strong> ${game.genre}</p>
                        <p><strong>Descrição:</strong> ${game.short_description}</p>
                        <p><strong>Sobre:</strong> ${game.description}</p>
                        <p><strong>Link:</strong> <a href="${game.game_url}" target="_blank">Ir para o jogo</a></p>
                    </div>`;
                document.getElementById('results').innerHTML += detailsHTML;
            } catch (err) {
                console.error("Erro ao analisar detalhes:", err);
                document.getElementById('results').innerHTML += '<p>Erro ao carregar detalhes do jogo.</p>';
            }
        })
        .catch(error => {
            console.error("Erro ao carregar detalhes:", error);
            document.getElementById('results').innerHTML += '<p>Erro ao carregar informações do jogo.</p>';
        });
}