# output html page in case of errors

from theonlinemcmc import *

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
  fp = open(errfile, 'w')
  fp.write(htmlpage.format(errormessages=errormessages[errval]))
  fp.close()
  
  # email the page
  emailresponse(email, outdir, errfile, runerror=True)
  