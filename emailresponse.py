# script for sending email repsonse

# import module for emailing
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def emailresponse(emailaddress, outdir, outfile, runerror=False):
  # email a link to the webpage
  fromaddr = 'theonlinemcmc@gmail.com'
  toaddr = emailaddress

  link = 'http://www.theonlinemcmc.com/%s/%s' % (outdir, outfile)

  subject = 'Your results from TheOnlineMCMC'

  username = 'theonlinemcmc'
  password = 'XXXXXX' # will need to sort out reading this from a file that is not in the repo

  msg = MIMEMultipart()
  msg['From'] = 'TheOnlineMCMC'
  msg['Subject'] = subject
  
  msgtext = """
Dear user,

{msgtext}

Regards,

TheOnlineMCMC
"""

  # message if there's been an error
  if runerror:
    msgtext = "Unfortunately there was an error in running your MCMC. Please see {0} for more information on the error that occured.".format(link)
  else:
    msgtext = "You data has been analysed. The results can be found at {0}."format(link)
  
  msg.attach(MIMEText(msgtext.format(msgtext=msgtext)))
  
  # set server and send email
  server = smtplib.SMTP_SSL('smtp.gmail.com:465')
  server.login(username,password)
  server.sendmail(fromaddr, toaddrs, msg.as_string())
  server.quit()