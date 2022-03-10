package com.rn_scheduler;

import android.app.ActivityManager;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Calendar;

public class SchedulerModule extends ReactContextBaseJavaModule {

    private static ReactApplicationContext reactContext;
    private AlarmManager alarmMgr;
    private PendingIntent alarmIntent;

    public SchedulerModule(@NonNull ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "Scheduler";
    }

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    @ReactMethod
    public void scheduleTask(int hour, int minute) {
        alarmMgr = (AlarmManager) reactContext.getSystemService(Context.ALARM_SERVICE);
        Intent intent = new Intent(this.reactContext, AlarmReceiver.class);
        alarmIntent = PendingIntent.getBroadcast(this.reactContext, 0, intent, 0);
        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(System.currentTimeMillis());
        calendar.set(Calendar.HOUR_OF_DAY, hour);
        calendar.set(Calendar.MINUTE, minute);
        calendar.set(Calendar.SECOND, 00);
        Calendar now = Calendar.getInstance();
        if (calendar.before(now)) {
            calendar.add(Calendar.DAY_OF_MONTH, 1);
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            System.out.println("here -> Setting alarm in JAVA");
            alarmMgr.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis(), alarmIntent);
        } else {
            alarmMgr.setExact(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis(), alarmIntent);
        }
        Toast.makeText(reactContext.getCurrentActivity(),
                "Task scheduled for "+String.valueOf(hour)+":"+String.valueOf(minute), Toast.LENGTH_SHORT).show();
        System.out.println("here -> Starting SERVICE");
        Intent serviceIntent = new Intent(this.reactContext, BackgroundService.class);
        serviceIntent.putExtra("hour", hour);
        serviceIntent.putExtra("minute", minute);
        this.reactContext.startService(serviceIntent);
    }

    @ReactMethod
    public void isBgServiceRunning(final Promise promise) {
        ActivityManager manager = (ActivityManager) reactContext.getSystemService(Context.ACTIVITY_SERVICE);
        for (ActivityManager.RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE)) {
            if ("com.rn_scheduler.BackgroundService".equals(service.service.getClassName())) {
                promise.resolve(true);
            }
        }
        promise.resolve(false);
    }
}
