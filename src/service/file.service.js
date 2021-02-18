const connection = require('../app/database');

class FileService {
    async createAvatarInfo(filename, mimetype, size, id) {
        const statement = `
            INSERT INTO avatar (filename, mimetype, size, user_id) VALUES (?, ?, ?, ?);
        `;
        const [result] = await connection.execute(statement, [filename, mimetype, size, id]);
        return result;
    }
    async getAvatarById(id) {
        const statement = `
            SELECT * FROM avatar WHERE user_id = ?;
        `;
        const [result] = await connection.execute(statement, [id]);
        return result.pop();
    }
    async getFileByFilename(filename) {
        const statement = `
            SELECT * FROM file WHERE filename = ?;
        `;
        const [result] = await connection.execute(statement, [filename]);
        return result[0];
    }
    async createFileInfo(filename, mimetype, size, momentId, id) {
        const statement = `
            INSERT INTO file (filename, mimetype, size, moment_id, user_id) VALUES (?, ?, ?, ?, ?);
        `;
        const [result] = await connection.execute(statement, [filename, mimetype, size, momentId, id]);
        return result;
    }
}   

module.exports = new FileService();