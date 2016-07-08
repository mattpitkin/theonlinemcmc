"""

define functions to insert some info into a MySQL database

The MySQL database first needs to have been created, e.g.

mysql -u root -p

# create a database called databasename
mysql> CREATE DATABASE databasename;

# create a user (called username) for the database
mysql> CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';
mysql> USE databasename;

# grant the user (username) access to databasename
mysql> GRANT ALL ON databasename.* TO 'username'@'localhost';

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
                         nvariables TINYINT, \
                         success BOOLEAN);
"""
def database_add_row(uid, mfunc, variables, nvars, success):
  # get database info from a file specified by an environment variable
  dbinf = open(os.environ['TOMDBFILE'], 'r')
  dbdata = json.load(dbinf)
  dbinf.close()
  
  # set database table
  sucvar = 0
  if success:
    sucvar = 1
  
  # open connection to the database
  con = mdb.connect('localhost', dbdata['user'], dbdata['password'], dbdata['database'])
  
  with con:
    # add values into table
    cur = con.cursor()

    # insert into row
    cur.execute("INSERT INTO %s (uid, modelfunction, variables, nvariables, success) VALUES('%s', '%s', '%s', '%d', '%d')" % (dbdata['table'], uid, mfunc, variables, nvars, sucvar))
    con.commit()
      
  con.close()
