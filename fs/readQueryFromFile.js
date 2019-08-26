import { readFile } 																		from 'fs';

export function readMySQLQuery(path){
  return new Promise((resolve, reject) => {
    readFile(path, 'utf-8', (errRead, text_query) => {
      if (errRead) reject(errRead);
      else resolve(text_query);
    })
  });
}