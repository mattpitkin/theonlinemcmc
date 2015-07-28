#!/usr/bin/env python

from distutils.core import setup
from distutils.extension import Extension

setup(
  name = 'TheOnlineMCMC',
  version = '0.0.1',
  description = 'Python functions required for The Online MCMC.',
  author = 'Matthew Pitkin',
  author_email = 'pitkin@gmail.com',
  packages = ['theonlinemcmc'],
  url = 'http://www.theonlinemcmc.com',
  classifiers=[
      'Development Status :: 2 - Pre-Alpha',
      'Intended Audience :: Science/Research',
      'License :: OSI Approved :: GNU General Public License (GPL)',
      'Operating System :: POSIX :: Linux',
      'Programming Language :: Python',
      'Natural Language :: English',
      'Topic :: Scientific/Engineering :: Information Analysis'     
      ]
)

