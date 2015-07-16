import webapp2
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


routes = [
  ('/', MainHandler)
]

router = webapp2.WSGIApplication(routes, config=app_config, debug=True)
