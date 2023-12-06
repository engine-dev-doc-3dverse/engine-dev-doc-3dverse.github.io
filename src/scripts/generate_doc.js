import { capitalizeFirstLetter, escapeHTML } from "./utils.js";

function generateNodeParametersHTMLElements(key, node) {
    let parameters = `<h4>${capitalizeFirstLetter(key)} : </h4><ul class="node-parameters-list node-${key}-parameters-list">`;
    node.data[key].forEach(parameterData => {
        parameters += `<li><pre class="node-card-cpp-equivalent language-cpp"><code>${ escapeHTML(parameterData.type) }:${ parameterData.name != "" ? parameterData.name : "out" }</code>${ parameterData.script ? ` = <code>${ escapeHTML(parameterData.script) }</code>` : `` }</pre></li>`
    });
    parameters += `</ul>`;
    return parameters
}

function generateNodeSidebarHTMLElements(node) {
    return `<li class="sidebar-node"><a href="#${node.uuid}" class="node-anchor-link">${node.name}</a></li>`;
}

function generateNodeMainHTMLElements(node, language) {
    let mainElement = `
    <li id="${node.uuid}" class="node-card">
        <div class="node-card-header">
            <h3 class="node-card-header-title">${node.name}</h3>
            <p class="node-card-uuid-subtitle copy-onclick"><span class="copy-onclick-content">${node.uuid}<i class="fa-solid fa-copy copy-icon"></i></span></p>
            <ul class="node-statuses-list"></ul>
        </div>
        <div class="node-card-main">
            <p class="node-card-description">${node.descriptions[language]}</p>`
            + ((node.data["inputs"].length != 0 || node.data["outputs"].length != 0 || node.data.script) ?
            `<div class="cpp-script-equivalent collapsible">
                <h4 class="collapsible-trigger">C++ Script Equivalent</h4>
                <div class="collapsible-content">
                    ${ node.data["inputs"].length != 0 ? generateNodeParametersHTMLElements("inputs", node) : ``}
                    ${ node.data["outputs"].length != 0 ? generateNodeParametersHTMLElements("outputs", node) : ``}
                    `
                    + (node.data.script ? `<h4>Script</h4><pre class="node-card-cpp-equivalent language-cpp"><code>${escapeHTML(node.data.script)}</code></pre>` : ``) +
                `</div>` : ``) +
            `</div>
        </div>
    </li>`
    return mainElement;
}

export async function generateHTML(nodesData, language = "en") {
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
                sidebar += generateNodeSidebarHTMLElements(node);
                main += generateNodeMainHTMLElements(node, language);
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
