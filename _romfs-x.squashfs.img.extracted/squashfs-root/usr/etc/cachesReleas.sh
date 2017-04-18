while [ 1 -eq 1 ]
do
    sync && echo 3 > /proc/sys/vm/drop_caches #«ø÷∆ Õ∑≈cache£¨∑¿÷πOOM
	/usr/bin/udelay 60000000
done
