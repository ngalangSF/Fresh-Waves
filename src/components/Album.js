import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';
import './styleAlbum.css';

class Album extends Component {
  constructor(props) {
    super(props);

    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });

    this.state = {
      album: album,
      currentSong: album.songs[0],
      currentTime: 0,
      duration: album.songs[0].duration,
      isPlaying: false,
      isHovered: null,
      currentVolume: 0
    };

    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;

  }

  play() {
    this.audioElement.play();
    this.setState({ isPlaying: true });
  }

  pause() {
  this.audioElement.pause();
  this.setState({ isPlaying: false });
  }

  componentDidMount() {
      this.eventListeners = {
        timeupdate: e => {
          this.setState({ currentTime: this.audioElement.currentTime });
        },
        durationchange: e => {
          this.setState({ duration: this.audioElement.duration });
        },
        volumeupdate: e => {
          this.setState({ volume: this.audioElement.currentVolume});
        }
      };
      this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
      this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
      this.audioElement.addEventListener('volumeupdate', this.eventListeners.volumeupdate);
    }

    componentWillUnmount() {
      this.audioElement.src = null;
      this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
      this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
      this.audioElement.removeEventListener('volumeupdate', this.eventListeners.volumeupdate);
    }

  setSong(song) {
  this.audioElement.src = song.audioSrc;
  this.setState({ currentSong: song });
  }


  handleSongClick(song) {
    const isSameSong = this.state.currentSong === song;
    if (this.state.isPlaying && isSameSong) {
      this.pause();
    } else {
      if (!isSameSong) { this.setSong(song); }
      this.play();
    }
  }

  handlePrevClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.max(0, currentIndex - 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
  }

  handleNextClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.min(Math.max(0, currentIndex + 1),(this.state.album.songs.length-1));
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
  }

  handleSongHover(song){
    this.setState({
      isHovered: song,
      isPlaying: (this.state.isPlaying ? true : false)
    })
  }

  handleIcon(song, index){
    if (this.state.currentSong === song && this.state.isPlaying) {
        return <span className="ion ion-pause"></span>
    } else if (this.state.isHovered === song && !this.state.isPlaying) {
        return <span className="ion ion-play"></span>
    } else {
        return index + 1 + '. ';
    }
  }

  handleTimeChange(e) {
    const newTime = this.audioElement.duration * e.target.value;
    this.audioElement.currentTime = newTime;
    this.setState({ currentTime: newTime });
  }

  handleVolumeChange(e) {
    const newVolume = e.target.value / 100;
    this.audioElement.volume = newVolume;
    this.setState({ currentVolume: newVolume});
  }

  formatTime(time) {
    var minutes = Math.floor(time / 60);
    var seconds = Math.floor(time % 60);
    var songTime = minutes + ':' + seconds;
    var lessThanSeconds = ":0" + seconds;
      if (seconds > 9) {
        return songTime;
      } else if (seconds <= 9){
        return minutes + lessThanSeconds;
      } else {
        return "-:--";
      }
  }


  render() {
    return (
      <section className="album">
        <section id="album-info">
          <img id="album-cover-art" src={this.state.album.albumCover}  alt={this.state.album.title}/>
          <div className="album-details">
            <h1 id="album-title">{this.state.album.title}</h1>
            <h2 className="artist">{this.state.album.artist}</h2>
            <div id="release-info">{this.state.album.releaseInfo}</div>
          </div>
        </section>
        <table id="song-list" align="center">
          <colgroup>
            <col id="song-number-column" />
            <col id="song-title-column" />
            <col id="song-duration-column" />
          </colgroup>
          <tbody>
              {this.state.album.songs.map((song,index) =>
              <tr key={index}
                  onClick={() => this.handleSongClick(song)}
                  onMouseEnter={() => this.handleSongHover(song)}
                  onMouseLeave={() => this.handleSongHover(null)}
              >
                <td>
                  {this.handleIcon(song, index)}
                </td>
                <td className= "song-title">{song.title}</td>
                <td className= "song-duration">{this.formatTime(song.duration)}</td>
              </tr>
            )}
          </tbody>
        </table>
        <PlayerBar
          isPlaying={this.state.isPlaying}
          currentSong={this.state.currentSong}
          currentTime={this.audioElement.currentTime}
          duration={this.audioElement.duration}
          currentVolume={this.audioElement.currentVolume}
          handleSongClick={() => this.handleSongClick(this.state.currentSong)}
          handlePrevClick={() => this.handlePrevClick()}
          handleNextClick={() => this.handleNextClick()}
          handleTimeChange={(e) => this.handleTimeChange(e)}
          handleVolumeChange={(e) => this.handleVolumeChange(e)}
          formatTime={(time)=> this.formatTime(time)}
        />
      </section>
    );
  }
}

export default Album;
