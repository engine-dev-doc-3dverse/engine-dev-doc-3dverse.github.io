import json
import requests

def getNodesList() :
    url = "https://labs.3dverse.com/graph-editor/nodes"
    headers = {}
    payload = {}
    try:
        response = requests.request("GET", url, headers=headers, data=payload)
    except:
        raise Exception("Error while scrapping nodes list.")
    return json.loads(response.text)

def getNode(uuid) :
    url = f"https://labs.3dverse.com/graph-editor/node?uuid={uuid}"
    headers = {}
    payload = {}
    try:
        response = requests.request("GET", url, headers=headers, data=payload)
    except:
        raise Exception(f"Error while scrapping node {uuid}")
    try:
        return json.loads(response.text)
    except:
        raise Exception(f"Error while parsing node {uuid}.")

if __name__ == "__main__" :
    pass