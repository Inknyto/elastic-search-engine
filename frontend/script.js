const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

const username = "elastic";
const password = "<passwd>";



searchInput.addEventListener("input", async () => {
    const query = searchInput.value;

    // Send the query to Elasticsearch
    const response = await fetch(`http://localhost:9200/software_jobs/_search?q=*${query}*&size=1000`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${btoa(`${username}:${password}`)}`  // Basic Authentication
        },
    });

    const data = await response.json();
    // console.log(data.hits.hits)
    displayResults(data.hits.hits.map(offre => {
        return {
            id: offre._id,
            ...offre._source
        }
    }));
});

function displayResults(results) {
    searchResults.innerHTML = "";

    results.forEach(result => {
        // console.log(result)
        const resultDiv = document.createElement("div");
        resultDiv.id = result.id
        resultDiv.innerHTML = ` 
        <p>title : ${result.title}</p>
        <p>company_name : ${result.company_name}</p>
        <p>location : ${result.location}</p>
        <p>via : ${result.via}</p>
        <p class="description" style="display: none;">description : ${result.description}</p>
        <button class="description-button" onclick="showDescription(${result.id})">description</button>
        `
        searchResults.appendChild(resultDiv);
    });
}

function showDescription(div){
    let desc = div.querySelector(".description")
    if(
        desc.style.display=="block"
        ){
            desc.style.display="none"
        }else{
            desc.style.display="block"
        }
    }
    
    // <p>id : ${result.id}</p>

    document.addEventListener("DOMContentLoaded", function () {
        var searchInput = document.getElementById("searchInput");
    
        // Get the initial offset of the searchInput
        var offsetTop = searchInput.offsetTop;
    
        // Add a scroll event listener
        window.addEventListener("scroll", function () {
            // Check if the window has scrolled past the initial position of the searchInput
            if (window.scrollY > offsetTop) {
                searchInput.classList.add("fixed");
            } else {
                searchInput.classList.remove("fixed");
            }
        });
    
        // Smooth transition when adding/removing the "fixed" class
        searchInput.style.transition = "all 0.3s ease-in-out";
    });
    