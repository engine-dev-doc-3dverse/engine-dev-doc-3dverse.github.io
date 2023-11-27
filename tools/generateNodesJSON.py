from pytools import scrappers as scrap
from pytools import sorters as sort
from pytools import data_handlers as data
import atomics
import threading
import os

# function called in thread to scrap a node and generate the final data from it which is then added to the nodes list dictionnary
def scrapNode(nodesList, nodeReference, previousNodesData, nodesDataRecovered, nodesDataUnrecovered, amountOfNodes) :
    try:
        scrappedNodeData = scrap.getNode(nodeReference["uuid"])
    except:
        nodesDataUnrecovered.inc()
        print(f"Node {nodeReference['name']} ({nodeReference['uuid']}) couldn't be scrapped. {nodesDataUnrecovered.load()}/{amountOfNodes} nodes unrecovered.(", nodesDataUnrecovered.load()/amountOfNodes*100, "%}\n")
        return
    
    try:
        previousNodeData = previousNodesData.get(nodeReference["uuid"], {})
        nodesList[nodeReference["uuid"]] = data.generateNodeData(nodeReference, scrappedNodeData, previousNodeData)
    except:
        nodesDataUnrecovered.inc()
        print("Error while generating node data for node", nodeReference["name"], "(", nodeReference["uuid"], ") {", nodesDataUnrecovered.load(), "/{amountOfNodes} nodes unrecovered.(", nodesDataUnrecovered.load()/amountOfNodes*100, "%}\n")
        return
    
    nodesDataRecovered.inc()
    print(f"Node scrapped : {nodeReference['name']} ({nodeReference['uuid']})... - {nodesDataRecovered.load()}/{amountOfNodes} nodes scrapped.(", nodesDataRecovered.load()/amountOfNodes*100, "%)\n")

generatedDataFolderPath = "./data/generated_data/"
previousNodesDataFolderPath =  "./data/reference_data/"

# SCRAPPING AND SORTING LIST OF NODES REFERENCES (UUID, NAME, PROPERTIES)
nodesList = sort.sortByAlphabeticalOrder( scrap.getNodesList() )

# STORING LIST OF NODES REFERENCES (UUID, NAME, PROPERTIES)
data.dumpJSON( generatedDataFolderPath + 'nodes_list.json', nodesList )

# RECOVERING PREVIOUS NODES DATA IF EXISTING & FOUND
try:
    previousNodesData = data.loadJSON(previousNodesDataFolderPath + 'previous_nodes_data.json')
except:
    previousNodesData = {}

# GENERATING FULL NODES DATA FOLLOWING THE DOCUMENTATION NODES DATA READING TEMPLATE
nodesData = {}
nodesDataRecovered = atomics.atomic(width=4, atype=atomics.INT)
nodesDataUnrecovered = atomics.atomic(width=4, atype=atomics.INT)
amountOfNodes = len(nodesList)

threads = []
for nodeReference in nodesList :
    thread = threading.Thread(target=scrapNode, args=(nodesData, nodeReference, previousNodesData, nodesDataRecovered, nodesDataUnrecovered, amountOfNodes))
    threads.append(thread)
    thread.start()

for thread in threads :
    thread.join()

print("All node references processed. (", nodesDataRecovered.load(), "/", amountOfNodes, "nodes recovered. (", nodesDataRecovered.load()/amountOfNodes*100, "%). ", nodesDataUnrecovered.load(), "/", amountOfNodes, "nodes unrecovered. (", nodesDataUnrecovered.load()/amountOfNodes*100, "%).\n")

# STORING RAW DATA
data.dumpJSON( generatedDataFolderPath + 'raw_nodes_data.json', nodesData )

# REORDERING NODES DATA BY ALPHABETICAL ORDER (order eventually lost during threaded requests) & CATEGORY
nodesData = sort.sortByCategory( data.loadJSON(previousNodesDataFolderPath + "empty_categories_data.json"), sorted(nodesData.items(), key=lambda x: x[1]['name'].lower()) )

# STORING NODES DATA
data.dumpJSON( generatedDataFolderPath + 'nodes_data.json', nodesData )
    