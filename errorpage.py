import smtplib # module for emailing
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# output html page in case of errors

def errorpage(errval, emailaddress, outdir):
  from errorcodes import *
  
  # the output html file
  errfile = 'error.html'
  
  fp = open(errfile)
  
  # write out html header
  fp.write("<!DOCTYPE HTML>\n<html>\n<head>\n</head>\n<body>\n")
  
  # check error codes and create out
  if errval == DATA_READ_ERR:
    fp.write("<p>There was a problem reading the data</p>")
    

  fp.write("</body>")

  # email a link to the webpage
  fromaddr = 'theonlinemcmc@gmail.com'
  toaddr = emailaddress

  link = 'http://www.theonlinemcmc.com/%s/%s' % (outdir, errfile)

  subject = 'Your results from TheOnlineMCMC'

  username = 'theonlinemcmc'
  password = 'XXXXXX' # will need to sort out reading this from a file that is not in the repo

  msg = MIMEMultipart()
  msg['From'] = 'TheOnlineMCMC'
  msg['Subject'] = subject
  
  msgtext = """
Dear user,

Unfortunately there was an error in running your MCMC. Please see %s for more information on the
error that occured.

Regards,

TheOnlineMCMC
  """ % link
  
  msg.attach(MIMEText(msgtext))
  
  # set server and send email
  server = smtplib.SMTP_SSL('smtp.gmail.com:465')
  server.login(username,password)
  server.sendmail(fromaddr, toaddrs, msg.as_string())
  server.quit()
  