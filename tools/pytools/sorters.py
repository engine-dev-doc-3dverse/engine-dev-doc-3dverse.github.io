def sortByAlphabeticalOrder(nodesReferencesList) :
    swapped = True
    while(swapped) :
      swapped = False
      for i in range(len(nodesReferencesList) - 1) :
        if (nodesReferencesList[i]["name"].lower() > nodesReferencesList[i + 1]["name"].lower()) :
          temp = nodesReferencesList[i]
          nodesReferencesList[i] = nodesReferencesList[i + 1]
          nodesReferencesList[i + 1] = temp
          swapped = True

    return nodesReferencesList

def sortByCategory(categoriesData, nodesData) :
    for nodeData in nodesData :
        category = nodeData[1]["category"]
        if category not in categoriesData :
            categoriesData["Miscellaneous"]["nodes"].append({nodeData[0]: nodeData[1]})
        else:
            categoriesData[category]["nodes"].append({nodeData[0]: nodeData[1]})
    return categoriesData

if __name__ == "__main__" :
   pass