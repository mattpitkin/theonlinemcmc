# script for sending email repsonse
import os
import json

# import module for emailing
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def emailresponse(emailaddress, outurl, runerror=False):
  # read info for emailing
  einf = open(os.environ['EMAILFILE'], 'r')
  edata = json.load(einf)
  einf.close()

  # email a link to the webpage
  fromaddr = edata['fromaddress']
  toaddr = emailaddress

  link = outurl

  subject = 'Your results from TheOnlineMCMC'

  username = edata['username']
  password = edata['password'] # will need to sort out reading this from a file that is not in the repo
  replyto = edata['replyto'] # reply-to address

  msg = MIMEMultipart()
  msg['From'] = 'The Online MCMC <results@theonlinemcmc.com>'
  msg['To'] = toaddr
  msg['Reply-To'] = replyto
  msg['Subject'] = subject
  
  msgtext = """Dear user,

{msgtext}

Regards,

TheOnlineMCMC
"""

  # message if there's been an error
  if runerror:
    message = "Unfortunately there was an error in running your MCMC. Please see {0} for more information on the error that occured.".format(link)
  else:
    message = "You data has been analysed. The results can be found at {0}.".format(link)
  
  msg.attach(MIMEText(msgtext.format(msgtext=message), 'plain'))
  
  # set server and send email
  if edata['server'] == 'localhost':
    server = smtplib.SMTP('localhost')
  else:
    server = smtplib.SMTP_SSL(edata['server'])
    server.login(username, password)
  server.sendmail(fromaddr, [toaddr], msg.as_string())
  server.quit()
