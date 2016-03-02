import os
c = 0
for fileName in os.listdir("."):
	if fileName.startswith("zp"):
	    os.rename(fileName, "zp_"+str(c)+".jpg")
	    c = c+1