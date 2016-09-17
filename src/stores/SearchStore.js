import {observable} from 'mobx';
import {ListView} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import userStore from './UserStore';
import {makeJSON} from '../lib/utils';
import get from 'lodash/get';
const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2
});
export default class SearchStore {
    @observable text = '';
    listData = null;
    @observable list = null;
    itct = "";
    ctoken = "";
    @observable loading = true;
    @observable endReached = false;
    handleChange = (text) => {
        this.text = text;
    }
    parse = (item) => {
        var type = item.item_type;
        if (type == 'compact_channel') {
            return this.parseChannel(item);
        } else if (type == 'compact_video') {
            return this.parseVideo(item);
        } else if (type == 'compact_playlist') {
            return this.parsePlaylist(item);
        } else if (type == 'message') {
            return {type: 'message', text: item.text.runs[0].text};
        } else {
            return {type: 'unsupported'};
        }
    }
    parseChannel = (channel) => {
        return {
            type: 'channel',
            username: channel.endpoint.url.replace('/user/', ''),
            title: channel.title.runs[0].text,
            avatar: channel.thumbnail_info.url,
            count_videos: get(channel, 'video_count.runs[0].text', ''),
            count_subs: get(channel, 'subscriber_count.runs[0].text') || ''
        };
    }
    parseVideo = (video) => {
        var id = video.endpoint.url.replace('/watch?v=', '');
        return {
            type: 'video',
            id,
            title: video.title.runs[0].text,
            thumbnail: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
            author: video.short_byline.runs[0].text,
            length: video.length.runs[0].text,
            count_views: video.view_count.runs[0].text
        };
    }
    parsePlaylist = (playlist) => {
        return {type: 'playlist'};
    }
    handleSubmit = () => {
        this.loading = true;
        this.endReached = false;
        var cookie = 'VISITOR_INFO1_LIVE=WgjaHAcmdsg;'
        if (userStore.isAuth) {
            cookie += `SID=${userStore.SID}; SSID=${userStore.SSID}`
        }
        var url = `https://m.youtube.com/results?ajax=1&layout=mobile&q=${this.text}&sm=3&tsp=1&utcoffset=180`;
        RNFetchBlob.fetch('GET', url, {
            'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.76 Mobile Safari/537.36',
            cookie
        }).then((res) => res.text()).then((response) => {
            var obj = makeJSON(response);
            var conts = obj.content.search_results.continuations;
            if (conts[0]) {
                var {click_tracking_params: itct, continuation: ctoken} = conts[0];
                this.itct = itct;
                this.ctoken = ctoken;
            } else {
                this.endReached = true;
            }
            var videos = obj.content.search_results.contents.map(this.parse);
            this.loading = false;
            this.listData = videos;
            this.list = ds.cloneWithRows(videos);
        }).catch(function(error) {
            console.log('search', error);
        });
    }
    handleEnd = () => {
        if (!this.loading && !this.endReached) {
            var cookie = 'VISITOR_INFO1_LIVE=WgjaHAcmdsg;'
            if (userStore.isAuth) {
                cookie += `SID=${userStore.SID}; SSID=${userStore.SSID}`
            }
            var url = `https://m.youtube.com/results?action_continuation=1&ajax=1&ctoken=${this.ctoken}&itct=${this.itct}&layout=mobile&tsp=1&utcoffset=180`;
            this.loading = true;
            RNFetchBlob.fetch('GET', url, {
                'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.76 Mobile Safari/537.36',
                cookie
            }).then((res) => res.text()).then((response) => {
                var obj = makeJSON(response);
                var conts = obj.content.continuation_contents.continuations;
                if (conts[1]) {
                    var {click_tracking_params: itct, continuation: ctoken} = conts[1];
                    this.itct = itct;
                    this.ctoken = ctoken;
                } else {
                    this.endReached = true;
                }
                var videos = obj.content.continuation_contents.contents.map(this.parse);
                this.loading = false;
                this.listData = this.listData.concat(videos);
                this.list = ds.cloneWithRows(this.listData);
            }).catch(function(error) {
                console.log('search cont', error);
            });
        }
    }
}
