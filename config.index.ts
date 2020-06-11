import {writeFile} from 'fs';
const targetPath = './src/environments/environment.prod.ts';
const envConfigFile = `export const environment = {
    production: true,
    version:"0.1",
    client_id:"${process.env.SPOTIFY_CLIENT_ID}",
    host_url:"https://djjam-staging.web.app",
    search_url:"https://djjam.app/queryTrack",
    api_url:"https://us-central1-djjam-d7ae7.cloudfunctions.net",
    default_suffix_search:\`exclude "notswing,uncheck"\`,
    search_size:20,
    firebase:{
      apiKey: "${process.env.FIREBASE_API_KEY}",
      authDomain: "djjam-d7ae7.firebaseapp.com",
      databaseURL: "https://djjam-d7ae7.firebaseio.com",
      projectId: "djjam-d7ae7",
      storageBucket: "djjam-d7ae7.appspot.com",
      messagingSenderId: "178432693429"
    },
    localstorage:{
      spotify_access_token:"SPOTFY_JAM_TOKEN",
      refresh_token:"SPOTIFY_REFRESH_TOKEN",
      spotify_expire_in:"SPOTIFY_EXPIRE_IN",
      spotify_redirect_url: "SPOTIFY_REDIRECT",
      spotify_age: "SPOTIFY_AGE",
      is_playing: "DJJAM_IS_PLAYING",
      playing_artist: "DJJAM_PLAYING_ARITST",
      playing_song: "DJJAM_PLAYING_SONG", 
      playing_url: "DJJAM_PLAYING_URL",
      playing_spotify_url: "DJJAM_PLAYING_ID",
      playlist_storage:"DJJAM_PLAYLIST"
    },
    spotify_token_age: 3600000,
    update_token_age:1800000,
    autotag:{
      scale : 100,
      nonvocal_ratio: 5,
      energetic: 50,
      valence : 70
    },
    bpmRanges:[
      {min:45, max:75},
      {min:75, max:105},
      {min:105, max:135},
      {min:135, max:165 },
      {min:165, max:195 },
      {min:195, max:225 },
      {min:225, max:255 }
    ],
    analytics:{
      defaultExcludeTags:['afterparty','shimsham'],
      rangeNames:[
        {name: "Super Slow", bpmMin:0, bpmMax:105 },
        {name: "Slow" , bpmMin:105, bpmMax:135 },
        {name: "Medium" , bpmMin:135, bpmMax:165 },
        {name: "Fast" , bpmMin:165, bpmMax:195 },
        {name: "Jam" , bpmMin:195, bpmMax:400 },
      ],
      tagLabels:[
        { name:"ONLY INSTRUMENT", tag_key:"nonvocal", progress_bar_type:"warning" },
        { name:"GOOD FEELING", tag_key:"valence", progress_bar_type:"info", option_text:"valence" },
        { name:"ENERGETIC", tag_key:"energetic", progress_bar_type:"success" },
        { name:"NOT ACTUALLY SWING", tag_key:"notswing", progress_bar_type:"danger", option_text:"manual" },
        { name:"NOT PROCESS YET", tag_key:"uncheck", progress_bar_type:"danger", option_text:"uncheck"},
      ]
    },
    recapcha_key:"${process.env.RECAPCHA_KEY}",
    settings:{
      recent_played_max:5,
      preference_tag_ui:{
        colMax:4,
        rowMax:4
      },
      upload_max:{
        "0":99999999,
        "1":10000,
        "5":10000,
        "10":200,
        "20":0
      },
      tag_label_max: 5
    },
    haveAccess:{
      "10":{
        spotify:{
          read:true,
          write:true
        },
        track:{
          read:true,
          write:true
        }
      },
      "20":{
        spotify:{
          read:true,
          write:false
        },
        track:{
          read:true,
          write:false
        }
      }
    },
    tag_types:[
      {
        name: "Music",
        default_tag_name: "Swing",
        description:"Seperate type of music by in genre. Like Swing, Blues, Soul, Rock, Gospel, Rhythm and Blues, Doowop, Pop or Other. Some music could have more than one genre too.",
        tags:{
          "blues": "Blues",
          "soul": "Soul",
          "rock": "Rock",
          "gospel": "Gospel",
          "r&b": "Rhythm and Blues",
          "doowop": "Doowop",
          "pop": "Pop",
          "notswing": "Other"
        }
      },
      {
        name: "Dance",
        description:"Seperate type of music by dancing. Like Lindy hop, Balboa, Charleston, Blues, Charleston or Other.  Some music could have more than one dancing and sometime it have not been tagged yet",
        default_tag_name: "Lindy Hop",
        tags: {
          "balboa": "Balboa",
          "boogiewoogie": "Boogie Woogie",
          "blues": "Blues",
          "charleston": "Charleston",
          "notswing": "Other"
        }
      },
      {
        name: "Artist",
        description:"Seperate type of track by era of artist. Either Classic (20s - 50s), Modern (80s - now) or Other(50s - 80s)",
        default_tag_name: "50s - 80s",
        tags: {
          "modern": "80s - Now",
          "classic": "20s - 50s"
        }
      }
    ],
    errorMessages:{
      'auth/user-not-found':"This user has not signup",
      'auth/wrong-password':"Credential is not correct please retype again"
    },
    statusMessaages:{
      sending_reset_password:"Sending a reset password to your email",
      done_sent:"Done sending a reset email"
    }
    ,
    hideFooterPaths:[
      '/',
      '/battle',
      '/battle/vote',
    ]
  };
  `;
  writeFile(targetPath, envConfigFile, 'utf8', (err) => {
    if (err) {
      return console.log(err);
    }
  });