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