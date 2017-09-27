import zerorpc
import pymongo
import bson
import bson.json_util

class Analytics():
    '''pass the method a name, it replies "Hello name!"'''

    def hello(self, content, username, timestamp):
        return "Hello {0}, {1} @ {2}!".format(username, content, timestamp)

    def mongo(self):
        client = pymongo.MongoClient("mongodb://127.0.0.1:27017/")
        db = client['terradb']
        users = db['users']
        return bson.json_util.dumps([find for find in users.find()])#users.find_one()


def main():
    s = zerorpc.Server(Analytics())
    s.bind("tcp://127.0.0.1:4242")
    s.run()

if __name__ == "__main__":
    main()
