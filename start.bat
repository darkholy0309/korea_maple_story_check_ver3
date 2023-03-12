set chrome= c:\"program files\google\chrome\application"
set msedge= c:\"program files (x86)\microsoft\edge\application"
set nodejs= c:\"program files\nodejs"
set url= http://www.nodejs.org
if exist %nodejs% (
start %nodejs%\node index.js
) else (
if exist %chrome% (
start %chrome%\chrome /incognito /new-window %url%
) else (
start %msedge%\msedge /inprivate /new-window %url%
)
)