while [ 1 -eq 1 ]
do
    sync && echo 3 > /proc/sys/vm/drop_caches #ǿ���ͷ�cache����ֹOOM
	/usr/bin/udelay 60000000
done
