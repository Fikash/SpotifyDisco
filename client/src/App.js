import React from 'react';
import './App.css';
import Spotify from 'spotify-web-api-js';

const spotifyWebAPI = new Spotify()

class App extends React.Component {
  constructor(props) {
    super(props);
    const params = this.getHashParams();

    this.state = {
      loggedIn: params.access_token ? true : false,
      nowPlaying: {
        name: 'Not Checked',
        image: undefined,
      },
      topTrack: undefined,
      topTracksArray: undefined
    }

    if (params.access_token) {
      spotifyWebAPI.setAccessToken(params.access_token)
    }
  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  getTopTracks() {
    spotifyWebAPI.getMyTopTracks()
      .then((response) => {
        let topArrayImages = [];
        for (let i = 0; i < 5; i++) {
          topArrayImages.push(response.items[i].album.images[1].url)
        }
        this.setState({
          topTracksArray: topArrayImages.slice(0),
          topTrack: response.items[0].album.images[1].url
        });
      })

  }

  getNowPlaying() {
    spotifyWebAPI.getMyCurrentPlaybackState()
      .then((response) => {
        this.setState({
          nowPlaying: {
            name: response.item.name,
            image: response.item.album.images[0].url
          }
        })
      })
  }

  render() {
    return (
      <div className="App">

        <NowPlaying nowPlaying={this.state.nowPlaying} />

        <div id="buttonDiv">
          <button onClick={() => this.getNowPlaying()} >
            Check Now Playing
         </button>

          <button onClick={() => this.getTopTracks()} >
            Top Tracks
         </button>
          <TopTracksGrid topTracksArray={this.state.topTracksArray} />
        </div>
      </div>
    );
  }
}

const TopTracksGrid = (topTracksArray) => {
  if (topTracksArray.topTracksArray != undefined) {
    let keyHolder = 0;
    return (
      <div style={{ display: "grid", gridTemplateColumns: "20% 20% 20% 20% 20%", gridTemplateRows: "25%" }}>
        {topTracksArray.topTracksArray.map(eachTrack => (
          <img src={eachTrack} key={++keyHolder} style={{ width: "95%" }} class="topTrackImages" />
        ))}
      </div>
    )
  } else {
    return null
  }
}

const NowPlaying = (nowPlaying) => {

  if (nowPlaying.nowPlaying.image != undefined) {
    return (
      <div id="albumDiv">
        <img src={nowPlaying.nowPlaying.image} style={{ width: '100%' }} />
        <div style={{ padding: 'auto' }}> Now Playing:  {nowPlaying.nowPlaying.name} </div>
      </div>
    )
  } else {
    return null;
  }
}


export default App;
