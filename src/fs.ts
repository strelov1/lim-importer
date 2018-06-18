import * as fs from "fs";

export async function readDirAsync(dir: string) : Promise<any> {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, function(err, files) {
            if (err) {
                reject(err); 
            } else {
                resolve(files);
            }
        });
    });
}

export async function readFileAsync(filename: string, encode: string) : Promise<any> {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, encode, function(err, data){
            if (err) {
                reject(err); 
            } else {
                resolve(data);
            }
        });
    });
}

export async function existsAsync(filename : string) : Promise<any> {
    return new Promise((resolve, reject) => {
    	fs.exists(filename, (exists) => {
    		resolve(exists);
		});
    });
}