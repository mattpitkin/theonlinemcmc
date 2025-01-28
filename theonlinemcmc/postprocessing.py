# define a function that performs the post-processing of the posterior values and creates a results page
import sys

import numpy as np

from .emailresponse import emailresponse

# Greek letters that need conversion for LaTeX (add a prefix '\') if given as a variable name
greekletters = [
    "alpha",
    "beta",
    "gamma",
    "Gamma",
    "delta",
    "Delta",
    "epsilon",
    "zeta",
    "eta",
    "theta",
    "Theta",
    "iota",
    "kappa",
    "lambda",
    "Lambda",
    "mu",
    "nu",
    "xi",
    "Xi",
    "pi",
    "Pi",
    "rho",
    "sigma",
    "Sigma",
    "tau",
    "upsilon",
    "Upsilon",
    "phi",
    "Phi",
    "chi",
    "psi",
    "Psi",
    "omega",
    "Omega",
]

import matplotlib as mpl

mpl.use("Agg")


# convert a floating point number into a string in X.X x 10^Z format
def exp_str(f, p=1):
    if p > 16:
        print("Precision must be less than 16 d.p.", file=sys.stderr)
        p = 16

    s = "%.16e" % f
    ssplit = s.split("e")
    return "%.*f&times;10<sup>%d</sup>" % (p, float(ssplit[0]), int(ssplit[1]))


# a function to get the credible intervals using numpy quantile
def credible_interval(dsamples, ci):
    intervals = [0.5 - ci / 2.0, 0.5 + ci / 2.0]

    return np.quantile(dsamples, intervals)


