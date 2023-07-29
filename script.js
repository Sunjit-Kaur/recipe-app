const searchBox = document.querySelector('.searchBox');
const searchBtn = document.getElementById('search-btn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');

// function to get recipes
const fetchRecipes = async (query) => {
    recipeContainer.innerHTML = `
    <h2>Fetching Recipes...</h2>
    <img class="cheeseimg" src="cheese.png">
    `;
    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response = await data.json();
        //console.log(response); 

        recipeContainer.innerHTML = "";
        response.meals.forEach(meal => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
            <img src="${meal.strMealThumb}">
            <h3>${meal.strMeal}</h3>
            <p><span>${meal.strArea}</span> Dish</p>
            <p>Category: ${meal.strCategory}</p>
        `
            // creating a container that contains both buttons
            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('button-container');
            recipeDiv.appendChild(buttonContainer);

            // First button
            const button = document.createElement('button');
            button.classList.add('mybuttons')
            button.textContent = "View Recipe";
            recipeDiv.appendChild(button);
            buttonContainer.appendChild(button);
            button.addEventListener('click', () => {
                openRecipePopup(meal);
            });

            // second button
            const buttonvid = document.createElement('button');
            buttonvid.classList.add('mybuttonss')
            buttonvid.innerHTML = `Watch <i class="fa-brands fa-youtube"></i>`
            recipeDiv.appendChild(buttonvid);
            buttonContainer.appendChild(buttonvid);
            buttonvid.addEventListener('click', () => {
                openVid(meal);
            })


            recipeContainer.appendChild(recipeDiv);
        });
    }
    catch (error) {
        recipeContainer.innerHTML = `
        <img class="errorimg" src="front.png"></img>
        <h3 class="errortxt">Recipe Not Found! <br>Try searching other meals.</h3> 
        `;
    }
}

// Function to fetch ingredients and measurements
const getIngredients = (meal) => {
    let ingreList = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient) {
            const measure = meal[`strMeasure${i}`];
            ingreList += `<li>${measure} ${ingredient}</li>`
        }
        else {
            break;
        }
    }
    return ingreList;
}


const openRecipePopup = (meal) => {
    recipeDetailsContent.innerHTML = `
        <h2 class = "recipeName">${meal.strMeal}</h2>
        <h3>Ingredients</h3>
        <ul class = "ingredientList">${getIngredients(meal)}</ul>
        <div>
            <h3>Instructions: </h3>
            <p class = "recipeInstructions">${meal.strInstructions}</p>
        </div>
    `
    recipeDetailsContent.parentElement.style.display = "block";
}

const openVid = (meal) => {
    var url = meal.strYoutube;
    window.open(url, '_blank');
}

recipeCloseBtn.addEventListener('click', () => {
    recipeDetailsContent.parentElement.style.display = "none";
});

searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if (!searchInput) {
        recipeContainer.innerHTML = `<h2>Type the meal in the search-box.</h2>`;
        return;
    }
    fetchRecipes(searchInput);
    //console.log("Button clicked");
});