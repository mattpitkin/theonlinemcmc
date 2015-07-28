# define a function that performs the post-processing of the posterior values and creates a results page
import numpy  as np

from theonlinemcmc import *

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

def postprocessing(postsamples, variables, abscissa, data, email, outdir):
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
<head></head>
<body>

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

</body>
"""

  varnames = variables.split(',')

  # create triangle plot
  labels = ['$%s$' % var for var in variables.split(',')] # LaTeX labels
  nvars = len(variables.split(','))
  levels = 1.-np.exp(-0.5*np.array([1., 2.])**2) # plot 1 and 2 sigma contours
  
  fig = triangle.corner(postsamples[:nvars,:], labels=labels, levels=levels)
  
  # output the figure
  postfigfile = 'posterior_plots.png'
  fig.savefig(postfigfile)
  
  fm['posteriorfig'] = '<img src="' + postfigfile + '" >'

  # get the 68% and 95% credible intervals
  inter68 = []
  inter95 = []
  for i in range(nvars):
    inter68.append(credible_interval(postsamples[i,:], 0.68))
    inter95.append(credible_interval(postsamples[i,:], 0.95))
  
  # output the results table
  resultstable = "<table>\n<tr><th>Variable</th><th>Mean</th><th>Median</th><th>Mode</th><th>&sigma;</th><th>68%% CI</th><th>95%% CI</th></tr>\n"
  for i in range(nvars):
    resstrs = [varnames[i]]
    
    meanv = np.mean(postsamples[i,:])
    if meanv > 1e3 or meanv < 1e-2:
      meanstr = exp_str(meanv)
    else:
      meanstr = '%.1f' % meanv
    resstrs.append(menastr)
    
    medianv = np.median(postsamples[i,:])
    if medianv > 1e3 or medianv < 1e-2:
      medianstr = exp_str(medianv)
    else:
      medianstr = '%.1f' % medianv
    resstrs.append(medianstr)
    
    modev = postsamples[i,np.argmax(postsamples[i,:])]
    if modev > 1e3 or modev < 1e-2:
      modestr = exp_str(modev)
    else:
      modestr = '%.1f' % modev
    resstrs.append(modestr)
    
    sigmav = np.std(postsamples[i,:])
    if sigmav > 1e3 or sigmav < 1e-2:
      sigmastr = exp_str(sigmav)
    else:
      sigmastr = '%.1f' % sigmav
    resstrs.append(sigmastr)
    
    ci68str = "[{0}, {1}]"
    if inter68[i][0] > 1e3 or inter68[i][0] < 1e-2:
      cis1 = exp_str(inter68[i][0])
    else:
      cis1 = '%.1f' % inter68[i][1]
    if inter68[i][1] > 1e3 or inter68[i][1] < 1e-2:
      cis2 = exp_str(inter68[i][1])
    else:
      cis2 = '%.1f' % inter68[i][1]
    resstrs.append(ci68str.format(cis1, cis2))
    
    ci95str = "[{0}, {1}]"
    if inter95[i][0] > 1e3 or inter95[i][0] < 1e-2:
      cis1 = exp_str(inter95[i][0])
    else:
      cis1 = '%.1f' % inter95[i][1]
    if inter95[i][1] > 1e3 or inter95[i][1] < 1e-2:
      cis2 = exp_str(inter95[i][1])
    else:
      cis2 = '%.1f' % inter95[i][1]
    resstrs.append(ci95str.format(cis1, cis2))
    
    resultstable += "<tr><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td></tr>".format(resstrs)
  resultstable += "</table>\n"
  
  fm['resultstable'] = resultstable
  
  # get the correlation coefficient matrix
  corrcoef = np.corrcoef(postsamples[:nvars,:])
  
  corrcoeftable = "<table><th></th>"
  for i in range(nvars):
    corrcoeftable += "<th>%s</th>" % varnames[i]
  corrcoeftable += "</tr>\n"
  for i in range(nvars):
    corrcoeftable += "<tr><td>%s</td>" % varnames[i]
    for j in range(nvars):
      corrcoeftable += "<td>%.2f</td>" % corrcoef[i,j]
    corrcoeftable += "</tr>\n"
  corrcoeftable += "</table>\n"
  
  # create plot of data along with distribution of best fit models
  from mymodel import mymodel
  
  # load data
  datafile = 'data_file.txt'
  try:
    data = np.loadtxt(datafile)
  except:
    try:
      data = np.loadtxt(datafile)
    except:
      # this should work as the file must have been read in for the MCMC to run
      import sys
      sys.exit(0)
  
  # load abscissa
  absfile = 'abscissa_file.txt'
  try:
    xdata = np.loadtxt(absfile)
  except:
    try:
      xdata = np.loadtxt(absfile)
    except:
      # this should work as the file must have been read in for the MCMC to run
      import sys
      sys.exit(0)
  
  fig2 = pl.figure()
  pl.plot(xdata, data, 'k.', ms=1, label='Data')
  varidxs = range(nvars)
  if 'sigma' in variables:
    sigmaidx = variables.index('sigma')
    varidxs.remove(sigmaidx)
  varidxs = np.array(varidxs)
  
  randidxs = np.random.permutation(len(postsamples))[0:100]
  
  # overplot models for 100 random draws from the posterior
  for i in range(100):
    thesevars = postsamples[varidxs, randidxs[i]].tolist()
    thesevars.append(xdata)
    thismodel = mymodel(*thesevars) # unpack list as arguments of model function
    pl.plot(xdata, thismodel, '-', color='mediumblue', lw=3, alpha=0.05)

  pl.legend(loc='best')
  modelplot = 'model_plot.png'
  fig2.savefig(modelplot)
  
  fm['bestfitfig'] = '<img src="' + modelplot + '" >'
    
  # output page
  ppfile = 'postprocessing.html'
  fp = open(ppfile, 'w')
  fp.write(htmlpage.format(**fm))
  fp.close()
  
  # email the page
  emailresponse(email, outdir, ppfile)