package com.rn_scheduler;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import com.facebook.react.HeadlessJsTaskService;

public class AlarmReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        Intent receiverIntent = new Intent(context, HeadlessSchedulerService.class);
        Intent backgroundIntent = new Intent(context, BackgroundService.class);
        System.out.println("here -> Receiving Alarm in JAVA");
        context.startService(receiverIntent);
        HeadlessJsTaskService.acquireWakeLockNow(context);
        System.out.println("here -> Stopping SERVICE");
        context.stopService(backgroundIntent);
    }
}
