git checkout master
git pull origin master
git checkout prod
git merge origin/master --ff-only
git push origin prod
git checkout master
