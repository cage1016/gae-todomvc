# -*- coding: utf-8 -*-

__author__ = 'cage'

import os
import logging
import endpoints

if os.environ.get('SERVER_SOFTWARE', '').startswith('Development'):
  DEBUG = True
else:
  DEBUG = False

logging.info("Starting application in DEBUG mode: %s", DEBUG)

# endpoint api
if DEBUG:
  API_ROOT = 'http://localhost:8080/_ah/api'
else:
  API_ROOT = 'https://mitac-gae-to.appspot.com/_ah/api'

SITE_NAME = 'gae-todo'
BASIC_SITE_URL = 'https://mitac-gae-to.appspot.com/'
SITE_OWNER = 'KAI CHU CHUNG'
