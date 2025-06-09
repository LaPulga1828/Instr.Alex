let sprites = {};
let pokemon = document.getElementById("pokemon");
let pokemonShiny = document.getElementById("pokemon-shiny")
let sgvPokeball = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000"
                stroke-linecap="round" stroke-linejoin="round" id="Pokeball--Streamline-Tabler" height="30" width="30">
                <desc>
                    Pokeball Streamline Icon: https://streamlinehq.com
                </desc>
                <path d="M3 12a9 9 0 1 0 18 0 9 9 0 1 0 -18 0" stroke-width="2"></path>
                <path d="M9 12a3 3 0 1 0 6 0 3 3 0 1 0 -6 0" stroke-width="2"></path>
                <path d="M3 12h6" stroke-width="2"></path>
                <path d="M15 12h6" stroke-width="2"></path>
                </svg>
                `
let altura = document.querySelectorAll(".altura")
let peso = document.querySelectorAll(".peso")
let number = document.getElementById("number");
let types = document.getElementById("types");
let weaknesses = document.getElementById("weaknesses")
// Colores de tipos de Pokémon
let typesData = [
    { name: "normal", color: "#9ea09e", icon: "./img/types/normal.png" },
    { name: "fighting", color: "#fc7f00", icon: "./img/types/fighting.png" },
    { name: "flying", color: "#74a6d7", icon: "./img/types/flying.png" },
    { name: "poison", color: "#8138b4", icon: "./img/types/poison.png" },
    { name: "ground", color: "#914f1b", icon: "./img/types/ground.png" },
    { name: "rock", color: "#afaa81", icon: "./img/types/rock.png" },
    { name: "bug", color: "#90a012", icon: "./img/types/bug.png" },
    { name: "ghost", color: "#704170", icon: "./img/types/ghost.png" },
    { name: "steel", color: "#5fa0b7", icon: "./img/types/steel.png" },
    { name: "fire", color: "#e62324", icon: "./img/types/fire.png" },
    { name: "water", color: "#247fed", icon: "./img/types/water.png" },
    { name: "grass", color: "#3ca024", icon: "./img/types/grass.png" },
    { name: "electric", color: "#fac000", icon: "./img/types/electric.png" },
    { name: "psychic", color: "#ef4179", icon: "./img/types/psychic.png" },
    { name: "ice", color: "#3cd6fc", icon: "./img/types/ice.png" },
    { name: "dragon", color: "#5061e1", icon: "./img/types/dragon.png" },
    { name: "dark", color: "#4e3f3d", icon: "./img/types/dark.png" },
    { name: "fairy", color: "#ec70ed", icon: "./img/types/fairy.png" },
    { name: "unknown", color: "#68A092", icon: "./img/types/unknown.png" },
    { name: "stellar", color: "#000", icon: "./img/types/stellar.png" }
];

document.addEventListener("DOMContentLoaded", async () => {
    let res = await axios.get(
        //"https://pokeapi.co/api/v2/pokemon/25"
        "https://pokeapi.co/api/v2/pokemon/" + (Math.floor(Math.random() * 1025) + 1)
    );

    // --------------Primer Div de pokedex (carta)---------------
    sprites = res.data.sprites.other.home;
    if (sprites.front_female == null) {
        pokemon.src = sprites.front_default;
        pokemonShiny.src = sprites.front_shiny;
    } else {
        let gender = document.createElement("div");
        gender.className = "genders";
        gender.innerHTML = `
            <p>Genero</p>
            <div>
                <button onclick="male()" id="male" class="gender">
                ${sgvPokeball}
                </button>
                <button onclick="female()" id="female"class="gender">
                ${sgvPokeball}
                </button>
            </div>
        `;
        document.getElementById("carta").appendChild(gender);
        pokemon.src = sprites.front_default;
        pokemonShiny.src = sprites.front_shiny;

    }

    document.getElementById("name").textContent = res.data.name.toUpperCase();
    document.getElementById("name-shiny").textContent = res.data.name.toUpperCase() + " (Shiny)";
    altura.forEach((altura) => {
        altura.textContent = ` Altura: ${res.data.height / 10} m`;
    });
    peso.forEach((peso) => {
        peso.textContent = `Peso: ${res.data.weight / 10} kg`;
    });

    // --------------Colores de la carta---------------
    const tipo1 = res.data.types[0].type.name;
    let tipoInfo = typesData.find(t => t.name === tipo1);
    let color1;
    console.log(tipoInfo);

    if (tipoInfo && tipoInfo.color) {
        color1 = tipoInfo.color;
    } else {
        color1 = "#cccccc";
    }

    let backgroundStyle = color1;

    if (res.data.types.length > 1) {
        const tipo2 = res.data.types[1].type.name;
        const color2 = typesData.find(t => t.name === tipo2)?.color || "#aaaaaa";

        backgroundStyle = `linear-gradient(147deg, ${color1} 40%, ${color2} 60%)`;
    }

    document.querySelector(".card_front").style.background = backgroundStyle;
    document.querySelector(".card_back").style.background = backgroundStyle;


    // --------------Segundo Div de pokedex (info)---------------
    number.textContent = `#${res.data.id}`;
    number.style.background = backgroundStyle;
    number.style.webkitTextFillColor = "transparent";
    number.style.color = "transparent";
    number.style.backgroundClip = "text";
    number.style.webkitBackgroundClip = "text";

    res.data.types.forEach(({ type }) => {
        crearBotonTipo(type.name, types);
    });

    const debilidades = await axios.get(res.data.types[0].type.url);
    debilidades.data.damage_relations.double_damage_from.forEach(({ name }) => {
        crearBotonTipo(name, weaknesses);
    });

    res.data.abilities.forEach(({ ability }) => {
        const abilityButton = document.getElementById("abilities");
        abilityButton.innerHTML += `
            <button  class="ability">${ability.name.toUpperCase()}</button>`
    })
    document.querySelectorAll(".ability").forEach(ability => {
        ability.style.background = backgroundStyle;
    });

    // --------------Tercer Div de pokedex (stats)---------------
    const statsContainer = document.getElementById("stats");
    res.data.stats.forEach(stat => {
        const statDiv = document.createElement("div");
        statDiv.className = "stat";
        statDiv.innerHTML = `
            <p class="stat-name">${stat.stat.name.toUpperCase()}:<span class="stat-value"> ${stat.base_stat}</span>/255</p>
            <div class="stat-bar">
                <div class="stat-fill" style="width: ${stat.base_stat / 2}%"></div>
            </div>
            
        `;
        statsContainer.appendChild(statDiv);
    })
    document.querySelectorAll(".stat-fill").forEach(statFill => {
        statFill.style.background = backgroundStyle;
    });
    document.querySelectorAll(".stat-value").forEach(stat => {
        stat.style.background = backgroundStyle;
        stat.style.webkitTextFillColor = "transparent";
        stat.style.color = "transparent";
        stat.style.backgroundClip = "text";
        stat.style.webkitBackgroundClip = "text";
    });
});

function male() {
    pokemon.src = sprites.front_default;
    pokemonShiny.src = sprites.front_shiny;

}

function female() {
    pokemon.src = sprites.front_female;
    pokemonShiny.src = sprites.front_shiny_female;
}

function crearBotonTipo(tipoNombre, contenedor) {
    const typeInfo = typesData.find(t => t.name === tipoNombre);

    const button = document.createElement("button");
    button.className = "type";

    if (typeInfo) {
        button.style.backgroundColor = typeInfo.color;


        const icon = document.createElement("img");
        icon.src = typeInfo.icon;
        icon.alt = `${tipoNombre} icon`;
        icon.className = "type-icon";
        button.appendChild(icon);
    } else {
        button.style.backgroundColor = "#cccccc";
    }

    const span = document.createElement("span");
    span.textContent = tipoNombre.toUpperCase();
    button.appendChild(span);

    contenedor.appendChild(button);
}