import knex, { Knex } from 'knex';
import config from './config.json';

const db = knex({
    connection: config.db,
    client: 'pg',
    debug: true,
    migrations: {
        tableName: 'migrations'
    }
});

export default db;

declare module 'knex/types/tables' {
    interface User {
        id: string;
        name: string;
        img: string;
        created_at: Date;
        updated_at: Date;
    }

    interface Difficulty {
        duration: number;
        length: number;
        njs: number;
        njsOffset: number;
        bombs: number;
        notes: number;
        obstacles: number;
    }

    type Difficulties = "easy" | "normal" | "hard" | "expert" | "expertPlus";

    interface Characteristic {
        difficulties: { [id in Difficulties]: Difficulty };
        name: string;
    }

    interface Song {
        id: string;
        key: string;
        name: string;
        sub_name: string;
        cover: string;
        hash: string;
        song_author_name: string;
        level_author_name: string;
        difficulties: Characteristic[];
        created_at: Date;
        updated_at: Date;
    }

    interface Score {
        id: string;
        difficulty: string;
        percent: number;
        score: number;
        modifiers: number;
        misses: number;
        bad_cuts: number;
        hmd: string;
        user_id: string;
        song_id: string;
        created_at: Date;
        updated_at: Date;
    }

    interface Tables {
        users: User;
        scores: Score;
        songs: Song;

        users_composite: Knex.CompositeTableType<User, Pick<User, 'name'> & Partial<Pick<User, 'created_at' | 'updated_at'>>, Partial<Omit<User, 'id'>>>
        scores_composite: Knex.CompositeTableType<Score, Pick<Score, 'user_id'> & Partial<Pick<Score, 'created_at' | 'updated_at'>>, Partial<Omit<Score, 'id'>>>
        songs_composite: Knex.CompositeTableType<User, Pick<User, 'name'> & Partial<Pick<User, 'created_at' | 'updated_at'>>, Partial<Omit<User, 'id'>>>
    }
}