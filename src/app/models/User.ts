export interface UserRecentPlaylist{
    name:string,
    image:any,
    spotify_user_id:string,
    spotify_playlist_id:string
}

export interface UserData{
    name?:string,
    level:number,
    preference_tags:Array<string>,
    preference_tag_label:Array<{
        name:string,
        progress_bar_type:string,
        tag_key:string,
        option_text?:string
    }>,
    dancing_scene?:string,
    is_dancer?:boolean,
    is_teacher?:boolean,
    exclude_tags?:Array<string>,
    recent_playlists?:Array<UserRecentPlaylist>
    upload_limit?:number;
}

