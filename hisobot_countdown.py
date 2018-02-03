from datetime import date
from datetime import datetime
from datetime import time

class Event:
    def __init__(self, name: str, start: str, end: str, game: str):
        self.name = name
        self.start = start
        self.end = end
        self.game = game

    def parse_time(self, date):
        return datetime.strptime(date, '%m/%d/%y')

    def event_countdown(self):
        end = self.parse_time(self.end)
        today = datetime.now()

        time_left = end - today
        return '{} has {} left.'.format(self.name, time_left)

levi = Event('Levi', '5/5/17', '11/6/17', 'TB1')
fores = Event('Fores', '6/6/17', '10/13/17', 'TB2')
baha = Event('Baha', '7/7/17', '12/8/17', 'TB2')

print(levi.event_countdown())
print(fores.event_countdown())
print(baha.event_countdown())