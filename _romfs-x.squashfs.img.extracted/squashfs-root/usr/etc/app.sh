#! /bin/sh
#for profile.txt
VDPARAM="AEWB"
#���ԵĿ��Ź����ʱʱ��ֻ��65�룬������sonia����ǰ��ιһ�ι�
echo f > /proc/osa_root/pdc/pdcWdt

cd /usr/bin
unlzma sonia.lzma -d /var/tmp
#cp /usr/bin/sonia.lzma /var/tmp
#cd /var/tmp
#unlzma sonia.lzma
#dh_keyboardλ��1ʱ��sonia��������ε�
DH_KEYBOARD=`dd if=/dev/mtd/1 bs=4096 count=1 2>&1 | grep -m 1 ^dh_keyboard=`
if [  "$DH_KEYBOARD" = "dh_keyboard=1" ];then
	/var/tmp/sonia $VDPARAM 2>/dev/null 1>/dev/null
else
	/var/tmp/sonia $VDPARAM
fi

state=$?
echo "####application exit:${state}, system will reboot!"
