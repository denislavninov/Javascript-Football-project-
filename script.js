const key = `0bcb75ac8d2d8f9a7027b6eb7b8c0a84`;

const getliveScores = document.getElementById("liveScoresBtn");
getliveScores.addEventListener("click", function (e) {
    const postsList = document.getElementById('posts-list');
    if (postsList.innerHTML !== '') {
        // Mevcut liste doluysa, temizle
        postsList.innerHTML = '';
        return;
    }

    fetch("https://v3.football.api-sports.io/fixtures?live=all", {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "v3.football.api-sports.io",
            "x-rapidapi-key": key
        }
    })
        .then(response => response.json()) // JSON formatında yanıt bekleniyor
        .then(data => {
            console.log(data);
            const matchesList = data['response'];

            // Her maçı listeye ekle
            matchesList.forEach(match => {
                const fixture = match['fixture'];
                const goals = match['goals'];
                const teams = match['teams'];
                const league = match['league'];

                const listGames = document.createElement('li');
                listGames.setAttribute('data-id', fixture.id);
                // Avoid using innerHTML, it's considered insecure approach. Instead, create elements in JS as we did in the lessons. See here: https://medium.com/@verity.carlos/why-you-shouldnt-use-innerhtml-and-what-to-use-instead-ed99d064a416#:~:text=The%20drawbacks%20of%20innerHTML&text=All%20three%20properties%20(textContent%2C%20innerText,may%20pose%20a%20security%20risk.
                listGames.innerHTML = `
                <img src="${league.logo}" alt="${league.name} logo" class="league-logo">
                <span class="league-name">${league.name}</span>
                <div class="team">
                    <img src="${teams.home.logo}" alt="${teams.home.name} logo" class="team-logo">
                    <span class="team-name">${teams.home.name}</span>
                </div>
                <span class="score">${goals.home}</span>
                <span class="elapsed">${fixture.status.elapsed ? fixture.status.elapsed + "'" : ''}</span>
                <span class="score">${goals.away}</span>
                <div class="team">
                    <span class="team-name">${teams.away.name}</span>
                    <img src="${teams.away.logo}" alt="${teams.away.name} logo" class="team-logo">
                </div>
            `;
                postsList.append(listGames);
            });

        })
        .catch(err => {
            console.log(err);
        });
});


