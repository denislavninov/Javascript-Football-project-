const key = `0bcb75ac8d2d8f9a7027b6eb7b8c0a84`;

// Removed click ement listener for the search button, it's added in the DOMContentLoaded event listener instead.

async function fetchPlayer() {
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
    // Use form submit event listener instead of only covering the click event
    document.getElementById('player-search-form').addEventListener('submit', searchPlayer);
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
    .then(response => {
        // If you want to improve the solution even more, you can check the status of the HTTP respose here. Normally, it's good to apply it to all API requests when working with Fetch API.
        if (response.status === 200) {
            return response.json();
        } else {
            throw Error(`Could not fetch leagues. Response code ${response.status}.`)
        }
        })
    .then(data => populateLeagues(data.response))
    .catch(error => console.error('Error fetching leagues',error));

}

function populateLeagues(leagues) {
    const leagueSelect = document.getElementById("league-select");
    leagueSelect.innerText = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.innerText = 'Select a League';
    leagueSelect.appendChild(defaultOption);

    leagues.forEach(league => {
        const option = document.createElement('option');
        option.value = league.league.id;
        option.innerText = league.league.name;
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
    teamSelect.innerText = '';

    const defaultOptionTeam = document.createElement('option');
    defaultOptionTeam.value = '';
    defaultOptionTeam.innerText = 'Select a Team';
    teamSelect.appendChild(defaultOptionTeam);

    teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team.team.id;
        option.innerText = team.team.name;
        teamSelect.appendChild(option);
    });
}

function searchPlayer() {
    const playerName = document.getElementById('player-input').value;
    const leagueId = document.getElementById('league-select').value;
    const teamId = document.getElementById('team-select').value;
    const errorMessage = document.getElementById('error-mesage');

    if (!playerName) {
        errorMessage.innerText = 'Please enter a player name';
        return;
    }
    errorMessage.innerText = '';


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
        container.innerText = '<p>No player found</p>'
        return;
    }

    players.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.classList.add('player-info');

        // Create and append the player's name
        const playerName = document.createElement('h2');
        playerName.innerText = player.player.name;
        playerDiv.appendChild(playerName);

        // Create and append the player's photo
        const playerPhoto = document.createElement('img');
        playerPhoto.src = player.player.photo;
        playerPhoto.alt = 'No photo available';
        playerDiv.appendChild(playerPhoto);

        // Create and append the player's date of birth
        const playerDOB = document.createElement('p');
        playerDOB.innerText = `Date of Birth: ${player.player.birth.date}`;
        playerDiv.appendChild(playerDOB);

        // Create and append the player's nationality
        const playerNationality = document.createElement('p');
        playerNationality.innerText = `Nationality: ${player.player.nationality}`;
        playerDiv.appendChild(playerNationality);

        // Create and append the player's position
        const playerPosition = document.createElement('p');
        playerPosition.innerText = `Position: ${player.statistics[0].games.position}`;
        playerDiv.appendChild(playerPosition);

        // Create and append the player's team
        const playerTeam = document.createElement('p');
        playerTeam.innerText = `Team: ${player.statistics[0].team.name}`;
        playerDiv.appendChild(playerTeam);

        // Append the playerDiv to the container
        container.appendChild(playerDiv);
    });
}