const key = `0bcb75ac8d2d8f9a7027b6eb7b8c0a84`;


document.getElementById('search-button').addEventListener('click', fetchPlayer);

async function fetchPlayer() {
    const key = `0bcb75ac8d2d8f9a7027b6eb7b8c0a84`;
    const playerName = document.getElementById('player-input').value;
    const url = `https://v3.football.api-sports.io/players?search=${playerName}`;

    try {
        const response = await fetch(url, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "v3.football.api-sports.io",
                "x-rapidapi-key": '0bcb75ac8d2d8f9a7027b6eb7b8c0a84'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayPlayerInfo(data.response);
        console.log(data);
    } catch (error) {
        console.error('Error fetching player data:', error);

    }

}


document.addEventListener('DOMContentLoaded', () => {
    fetchLeagues();
    document.getElementById('league-select').addEventListener('change', fetchTeams);
    document.getElementById('search-button').addEventListener('click', searchPlayer);
});

function fetchLeagues() {
    const url = 'https://v3.football.api-sports.io/leagues';
    fetch(url, {
        method: 'GET',
        headers: {
            'x-rapidapi-host': 'v3.football.api-sports.io',
            "x-rapidapi-key": '0bcb75ac8d2d8f9a7027b6eb7b8c0a84'
        }
    })
    .then(response => response.json())
    .then(data => populateLeagues(data.response))
    .catch(error => console.error('Erro fetching leagues',error));

}

function populateLeagues(leagues) {
    const leagueSelect =document.getElementById("league-select");
    leagueSelect.innerHTML = '<option value="">Select a league</option>';

    leagues.forEach(league=> {
        const option = document.createElement('option');
        option.value = league.league.id;
        option.textContent = league.league.name;
        leagueSelect.appendChild(option);
    });
}

function fetchTeams() {
    const leagueId = document.getElementById('league-select').value;
    const url = `https://v3.football.api-sports.io/teams?league=${leagueId}&season=2023`;

    fetch(url, {
        method: 'GET',
        headers: {
            'x-rapidapi-host': 'v3.football.api-sports.io',
            'x-rapidapi-key': '0bcb75ac8d2d8f9a7027b6eb7b8c0a84'
        }
    })
    .then(response => response.json())
    .then(data => populateTeams(data.response))
    .catch(error => console.error('Error fetching teams:', error));
}


function populateTeams(teams) {
    const teamSelect = document.getElementById('team-select');
    teamSelect.innerHTML = '<option value="">Select a Team</option>';

    teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team.team.id;
        option.textContent = team.team.name;
        teamSelect.appendChild(option);
    });
}

function searchPlayer() {
    const playerName = document.getElementById('player-input').value;
    const leagueId = document.getElementById('league-select').value;
    const teamId = document.getElementById('team-select').value;

    if (!playerName) {
        alert('Please enter a player name');
        return;
    }

    const url = `https://v3.football.api-sports.io/players?search=${playerName}&league=${leagueId}&team=${teamId}`;

    fetch(url, {
        method: 'GET',
        headers: {
            'x-rapidapi-host': 'v3.football.api-sports.io',
            'x-rapidapi-key': `0bcb75ac8d2d8f9a7027b6eb7b8c0a84`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if (!Array.isArray(data.response)) {
            throw new TypeError('Expected an array as response');
        }
        displayPlayerInfo(data.response);
    })
    .catch(error => console.error('Error fetching player data:', error));
}




function displayPlayerInfo(players) {
    const container = document.getElementById('player-info');
    container.innerHTML = '';
    if (players.length === 0) {
        container.innerHTML = '<p>No player found</p>'
        return;
    }

    players.forEach(player => {
        const playerName =player
        const playerDiv = document.createElement('div');
        playerDiv.classList.add('player-info');
        playerDiv.innerHTML =
            `
        <h2>${player.player.name}</h2>
        <img src="${player.player.photo}" alt="No photo available">
        <p>Date of Birth: ${player.player.birth.date}</p>
        <p>Nationality: ${player.player.nationality}</p>
        <p>Position: ${player.statistics[0].games.position}</p>
        <p>Team: ${player.statistics[0].team.name}</p>
    `;

        container.appendChild(playerDiv);

    });
}