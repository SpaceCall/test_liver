import sys

argvs = sys.argv

answer = ""
for i in range(len(argvs[1:])):
    answer += str(i)
print(answer)