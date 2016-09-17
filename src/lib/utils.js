import qs from 'query-string';
import formats from './formats';
import uniqBy from 'lodash/uniqBy';
headers = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.7',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:10.0) Gecko/20150101 Firefox/47.0 (Chrome)',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'en-us,en;q=0.5'
}
export function getFormats(id) {
    return fetch(`https://www.youtube.com/get_video_info?video_id=${id}&el=info&ps=default&eurl=&gl=US&hl=en`, headers).then((res) => res.text()).then((res) => {
        var {use_cipher_signature, reason} = qs.parse(res);
        if (reason) {
            return Promise.reject(new Error(reason));
        }
        if (use_cipher_signature && use_cipher_signature.toLowerCase() === 'true') {
            return fetch(`https://www.youtube.com/watch?v=${id}&gl=US&hl=en&has_verified=1&bpctr=9999999999`, headers).then((res) => res.text()).then((res) => {
                var [,
                    data] = /;ytplayer\.config\s*=\s*({.+?});ytplayer/.exec(res);
                var args = JSON.parse(data).args;
                return parseEncrypted(args);
            });
        }
        return parseDecrypted(res);
    });
}
var parseDecrypted = (youtubeInfoString) => {
    var {url_encoded_fmt_stream_map, adaptive_fmts} = qs.parse(youtubeInfoString);
    var splited = `${url_encoded_fmt_stream_map},${adaptive_fmts}`;
    var fmts = [];
    splited.split(',').forEach((item) => {
        var params = qs.parse(item);
        var fmt = {
            itag: Number(params.itag),
            url: params.url
        }
        var format = formats[params.itag] || {};
        fmts.push(Object.assign(fmt, format));
    });
    return fmts;
};
var parseEncrypted = (args) => {
    var {url_encoded_fmt_stream_map, adaptive_fmts} = args;
    var splited = `${url_encoded_fmt_stream_map},${adaptive_fmts}`;
    var fmts = [];
    splited.split(',').forEach((item) => {
        if (item) {
            var {s, url, itag} = qs.parse(item);
            fmts.push({itag: Number(itag), url: `${url}&signature=${Ly(s)}`});
        }
    });
    return fmts;
};
export function getByITAG(formats, itag) {
    var format,
        i,
        len;
    for (i = 0, len = formats.length; i < len; i++) {
        format = formats[i];
        if (format.itag == itag) {
            return format.url;
        }
    }
};
var Ly = function(a) {
    a = a.split("");
    Ky.YP(a, 19);
    Ky.lm(a, 14);
    Ky.wZ(a, 1);
    Ky.lm(a, 23);
    Ky.wZ(a, 1);
    Ky.YP(a, 7);
    Ky.lm(a, 22);
    Ky.YP(a, 38);
    Ky.wZ(a, 3);
    return a.join("")
};
var Ky = {
    wZ: function(a, b) {
        a.splice(0, b)
    },
    YP: function(a, b) {
        var c = a[0];
        a[0] = a[b % a.length];
        a[b] = c
    },
    lm: function(a) {
        a.reverse()
    }
};

//id = 'bg4BOt2e040' //blocked
//id = '8svQcWsf8r4' //encrypted
//id = 't8UzVOaNPC0' //normal
//id = 'PIlFyXucIhw' //stream
/*getFormats('t8UzVOaNPC0').then((formats) => {
  console.log(getByITAG(formats, 22));
})*/
const _dec2hex = (textString) => (textString + 0).toString(16).toUpperCase();
function _hex2char(hex) {
    // converts a single hex number to a character
    // note that no checking is performed to ensure that this is just a hex number, eg. no spaces etc
    // hex: string, the hex codepoint to be converted
    var result = '';
    var n = parseInt(hex, 16);
    if (n <= 0xFFFF) {
        result += String.fromCharCode(n);
    } else if (n <= 0x10FFFF) {
        n -= 0x10000
        result += String.fromCharCode(0xD800 | (n >> 10)) + String.fromCharCode(0xDC00 | (n & 0x3FF));
    } else {
        result += 'hex2Char error: Code point out of range: ' + _dec2hex(n);
    }
    return result;
}
export function makeJSON(str) {
    return JSON.parse(str.substr(4, str.length).replace(/\\U([A-Fa-f0-9]{8})/g, (matchstr, parens) => _hex2char(parens)));
}
var audioEncodingRanks = {
    mp3: 1,
    vorbis: 2,
    aac: 3,
    opus: 4,
    flac: 5
};
var videoEncodingRanks = {
    'Sorenson H.283': 1,
    'VP8': 3,
    'MPEG-4 Visual': 2,
    'VP9': 4,
    'H.264': 5
};
var _sortFormats = function(a, b) {
    var ares = a.resolution
        ? parseInt(a.resolution.slice(0, -1), 10)
        : 0;
    var bres = b.resolution
        ? parseInt(b.resolution.slice(0, -1), 10)
        : 0;
    var afeats = ~~!!ares * 2 + ~~ !!a.audioBitrate;
    var bfeats = ~~!!bres * 2 + ~~ !!b.audioBitrate;

    function getBitrate(c) {
        if (c.bitrate) {
            var s = c.bitrate.split('-');
            return parseFloat(s[s.length - 1], 10);
        } else {
            return 0;
        }
    }

    function audioScore(c) {
        var abitrate = c.audioBitrate || 0;
        var aenc = audioEncodingRanks[c.audioEncoding] || 0;
        return abitrate + aenc / 10;
    }

    if (afeats === bfeats) {
        if (ares === bres) {
            var avbitrate = getBitrate(a);
            var bvbitrate = getBitrate(b);
            if (avbitrate === bvbitrate) {
                var aascore = audioScore(a);
                var bascore = audioScore(b);
                if (aascore === bascore) {
                    var avenc = videoEncodingRanks[a.encoding] || 0;
                    var bvenc = videoEncodingRanks[b.encoding] || 0;
                    return bvenc - avenc;
                } else {
                    return bascore - aascore;
                }
            } else {
                return bvbitrate - avbitrate;
            }
        } else {
            return bres - ares;
        }
    } else {
        return bfeats - afeats;
    }
};

export function getFormatsString(fmts) {
    return uniqBy(fmts.filter((item) => item.itag <= 102).sort(_sortFormats), 'resolution').map((item) => item.resolution);
}
export function getBestFormat(fmts) {
    return fmts.filter((item) => item.itag <= 102).sort(_sortFormats)[0];
}
export function getFormat(fmts, fmt) {
    return fmts.filter((item) => item.itag <= 102 && item.resolution == fmt).sort(_sortFormats)[0];
}
