const connection = require('../app/database');
const {
    APP_HOST, APP_PORT
} = require('../app/config');

const BASE_URL = `${APP_HOST}:${APP_PORT}`;
// const sqlFragment = `
//     SELECT 
//         m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
//         JSON_OBJECT('id', u.id, 'name', u.name) author
//     FROM moment m
//     LEFT JOIN users u ON m.user_id = u.id
// `;

class MomentService {
    async create(userId, content) {
        const statement = `
            INSERT INTO moment (content, user_id) VALUES (? ,?);
        `;
        const [result] = await connection.execute(statement, [content, userId]);
        return result;
    }
    async getMomentList(offset, size){
        const statement = `
            SELECT 
                m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
                JSON_OBJECT('id', u.id, 'name', u.name, 'avatarUrl', u.avatar_url) author,
                (SELECT COUNT(*) FROM comment c WHERE c.moment_id = m.id) commentCount,
                (SELECT COUNT(*) FROM moment_label mo WHERE ml.moment_id = m.id) labelCount,
                (SELECT COUNT(*) FROM approval WHERE approval.moment_id = m.id) approvalCount,
                IF(COUNT(l.id), JSON_ARRAYAGG(
                        JSON_OBJECT('id', l.id, 'name', l.name)
                ), NULL) labels,
                (SELECT JSON_ARRAYAGG(
                    CONCAT('${BASE_URL}/moment/images/',file.filename)) 
                FROM file WHERE m.id = file.moment_id) images
            FROM moment m
            LEFT JOIN users u ON m.user_id = u.id
            LEFT JOIN moment_label ml ON m.id = ml.moment_id
            LEFT JOIN label l ON ml.label_id = l.id
            GROUP BY m.id
            LIMIT ?, ?;
        `;
        const [result] = await connection.execute(statement, [offset, size]);
        return result;
    }
    async getMomentById(id) {
        const statement = `
            SELECT 
                m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
                JSON_OBJECT('id', u.id, 'name', u.name, 'avatarUrl', u.avatar_url) author,
                (SELECT COUNT(*) FROM comment c WHERE c.moment_id = m.id) commentCount,
                (SELECT IF(COUNT(c.id), JSON_ARRAYAGG(
                        JSON_OBJECT('id', c.id, 'content', c.content, 'commentId', c.comment_id, 'createTime', c.createAt,
                         'user', JSON_OBJECT('id', cu.id, 'name', cu.name, 'avatarUrl', cu.avatar_url))
                ), NULL) FROM comment c LEFT JOIN users cu ON c.user_id = cu.id WHERE m.id = c.moment_id) comments,
                IF(COUNT(l.id), JSON_ARRAYAGG(
                        JSON_OBJECT('id', l.id, 'name', l.name)
                ), NULL) labels,
                (SELECT JSON_ARRAYAGG(
                    CONCAT('${BASE_URL}/moment/images/',file.filename)) 
                FROM file WHERE m.id = file.moment_id) images
            FROM moment m
            LEFT JOIN users u ON m.user_id = u.id
            LEFT JOIN moment_label ml ON ml.moment_id = m.id
            LEFT JOIN label l ON l.id = ml.label_id
            WHERE m.id = ?
            GROUP BY m.id;
        `;
        const [result] = await connection.execute(statement, [id]);
        return result;
    }

    async update(content, momentId) {
        const statement = `
            UPDATE moment SET content = ? WHERE id = ?;
        `;
        const [result] = await connection.execute(statement, [content, momentId]);
        return result;
    }
    async remove(momentId) {
        const statement = `
            DELETE FROM moment WHERE id = ?;
        `;
        const [result] = await connection.execute(statement, [momentId]);
        return result;
    }
    async hasLabel(momentId, labelId) {
        const statement = `
            SELECT * FROM moment_label WHERE moment_id = ? AND label_id = ?;
        `;
        const [result] = await connection.execute(statement, [momentId, labelId]);
        return result[0] ? true : false;
    }
    async addLabel(momentId, labelId) {
        const statement = `
            INSERT INTO moment_label (moment_id, label_id) VALUES (?, ?);
        `;
        const [result] = await connection.execute(statement, [momentId, labelId]);
        return result;
    }
    async isApproval(userId, momentId) {
        const statement = `
            SELECT * FROM approval WHERE user_id = ? AND moment_id = ?;
        `;
        const [result] = await connection.execute(statement, [userId, momentId]);
        return result[0] ? true : false;
    }
    async approval(userId, momentId) {
        const statement = `
            INSERT INTO approval (user_id, moment_id) VALUES (?, ?);
        `;
        const [result] = await connection.execute(statement, [userId, momentId]);
        return result;
    }
    async cancelApproval(userId, momentId) {
        const statement = `
            DELETE FROM approval WHERE user_id = ? AND moment_id = ?;
        `;
        const [result] = await connection.execute(statement, [userId, momentId]);
        return result;
    }
}

module.exports = new MomentService();