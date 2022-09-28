
const BASE_URL = "http://127.0.0.1:5000/api";

// Gets ALL CUPCAKES from the database and render it to the DOM

function generateCupcakeMarkup(cupcake) {
    return `
      <li class="list-group-item d-flex justify-content-between align-items-center" data-cupcake-id=${cupcake.id}>
        ${cupcake.flavor} / ${cupcake.size} / ${cupcake.rating}
        <img class="cupcake-img"
            src="${cupcake.image}"
            alt="(no image provided)">
        <button class="delete-button btn-sm btn-danger">X</button>
      </li>
  `;
}

async function showAllCupcakes() {
    const res = await axios.get(`${BASE_URL}/cupcakes`);

    // Getting the data we got from the API which is a LIST of DICTS
    const cupcakes = res.data.cupcakes;

    // Iterating over each list to create a <li> and append it to <ul> on the DOM
    for (let cupcake of cupcakes) {
        let cupcakeList = generateCupcakeMarkup(cupcake);

        // Appending the <li> markup generated for each cupcake into the <ul>

        $("#cupcakes-list").append(cupcakeList);
    }
}

showAllCupcakes();

/** handle form submission for adding of new cupcakes */

$("#new-cupcake-form").on("submit", createCupcake)

async function createCupcake(e) {
  e.preventDefault();

  // Getting the values entered from the FORM
  const flavor = $("#form-flavor").val();
  const size = $("#form-size").val();
  const rating = $("#form-rating").val();
  const image = $("#form-image").val();

  // Sending POST REQUEST to our API and getting back response
  const res = await axios.post(`${BASE_URL}/cupcakes`,
    {
      flavor,
      size,
      rating,
      image
    });
    
  // Updating the LIST OF CUPCAKES LISTED ON THE DOM by first emptying the LIST 
  // we could do this way too
  
  // $("#cupcakes-lists").empty();
  // showAllCupcakes();
    
  let newCupcake = $(generateCupcakeHTML(res.data.cupcake));
  $("#cupcakes-list").append(newCupcake); 

  // Resetting the FORM
  $("#new-cupcake-form").trigger('reset');
}

/** handle clicking delete button to delete a cupcake */

$("#cupcakes-list").on("click", ".delete-button", deleteCupcake);

async function deleteCupcake(e) {

  e.preventDefault();

  // Finding the div closest to the delete button clicked, so that we can get the ID from the DATA ATTRIBUTE and delete that cupcake based off of that ID
  let $cupcake = $(e.target).closest("li");
  const id = $cupcake.attr("data-cupcake-id");

  await axios.delete(`${BASE_URL}/cupcakes/${id}`)

  $cupcake.remove()
}