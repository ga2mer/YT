import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
    Text,
    View,
    TouchableWithoutFeedback,
    StyleSheet,
    Dimensions,
    ScrollView,
    Image,
    Slider
} from 'react-native';
import videoStore from '../../stores/VideoStore';
import {observer} from 'mobx-react/native';
import SeekBar from 'react-native-android-seekbar';
import LinearGradient from 'react-native-linear-gradient';
var toHHMMSS = (secs) => {
    var sec_num = parseInt(secs, 10)
    var hours = Math.floor(sec_num / 3600) % 24
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60
    return [hours, minutes, seconds].map(v => v < 10
        ? "0" + v
        : v).filter((v, i) => v !== "00" || i > 0).join(":")
}
@observer
export default class Controls extends Component {
    renderPlayButton = () => {
        switch (videoStore.state) {
            case 'BUFFER':
                return (<Icon name={'donut-large'} color={'white'} size={50}/>);
            case 'PLAYED':
                return (<Icon name={'pause'} color={'white'} size={50}/>);
            case 'PAUSED':
                return (<Icon name={'play-arrow'} color={'white'} size={50}/>);
            case 'ENDED':
                return (<Icon name={'replay'} color={'white'} size={50}/>);
            default:
                return (<Icon name={'donut-large'} color={'white'} size={50}/>);
        }
    }
    render() {
        if (!videoStore.showControls) {
            return false;
        }
        return (
            <View style={styles.absolute}>
                <View style={{
                    flex: 1,
                    flexDirection: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}>
                    <LinearGradient style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }} colors={['#000', 'transparent']}>
                        <Icon name={'keyboard-arrow-down'} color={'white'} size={30}/>
                        <TouchableWithoutFeedback onPress={videoStore.handlePressMore}>
                            <Icon name={'more-vert'} color={'white'} size={30}/>
                        </TouchableWithoutFeedback>
                    </LinearGradient>
                    <View style={{
                        alignSelf: 'center'
                    }}>
                        <TouchableWithoutFeedback onPress={videoStore.handlePressPause}>
                            {this.renderPlayButton()}
                        </TouchableWithoutFeedback>
                    </View>
                    <LinearGradient colors={['transparent', '#000']}>
                        <View style={{
                            alignItems: 'flex-end',
                            flexDirection: 'row'
                        }}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingLeft: 15,
                                paddingRight: 15,
                                paddingBottom: 5
                            }}><CurrentTime/><TotalTime/></View>
                            <View style={{
                                paddingRight: 5
                            }}><Icon name={'crop-free'} color={'white'} size={26}/></View>
                        </View>
                        <View><S/></View>
                    </LinearGradient>
                </View>
            </View>
        );
    }
}
@observer
class S extends Component {
    componentDidMount() {
        videoStore.seekbar = this.seekbar;
    }
    componentWillUnmount() {
        videoStore.seekbar = null;
    }
    render() {
        return (<SeekBar ref={(c) => this.seekbar = c} style={{
            flex: 1
        }} color={'#e62117'} onChange={videoStore.handleChange} secondaryProgress={videoStore.bufferDuration} onTrackingTouch={videoStore.handleTouch} max={videoStore.info.lengthSeconds} secondaryColor={'#336699'} thumbColor={'#e62117'} bgColor={'grey'}/>);
    }
}
@observer
class CurrentTime extends Component {
    render() {
        return (
            <Text style={{
                color: 'white'
            }}>{toHHMMSS(videoStore.currentTime)}</Text>
        );
    }
}
@observer
class TotalTime extends Component {
    render() {
        return (
            <Text style={{
                color: 'white'
            }}>{toHHMMSS(videoStore.info.lengthSeconds)}</Text>
        );
    }
}
const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: 'white'
    },
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    video: {
        alignSelf: 'stretch',
        height: 200
    },
    videoMini: {
        position: 'absolute',
        alignSelf: 'stretch',
        width: 200,
        height: 120
    }
});
