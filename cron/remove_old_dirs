#!/bin/sh

# a script to run with cron daily (place in /etc/cron/daily) to remove
# user created directories after 15 days

# get environment variable with results directory location
RESDIR=$ONLINEMCMC_RESULTS_DIR

# set 15 day limit on directory modificate (which should be the creation time)
modlim=+15

# use find to find and delete the directories and their content
find ${RESDIR}/* -type d -mtime ${modlim} -exec rm -rf {} +
