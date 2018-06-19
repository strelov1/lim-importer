import { readDirAsync, readFileAsync } from "./fs";
import * as cuid from "cuid";

const course = './test_data';

const exersizeFiles = [
	'SPos.lim',
	'EPos.lim',
	'Eng.lim',
	'Rus.lim',
];

const allowDir = /^\d{4}$/;

// read directory
async function getDir(exersizes : string[]) {
    return exersizes.filter(exersize => {
        return allowDir.test(exersize)
    });
}

// make all file link
async function getPathExersizes(exersizes : string[]) {
	return exersizes.map((exersize: string) => {
		return exersizeFiles.map(fileType => {
			return `${course}/${exersize}/${fileType}`;
		});
	})
}

// read file on array
async function readLine(filename: string) {
    return readFileAsync(filename, 'utf8')
		.then((data : string) => data.trim().split("\n"))
		.then(data => data.map(item => item.trim()));
}

// read every files
async function readExersizes(exersizesPath : string[][]) {
    return exersizesPath.map(exersize => {
        return exersize.map(readLine);
    });
}

async function zip(...arrays : any[]) {
    return arrays[0].map((_ : any, i : number) => {
        return arrays.map(array => {
            return array[i];
        });
    });
}

// waiting all file array and ziped their
async function allZip(promises : Promise<any[]>[][]) {
    return promises.map(data => Promise.all(data).then((values) => {
        return zip(...values);
    }));
}

// join all result in one array
async function joinPromise(promises :any) {
    return Promise.all(promises);
}

readDirAsync(course)
    .then(getDir)
    .then(getPathExersizes)
    .then(readExersizes)
    .then(allZip)
    .then(joinPromise)
    .then((data) => {
        
        let values = data.map((item : any) => {
            return item.map((node) => {
                return {
                    "_typeName": "Phrase",
                    id : cuid(),
                    startTime : node[0],
                    stopTime : node[1],
                    originalText : node[2],
                    translateText : node[3]
                };
            })
        });     
        
        let mergeValue = values[0].concat(values[1]);

        return {
            "valueType": "nodes",
            "values": mergeValue
        }
    })
    .then(JSON.stringify)
    .then(console.log);