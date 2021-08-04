import { Query, Resolver, Arg } from "type-graphql";
import db from "../db";
import { User, Song, Score } from "./schema";

@Resolver((of) => User)
export class UserResolver {
    @Query((returns) => User)
    async getUser(@Arg('id') id: string) {
        return await db('users').where({ id: id }).first();
    }
}

@Resolver((of) => Song)
export class SongResolver {
    @Query((returns) => Song)
    async getSongFromHash(@Arg('hash') hash: string) {
        return await db('songs').where({ hash: hash }).first();
    }
    @Query((returns) => Song)
    async getSongFromKey(@Arg('key') key: string) {
        return await db('songs').where({ key: key }).first();
    }
    @Query((returns) => Song)
    async getSong(@Arg('id') id: string) {
        return await db('songs').where({ id: id }).first();
    }
}

@Resolver((of) => Score)
export class ScoreResolver {
    @Query((returns) => [Score])
    async getScores(@Arg('song_id') song_id: string, @Arg('user_ids', type => [String], { nullable: true, defaultValue: [] }) user_ids: string[]) {
        var query = db('scores').where('song_id', song_id)
        if (user_ids.length > 0) {
            return await query.whereIn('user_id', user_ids);
        }
        else {
            return await query;
        }
    }
}