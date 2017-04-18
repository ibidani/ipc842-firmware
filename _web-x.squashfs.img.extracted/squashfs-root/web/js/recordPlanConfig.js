(function(){function j(b,a){$$("#schedule_dialog input[type=checkbox]").setProperty("checked",!1).setProperty("disabled",!1);$("schedule_day_"+a).setProperty("checked",!0).setProperty("disabled",!0);$$("#schedule_dialog label[for^=schedule_day]").removeClass("fn-color-red");$$("#schedule_dialog label[for=schedule_day_"+a+"]").addClass("fn-color-red");b[a].each(function(a,b){var f=a.match(/([\d]+) (\d\d):(\d\d):(\d\d)-(\d\d):(\d\d):(\d\d)/),g="schedule_period_"+b+"_";$(g+"from_hour").value=f[2];$(g+
"from_minite").value=f[3];$(g+"from_second").value=f[4];$(g+"to_hour").value=f[5];$(g+"to_minite").value=f[6];$(g+"to_second").value=f[7];$(g+"mode_general").checked=!!(f[1]&1);$(g+"mode_motion").checked=!!(f[1]&2);$(g+"mode_alarm").checked=!!(f[1]&4)})}function k(b){var a=[],c=[];$$("#page_recordPlanConfig input[id^=schedule_day]").each(function(b){b.checked&&a.push(b.id.replace(/[^\d]*/g,""))});[0,1,2,3,4,5].each(function(a){var b="schedule_period_"+a+"_";c[a]={from_hour:$(b+"from_hour").value,
from_minite:$(b+"from_minite").value,from_second:$(b+"from_second").value,to_hour:$(b+"to_hour").value,to_minite:$(b+"to_minite").value,to_second:$(b+"to_second").value,mode_general:$(b+"mode_general").checked,mode_motion:$(b+"mode_motion").checked,mode_alarm:$(b+"mode_alarm").checked}});a.each(function(a){var f=b[a];[0,1,2,3,4,5].each(function(a){var b=f[a].match(/([\d]+)/)[1]-0,d=c[a];d.mode_general?b|=1:b&=4294967294;d.mode_motion?b|=2:b&=4294967293;d.mode_alarm?b|=4:b&=4294967291;d.mode=b;f[a]=
"{mode} {from_hour}:{from_minite}:{from_second}-{to_hour}:{to_minite}:{to_second}".substitute(d)})})}function l(b){h||b.each(function(a,c){a.each(function(a,f){var g=a.split(" ")[0].toInt(),e=a.split(" ")[1];g&=4294967291;b[c][f]=g+" "+e})})}var h=ALARM_IN_NUMBER>0||hasSDCard;(function(){var b=Page.recordPlanConfig={Tab:{},init:function(){if(!h)$$(".schedule_showAlarmInfo").setStyle("display","none"),$("schedule_record_alarm").checked=!1,$("schedule_snapshot_alarm").checked=!1;b.dialog=new Dialog("schedule_dialog",
function(){},"schedule_dialog_confirm","schedule_dialog_cancel",tl("w_Setup"));b.dialog.setPosition(200,60);b.Tab.record.init();b.Tab.snapshot.init();b.Tab.holiday.init();b.translate();b.bind();b.render()},translate:function(){$("schedule_tab_title_record").set("text",tl("w_Recordschedule"));$("schedule_tab_title_snapshot").set("text",tl("w_Snapschedule"));$("schedule_tab_title_holiday").set("text",tl("w_Holiday schedule"));$("schedule_help").set("title",tl("w_help"));$$("#page_recordPlanConfig .schedule_alarm").set("text",
tl("w_Alarm"));$$("#page_recordPlanConfig .schedule_motion").set("text",tl("w_Motion"));$$("#page_recordPlanConfig .schedule_general").set("text",tl("w_General"));$$("#page_recordPlanConfig .schedule_sunday").set("text",tl("w_Sunday"));$$("#page_recordPlanConfig .schedule_monday").set("text",tl("w_Monday"));$$("#page_recordPlanConfig .schedule_tuesday").set("text",tl("w_Tuesday"));$$("#page_recordPlanConfig .schedule_wendesday").set("text",tl("w_Wednesday"));$$("#page_recordPlanConfig .schedule_thursday").set("text",
tl("w_Thursday"));$$("#page_recordPlanConfig .schedule_friday").set("text",tl("w_Friday"));$$("#page_recordPlanConfig .schedule_saturday").set("text",tl("w_Saturday"));$$("#page_recordPlanConfig .schedule_holiday").set("text",tl("w_Holiday"));$$("#page_recordPlanConfig .schedule_setup").set("text",tl("w_Setup"));$("schedule_week_all_label").set("text",tl("w_Weekall"));$("schedule_period_0").set("text",tl("w_Time1"));$("schedule_period_1").set("text",tl("w_Time2"));$("schedule_period_2").set("text",
tl("w_Time3"));$("schedule_period_3").set("text",tl("w_Time4"));$("schedule_period_4").set("text",tl("w_Time5"));$("schedule_period_5").set("text",tl("w_Time6"));$("schedule_dialog_confirm").set("text",tl("w_Confirm"));$("schedule_dialog_cancel").set("text",tl("w_Cancel"));$$("#schedule_dialog h1").set("text",tl("w_Setup"))},bind:function(){$$(".schedule_tab_title").addEvent("click",b._onTabTitleClick);[0,1,2,3,4,5].each(function(a){a="schedule_period_"+a+"_";attachTimeEvent([$(a+"from_hour"),$(a+
"from_minite"),$(a+"from_second"),$(a+"to_hour"),$(a+"to_minite"),$(a+"to_second")])});$("schedule_week_all").addEvent("click",function(){var a=this;$$("#page_recordPlanConfig input[id^=schedule_day]").filter(function(a){return!a.disabled}).each(function(b){b.checked=a.checked})});$$("#page_recordPlanConfig input[id^=schedule_day]").addEvent("click",function(){var a=!0;[0,1,2,3,4,5,6,7].each(function(b){a=a&&$("schedule_day_"+b).checked});$("schedule_week_all").checked=a});$("schedule_help").addEvent("click",
function(){openHelp("recordPlanConfig.htm")})},render:function(){$$(".schedule_tab_title.ui-tab-current").fireEvent("click")},_onTabTitleClick:function(){b.dialog.close();var a=this.getProperty("data-for");b.Tab[a].render();$$(".schedule_tab_title").removeClass("ui-tab-current");$$(".schedule_tabs").setStyle("display","none");this.addClass("ui-tab-current");$("schedule_tab_"+a).setStyle("display","block")}}})();(function(){var b={},a=Page.recordPlanConfig.Tab.record={init:function(){a.dialog=Page.recordPlanConfig.dialog;
a.configManager=new ConfigManager;a.translate();a.bind();a.schedule=new Schedule("schedule_tab_record_canvas",{holiday:!0,displayMode:h?["general","motion","alarm"]:["general","motion"]});a._onTypeClick()},translate:function(){$("schedule_tab_record_default").set("text",tl("w_DefaultConfig"));$("schedule_tab_record_refresh").set("text",tl("w_Refresh"));$("schedule_tab_record_confirm").set("text",tl("w_Confirm"))},render:function(){$("schedule_dialog_confirm").removeEvents("click").addEvent("click",
a._onDialogConfirmClick);a.configManager.getConfig("Record",function(c,d){d.result?(b=d.params.table[0],a._renderElements(b.TimeSection)):remarkDisplay("schedule_tab_record_remark",tl("Operateingfailure"),3E3,1)})},bind:function(){$$("#schedule_record_general, #schedule_record_motion, #schedule_record_alarm").addEvent("click",a._onTypeClick);$$("#schedule_tab_record .schedule_setup").addEvent("click",a._onSetupClick);$("schedule_tab_record_default").addEvent("click",a._onDefaultClick);$("schedule_tab_record_refresh").addEvent("click",
a._onRefreshClick);$("schedule_tab_record_confirm").addEvent("click",a._onConfirmClick)},_renderElements:function(b){l(b);a.schedule.render(b)},_onDialogConfirmClick:function(){k(b.TimeSection);a.dialog.close();a._renderElements(b.TimeSection)},_onTypeClick:function(){var b=[];$("schedule_record_general").checked&&b.push("general");$("schedule_record_motion").checked&&b.push("motion");$("schedule_record_alarm").checked&&b.push("alarm");a.schedule.setType(b)},_onSetupClick:function(){var c=this.id.replace(/[^\d]*/g,
"");j(b.TimeSection,c);a.dialog.show();$("schedule_dialog").style.display="block";$("schedule_dialog").style.top="100px"},_onDefaultClick:function(){a.configManager.getDefault("Record",function(c,d){d.result?(b.TimeSection=d.params.table[0].TimeSection,a._renderElements(b.TimeSection),remarkDisplay("schedule_tab_record_remark",tl("Defaultsuccess"),3E3,0)):remarkDisplay("schedule_tab_record_remark",tl("Defaultfailure"),3E3,1)})},_onRefreshClick:function(){a.configManager.getConfig("Record",function(c,
d){d.result?(b=d.params.table[0],a._renderElements(b.TimeSection),remarkDisplay("schedule_tab_record_remark",tl("Operateingsuccess"),3E3,0)):remarkDisplay("schedule_tab_record_remark",tl("Operateingfailure"),3E3,1)})},_onConfirmClick:function(){a.configManager.setConfig("Record",[b],function(a,b){b.result?remarkDisplay("schedule_tab_record_remark",tl("Succeed in saving configure"),3E3,0):remarkDisplay("schedule_tab_record_remark",tl("Saving failure"),3E3,1)})}}})();(function(){var b={},a=Page.recordPlanConfig.Tab.snapshot=
{init:function(){a.dialog=Page.recordPlanConfig.dialog;a.configManager=new ConfigManager;a.translate();a.bind();a.schedule=new Schedule("schedule_tab_snapshot_canvas",{holiday:!0,displayMode:h?["general","motion","alarm"]:["general","motion"]});a._onTypeClick()},translate:function(){$("schedule_tab_snapshot_default").set("text",tl("w_DefaultConfig"));$("schedule_tab_snapshot_refresh").set("text",tl("w_Refresh"));$("schedule_tab_snapshot_confirm").set("text",tl("w_Confirm"))},render:function(){$("schedule_dialog_confirm").removeEvents("click").addEvent("click",
a._onDialogConfirmClick);a.configManager.getConfig("Snap",function(c,d){d.result?(b=d.params.table[0],a._renderElements(b.TimeSection)):remarkDisplay("schedule_tab_snapshot_remark",tl("Operateingfailure"),3E3,1)})},bind:function(){$$("#schedule_snapshot_general, #schedule_snapshot_motion, #schedule_snapshot_alarm").addEvent("click",a._onTypeClick);$$("#schedule_tab_snapshot .schedule_setup").addEvent("click",a._onSetupClick);$("schedule_tab_snapshot_default").addEvent("click",a._onDefaultClick);$("schedule_tab_snapshot_refresh").addEvent("click",
a._onRefreshClick);$("schedule_tab_snapshot_confirm").addEvent("click",a._onConfirmClick)},_renderElements:function(b){l(b);a.schedule.render(b)},_onDialogConfirmClick:function(){k(b.TimeSection);a.dialog.close();a._renderElements(b.TimeSection)},_onTypeClick:function(){var b=[];$("schedule_snapshot_general").checked&&b.push("general");$("schedule_snapshot_motion").checked&&b.push("motion");$("schedule_snapshot_alarm").checked&&b.push("alarm");a.schedule.setType(b)},_onSetupClick:function(){var c=
this.id.replace(/[^\d]*/g,"");j(b.TimeSection,c);a.dialog.show();$("schedule_dialog").style.display="block";$("schedule_dialog").style.top="100px"},_onDefaultClick:function(){a.configManager.getDefault("Snap",function(c,d){d.result?(b.TimeSection=d.params.table[0].TimeSection,a._renderElements(b.TimeSection),remarkDisplay("schedule_tab_snapshot_remark",tl("Defaultsuccess"),3E3,0)):remarkDisplay("schedule_tab_snapshot_remark",tl("Defaultfailure"),3E3,1)})},_onRefreshClick:function(){a.configManager.getConfig("Snap",
function(c,d){d.result?(b=d.params.table[0],a._renderElements(b.TimeSection),remarkDisplay("schedule_tab_snapshot_remark",tl("Operateingsuccess"),3E3,0)):remarkDisplay("schedule_tab_snapshot_remark",tl("Operateingfailure"),3E3,1)})},_onConfirmClick:function(){a.configManager.setConfig("Snap",[b],function(a,b){b.result?remarkDisplay("schedule_tab_snapshot_remark",tl("Succeed in saving configure"),3E3,0):remarkDisplay("schedule_tab_snapshot_remark",tl("Saving failure"),3E3,1)})}}})();(function(){var b=
{},a={},c={},d=1,f,g,e=Page.recordPlanConfig.Tab.holiday={init:function(){e.getCurrentTime=new Global;e.getCurrentTime.getCurrentTime(function(a){f=JSON.decode(a).result.split(" ")[0].split("-")[0];g=Number(JSON.decode(a).result.split(" ")[0].split("-")[1])},!1);e._initMonthSelect();e.configManager=new ConfigManager;e.translate();e.render();e.bind()},translate:function(){$("schedule_tab_holiday_record_enable_label").set("text",tl("w_Record"));$("schedule_tab_holiday_snap_enable_label").set("text",
tl("w_Snap"));$("schedule_tab_holiday_calender_label").set("text",tl("w_Calendar"));$("schedule_tab_holiday_refresh").set("text",tl("w_Refresh"));$("schedule_tab_holiday_confirm").set("text",tl("w_Confirm"));$("schedule_mon").set("text",tl("Mon"));$("schedule_tue").set("text",tl("Tue"));$("schedule_wed").set("text",tl("Wed"));$("schedule_thu").set("text",tl("Thu"));$("schedule_fri").set("text",tl("Fri"));$("schedule_satu").set("text",tl("Satu"));$("schedule_sun").set("text",tl("Sun"))},render:function(d){e.getCurrentTime.getCurrentTime(function(a){f=
JSON.decode(a).result.split(" ")[0].split("-")[0];g=Number(JSON.decode(a).result.split(" ")[0].split("-")[1])},!1);e._initMonthSelect();e.configManager.getConfig(["Holiday","Record","Snap"],function(f,i){i.result?(b=i.params[0].params.table,a=i.params[1].params.table[0],c=i.params[2].params.table[0],e._renderElements(b,a,c),d&&remarkDisplay("schedule_tab_holiday_remark",tl("Operateingsuccess"),3E3,0)):remarkDisplay("schedule_tab_holiday_remark",tl("Operateingfailure"),3E3,1)})},bind:function(){$("schedule_tab_holiday_month").addEvent("change",
e._onMonthChange);$("schedule_tab_holiday_refresh").addEvent("click",e._onRefreshClick);$("schedule_tab_holiday_confirm").addEvent("click",e._onConfirmClick);$$("#page_recordPlanConfig a[id^=schedule_tab_holiday_day_]").addEvent("click",e._onDayClick)},_renderElements:function(a,b,d){$("schedule_tab_holiday_record_enable").checked=b.HolidayEnable;$("schedule_tab_holiday_snap_enable").checked=d.HolidayEnable;e._showCalendar()},_initMonthSelect:function(){var a=$("schedule_tab_holiday_month");a.empty();
for(var b=1;b<=12;b++)a.options.add(new Option(tl(b+"month"),b));a.value=d=g},_showCalendar:function(){e._calculateDate(f,d,1,"schedule_tab_holiday_day_")},_calculateDate:function(a,d,e,f){for(var e=(new Date(a,d-1,1)).getDay(),a=getMonthDays(a,d),c=0;c<e;c++)$(f+c).style.display="none";for(c=e;c<e+a;c++)$(f+c).style.display="",b.MonthMask[d-1]&1<<c-e?$(f+c).addClass("ui-calendar-day-current"):$(f+c).removeClass("ui-calendar-day-current"),$(f+c).set("text",c-e+1);for(c=e+a;c<42;c++)$(f+c).style.display=
"none"},_onMonthChange:function(){d=this.value;e._showCalendar()},_onRefreshClick:function(){e.render(!0)},_onConfirmClick:function(){a.HolidayEnable=$("schedule_tab_holiday_record_enable").checked;c.HolidayEnable=$("schedule_tab_holiday_snap_enable").checked;e.configManager.setConfig(["Holiday","Record","Snap"],[b,[a],[c]],function(a,b){b.result?remarkDisplay("schedule_tab_holiday_remark",tl("Succeed in saving configure"),3E3,0):remarkDisplay("schedule_tab_holiday_remark",tl("Saving failure"),3E3,
1)})},_onDayClick:function(){this.hasClass("ui-calendar-day-current")?(this.removeClass("ui-calendar-day-current"),e._changeHolidayMask(this.id,!1)):(this.addClass("ui-calendar-day-current"),e._changeHolidayMask(this.id,!0))},_changeHolidayMask:function(a,c){var e=new Date,e=new Date(f,d-1,1),e=e.getDay();c?b.MonthMask[d-1]|=1<<a.replace(/[^\d]/g,"")-e:b.MonthMask[d-1]&=~(1<<a.replace(/[^\d]/g,"")-e)}}})()})();