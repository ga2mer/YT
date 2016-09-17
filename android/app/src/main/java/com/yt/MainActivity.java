package com.yt;

import com.facebook.react.ReactActivity;
import com.xebia.reactnative.TabLayoutPackage;
import android.content.Intent;
import android.content.res.Configuration;
public class MainActivity extends ReactActivity {
    @Override
    protected String getMainComponentName() {
        return "YT";
    }
    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        Intent intent = new Intent("onConfigurationChanged");
        intent.putExtra("newConfig", newConfig);
        this.sendBroadcast(intent);
    }
}
