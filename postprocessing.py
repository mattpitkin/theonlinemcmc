# define a function that performs the post-processing of the posterior values and creates a results page
import numpy  as np

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
  
  # the output html file
  ppfile = 'postprocessing.html'
  
  fp = open(ppfile)
  
  # write out html header
  fp.write("<!DOCTYPE HTML>\n<html>\n<head>\n</head>\n<body>\n")
  
  # create triangle plot
  labels = ['$%s$' % var for var in variables.split(',')] # LaTeX labels
  nvars = len(variables.split(','))
  levels = 1.-np.exp(-0.5*np.array([1., 2.])**2) # plot 1 and 2 sigma contours
  
  fig = triangle.corner(postsamples[:nvars,:], labels=labels, levels=levels)
  
  # output the figure
  postfigfile = 'posterior_plots.png'
  fig.savefig(postfigfile)
  
  # get the 68% and 95% credible intervals
  inter68 = []
  inter95 = []
  for i in range(nvars):
    inter68.append(credible_interval(postsamples[i,:], 0.68))
    inter95.append(credible_interval(postsamples[i,:], 0.95))
  
  # get the correlation coefficient matrix
  corrcoef = np.corrcoef(postsamples[:nvars,:])
  
  # create plot of data along with distribution of best fit models
  from mymodel import mymodel
  
  fp.write("</body>")
  
  # email a link to the webpage