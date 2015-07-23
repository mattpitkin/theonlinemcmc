# output html page in case of errors

from errorcodes import *

def errorpage(errval, emailaddress, outdir):
  # the output html file
  errfile = 'error.html'
  
  fp = open(errfile)
  
  # write out html header
  fp.write("<!DOCTYPE HTML>\n<html>\n<head>\n</head>\n<body>\n")
  
  # check error codes and create out
  fp.write("<p>%s</p>" % errormessages[errval])

  fp.write("</body>")
  
  # email the page
  import emailrepsonse
  emailresponse.emailrepsonse(email, outdir, errfile, runerror=True)
  