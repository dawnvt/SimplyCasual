import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { PutRoute } from "../router";
import config from "../config.json";
import db from "../db";
import { Characteristic, Song, Score, User } from "knex/types/tables";
import fetch from "node-fetch";
import { getSongName, numberWithSpaces } from "../functions";

export class Upload {
    @PutRoute("upload")
    async uploadScore(req: Request<ParamsDictionary, any, IUpload>, res: Response) {
        async function finalUpload(req: Request<ParamsDictionary, any, IUpload>, res: Response, user: User, song: Song) {
            var score = await db.select(['id']).from<Score>('scores').where({ user_id: user.id, song_id: song.id, difficulty: req.body.difficulty }).first() as Score;
            if (!score) {
                await db('scores').insert({ user_id: user.id, song_id: song.id, difficulty: req.body.difficulty, bad_cuts: req.body.bad_cuts, hmd: req.body.hmd, misses: req.body.misses, modifiers: req.body.modifiers, percent: req.body.accuracy, score: req.body.score });
            }
            else {
                await db('scores').where({ user_id: user.id, song_id: song.id, difficulty: req.body.difficulty, id: score.id }).update({ bad_cuts: req.body.bad_cuts, hmd: req.body.hmd, misses: req.body.misses, modifiers: req.body.modifiers, percent: req.body.accuracy, score: req.body.score });
            }
            if (config.discordHook) {
                score = await db.select(['id']).from<Score>('scores').where({ user_id: user.id, song_id: song.id, difficulty: req.body.difficulty }).first() as Score;
                var rank = parseInt((await db.count('*').from(function () {
                    this.from('scores').select('*').rowNumber('row', function () {
                        this.orderBy([{ order: "desc", column: "score" }, { column: "updated_at", order: "asc" }]);
                    }).as('sq1');
                }).innerJoin(function () {
                    this.from('scores').select('*').rowNumber('row', function () {
                        this.orderBy([{ order: "desc", column: "score" }, { column: "updated_at", order: "asc" }]);
                    }).as('sq2');
                }, function () {
                    this.on('sq2.row', '<', 'sq1.row').andOn('sq1.id', '=', db.raw("'" + score.id + "'"));
                }).first()).count as string) + 1;
                var hookObject = {
                    embeds: [
                        {
                            title: `New score set on ${getSongName(song)}`,
                            description: `[Leaderboard](https://localhost:3000/leaderboard/${song.id}?diff=${req.body.difficulty})\n\n[${user.name}](https://localhost:3000/user/${user.id}) got rank ${rank} with score:`,
                            fields: [
                                {
                                    name: `Score`,
                                    value: `${numberWithSpaces(req.body.score)}`,
                                    inline: true
                                },
                                {
                                    name: `Accuracy`,
                                    value: `${req.body.accuracy}%`,
                                    inline: true
                                },
                                {
                                    name: `Difficulty`,
                                    value: `${req.body.difficulty}`,
                                    inline: true
                                }
                            ],
                            color: 4980908,
                            thumbnail: {
                                url: song.cover
                            }
                        }
                    ]
                };
                fetch("https://discord.com/api/webhooks/" + config.discordHook, { headers: { "Content-Type": "application/json" }, body: JSON.stringify(hookObject), method: "POST" });
            }
            res.send();
        }

        if (req.get("Authorization") === "Token " + config.secret) {
            try {
                var user = await db.select(['id', 'name']).from<User>('users').where('id', req.body.user_id).first();
                if (!user)
                    await db('users').insert({ id: req.body.user_id, name: req.body.user_name });
                var song = await db.select().from<Song>('songs').where('hash', req.body.hash).first() as Song;
                if (!song) {
                    var songInfoReq = await fetch(`https://beatsaver.com/api/maps/by-hash/${req.body.hash}`, { headers: { "User-Agent": "SimplyCasual/1.0.0" } });
                    var songInfo = await songInfoReq.json() as BeatMapData;
                    await db('songs').insert({ difficulties: JSON.stringify(songInfo.metadata.characteristics), cover: "https://beatsaver.com" + songInfo.coverURL, hash: req.body.hash, song_author_name: songInfo.metadata.songAuthorName, level_author_name: songInfo.metadata.levelAuthorName, key: songInfo.key, sub_name: songInfo.metadata.songSubName, name: songInfo.metadata.songName });
                    song = await db.select().from<Song>('songs').where('hash', req.body.hash).first();
                    await finalUpload(req, res, user, song);
                }
                else {
                    await finalUpload(req, res, user, song);
                }
            }
            catch (e: any) {
                console.log(e);
                res.status(500).send();
            }
        }
        else {
            res.status(403).send();
        }
    }
}

interface IUpload {
    user_id: string;
    user_name: string;
    score: number;
    difficulty: string;
    hash: string;
    accuracy: number;
    misses: number;
    bad_cuts: number;
    hmd: string;
    modifiers: number;
}

interface Metadata {
    characteristics: Characteristic[];
    levelAuthorName: string;
    songAuthorName: string;
    songName: string;
    songSubName: string;
}

interface BeatMapData {
    metadata: Metadata;
    key: string;
    name: string;
    uploader: { username: string };
    hash: string;
    coverURL: string;
}