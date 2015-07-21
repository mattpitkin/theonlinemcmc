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
  
  # import module for emailing
  import smtplib
  from email.mime.text import MIMEText
  from email.mime.multipart import MIMEMultipart
  
  # import matplotlib
  from matplotlib import pyplot as pl
  
  # the output html file
  ppfile = 'postprocessing.html'
  
  fp = open(ppfile)
  
  # write out html header
  fp.write("<!DOCTYPE HTML>\n<html>\n<head>\n</head>\n<body>\n")
  fp.write("<h1>MCMC output page</h1>\n")
  
  fp.write("<h2>Marginalised posteriors</h2>\n")
  
  # create triangle plot
  labels = ['$%s$' % var for var in variables.split(',')] # LaTeX labels
  nvars = len(variables.split(','))
  levels = 1.-np.exp(-0.5*np.array([1., 2.])**2) # plot 1 and 2 sigma contours
  
  fig = triangle.corner(postsamples[:nvars,:], labels=labels, levels=levels)
  
  # output the figure
  postfigfile = 'posterior_plots.png'
  fig.savefig(postfigfile)
  
  fp.write('<img src="' + postfigfile + '" >')
  
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
  
  # load data
  datafile = 'data_file.txt'
  try:
    data = np.loadtxt(datafile)
  except:
    try:
      data = np.loadtxt(datafile)
    except:
      # this should work as the file must have been read in for the MCMC to run
  
  # load abscissa
  absfile = 'abscissa_file.txt'
  try:
    xdata = np.loadtxt(absfile)
  except:
    try:
      xdata = np.loadtxt(absfile)
    except:
      # this should work as the file must have been read in for the MCMC to run
  
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
  
  fp.write("<h2>Best fit model distribution</h2>\n")
  
  fp.write('<img src="' + modelplot + '" >')
  
  fp.write("</body>")
  
  # email a link to the webpage
  fromaddr = 'theonlinemcmc@gmail.com'
  toaddr = emailaddress

  link = 'http://www.theonlinemcmc.com/%s/%s' % (outdir, ppfile)

  subject = 'Your results from TheOnlineMCMC'

  username = 'theonlinemcmc'
  password = 'XXXXXX' # will need to sort out reading this from a file that is not in the repo

  msg = MIMEMultipart()
  msg['From'] = 'TheOnlineMCMC'
  msg['Subject'] = subject
  
  msgtext = """
Dear user,

You data has been analysed. The results can be found at %s.

Regards,

TheOnlineMCMC
  """ % link
  
  msg.attach(MIMEText(msgtext))
  
  # set server and send email
  server = smtplib.SMTP_SSL('smtp.gmail.com:465')
  server.login(username,password)
  server.sendmail(fromaddr, toaddrs, msg.as_string())
  server.quit()