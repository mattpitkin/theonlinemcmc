# output html page in case of errors

from theonlinemcmc import errormessages, emailresponse

def errorpage(errval, emailaddress, outdir):
  # the string containing the webpage
  htmlpage = """
<!DOCTYPE HTML>
<html>
<head>
<title>The Online MCMC: Error page</title>
<link rel="stylesheet" type="text/css" href="../../simple.css"/>
</head>
<body>
<div id="page-wrap">

<h1>MCMC output page</h1>

<p>{errormessage}</p>

<!-- include footer file -->
<?php include('../footer.inc'); ?>

</div>
</body>
"""
  
  # the output html file
  errfile = 'error.php'
  fp = open(errfile, 'w')
  fp.write(htmlpage.format(errormessage=errormessages[errval]))
  fp.close()
  
  # email the page
  emailresponse(emailaddress, outdir, errfile, runerror=True)
  