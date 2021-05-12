const fs = require('fs');
// const json = require('tools.json')


let tools = {};

const saveToFile = (file) => {
     fs.writeFile('tools.json', file, 'utf-8', (err) => {
          if (err){
               alert(err);
          }
          console.log('Plik został zaktualizawny!');
     });
}



module.exports.findCategory = (data, cat) => {
     let myJson = fs.readFileSync('tools.json');
     let readedJSON = JSON.parse(myJson);

     let finded = 0;

     const addCategory = () => {
          if (finded >= readedJSON.tools.length){
               readedJSON.tools.push(data);
               console.log('Dodaję kategorię!');
               finded = 0;
          }
     }

     readedJSON.tools.every(item => {
          if (item.id === cat){
               console.log(`Znaleziono: ${cat}`);
               item.tools.push(data.tools[0]);
               return false;
          }
          else {
               console.log(`Nie znaleziono ${cat}`);
               finded = finded + 1;
               addCategory();
               return true
          }
     });

     let readyJSON = JSON.stringify(readedJSON);
     saveToFile(readyJSON);
 };