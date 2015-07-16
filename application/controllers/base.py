# -*- coding:utf-8 -*-

__author__ = 'cage'

import os
import webapp2
import pickle
import httplib2
import logging
import json

from webapp2_extras import sessions, jinja2
from jinja2.runtime import TemplateNotFound

from apiclient import discovery
from apiclient.discovery import build
from oauth2client.client import AccessTokenRefreshError
from oauth2client.client import flow_from_clientsecrets
from oauth2client.client import FlowExchangeError
from oauth2client.clientsecrets import loadfile
from google.appengine.api import urlfetch

from oauth2client.appengine import AppAssertionCredentials
from google.appengine.api import memcache

from application.models import Site


def jinja2_date_filter(date, fmt=None):
  if fmt:
    return date.strftime(fmt)
  else:
    return date.strftime('%Y-%m')


class BaseRequestHandler(webapp2.RequestHandler):
  def dispatch(self):
    """Get a session store for this request."""
    self.session_store = sessions.get_store(request=self.request)
    try:
      # Dispatch the request.
      webapp2.RequestHandler.dispatch(self)
    finally:
      # Save all sessions.
      self.session_store.save_sessions(self.response)

  @webapp2.cached_property
  def session(self):
    """Return a session using key from the configuration."""
    return self.session_store.get_session()

  @webapp2.cached_property
  def jinja2(self):
    """Returns a Jinja2 renderer cached in the app registry"""

    j = jinja2.get_jinja2(app=self.app)
    j.environment.filters['date'] = jinja2_date_filter
    return j

  @webapp2.cached_property
  def site(self):
    site = Site.get_by_id('default')
    return site

  def render(self, template_name, **template_vars):
    # Pass name of current page
    state = ''
    if template_name != 'index.html':
      state = os.path.splitext(template_name)[0]
    template_vars['state'] = state


    if type(self.request.route_args) == dict:
      if self.request.route_args['exception']:
        template_vars['exception'] = self.request.route_args.get('exception').message

    values = {
      'upath_info': self.request.upath_info,
      'url_for': self.uri_for,
      'site': self.site
    }

    # Add manually supplied template values
    values.update(template_vars)

    # read the template or 404.html
    try:
      self.response.write(self.jinja2.render_template(template_name, **values))
    except TemplateNotFound:
      self.abort(404)
