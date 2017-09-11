import zerorpc

class Analytics():
    '''pass the method a name, it replies "Hello name!"'''

    def hello(self, world, user):
        return "Hello {0}, {1}!".format(world, user)

def main():
    s = zerorpc.Server(Analytics())
    s.bind("tcp://*:4242")
    s.run()

if __name__ == "__main__":
    main()
