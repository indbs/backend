import { readFile } 																		from 'fs';

export function readMySQLQuery(path){
  return new Promise((resolve, reject) => {
    readFile(path, 'utf-8', (err, text_query) => {
      if (err) reject(err);
      else resolve(text_query);
    })
  });
}