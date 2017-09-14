import zerorpc

class Analytics():
    '''pass the method a name, it replies "Hello name!"'''

    def hello(self, content, username, timestamp):
        return "Hello {0}, {1} @ {2}!".format(username, content, timestamp)

def main():
    s = zerorpc.Server(Analytics())
    s.bind("tcp://127.0.0.1:4242")
    s.run()

if __name__ == "__main__":
    main()
