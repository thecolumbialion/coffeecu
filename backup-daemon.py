import daemon
import subprocess
import time

with daemon.DaemonContext():
	#make backup file
    print "Creating backup at %s" % datetime.datetime.now()
    subprocess.call(['./backup.sh'])
    time.sleep(3600)
