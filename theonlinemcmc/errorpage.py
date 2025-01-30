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
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.css">

<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

<!-- Include theme font -->
<link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet">

<!-- Include jQuery -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

<!-- custom CSS file -->
<link rel="stylesheet" type="text/css" href="simple.css"/><title>The Online MCMC: Error page</title>

<!-- Include jQuery -->
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>

<!-- custom CSS file -->
<link rel="stylesheet" type="text/css" href="../../simple.css"/>

<title>The Online MCMC: Error page</title>

<body>

<!-- Navbar -->
<nav class="navbar navbar-default">
  <div class="container">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>                        
      </button>
      <a class="navbar-brand" href="/">THE ONLINE MCMC</a>
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
