const fs = require('fs');

function main(){
  let day = null;
  let currentDate = new Date();
  let currentDay = currentDate.getDay();
  if(currentDay!==day){
    day=currentDay;
  fs.writeFileSync('./directory/dataonce111.txt', new Date()+"\n",{
    flag: "a+"
  })
}
  setTimeout(()=>{
     currentDate = new Date();
     currentDay = currentDate.getDay();
    if(currentDay!==day){
      day=currentDay;
    fs.writeFileSync('./directory/dataonce111.txt', new Date()+"\n",{
      flag: "a+"
    })
  }
  }, 60*1000*5)
    
}

main();