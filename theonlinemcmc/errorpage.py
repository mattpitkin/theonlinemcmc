# output html page in case of errors

from theonlinemcmc import errormessages, emailresponse


def errorpage(erroroutput, errval, emailaddress, outdir):
    # the string containing the webpage
    htmlpage = """
<!DOCTYPE HTML>
<html>
<head>
  <!-- Theme Made By www.w3schools.com - No Copyright -->
<meta name="author" content="Matthew Pitkin">
<meta name="description" content="The Online MCMC">
<meta name="keywords" content="MCMC, Markov chain Monte Carlo, Bayesian, emcee, python, data analysis, probability">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
 
<!-- Include theme font -->
<link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet">

<!-- Include jQuery/bootstrap -->
<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
 

<!-- custom CSS file -->
<link rel="stylesheet" type="text/css" href="simple.css"/><title>The Online MCMC: Error page</title>

<!-- custom CSS file -->
<link rel="stylesheet" type="text/css" href="../../simple.css"/>

<!-- icon -->
<link rel="icon" type="image/png" href="../../logo.png"/>

<title>The Online MCMC: Error page</title>

<body>

<!-- Navbar -->
<nav class="navbar navbar-default">
  <div class="container">
    <div class="navbar-header">
      <a class="navbar-brand" href="/"><img src="../../logo.png" width="40" height="40" alt=""/> THE ONLINE MCMC</a>
    </div>
  </div>
</nav>

<div class="container-top bg-1 text-center">
  <h3 class="title">ERROR</h3>
  <p>
    <br><br>{errormessage}<br>
    <br><code>{erroroutput}</code><br><br>
  </p>
  <br>
  <br>
  <li><a href="pyfile.py"><code>pyfile.py</code></a> - the python file used to run the MCMC</li>
  <li><a href="mymodel.py"><code>mymodel.py</code></a> - the python model function</li>
</div>

<!-- include footer -->
<?php
$shareurl = "https://www.theonlinemcmc.com";
include('../../footer.inc');
?>
</div>
</body>
"""

    # the output php file
    errfile = "index.php"
    fp = open(errfile, "w")
    fp.write(
        htmlpage.format(errormessage=errormessages[errval], erroroutput=erroroutput)
    )
    fp.close()

    # email the page
    emailresponse(emailaddress, outdir, runerror=True)
