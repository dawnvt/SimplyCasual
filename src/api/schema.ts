import { Field, ObjectType, InputType, InterfaceType, Arg, Int } from "type-graphql";
import db from "../db";
import { SongResolver } from "./resolver";

@ObjectType()
export class User {
    @Field()
    id: string;
    @Field()
    name: string;
    @Field()
    img: string;
    @Field()
    created_at: Date;
    @Field()
    updated_at: Date;
}

type Difficulties = "Easy" | "Normal" | "Hard" | "Expert" | "ExpertPlus";

type Characteristics = "Standard" | "OneSaber" | "NoArrows" | "_90Degree" | "_360Degree" | "Lightshow" | "Lawless";

@ObjectType()
export class ParitySummary {
    @Field()
    errors: number;
    @Field()
    warns: number;
    @Field()
    resets: number;
}

@ObjectType()
export class Diff {
    @Field()
    njs: number;
    @Field()
    offset: number;
    @Field()
    notes: number;
    @Field()
    bombs: number;
    @Field()
    obstacles: number;
    @Field()
    nps: number;
    @Field()
    length: number;
    @Field()
    characteristic: Characteristics;
    @Field()
    difficulty: Difficulties;
    @Field()
    events: number;
    @Field()
    chroma: boolean;
    @Field()
    me: boolean;
    @Field()
    ne: boolean;
    @Field()
    cinema: boolean;
    @Field()
    seconds: number;
    @Field()
    paritySummary: ParitySummary;
    @Field()
    stars?: number;
}

@ObjectType()
export class Song {
    @Field()
    id: string;
    @Field()
    key: string;
    @Field()
    name: string;
    @Field()
    sub_name: string;
    @Field()
    cover: string;
    @Field()
    hash: string;
    @Field()
    song_author_name: string;
    @Field()
    level_author_name: string;
    @Field(type => [Diff])
    difficulties: Diff[] | string;
    @Field()
    created_at: Date;
    @Field()
    updated_at: Date;
    @Field(type => [Score])
    async scores(@Arg('skip', type => Int, { nullable: true, defaultValue: 0 }) skip: number, @Arg('take', type => Int, { defaultValue: 25 }) take: number) {
        return await db('scores').where('song_id', this.id).limit(take <= 100 ? take >= 10 ? take : 10 : 100).offset(skip);
    }
}

@ObjectType()
export class Score {
    @Field()
    id: string;
    @Field()
    difficulty: string;
    @Field()
    percent: number;
    @Field()
    score: number;
    @Field()
    modifiers: number;
    @Field()
    misses: number;
    @Field()
    bad_cuts: number;
    @Field()
    hmd: string;
    @Field()
    user_id: string;
    @Field()
    song_id: string;
    @Field()
    created_at: Date;
    @Field()
    updated_at: Date;
    @Field(type => User)
    async user() {
        return await db('users').where('id', this.user_id).first();
    }
    @Field(type => Song)
    async song() {
        return await db('songs').where('id', this.song_id).first();
    }
}

