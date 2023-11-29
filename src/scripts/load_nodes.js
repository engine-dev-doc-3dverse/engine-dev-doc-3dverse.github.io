import { highlightElement } from "./prism.min.js";

window.addEventListener('load', load);

async function load() {
    const nodesData = await getFileData("./data/app_data/nodes_data.json")
    const [sidebar, main] = await generateHTML(nodesData)
    document.getElementById("sidebar-nodes-categories-list").innerHTML = sidebar;
    document.getElementById("documentation").innerHTML = main;
    loadComponentsEventListeners();
}

function collapseCollapsible(element) {
    element.style.height = 0 + 'px';
}

function expandCollapsible(element) {
    var sectionHeight = element.scrollHeight;
    element.style.height = sectionHeight + 'px';
}

async function triggerCollapsible(collapsible) {
    collapsible.classList.toggle('active');
    if(collapsible.classList.contains('active')) {
        expandCollapsible(collapsible.querySelector('.collapsible-content'));
    } else {
        collapseCollapsible(collapsible.querySelector('.collapsible-content'));
    }
}

async function setCollapsibleState(collapsible, state) {
    if(state) {
        collapsible.classList.add('active');
        expandCollapsible(collapsible.querySelector('.collapsible-content'));
    } else {
        collapsible.classList.remove('active');
        collapseCollapsible(collapsible.querySelector('.collapsible-content'));
    }
}

async function registerCollapsibles() {
    /* Init Collapsibles */
    document.querySelectorAll('.collapsible').forEach((collapsible) => collapsible.querySelector('.collapsible-trigger').addEventListener('click', () => triggerCollapsible(collapsible)));
}


function toggleDisplayState(element, displayState) {
    if(displayState) {
        element.style.display = 'block';
    } else {
        element.style.display = 'none';
    }
}

async function searchNodes(event) {
    const searchInput = event.target.value.toLowerCase();
    
    const categories = document.querySelectorAll('.sidebar-category-container');
    categories.forEach(category => {
        displayCategory = false;
        nodes = category.querySelectorAll('.node-anchor-link');
        nodes.forEach(node => {
            toggleDisplayState(node.parentElement, (node.innerText.toLowerCase().includes(searchInput)))
            displayCategory = displayCategory || (node.innerText.toLowerCase().includes(searchInput));
        });

        //Debug Collapsible Content Scrollheight
        category.querySelector('.collapsible-content').style.height = 'auto';        
        toggleDisplayState(category, displayCategory);
        setCollapsibleState(category, displayCategory);
    });
}

async function registerNodeSearch() {
    document.getElementById('nodes-search-input').addEventListener('keyup', searchNodes);
}

async function loadComponentsEventListeners() {
    registerCollapsibles();
    registerNodeSearch();
}

async function generateHTML(nodesData, language = "en") {
    let sidebar = "";
    let main = "";

    Object.values(nodesData).forEach((category) => {
        if( category.nodes.length != 0 ) {
            const categoryName = (category["name-translations"][language] !== undefined) ? category["name-translations"][language] : category["name-translations"]["en"];
            const categoryNameLowerCased = category.name.toLowerCase();
            const categoryDrescription = (category.description[language] !== undefined) ? category.description[language] : ((category.description["en"] !== undefined) ? category.description["en"] : "No description available for this category.");

            sidebar += `
                <li id="sidebar-${categoryNameLowerCased}-category-li" class="sidebar-category-container collapsible">
                    <h2 class="collapsible-trigger">${categoryName}</h2>
                    <ul id="sidebar-${categoryNameLowerCased}-links-list" class="sidebar-links-list collapsible-content">
            `;

            main += `
                <article id="nodes-${categoryNameLowerCased}-definitions-container" class="container">
                    <h2 class="category-title">${categoryName}</h2>
                    <p class="category-description">${categoryDrescription}</p>
                    <ul class="category-nodes-list">
            `
            
            category.nodes.forEach(node => {
                node = Object.values(node)[0];
                sidebar += `
                    <li class="sidebar-node">
                        <a href="#${node.uuid}" class="node-anchor-link">${node.name}</a>
                    </li>
                `;

                mainScriptCodeSample =  `<pre>` + highlightElement(`<code class="node-card-cpp-equivalent language-cpp">${(node.data.script)}</code>`) + `</pre>`

                main += `
                    <li id="${node.uuid}" class="node-card">
                        <div class="node-card-header">
                            <h3 class="node-card-header-title">${node.name}</h3>
                            <ul class="node-statuses-list"></ul>
                        </div>
                        <div class="node-card-main">
                            <p class="node-card-description">${node.descriptions[language]}</p>
                            ${mainScriptCodeSample}
                        </div>
                `
            });

            sidebar += `
                    </ul>
                </li>
            `;

            main += `
                    </ul>
                </article>
            `
        }});
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