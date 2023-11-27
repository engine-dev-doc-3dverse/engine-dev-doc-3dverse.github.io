import json

def readFile(filePath) :
    try:
        with open(filePath, "r", encoding="utf-8") as file :
            data = file.read()
        return data
    except Exception as exception:
        raise Exception(f"Error while reading file {filePath}. {exception}")

def writeFile(filePath, data):
    try:
        with open(filePath, "w", encoding="utf-8") as file :
            file.write(data)
    except Exception as exception:
        raise Exception(f"Error while writing file {filePath}. {exception}")

def loadJSON(filePath) :
    try:
        with open(filePath, "r", encoding="utf-8") as file :
            data = json.load(file)
        return data
    except Exception as exception:
        raise Exception(f"Error while loading JSON file {filePath}. {exception}")

def dumpJSON(filePath, data) :
    try:
        with open(filePath, "w", encoding="utf-8") as file :
            json.dump(data, file, indent=4)
    except Exception as exception:
        raise Exception(f"Error while dumping JSON file {filePath}. {exception}")


def generateNodeData(nodeReference, scrappedNodeData, previousNodesData) :
    scrappedNodeDataStatus = previousNodesData.get("status", {})
    isDeprecated = "___DEPRECATED" in nodeReference["name"]
    nodeData = {
            "uuid": nodeReference["uuid"],
            "name": nodeReference["name"],
            "name-translations": previousNodesData.get("name-translations", { "en" : nodeReference["name"]}),
            "descriptions": previousNodesData.get("descriptions", {"en": "No description available."}),
            "category": previousNodesData.get("category", "Miscellaneous"),
            "status": {
                "isDeprecated": scrappedNodeDataStatus.get("isDeprecated", isDeprecated),
                "isRemoved": scrappedNodeDataStatus.get("isRemoved", False),
                "isExperimental": scrappedNodeDataStatus.get("isExperimental", False),
                "isHidden": scrappedNodeDataStatus.get("isHidden", isDeprecated),
                "isImplemented": scrappedNodeDataStatus.get("isImplemented", False),
            },
            "data": scrappedNodeData,
        }
    return nodeData


if __name__ == "__main__" :
    pass