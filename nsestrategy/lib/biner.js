const fs = require('fs');

function main(){
    fs.writeFileSync('./directory/dataonce111.txt', 'jdjdjdjdjdjjd\n',{
        flag: "a+"
      })
}

main();