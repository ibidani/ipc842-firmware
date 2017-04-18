#! /bin/sh
#for profile.txt
VDPARAM="AEWB"
#安霸的看门狗最大超时时间只有65秒，所以在sonia启动前先喂一次狗
echo f > /proc/osa_root/pdc/pdcWdt

cd /usr/bin
unlzma sonia.lzma -d /var/tmp
#cp /usr/bin/sonia.lzma /var/tmp
#cd /var/tmp
#unlzma sonia.lzma
#dh_keyboard位是1时将sonia的输出屏蔽掉
DH_KEYBOARD=`dd if=/dev/mtd/1 bs=4096 count=1 2>&1 | grep -m 1 ^dh_keyboard=`
if [  "$DH_KEYBOARD" = "dh_keyboard=1" ];then
	/var/tmp/sonia $VDPARAM 2>/dev/null 1>/dev/null
else
	/var/tmp/sonia $VDPARAM
fi

state=$?
echo "####application exit:${state}, system will reboot!"
