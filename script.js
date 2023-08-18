const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const searchResults = document.getElementById("searchResults");

searchInput.addEventListener("input", async () => {
    const query = searchInput.value;

    // Send the query to Elasticsearch
    const response = await fetch(`http://localhost:9200/software_jobs/_search?q=*${query}*&size=1000`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
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
        <p>id : ${result.id}</p>
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






// <p>related_links : ${result.related_links}</p>
// <p>extensions : ${result.extensions}</p>
// <p>detected_extensions : ${result.detected_extensions}</p>
// <p>job_id : ${result.job_id}</p>        
// <p>job_highlights : ${result.job_highlights}</p>
