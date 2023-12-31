const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");


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

// function displayResults(results) {
//     searchResults.innerHTML = "";

//     results.forEach(result => {
//         // console.log(result)
//         const resultDiv = document.createElement("div");
//         resultDiv.classList.add('job_result');
//         resultDiv.id = result.id
//         resultDiv.innerHTML = ` 
//         <div class="job_result">
//             <div class="job_info">
//                 <p>title : ${result.title}</p>
//                 <p>company_name : ${result.company_name}</p>
//                 <p>location : ${result.location}</p>
//                 <p>via : ${result.via}</p>
//                 <p class="description" style="display: none;">description : ${result.description}</p>
//                 <button class="description-button" onclick="showMore('${result.id}')">More</button>
//             </div>    
//             <div class="job_skills">${result.skills}</div>
            
//         </div>
//         `
//         console.log(result.skills)

//         searchResults.appendChild(resultDiv);
//     });
// }


function displayResults(results) {
    searchResults.innerHTML = "";

    results.forEach(result => {
        const resultDiv = document.createElement("div");
        resultDiv.classList.add('job_result');
        resultDiv.id = result.id;

        const skillsDiv = document.createElement("div");
        skillsDiv.classList.add('job_skills');
        head = document.createElement('h3');
        head.innerText = 'Required_skills:';
        skillsDiv.appendChild(head);

        // Loop through each skill category
        for (const category in result.skills) {
            const categoryDiv = document.createElement("div");
            categoryDiv.classList.add('skill_category');

            const categoryTitle = document.createElement("span");
            categoryTitle.classList.add('category_title');
            categoryTitle.textContent = category;
            categoryDiv.appendChild(categoryTitle);

            // Loop through each skill in the category
            result.skills[category].forEach(skill => {
                const skillSpan = document.createElement("span");
                skillSpan.classList.add('skill');
                skillSpan.textContent = skill;
                categoryDiv.appendChild(skillSpan);
            });
            
            skillsDiv.appendChild(categoryDiv);
        }

        resultDiv.innerHTML = `
                <div class="job_info">
                    <p><strong>title</strong> : ${result.title}</p>
                    <p><strong>company_name</strong> : ${result.company_name}</p>
                    <p><strong>location</strong> : ${result.location}</p>
                    <p><strong>via</strong> : ${result.via}</p>
                    <p class="description" style="display: none;"><strong>description</strong> : ${result.description}</p>
                    <button class="description-button" onclick="showMore('${result.id}')">More</button>   
            </div>
        `;
        
        resultDiv.appendChild(skillsDiv);
        searchResults.appendChild(resultDiv);
    });
}


async function showMore(id) {
    try {
        const response = await fetch(`http://localhost:9200/software_jobs/_doc/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${btoa(`${username}:${password}`)}`  // Basic Authentication
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        const blurrer = document.createElement("div");
        blurrer.id = "blurrer";
        
        const result = document.createElement('div');
        result.id = "popup";
        result.innerHTML = ` 
            <p>title : ${data._source.title}</p>
            <p>company_name : ${data._source.company_name}</p>
            <p>location : ${data._source.location}</p>
            <p>via : ${data._source.via}</p>
            <p class="description" style="height: 200px;overflow:scroll;" >description : ${data._source.description}</p>
            <button class="close_blurrer" onclick="closeBlurrer()">Close</button>
            <button class="apply" onclick="apply()">Apply</button>
        `;

        blurrer.appendChild(result);
        document.body.appendChild(blurrer);
    } catch (error) {
        console.error("Error fetching data from Elasticsearch:", error);
    }
}

function apply(){
    // imma leave this one for later 
    // wollah js bad
}


function closeBlurrer() {
    const blurrer = document.getElementById("blurrer");
    if (blurrer) {
        blurrer.remove();
    }
}



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
