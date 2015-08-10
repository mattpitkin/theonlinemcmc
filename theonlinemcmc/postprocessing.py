# define a function that performs the post-processing of the posterior values and creates a results page
import numpy  as np

from theonlinemcmc import emailresponse

import matplotlib as mpl
mpl.use("Agg")

# convert a floating point number into a string in X.X x 10^Z format
def exp_str(f, p=1):
  if p > 16:
    print >> sys.stderr, "Precision must be less than 16 d.p."
    p = 16

  s = '%.16e' % f
  ssplit = s.split('e')
  return '%.*f&times;10<sup>%d</sup>' % (p, float(ssplit[0]), int(ssplit[1]))

# a function to get the credible intervals using a greedy binning method
def credible_interval(dsamples, ci):
   n, binedges = np.histogram(dsamples, bins=250)
   dbins = binedges[1]-binedges[0] # width of a histogram bin
   bins = binedges[0:-1]+dbins/2. # centres of bins

   histIndices=np.argsort(n)[::-1]  # indices of the points of the histogram in decreasing order

   frac = 0.0
   j = 0
   for i in histIndices:
     frac += float(n[i])/float(len(dsamples))
     j = j+1
     if frac >= ci:
       break

   return (np.min(bins[histIndices[:j]]), np.max(bins[histIndices[:j]]))

