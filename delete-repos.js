var URL = "https://clasor-backend.sandpod.ir/v1";
var TOKEN = "8437949888-90B205feeb154345bdd7703786f91678.XzIwMjU0";
var repoids = [];
var offset = 0;

function getIdS() {
  pm.sendRequest({
      url: URL + "/repositories/myRepoList?offset=" + offset + "&size=30",
      method: 'GET',
      header: {
          'Accept': 'test',
          'Authorization': "Bearer " + TOKEN
      }
  }, (err, res) => {
      if (err) {
          console.error('Error fetching repositories:', err);
          setTimeout(getIdS, 500);
          return;
      }
      
      try {
          const responseData = res.json().data;
          const list = responseData?.list || [];
          const total = responseData?.total || 0;
          
          list.forEach((item) => {
              repoids.push(item.id);
          });
          
          console.info(`Fetched ${list.length} repositories. Total: ${total}, Offset: ${offset}`);
          
          if (repoids.length > 0) {
              deleteRepos();
          } else if (offset < total) {
              offset += 30;
              setTimeout(getIdS, 500);
          } else {
              console.log("All repositories processed.");
          }
      } catch (error) {
          console.error('Error processing response:', error);
          setTimeout(getIdS, 500);
      }
  });
}

function deleteRepos() {
  if (repoids.length === 0) {
      console.log("No more repositories to delete. Fetching next batch...");
      offset += 30;
      setTimeout(getIdS, 500);
      return;
  }
  
  const repoID = repoids[repoids.length - 1];
  pm.sendRequest({
      url: URL + "/repositories/" + repoID + "?forceDelete=true",
      method: 'DELETE',
      header: {
          'Authorization': "Bearer " + TOKEN
      }
  }, (err, res) => {
      if (err) {
          console.error('Error deleting repository:', repoID, err);
          setTimeout(() => deleteRepos(), 2000);
          return;
      }
      
      console.log(`Deleted repository: ${repoID}. Remaining: ${repoids.length - 1}`);
      repoids.pop();
      setTimeout(deleteRepos, 500);
  });
}

getIdS(); 