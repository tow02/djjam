export interface Artist {
  id?: string;
  name: string;
  url: string;
  picture?: string;
  bio?: string;
  haveImage?: boolean;
  group?: any;
}

export interface ArtistUIItem {
  artist: Artist;
  isSelected: boolean;
  isPrimary: boolean;
}

export class ArtistHelper {
  constructor(public artists: Array<Artist>) {}

  search(name: string) {
    return this.artists.filter(
      (artist) => artist.name.toLowerCase().indexOf(name.toLowerCase()) >= 0,
    );
  }
}
