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
import Video from 'react-native-video';
import videoStore from '../../stores/VideoStore';
import {observer} from 'mobx-react/native';
import HiddenArrow from '../HiddenArrow';
import Controls from './Controls';
@observer
export default class VideoComponent extends Component {
    state = {
        value: 0
    }
    componentDidMount() {
        videoStore.videoComponent = this.video;
    }
    componentWillUnmount() {
        videoStore.videoComponent = null;
    }
    orientationDidChange(orientation) {
        videoStore.handleOrientaion(orientation);
    }
    setTime(data) {
        console.log(args)
    }
    ch = (progress) => {
        this.setState({value: progress});
    }
    render() {
        var {height, width} = Dimensions.get('window');
        const min = Math.min(height, width);
        const max = Math.max(height, width);
        var viewStyle = styles.view;
        var videoStyle = styles.video;
        var resizeMode = "stretch";
        if (videoStore.mini) {
            viewStyle = styles.miniView;
            videoStyle = styles.videoMini;
        }
        if (videoStore.full) {
            if ((videoStore.orientation == 0 && videoStore.isVerticalVideo) || (videoStore.orientation == 1 && !videoStore.isVerticalVideo)) {
                videoStyle = {
                    flex: 1
                };
                resizeMode = 'stretch';
            } else if (videoStore.orientation == 1 && videoStore.isVerticalVideo) {
                videoStyle = {
                    flex: 1,
                    width: videoStore.width,
                    alignSelf: 'center'
                };
                resizeMode = 'stretch';
            } else if (videoStore.orientation == 0 && !videoStore.isVerticalVideo) {
                videoStyle = {
                    flex: 1,
                    width: min,
                    maxHeight: videoStore.height / (height / videoStore.height)
                }
                resizeMode = 'stretch';
            }
        }
        return (
            <View style={viewStyle}>
                <View style={videoStyle}>
                    <TouchableWithoutFeedback style={{
                        flex: 1
                    }} onPress={videoStore.handlePressVideo} onLongPress={videoStore.handleLongPressVideo} delayLongPress={3000}>
                        <Video ref={(c) => this.video = c} paused={videoStore.state == 'PAUSED'} onEnd={videoStore.handleEnd} onProgress={videoStore.handleProgress} onLoad={videoStore.handleLoad} source={{
                            uri: videoStore.url
                        }} style={videoStyle} resizeMode={resizeMode}/>
                    </TouchableWithoutFeedback>
                    {!videoStore.mini && <Controls/>}
                </View>
                <Text>{videoStore.state}</Text>
                {!videoStore.mini && !videoStore.full && <ScrollView>
                    <Info/>
                </ScrollView>}
            </View>
        );
    }
}

@observer
class Info extends Component {
    render() {
        const {info} = videoStore;
        var title = <Text style={styles.title}>{info.title}</Text>;
        var under = <Text>{info.views}</Text>;
        return (
            <View style={styles.info}>
                <HiddenArrow title={title} under={under}>
                    <Text>{info.published}{' · '}{info.description}</Text>
                </HiddenArrow>
                <View style={styles.likeView}>
                    <View style={styles.likeView}>
                        <Icon name="thumb-up" size={24}/>
                        <Text style={styles.likeText}>{info.likes}</Text>
                    </View>
                    <View style={styles.likeView} paddingLeft={15}>
                        <Icon name="thumb-down" size={24}/>
                        <Text style={styles.likeText}>{info.dislikes}</Text>
                    </View>
                </View>
            </View>
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
    miniView: {
        flex: 1,
        position: 'absolute',
        bottom: 10,
        right: 10,
        alignSelf: 'stretch',
        width: 200,
        height: 120
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
    },
    info: {
        padding: 15
    },
    title: {
        marginRight: 20,
        color: 'black',
        fontSize: 22
    },
    likeView: {
        flexDirection: 'row'
    },
    likeText: {
        fontFamily: 'Arial',
        fontSize: 14,
        marginLeft: 4,
        alignSelf: 'center'
    }
});
