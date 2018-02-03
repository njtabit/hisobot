import bson
import bson.json_util
import json
import pymongo
import urllib.request
import zerorpc
from fuzzywuzzy import fuzz
from fuzzywuzzy import process

class Analytics:

    def hello(self, content, username, timestamp):
        return "Hello {0}, {1} @ {2}!".format(username, content, timestamp)

    def mongo(self):
        client = pymongo.MongoClient("mongodb://127.0.0.1:27017/")
        db = client['terradb']
        users = db['users']
        return bson.json_util.dumps([find for find in users.find()])#users.find_one()

    def populate_tb2(self):
        headers = {'User-Agent': 'Mozilla'}
        urlbegin = "https://terrabattle2.gamepedia.com/index.php?title=Special:CargoExport&order+by=`_pageName`&limit=200&format=json&tables="
        request = urllib.request.Request(urlbegin + "guardians", headers=headers)                
        guardians = set([x['_pageName'] for x in json.loads(urllib.request.urlopen(request).read().decode('utf-8'))])
        request = urllib.request.Request(urlbegin + "equipment", headers=headers)                
        equipments = set([x['_pageName'] for x in json.loads(urllib.request.urlopen(request).read().decode('utf-8'))])
        return guardians.union(equipments) 

    def match_string(self, argument):
        best_match = process.extractOne(argument, self.populate_tb2())
        return best_match[0]#bson.json_util.dumps([find for find in users.find()])#users.find_one()best_match[0]
        


def main():
    s = zerorpc.Server(Analytics())
    s.bind("tcp://127.0.0.1:4242")
    s.run()

if __name__ == "__main__":
    main()
