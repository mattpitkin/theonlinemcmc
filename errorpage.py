# output html page in case of errors

from errorcodes import *

def errorpage(errval, emailaddress, outdir):
  # the string containing the webpage
  htmlpage = """
<!DOCTYPE HTML>
<html>
<head></head>
<body>

<h1>MCMC output page</h1>

<p>{errormessage}</p>

</body>
"""
  
  # the output html file
  errfile = 'error.html'
  fp = open(errfile)
  fp.write(htmlpage.format(errormessages=errormessages[errval]))
  fp.close()
  
  # email the page
  import emailrepsonse
  emailresponse.emailrepsonse(email, outdir, errfile, runerror=True)
  