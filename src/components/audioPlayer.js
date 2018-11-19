import React from 'react';
import { View } from 'react-native';
import Sound from 'react-native-sound';
import {Icon, Text} from "native-base";

export default class audioPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            loading: true,
            playing: false,
            pause: false,
            duration: "",
            audioSeconds: 0,
            audioMinutes: 0,
            seconds: 0,
            minutes: 0,
        };
        this.audio= null;
        this.playingInterval = this.playingInterval.bind(this);
    }
    playingInterval(){
        this.audio.getCurrentTime((seconds) => {
            this.currentSecondsToTime(seconds);
            if(seconds >= this.state.duration){
                this.pause();
            }
        });
    }

    secondsToTime(total){
        let min = Math.floor(total / 60);
        let sec = Math.floor(total - (min * 60));
        this.setState({
           audioSeconds: sec,
           audioMinutes: min
        });
    }
    currentSecondsToTime(total){
        let min = Math.floor(total / 60);
        let sec = Math.floor(total - (min * 60));
        this.setState({
           seconds: sec,
           minutes: min
        });
    }
    componentDidMount(){
        Sound.setCategory('Playback');
        let uri= this.props.url;
        // let uri= "http://app.vgksa.com/storage/app/public/images/b10hefAUQ5wCFWu0z81t4rRDD4OXKCIkNl3zGGjX.wav";
        this.audio = new Sound(uri, Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                alert('Error, playing the record');
                return;
            }
            // loaded successfully
            this.secondsToTime(this.audio.getDuration());
            this.setState({
                duration: Math.floor(this.audio.getDuration()),
                loading: false
            })
        });
    }
    play(){
        if(this.state.loading){
            return false
        }
        this.setState({
            playing: true,
            pausing: false,
        });
        this.intervalHandle = setInterval(this.playingInterval, 500);
        this.audio.play((success) => {
            if (success) {
                console.log('successfully finished playing');
            } else {
                console.log('playback failed due to audio decoding errors');
                // reset the player to its uninitialized state (android only)
                // this is the only option to recover after an error occured and use the player again
                this.audio.reset();
            }
        });
    }
    pause(){
        if(this.state.loading){
            return false
        }
        this.setState({
            playing: false,
            pausing: true,
        });
        this.audio.pause();
        clearInterval(this.intervalHandle);
    }
    render() {
        return (
            <View style={{flex: 1, flexDirection: "row", paddingLeft: 5, paddingRight: 5, justifyContent: "center", alignItems: "center"}}>
                {
                    this.state.playing ?(
                        <Icon onPress={()=> this.pause()} type="MaterialCommunityIcons" name="pause-circle-outline" color="#ffffff"/>
                    ):(
                        <Icon onPress={()=> this.play()} type="MaterialCommunityIcons" name="play-circle-outline" color="#ffffff"/>
                    )
                }
                <Text style={{padding: 10}}>{(this.state.minutes < 10)? "0"+this.state.minutes : this.state.minutes}:{(this.state.seconds < 10)? "0"+this.state.seconds : this.state.seconds} | {(this.state.audioMinutes < 10)? "0"+this.state.audioMinutes : this.state.audioMinutes}:{(this.state.audioSeconds < 10)? "0"+this.state.audioSeconds : this.state.audioSeconds} </Text>
            </View>
        );
    }
}
