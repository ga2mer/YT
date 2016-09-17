import {observable, action, toJS} from 'mobx';
import RNFetchBlob from 'react-native-fetch-blob';
import userStore from './UserStore';
import appState from './AppState';
import {makeJSON} from '../lib/utils';
import find from 'lodash/find';
import get from 'lodash/get';
import {ListView} from 'react-native';
export default class ChannelStore {
    @observable title = '';
    @observable videos = {
        listData: null,
        list: null,
        loading: false,
        endReached: false
    }
    @observable about = {
        description: '',
        loaded: true
    }
    @observable username;
    ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
    });
    constructor(username) {
        this.username = username;
        this.loadData();
    }
    parseVideo = (video) => {
        var title = video.title.runs[0].text;
        var id = video.endpoint.url.replace('/watch?v=', '');
        var thumbnail = `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
        var views = video.view_count.runs.length > 0 && video.view_count.runs[0].text || 'запланированый стрим';
        var length = video.length.runs.length > 0 && video.length.runs[0].text || '';
        return {title, thumbnail, id, views, length};
    }
    handleSetPage = (position) => {
        if (position == 1 && !this.videos.listData && !this.videos.loading) {
            this.loadVideos();
        } else if (position == 2 && this.about.loaded) {
            this.loadAbout();
        }
    }
    @action
    loadVideos = () => {
        this.videos.loading = true;
        var cookie = 'VISITOR_INFO1_LIVE=WgjaHAcmdsg;'
        if (userStore.isAuth) {
            cookie += `SID=${userStore.SID}; SSID=${userStore.SSID}`
        }
        var url = `https://m.youtube.com/user/${this.username}/videos?ajax=1&layout=mobile&tsp=1&utcoffset=180`;
        RNFetchBlob.fetch('GET', url, {
            'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.76 Mobile Safari/537.36',
            cookie
        }).then((res) => res.text()).then((response) => {
            var obj = makeJSON(response);
            var tab = find(obj.content.tab_settings.available_tabs, 'selected');
            var {click_tracking_params: itct, continuation: ctoken} = tab.content.contents[0].continuations[0];
            var videos = tab.content.contents[0].contents.map(this.parseVideo);
            this.videos.itct = itct;
            this.videos.ctoken = ctoken;
            this.videos.listData = videos;
            this.videos.list = this.ds.cloneWithRows(toJS(this.videos.listData));
            this.videos.loading = false;
        }).catch(function(error) {
            console.log('channel', error);
        });
    }
    @action
    handleEndVideos = () => {
        if (!this.videos.loading && !this.videos.endReached) {
            this.videos.loading = true;
            var cookie = 'VISITOR_INFO1_LIVE=WgjaHAcmdsg;'
            if (userStore.isAuth) {
                cookie += `SID=${userStore.SID}; SSID=${userStore.SSID}`
            }
            var url = `https://m.youtube.com/user/${this.username}?action_continuation=1&ajax=1&ctoken=${this.videos.ctoken}&itct=${this.videos.itct}&layout=mobile&tsp=1&utcoffset=180`;
            RNFetchBlob.fetch('GET', url, {
                'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.76 Mobile Safari/537.36',
                cookie
            }).then((res) => res.text()).then((response) => {
                var obj = makeJSON(response);
                var conts = obj.content.continuation_contents.continuations;
                if (conts[1]) {
                    var {click_tracking_params: itct, continuation: ctoken} = conts[1];
                    this.videos.itct = itct;
                    this.videos.ctoken = ctoken;
                } else {
                    this.videos.endReached = true;
                }
                var videos = obj.content.continuation_contents.contents.map(this.parseVideo);
                this.videos.listData = this.videos.listData.concat(videos);
                this.videos.list = this.ds.cloneWithRows(toJS(this.videos.listData));
                this.videos.loading = false;
            }).catch(function(error) {
                console.log('channel', error);
            });
        }
    }
    @action
    loadData = () => {
        var cookie = 'VISITOR_INFO1_LIVE=WgjaHAcmdsg;'
        if (userStore.isAuth) {
            cookie += `SID=${userStore.SID}; SSID=${userStore.SSID}`
        }
        var url = `https://m.youtube.com/user/${this.username}?ajax=1&layout=mobile&tsp=1&utcoffset=180`;
        RNFetchBlob.fetch('GET', url, {
            'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.76 Mobile Safari/537.36',
            cookie
        }).then((res) => res.text()).then((response) => {
            var obj = makeJSON(response);
            this.title = obj.content.header.title;
        }).catch(function(error) {
            console.log('channel', error);
        });
    }
    @action
    loadAbout = () => {
        var cookie = 'VISITOR_INFO1_LIVE=WgjaHAcmdsg;'
        if (userStore.isAuth) {
            cookie += `SID=${userStore.SID}; SSID=${userStore.SSID}`
        }
        var url = `https://m.youtube.com/user/${this.username}/about?ajax=1&layout=mobile&tsp=1&utcoffset=180`;
        RNFetchBlob.fetch('GET', url, {
            'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.76 Mobile Safari/537.36',
            cookie
        }).then((res) => res.text()).then((response) => {
            var obj = makeJSON(response);
            var tab = find(obj.content.tab_settings.available_tabs, 'selected');
            var about = tab.content.contents[0].contents[0];
            this.about.description = get(about, 'description.runs[0].text');
            this.about.loaded = true;
        }).catch(function(error) {
            console.log('channel', error);
        });
    }
}
