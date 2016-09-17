import {observable, action} from 'mobx';
import {ListView} from 'react-native';
import axios from 'axios';
const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2
});
import map from 'lodash/map';
import has from 'lodash/has';
import flatten from 'lodash/flatten';
import forEach from 'lodash/forEach';
import find from 'lodash/find';
import RNFetchBlob from 'react-native-fetch-blob';
import userStore from './UserStore';
import {makeJSON} from '../lib/utils';
class MainStore {
    mainListData = [];
    topListData = [];
    subsListData = [];
    @observable mainList = ds.cloneWithRows([]);
    @observable topList = ds.cloneWithRows([]);
    @observable subsList = ds.cloneWithRows([]);
    main = {
        itct: '',
        ctoken: '',
        refreshItct: '',
        refreshCtoken: ''
    }
    itctTop = '';
    itctSubs = '';
    continuationTop = '';
    continuationSubs = '';
    @observable mainRefresh = false;
    @observable topRefresh = false;
    @observable subsRefresh = false;
    loadingMain = true;
    loadingTop = true;
    loadingSubs = true;
    @observable endReachedTop = false;
    constructor() {
        this.loadData('what_to_watch', 0);
    }
    handleSetPage = (position) => {
        if (position == 0 && this.mainListData.length == 0) {
            this.loadData('what_to_watch', position);
        } else if (position == 1 && this.topListData.length == 0) {
            this.loadData('trending', position);
        } else if (userStore.isAuth && position == 2 && this.subsListData.length == 0) {
            this.loadData('subscriptions', position);
        }/*else if (position == 3 && this.mainListData.length == 0) {
            //this.loadDataMain();
        }*/
    }
    parseVideo = (item) => {
        item = item.contents[0];
        var title = item.headline.runs[0].text;
        var isStream = item.length_text.runs.length == 0;
        var id = item.navigation_endpoint.url.replace('/watch?v=', '');
        var thumbnail = `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
        var views = isStream
            ? item.short_view_count_text.runs.map((item) => item.text).join('')
            : item.short_view_count_text.runs[0].text;
        var length = isStream
            ? ''
            : item.length_text.runs[0].text;
        var ago = isStream && 'эфир' || item.published_time_text.runs.length > 0 && item.published_time_text.runs[0].text || '';
        var author = {
            name: item.short_byline_text.runs[0].text,
            avatar: item.channel_thumbnail.thumbnail_info.url,
            url: item.channel_thumbnail.navigation_endpoint.url
        }
        return {
            title,
            thumbnail,
            author,
            id,
            views,
            length,
            ago
        };
    }
    parseSubsVideo = (item) => {
        item = item.contents[0];
        deepItem = item.content.items[0];
        var title = deepItem.title.runs[0].text;
        var id = deepItem.endpoint.url.replace('/watch?v=', '');
        var thumbnail = `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
        var views = deepItem.view_count.runs.length > 0 && deepItem.view_count.runs[0].text || 'запланированый стрим';
        var length = deepItem.length.runs.length > 0 && deepItem.length.runs[0].text || '';
        var author = {
            name: item.title.runs[0].text,
            avatar: item.thumbnail.url,
            url: item.endpoint.url
        }
        return {
            title,
            thumbnail,
            author,
            id,
            views,
            length
        };
    }
    loadData = (feed, position, refreshing) => {
        var cookie = 'VISITOR_INFO1_LIVE=WgjaHAcmdsg;'
        if (userStore.isAuth) {
            cookie += `SID=${userStore.SID}; SSID=${userStore.SSID}`
        }
        var url;
        if (feed == 'what_to_watch') {
            url = 'https://m.youtube.com/feed?ajax=1&layout=mobile&tsp=1&utcoffset=180';
            if (refreshing) {
                this.mainRefresh = true;
            }
        } else if (feed == 'trending') {
            url = 'https://m.youtube.com/feed/trending?ajax=1&layout=mobile&tsp=1&utcoffset=180';
            if (refreshing) {
                this.topRefresh = true;
            }
        } else if (feed == 'subscriptions') {
            url = 'https://m.youtube.com/feed/subscriptions?ajax=1&layout=mobile&tsp=1&utcoffset=180';
            if (refreshing) {
                this.subsRefresh = true;
            }
        }
        RNFetchBlob.fetch('GET', url, {
            'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.76 Mobile Safari/537.36',
            cookie
        }).then((res) => res.text()).then((response) => {
            var obj = makeJSON(response);
            var {click_tracking_params: refreshItct, refreshCtoken} = obj.content.single_column_browse_results.tabs[position].content.continuations[0];
            var {click_tracking_params: itct, continuation: ctoken} = obj.content.single_column_browse_results.tabs[position].content.continuations[1];
            var videos = obj.content.single_column_browse_results.tabs[position].content.contents.map(feed == 'subscriptions' && this.parseSubsVideo || this.parseVideo);
            if (feed == 'what_to_watch') {
                this.main.itct = itct;
                this.main.ctoken = ctoken;
                this.main.refreshItct = refreshItct;
                this.main.refreshCtoken = refreshCtoken;
                this.loadingMain = false;
                this.mainListData = videos;
                this.mainList = ds.cloneWithRows(videos);
                if (refreshing) {
                    this.mainRefresh = false;
                }
            } else if (feed == 'trending') {
                this.itctTop = itct;
                this.continuationTop = ctoken;
                this.loadingTop = false;
                this.topListData = videos;
                this.topList = ds.cloneWithRows(videos);
                if (refreshing) {
                    this.topRefresh = false;
                }
            } else if (feed == 'subscriptions') {
                this.itctSubs = itct;
                this.continuationSubs = ctoken;
                this.loadingSubs = false;
                this.subsListData = videos;
                this.subsList = ds.cloneWithRows(videos);
                if (refreshing) {
                    this.subsRefresh = false;
                }
            }
        }).catch(function(error) {
            console.log('main load', error);
        });
    }
    handleEndReached = () => {
        if (!this.loadingMain) {
            this.loadingMain = true;
            this.handleContinue('what_to_watch');
        }
    }
    handleEndReachedTop = () => {
        if (!this.loadingTop) {
            this.loadingTop = true;
            this.handleContinue('trending');
        }
    }
    handleEndReachedSubs = () => {
        if (!this.loadingSubs) {
            console.log('roading');
            this.loadingSubs = true;
            this.handleContinue('subscriptions');
        }
    }
    handleContinue = (feed, position, reload) => {
        var cookie = 'VISITOR_INFO1_LIVE=WgjaHAcmdsg;'
        if (userStore.isAuth) {
            cookie += `SID=${userStore.SID}; SSID=${userStore.SSID}`
        }
        var cont = this.main.ctoken;
        var itct = this.main.itct;
        if (reload) {
            console.log('reloading');
            cont = this.main.reloadCtoken;
            itct = this.main.reloadItct;
        }
        if (feed == 'trending') {
            cont = this.continuationTop;
            itct = this.itctTop;
        } else if (feed == 'subscriptions') {
            cont = this.continuationSubs;
            itct = this.itctSubs;
        }
        RNFetchBlob.fetch('GET', `https://m.youtube.com/feed?action_continuation=1&ajax=1&ctoken=${cont}&feed_name=${feed}&itct=${itct}&layout=mobile&tsp=1&utcoffset=180`, {
            'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.76 Mobile Safari/537.36',
            cookie
        }).then((res) => res.text()).then((response) => {
            var obj = makeJSON(response);
            var conts = obj.content.continuation_contents;
            var isEnd = false;
            var click_tracking_params,
                continuation;
            if (!conts) {
                return this.handleContinue(feed, position, reload);
            } else if (conts.continuations.length > 0) {
                click_tracking_params = conts.continuations[0].click_tracking_params;
                continuation = conts.continuations[0].continuation;
            } else {
                isEnd = true;
            }
            var videos = obj.content.continuation_contents.contents.map(feed == 'subscriptions' && this.parseSubsVideo || this.parseVideo);
            if (feed == 'what_to_watch') {
                this.main.itct = click_tracking_params;
                this.main.ctoken = continuation;
                this.loadingMain = false;
                this.mainListData = this.mainListData.concat(videos);
                this.mainList = ds.cloneWithRows(this.mainListData);
            } else if (feed == 'trending') {
                this.itctTop = click_tracking_params;
                this.continuationTop = continuation;
                this.loadingTop = false;
                this.topListData = this.topListData.concat(videos);
                this.topList = ds.cloneWithRows(this.topListData);
                this.endReachedTop = isEnd;
            } else if (feed == 'subscriptions') {
                this.itctSubs = click_tracking_params;
                this.continuationSubs = continuation;
                this.loadingSubs = false;
                this.subsListData = this.subsListData.concat(videos);
                this.subsList = ds.cloneWithRows(this.subsListData);
                //this.endReachedSubs = isEnd;
            }
        }).catch((err) => {
            console.log('mail cont', err);
            console.log(`https://m.youtube.com/feed?action_continuation=1&ajax=1&ctoken=${cont}&feed_name=${feed}&itct=${itct}&layout=mobile&tsp=1&utcoffset=180`);
        });
    }
}
export default new MainStore();
