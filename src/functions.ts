import { Song } from "./api/schema";

export function numberWithSpaces(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function getSongName(x: Song) {
    var name = x.sub_name.length > 0 ? `${x.name} (${x.sub_name})` : `${x.name}`
    return `${name} - ${x.song_author_name}`;
}