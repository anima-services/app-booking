package com.wantid.appbooking;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import cn.com.newbest.panelsdk.PanelEventListener;
import cn.com.newbest.panelsdk.PanelSDK;
import cn.com.newbest.panelsdk.callback.ADBStateCallback;
import cn.com.newbest.panelsdk.callback.InitCallback;
import cn.com.newbest.panelsdk.callback.PanelCallback;
import cn.com.newbest.panelsdk.callback.RunShellCallback;
import cn.com.newbest.panelsdk.callback.SerialNumCallback;
import cn.com.newbest.panelsdk.callback.SystemUpdateStateCallback;
import cn.com.newbest.panelsdk.model.DataTypeEnum;
import cn.com.newbest.panelsdk.model.DriverTypeEnum;
import cn.com.newbest.panelsdk.model.KNXData;
import cn.com.newbest.panelsdk.model.SystemUpdateState;

public class NewbestModule extends ReactContextBaseJavaModule {
    private static final String TAG = "NewbestModule";

    public NewbestModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "NewbestSDK";
    }

    private PanelEventListener panelEventListener = new PanelEventListener() {
        @Override
        public void onDistanceChange(int i, int i1) {

        }

        @Override
        public void onReceive485Data(String s, DataTypeEnum dataTypeEnum) {

        }

        @Override
        public void onReceiveKNXData(KNXData knxData) {

        }

        @Override
        public void onReceiveDryContactData(int i, int i1) {

        }

        @Override
        public void onError(int i, String s) {
            Log.e(TAG, "onError, code: " + i + ", msg:" + s);
        }
    };

    @ReactMethod
    public void initModule(String data, Callback callback) {
        try {
            init();
            String answer = "Init ok " + data;
            callback.invoke(null, answer);
        } catch (Exception e) {
            callback.invoke(e, null);
        }
    }

    private void init() {
        PanelSDK.getInstance().init(null, panelEventListener, new InitCallback() {
            @Override
            public void onSuccess() {
                Log.i(TAG, "sdk init ok");
                setColorGreen();
            }

            @Override
            public void onError(int i) {
                Log.i(TAG, "sdk init error：" + i);
            }
        });
    }

    @ReactMethod
    private void setColorRed() {
        try {
            PanelSDK.getInstance().setRBGLightColor(100, 0, 0, false, new PanelCallback() {
                @Override
                public void onSuccess() {
                    Log.i(TAG, "setRBGLightColor success");
                }

                @Override
                public void onError(int i) {
                    Log.i(TAG, "setRBGLightColor error: " + i);
                }
            });
        } catch (Exception e) {
        }
    }

    @ReactMethod
    private void setColorGreen() {
        try {
            PanelSDK.getInstance().setRBGLightColor(0, 100, 0, false, new PanelCallback() {
                @Override
                public void onSuccess() {
                    Log.i(TAG, "setRBGLightColor success");
                }

                @Override
                public void onError(int i) {
                    Log.i(TAG, "setRBGLightColor error: " + i);
                }
            });
        } catch (Exception e) {
        }
    }
}
