import os
import webapp2
import json
import endpoints
from application.apis.todo_api import TodoV1

from application.controllers.base import BaseRequestHandler

# from settings import decorator
from secrets import SESSION_KEY

# webapp2 config
app_config = {
  'webapp2_extras.sessions': {
    'secret_key': SESSION_KEY
  }
}


class MainHandler(BaseRequestHandler):
  def get(self):
    self.render('index.html')


class AngularJSHandler(BaseRequestHandler):
  def get(self):
    self.render('angularjs.html')


class ReactJSHandler(BaseRequestHandler):
  def get(self):
    self.render('reactjs.html')


class VueJSHandler(BaseRequestHandler):
  def get(self):
    self.render('vuejs.html')


class LearnJSONHandler(webapp2.RequestHandler):
  def get(self):

    name = os.path.join(os.path.dirname(__file__), 'learn.json')
    with open(name, 'r') as file:
      content = file.read()

    self.response.headers['Content-Type'] = 'application/json'
    self.response.out.write(content)

routes = [
  ('/', MainHandler),
  ('/angularjs', AngularJSHandler),
  ('/reactjs', ReactJSHandler),
  ('/vuejs', VueJSHandler),
  ('/learn.json', LearnJSONHandler)
]

router = webapp2.WSGIApplication(routes, config=app_config, debug=True)

API = endpoints.api_server([TodoV1], restricted=False)