def postprocessing(postsamples, variables, abscissa, abscissaname, data, email, outdir):
  # import the triangle plot code
  import triangle

  # import matplotlib
  from matplotlib import pyplot as pl
  
  # the format text to include in the page
  fm = {}
  
  # the string containing the webpage
  htmlpage = """
<!DOCTYPE HTML>
<html>
<head>
<title>The Online MCMC: Results page</title>
<link rel="stylesheet" type="text/css" href="../simple.css"/>
</head>
<body>
<div id="page-wrap">

<h1>MCMC output page</h1>

<h2>Marginalised posteriors</h2>

{posteriorfig}

<h2>Best fit values</h2>

<div>
{resultstable}
</div>

<div>
{corrcoeftable}
</div>

<h2>Best fit model distribution</h2>

{bestfitfig}

<h2>Code links</h2>

<ul>
<li><a href="pyfile.py"><code>pyfile.py</code></a> - the python file used to run the MCMC</li>
<li><a href="mymodel.py"><code>mymodel.py</code></a> - the python model function</li>
</ul>

<h2>Data links</h2>

<ul>
<li><a href="posterior_samples.txt.gz"><code>posterior_samples.txt.gz</code></a> - a gzipped tarball 
containing the posterior samples</li>
<li><a href="variables.txt"><code>variables.txt</code></a> - the variables in the order of the posterior file</li>
</ul>

<!-- include footer file -->
<?php include('../footer.inc'); ?>

</div>
</body>
"""

  varnames = variables.split(',')

  # create triangle plot
  labels = ['$%s$' % var for var in varnames] # LaTeX labels
  nvars = len(varnames)
  levels = 1.-np.exp(-0.5*np.array([1., 2.])**2) # plot 1 and 2 sigma contours

  fig = triangle.corner(postsamples[:,:nvars], labels=labels, levels=levels)

  # output the figure
  postfigfile = 'posterior_plots.png'
  fig.savefig(postfigfile, transparent=True) # transparent background

  fm['posteriorfig'] = '<img src="' + postfigfile + '" >'

  # get the 68% and 95% credible intervals
  inter68 = []
  inter95 = []
  for i in range(nvars):
    inter68.append(credible_interval(postsamples[:,i], 0.68))
    inter95.append(credible_interval(postsamples[:,i], 0.95))
  
  # output the results table
  resultstable = "<table>\n<tr><th>Variable</th><th>Mean</th><th>Median</th><th>Mode</th><th>&sigma;</th><th>68%% CI</th><th>95%% CI</th></tr>\n"
  for i in range(nvars):
    resstrs = [varnames[i]]
    
    meanv = np.mean(postsamples[:,i])
    if np.fabs(meanv) > 1e3 or np.fabs(meanv) < 1e-2:
      meanstr = exp_str(meanv)
    else:
      meanstr = '%.1f' % meanv
    resstrs.append(meanstr)
    
    medianv = np.median(postsamples[:,i])
    if np.fabs(medianv) > 1e3 or np.fabs(medianv) < 1e-2:
      medianstr = exp_str(medianv)
    else:
      medianstr = '%.1f' % medianv
    resstrs.append(medianstr)
    
    modev = postsamples[np.argmax(postsamples[:,i]),i]
    if np.fabs(modev) > 1e3 or np.fabs(modev) < 1e-2:
      modestr = exp_str(modev)
    else:
      modestr = '%.1f' % modev
    resstrs.append(modestr)

    sigmav = np.std(postsamples[:,i])
    if np.fabs(sigmav) > 1e3 or np.fabs(sigmav) < 1e-2:
      sigmastr = exp_str(sigmav)
    else:
      sigmastr = '%.1f' % sigmav
    resstrs.append(sigmastr)
    
    ci68str = "[{0}, {1}]"
    if np.fabs(inter68[i][0]) > 1e3 or np.fabs(inter68[i][0]) < 1e-2:
      cis1 = exp_str(inter68[i][0])
    else:
      cis1 = '%.1f' % inter68[i][0]
    if np.fabs(inter68[i][1]) > 1e3 or np.fabs(inter68[i][1]) < 1e-2:
      cis2 = exp_str(inter68[i][1])
    else:
      cis2 = '%.1f' % inter68[i][1]
    resstrs.append(ci68str.format(cis1, cis2))
    
    ci95str = "[{0}, {1}]"
    if np.fabs(inter95[i][0]) > 1e3 or np.fabs(inter95[i][0]) < 1e-2:
      cis1 = exp_str(inter95[i][0])
    else:
      cis1 = '%.1f' % inter95[i][0]
    if np.fabs(inter95[i][1]) > 1e3 or np.fabs(inter95[i][1]) < 1e-2:
      cis2 = exp_str(inter95[i][1])
    else:
      cis2 = '%.1f' % inter95[i][1]
    resstrs.append(ci95str.format(cis1, cis2))

    resultstable += "<tr><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td></tr>".format(*resstrs)
  resultstable += "</table>\n"

  fm['resultstable'] = resultstable
  
  # get the correlation coefficient matrix
  corrcoef = np.corrcoef(postsamples[:,:nvars].T)

  corrcoeftable = "<table><th></th>"
  for i in range(nvars):
    corrcoeftable += "<th>%s</th>" % varnames[i]
  corrcoeftable += "</tr>\n"
  for i in range(nvars):
    corrcoeftable += "<tr><td>%s</td>" % varnames[i]
    for j in range(nvars):
      # check if only 1d corrcoef array
      if nvars == 1:
        corrcoeftable += "<td>%.2f</td>" % corrcoef
      else:
        corrcoeftable += "<td>%.2f</td>" % corrcoef[i,j]
    corrcoeftable += "</tr>\n"
  corrcoeftable += "</table>\n"

  fm['corrcoeftable'] = corrcoeftable
  
  # create plot of data along with distribution of best fit models
  from mymodel import mymodel

  fig2 = pl.figure()
  pl.plot(abscissa, data, 'k.', ms=1, label='Data')
  varidxs = range(nvars)
  if 'sigma' in variables:
    sigmaidx = variables.index('sigma')
    varidxs.remove(sigmaidx)
  varidxs = np.array(varidxs)
  
  randidxs = np.random.permutation(postsamples.shape[0])[0:100]
  
  # overplot models for 100 random draws from the posterior
  for i in range(100):
    thesevars = postsamples[randidxs[i], varidxs].tolist()
    thesevars.append(abscissa)
    thismodel = mymodel(*thesevars) # unpack list as arguments of model function
    pl.plot(abscissa, thismodel, '-', color='mediumblue', lw=3, alpha=0.05)

  pl.legend(loc='best', numpoints=1)
  pl.xlabel(abscissaname)

  modelplot = 'model_plot.png'
  
  # later try converting to d3 figure using http://mpld3.github.io/ (e.g. import mpld3; mpld3.save_html(fig2))
  fig2.savefig(modelplot, transparent=True)
  
  fm['bestfitfig'] = '<img src="' + modelplot + '" >'
    
  # output page
  ppfile = 'postprocessing.php'
  fp = open(ppfile, 'w')
  fp.write(htmlpage.format(**fm))
  fp.close()
  
  # email the page
  emailresponse(email, outdir, ppfile)