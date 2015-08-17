"""

define functions to insert some info into a MySQL database

"""

import MySQLdb as mdb
import os
import json

"""
 add a row to the table containing some low level info just for use monitoring purposes.
 in the future more info could be added
 add:
  - the unique ID for the run
  - the model function (as text)
  - the variables used
  - the number of variables
  - whether the run was successful or not
 The database table must have been created with
  CREATE TABLE tablename(Id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT, \
                         uid VARCHAR(255), \
                         modelfunction TEXT, \
                         variables VARCHAR(255), \
                         nvariables TINYINT \
                         success BOOLEAN)
"""
def database_add_row(uid, mfunc, variables, nvars, success):
  # get database info from a file specified by an environment variable
  dbinf = open(os.environ['TOMDBFILE'], 'r')
  dbdata = json.load(dbinf)
  dbinf.close()
  
  # set database table
  sucvar = 'FALSE'
  if success:
    sucvar = 'TRUE'
  
  # open connection to the database
  con = mdb.connect('localhost', dbdata['user'], dbdata['password'], dbdata['database'])
  
  with con:
    # add values into table
    cur = con.cursor()
    
    insertrow = """\
INSERT INTO {table} (uid, modelfunction, variables, nvariables, success) \
VALUES('{uid}', '{mfunc}', '{variables}', '{nvars}', '{success}')
"""
    rowdict = {}
    rowdict['table'] = dbdata['table']
    rowdict['uid'] = uid
    rowdict['mfunc'] = mfunc
    rowdict['variables'] = variables
    rowdict['nvars'] = nvars
    rowdict['success'] = suvar
    
    # insert into row
    cur.execute(insertrow.format(rowdict))
      
  con.close()
