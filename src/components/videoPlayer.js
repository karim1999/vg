import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import VideoPlayer from "react-native-video-controls";

export default class videoPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            isFullscreen: this.props.isFullscreen || false,
            modalVisible: false
        };
    }
    componentDidMount(){
    }
    setModalVisible() {
        this.setState({modalVisible: !this.state.modalVisible});
    }
    render() {
        return (
            <View>
                <VideoPlayer
                    style={{height: 250}}
                    paused={true}
                    toggleResizeModeOnFullscreen={false}
                    onEnterFullscreen={()=> this.setModalVisible()}
                    onExitFullscreen={()=> this.setModalVisible()}
                    // fullscreen={true}
                    source={{ uri: this.props.source }}
                    navigator={ this.props.navigation }
                />
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                    }}>
                    <VideoPlayer
                        disableFullscreen={true}
                        onBack={()=> this.setModalVisible()}
                        onEnterFullscreen={()=> this.setModalVisible()}
                        onExitFullscreen={()=> this.setModalVisible()}
                        paused={true}
                        source={{ uri: this.props.source }}
                        navigator={ this.props.navigation }
                    />
                </Modal>
            </View>
        );
    }
}
const styles = {
    player: StyleSheet.create({
        fullscreen: {
            backgroundColor: "#f00",
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
        },
        embedded: {
            // Style in a way that it's embedded into the page how you have it
            position: 'relative',
            height: 200,
        }
    })
}