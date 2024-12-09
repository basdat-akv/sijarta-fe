// path : sijarta-fe/src/db/models/user.ts

import { User, Convert } from '../types/user';
import { BaseModel } from '../model';
import pool from '../db';

export class UserModel extends BaseModel<User> {
    constructor() {
        super('"user"', Convert);
    }

    async getUserByPhone(noHP: string): Promise<User | null> {
        const client = await pool.connect();
        const { rows } = await client.query(`
            SELECT * FROM ${this.table}
            WHERE no_hp = '${noHP}'
        `);
        client.release();
        return (this.converter.toTypes(JSON.stringify(rows)) as User[])[0] ?? null;
    }
}