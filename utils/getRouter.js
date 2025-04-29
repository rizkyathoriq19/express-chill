import path from 'path';
import fs from 'fs';

export function getRoutersSync(__path, __extension) {
    const files = {};

    // Using sync to avoid unnecessary complexity during startup
    fs.readdirSync(__path).forEach(file => {
        const stats = fs.statSync(path.join(__path, file));

        if (stats.isFile() && path.extname(file) === __extension) {
        files[path.basename(file, path.extname(file))] = path.resolve(__path, file);
        } else if (stats.isDirectory()) {
        // Recursively get all files in subdirectories
        const tmp = getRoutersSync(path.resolve(__path, file), __extension);
        for (let key in tmp) {
            files[path.basename(file, path.extname(file)) + '/' + key] = tmp[key];
        }
        }
    });

    return files;
}

export function getAllRouters(__path) {
    return {
        '/': getRoutersSync(__path, '.js'),
    };
}
