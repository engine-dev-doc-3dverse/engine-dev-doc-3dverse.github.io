window.addEventListener('load', load);

async function load() {
    const buffer =await getFileData("./data/nodes_list.json")
    const nodesCategoriesList =  for(const nodesList in buffer){ await sortByAlphabeticalOrder()}
    const nodesData = await getFileData("./data/nodes_data.json")
    const [sidebar, main] = await generateHTML(nodesCategoriesList, nodesData)
    document.getElementById("sidebar-nodes-link-list").innerHTML = sidebar;
    document.getElementById("nodes-definitions-container").innerHTML = main;
    loadComponentsEventListeners();

}


async function loadComponentsEventListeners() {
    /* Init Collapsibles */
    [...document.querySelectorAll('.collapsible')].map((collapsible) => collapsible.addEventListener('click', function() {
        console.log("collapsing")
        const content = this.nextElementSibling;
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    }));
}

async function generateHTML(categoriesList, nodesData) {
    let sidebar = "";
    let main = "";

    for (const [categoryName, nodesList] of Object.entries(categoriesList)) {
        sidebar += `<li class="sidebar-category">${categoryName}<ul>`
        main += `<div class="category-container"></div><h2 class="category-title">${categoryName}</h2>`

        Object.values(nodesList).forEach(node => {
            sidebar += `
            <li class="sidebar-node">
                <a href="#${node.uuid}" class="node-anchor-link">${node.name}</a>
            </li>`

            main += `
            <articles id="${node.uuid}" class="node-card">
                <div class="node-card-header collapsible">
                    <div>
                        <h3 class="node-card-header-title">${node.name}</h3>
                    </div>
                    <div class="node-card-header-icon">
                        <!-- <img src="" alt="${node.name} icon"> -->
                    </div>
                </div>
                <div class="node-card-main collapsible-content">
                    Content
                </div>
            </articles>
            `
        })
        sidebar += `</ul></li>`
        main += `</div>`
    }
    return [sidebar, main];
}

/**
 * 
 * @param {object} JSONData 
 * @returns 
 */
async function sortByAlphabeticalOrder(JSONData) {
    const length = JSONData.length;
    let swapped;
    
    do {
      swapped = false;
      for (let i = 0; i < length - 1; i++) {
        if (JSONData[i].name.toLowerCase() > JSONData[i + 1].name.toLowerCase()) {
          const temp = JSONData[i];
          JSONData[i] = JSONData[i + 1];
          JSONData[i + 1] = temp;
          swapped = true;
        }
      }
    } while (swapped);
  
    return JSONData;
  }

/**
 * Returns the data from a file in json | data read using fetch API
 * @param {string} path 
 * @returns 
 */
async function getFileData(path) {
    const response = await fetch(path)
    let nodesData = {};
    try {
        nodesData = await response.json()
    } catch (error) {
        console.warn("Couldn't fetch data from file at '", path, "' or file was empty.")
    }
    return nodesData;
}