def postprocessing(postsamples, abscissa, abscissaname, data, email, outdir, evidence):
    # import the corner plot code
    import corner

    # import matplotlib
    from matplotlib import pyplot as pl

    # the format text to include in the page
    fm = {}

    # the string containing the webpage
    htmlpage = """
<!DOCTYPE HTML>
<html>
<head>
  <!-- Theme Made By www.w3schools.com - No Copyright -->
<meta name="author" content="Matthew Pitkin">
<meta name="description" content="The Online MCMC">
<meta name="keywords" content="MCMC, Markov chain Monte Carlo, Bayesian, emcee, Python, data analysis, nested sampling, dynesty, nestle, probability">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.css">

<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

<!-- Include theme font -->
<link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet">

<!-- Include jQuery -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

<!-- custom CSS file -->
<link rel="stylesheet" type="text/css" href="../../simple.css"/>

<!-- include MathJax -->
<script type="text/javascript" src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>

<!-- Formatting for text on website -->
<style>body{{color:dimgrey}}</style>

<!-- Include script to create tabs - https://www.w3schools.com/bootstrap/bootstrap_tabs_pills.asp -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

<!-- Make sure text is readable with previous css formatting -->
<style>body{{color:dimgrey}}</style> 

<title>The Online MCMC: Results page</title>
</head>

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
      <a class="navbar-brand" href="#">THE ONLINE MCMC</a>
    </div>
    <div class="collapse navbar-collapse" id="myNavbar">
      <ul class="nav navbar-nav navbar-right">
        <li><a href="#margpos">MARGINALISED POSTERIORS</a></li>
        <li><a href="#bestfit">BEST FIT VALUES & DISTRIBUTION</a></li>        
        <li><a href="#links">LINKS</a></li>
      </ul>
    </div>
  </div>
</nav>

<div class="container-top bg-1 text-center">
  <h2 class="title">RESULTS</h2>
  <h3>Your results have been generated and are displayed below.</h3>
</div>

<div class="container">
  <ul class="nav nav-pills">
    <li class="active"><a data-toggle="pill" href="#margpos">MARGINALISED POSTERIORS</a></li>
    <li><a data-toggle="pill" href="#bestfit">BEST FIT VALUES & DISTRIBUTION</a></li>
    <li><a data-toggle="pill" href="#links">LINKS</a></li>
  </ul>

   <div class="tab-content">


    <div id="margpos" class="tab-pane fade in active">
      <h3 class="text-center" id="instructions">MARGINALISED POSTERIORS</h3>
      <p>
        The diagonal plots show the <a style="color: #BD5D38" href="https://en.wikipedia.org/wiki/Marginal_distribution">marginal</a> <a style="color: #BD5D38" href="https://en.wikipedia.org/wiki/Posterior_probability">posterior probability</a> distributions for each of your fitted parameters. The off-diagonal plots show 1 and 2&sigma; probability contours for the <a style="color: #BD5D38" href="https://en.wikipedia.org/wiki/Joint_probability_distribution">joint</a> marginal posterior probability distributions of pairs of parameters. This has been produced with <a style="color: #BD5D38" href="https://github.com/dfm/corner.py">corner.py</a>.
      </p>
      {posteriorfig}
    </div>

    <div id="bestfit" class="tab-pane fade">
      <h3 class="text-center" id="functions">BEST FIT VALUES</h3>
      
      The <a href="https://en.wikipedia.org/wiki/Mean">mean</a> and <a href="https://en.wikipedia.org/wiki/Median">median</a> of the probability distributions for each parameter are displayed in the table below. Also given are the <a href="https://en.wikipedia.org/wiki/Standard_deviation">standard deviation</a> of the distributions and minimal 68% and 95% <a href="https://en.wikipedia.org/wiki/Credible_interval">credible intervals</a> (CI).
      <div>
        {resultstable}
      </div>

      <h3>Correlation coefficient matrix</h3>

      The <a href="https://en.wikipedia.org/wiki/Pearson_correlation_coefficient">correlation coefficients</a> between each of the fitted parameters.
      <div>
        {corrcoeftable}
      </div>
    

    {evidencevalue}

    <div class="container-fluid bg-1 text-left">
      <h3 class="text-center" id="instructions">BEST FIT MODEL DISTRIBUTION</h3>
      <p>
        This plot shows the distribution of 100 models drawn randomly from the posterior distribution. The best fitting models will be clustered over each other.
      </p>
      {bestfitfig}
    </div>
    </div>

    <div id="links" class="tab-pane fade">
      <h2 class="text-center">LINKS</h2>
      <h3>Code links</h3>
      The <a href="https://www.python.org/">Python</a> files for running the analysis are provided below. These use the <a href="https://pypi.org/project/bilby/">bilby</a> Python module.
      <ul>
        <li><a href="pyfile.py"><code>pyfile.py</code></a> - the Python file used to run the analysis</li>
        <li><a href="mymodel.py"><code>mymodel.py</code></a> - the Python model function</li>
      </ul>

      <h3>Data links</h3>
      <ul>
        <li><a href="posterior_samples.txt.gz"><code>posterior_samples.txt.gz</code></a> - a gzipped tarball containing the posterior samples</li>
        <li><a href="variables.txt"><code>variables.txt</code></a> - the variables in the order of the posterior file</li>
      </ul>
    </div>
  </div>
</div>

<!-- include footer -->
<?php
$shareurl = "https://www.theonlinemcmc.com";
include('../../footer.inc');
?>

<!-- include social media sharing -->
<?php
$shareurl = "{outdir}";
include('../../social.inc');
?>
</div>
</body>
"""

    fm["outdir"] = outdir

    varnames = list(postsamples.columns)[:-2]
    psamples = postsamples.values
    nvars = len(varnames)
    # convert any Greek alphabet variable names into LaTeX tags (prefix with \)
    for i, var in enumerate(varnames):
        if var in greekletters:
            varnames[i] = "\\" + varnames[i]

        # if sigma has been fit for the Gaussian likelihood change the variable name
        if "sigma_gauss" in var:
            varnames[i] = "\\sigma_{\mathrm{gauss}}"  # convert to LaTeX

    # create triangle plot

    fm["posteriorfig"] = (
        '<img class="center-block bg-3" src="outdir/label_corner.png" width="60%">'
    )

    # get the 68% and 95% credible intervals
    inter68 = []
    inter95 = []
    for i in range(nvars):
        inter68.append(credible_interval(psamples[:, i], 0.68))
        inter95.append(credible_interval(psamples[:, i], 0.95))

    # output the results table
    resultstable = '<table class="table table-striped table-hover">\n<tr><th>Variable</th><th>Mean</th><th>Median</th><th>&sigma;</th><th>68% CI</th><th>95% CI</th></tr>\n'
    for i in range(nvars):
        resstrs = [
            "\(" + varnames[i] + "\)"
        ]  # the \( \) are the MathJax equation delimiters

        meanv = np.mean(psamples[:, i])
        if np.fabs(meanv) > 1e3 or np.fabs(meanv) < 1e-2:
            meanstr = exp_str(meanv)
        else:
            meanstr = "%.1f" % meanv
        resstrs.append(meanstr)

        medianv = np.median(psamples[:, i])
        if np.fabs(medianv) > 1e3 or np.fabs(medianv) < 1e-2:
            medianstr = exp_str(medianv)
        else:
            medianstr = "%.1f" % medianv
        resstrs.append(medianstr)

        # modev = postsamples[np.argmax(postsamples[:,-1]),i]
        # if np.fabs(modev) > 1e3 or np.fabs(modev) < 1e-2:
        # modestr = exp_str(modev)
        # else:
        # modestr = '%.1f' % modev
        # resstrs.append(modestr)

        sigmav = np.std(psamples[:, i])
        if np.fabs(sigmav) > 1e3 or np.fabs(sigmav) < 1e-2:
            sigmastr = exp_str(sigmav)
        else:
            sigmastr = "%.1f" % sigmav
        resstrs.append(sigmastr)

        ci68str = "[{0}, {1}]"
        if np.fabs(inter68[i][0]) > 1e3 or np.fabs(inter68[i][0]) < 1e-2:
            cis1 = exp_str(inter68[i][0])
        else:
            cis1 = "%.1f" % inter68[i][0]
        if np.fabs(inter68[i][1]) > 1e3 or np.fabs(inter68[i][1]) < 1e-2:
            cis2 = exp_str(inter68[i][1])
        else:
            cis2 = "%.1f" % inter68[i][1]
        resstrs.append(ci68str.format(cis1, cis2))

        ci95str = "[{0}, {1}]"
        if np.fabs(inter95[i][0]) > 1e3 or np.fabs(inter95[i][0]) < 1e-2:
            cis1 = exp_str(inter95[i][0])
        else:
            cis1 = "%.1f" % inter95[i][0]
        if np.fabs(inter95[i][1]) > 1e3 or np.fabs(inter95[i][1]) < 1e-2:
            cis2 = exp_str(inter95[i][1])
        else:
            cis2 = "%.1f" % inter95[i][1]
        resstrs.append(ci95str.format(cis1, cis2))

        resultstable += "<tr><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td></tr>".format(
            *resstrs
        )
    resultstable += "</table>\n"

    fm["resultstable"] = resultstable

    # get the correlation coefficient matrix
    corrcoef = np.corrcoef(psamples[:, :nvars].T)

    corrcoeftable = '<table class="table table-striped table-hover"><th></th>'
    for i in range(nvars):
        corrcoeftable += "<td>%s</td>" % ("\(" + varnames[i] + "\)")
    corrcoeftable += "</tr>\n"
    for i in range(nvars):
        corrcoeftable += "<tr><td>%s</td>" % ("\(" + varnames[i] + "\)")
        for j in range(nvars):
            # check if only 1d corrcoef array
            if nvars == 1:
                corrcoeftable += "<td>%.2f</td>" % corrcoef
            else:
                corrcoeftable += "<td>%.2f</td>" % corrcoef[i, j]
        corrcoeftable += "</tr>\n"
    corrcoeftable += "</table>\n"

    fm["corrcoeftable"] = corrcoeftable

    if np.isnan(evidence) == True:
        fm["evidencevalue"] = (
            ""  # Not using nestling sampler - no evidence value to display
        )
    else:
        evidencevalue = '<div id="lnevd" class="container-fluid bg-2 text-left">'
        evidencevalue += (
            '<h3 class="text-center" id="functions">LOG EVIDENCE VALUE</h3>'
        )
        evidencevalue += (
            "The nested sampler used gave a log evidence value of: <b>%.4f </b></div>"
            % evidence
        )
        fm["evidencevalue"] = evidencevalue

    # create plot of data along with distribution of best fit models

    fm["bestfitfig"] = (
        '<img class="center-block bg-3" src="outdir/label_plot_with_data.png" width="60%">'
    )

    # output page
    ppfile = "index.php"
    fp = open(ppfile, "w")
    fp.write(htmlpage.format(**fm))
    fp.close()

    # email the page
    emailresponse(email, outdir)
