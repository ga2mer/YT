package com.yt;

import android.app.Application;
import android.util.Log;
import android.support.annotation.NonNull;

import com.facebook.react.ReactApplication;
import com.psykar.cookiemanager.CookieManagerPackage;
import com.ga2mer.bottomdialog.RNBottomDialogPackage;
import com.gijoehosaphat.keepscreenon.KeepScreenOnPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.ga2mer.seekbar.RNAndroidSeekbarPackage;
import com.github.xinthink.rnmk.ReactMaterialKitPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

import com.brentvatne.react.ReactVideoPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.oblador.vectoricons.VectorIconsPackage;
/*import com.facebook.react.modules.network.ReactCookieJarContainer;
   import com.facebook.stetho.Stetho;
   import okhttp3.OkHttpClient;
   import com.facebook.react.modules.network.OkHttpClientProvider;
   import com.facebook.stetho.okhttp3.StethoInterceptor;
   import java.util.concurrent.TimeUnit;*/
import com.xebia.reactnative.TabLayoutPackage;
public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        protected boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                new MainReactPackage(),
                new CookieManagerPackage(),
                new RNBottomDialogPackage(),
                new KeepScreenOnPackage(),
                new LinearGradientPackage(),
                new RNAndroidSeekbarPackage(),
                new ReactMaterialKitPackage(),
                new RNFetchBlobPackage(),
                new ReactVideoPackage(),
                new OrientationPackage(),
                new VectorIconsPackage(),
                new TabLayoutPackage()
                );
        }
    };
    /*public void onCreate() {
        super.onCreate();
        Stetho.initializeWithDefaults(this);
        OkHttpClient client = new OkHttpClient.Builder()
        .connectTimeout(0, TimeUnit.MILLISECONDS)
        .readTimeout(0, TimeUnit.MILLISECONDS)
        .writeTimeout(0, TimeUnit.MILLISECONDS)
        .cookieJar(new ReactCookieJarContainer())
        .addNetworkInterceptor(new StethoInterceptor())
        .build();
        OkHttpClientProvider.replaceOkHttpClient(client);
       }*/
    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }
}
