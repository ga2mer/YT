import {observable, autorun, action} from 'mobx';
import axios from 'axios';
import {getFormat, getFormats, getFormatsString, getBestFormat, getByITAG, makeJSON} from '../lib/utils.js';
import {BackAndroid} from 'react-native';
import Orientation from 'react-native-orientation';
import debounce from 'lodash/debounce';
import uniq from 'lodash/uniq';
import KeepScreenOn from 'react-native-keep-screen-on'
import BottomDialog from 'react-native-bottomdialog';
var obj = {
    title: '',
    views: '',
    description: '',
    commentsCount: 0,
    lengthSeconds: 0,
    thumbnail: '',
    published: '',
    likes: 0,
    dislikes: 0
};
class VideoStore {
    videoComponent = null;
    seekbar = null;
    @observable url = '';
    @observable enable = false;
    @observable info = obj;
    @observable mini = false;
    @observable full = false;
    @observable orientation = 0;
    @observable height = 0;
    @observable width = 0;
    @observable isVerticalVideo = false;
    @observable bufferDuration = 0;
    @observable currentTime = 0;
    @observable isPressed = false;
    @observable state = 'BUFFER';
    @observable formats = [];
    @observable showControls = false;
    constructor() {
        autorun(() => {
            if (this.enable) {
                console.log('enableBack');
                BackAndroid.addEventListener('hardwareBackPress', this.backListener);
            } else {
                console.log('disableBack');
                BackAndroid.removeEventListener('hardwareBackPress', this.backListener);
            }
        });
        Orientation.addOrientationListener(this.handleOrientaion);
        this.handleOrientaion(Orientation.getInitialOrientation());
    }

    handleChange = ({progress, fromUser}) => {
        if (this.state == 'ENDED') {
            this.state = 'PLAYED';
        }
        this.currentTime = Math.round(progress);
    }
    @action
    handleTouch = (pressed) => {
        this.isPressed = pressed;
        if (!pressed) {
            this.videoComponent.seek(this.currentTime);
        }
    }
    @action
    handleProgress = ({playableDuration, currentTime} = {}) => {
        if (this.state == 'ENDED') {
            this.state = 'PLAYED';
        }
        this.bufferDuration = Math.round(playableDuration);
        if (!this.isPressed && this.seekbar) {
            this.seekbar.setProgress(currentTime);
            this.currentTime = Math.round(currentTime);
        }
    }
    @action
    handleOrientaion = (orientation) => {
        this.orientation = orientation == 'PORTRAIT'
            ? 0
            : 1;
        if (this.orientation == 1) {
            this.full = true;
        } else {
            this.full = false;
        }
    }
    @action
    handlePressPause = () => {
        if (this.state == 'PLAYED') {
            this.state = 'PAUSED';
        } else if (this.state == 'PAUSED') {
            this.state = 'PLAYED';
        } else if (this.state == 'ENDED') {
            this.videoComponent.seek(0);
        }
    }
    @action
    handleEnd = () => {
        this.state = 'ENDED';
    }
    handlePressMore = () => {
        BottomDialog.show({
            items: ["Качество"]
        }, () => {
            if (this.formats.length > 0) {
                var qualities = getFormatsString(this.formats);
                BottomDialog.show({
                    title: 'Выберите качество',
                    items: qualities
                }, (selected) => {
                    var f = qualities[selected];
                    var {url} = getFormat(this.formats, f);
                    this.url = url;
                    //this.videoComponent.seek(this.currentTime);
                });
            }
        });
    }
    @action
    handlePressVideo = () => {
        if (this.mini) {
            this.mini = false;
            if (this.orientation == 1) {
                this.full = true;
            }
        } else {
            this.showControls = !this.showControls;
        }
    }
    @action
    handleLongPressVideo = () => {
        console.log('long presss');
        if (this.mini) {
            this.url = '';
            this.mini = false;
            this.full = false;
            this.enable = false;
            this.info = obj;
            KeepScreenOn.setKeepScreenOn(false);
            this.formats.length = 0;
            this.currentTime = 0;
        } else if (!this.full) {
            this.full = true;
            this.main = false;
        }
    }
    @action
    handleLoad = (ev) => {
        if (this.currentTime > 0) {
            this.videoComponent.seek(this.currentTime);
        }
        this.state = 'PLAYED';
        this.width = ev.naturalSize.width;
        this.height = ev.naturalSize.height;
        this.isVerticalVideo = ev.naturalSize.orientation == 'portrait';
    }
    backListener = () => {
        if (!this.full && !this.mini) {
            this.mini = true;
            console.log('mini');
        }
        if (this.full) {
            this.full = false;
            if (this.orientation == 1) {
                this.mini = true;
            }
        }
        return true;
    }
    @action
    setVideo = (id) => {
        if (this.orientation == 1) {
            this.full = true;
        }
        this.enable = true;
        KeepScreenOn.setKeepScreenOn(true);
        getFormats(id).then((fmts) => {
            var {itag, url} = getBestFormat(fmts);
            this.url = url;
            this.formats = fmts;
        });
        this.getVideoInfo(id);
    }
    @action
    getVideoInfo = (id) => {
        axios.get(`https://m.youtube.com/watch?ajax=1&layout=mobile&sts=17050&tsp=1&utcoffset=180&v=${id}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.76 Mobile Safari/537.36'
            }
        }).then((res) => {
            var obj = makeJSON(res.data);
            var content = obj.content.video_main_content.contents[0];
            var title = content.title.runs[0].text;
            var views = content.view_count_text.runs[0].text;
            var description = content.description.runs[0].text;
            var commentsCount = obj.content.video.comments_count;
            var lengthSeconds = obj.content.video.length_seconds;
            var thumbnail = 'https:' + obj.content.video.thumbnail_for_watch;
            var published = content.date_text.runs[0].text;
            var likes = content.like_button.like_count;
            var dislikes = content.like_button.dislike_count;
            this.info = {
                title,
                views,
                description,
                commentsCount,
                lengthSeconds,
                thumbnail,
                published,
                likes,
                dislikes
            };
        });
    }
}
export default new VideoStore()
