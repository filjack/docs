# LINUX

## shell

1. 在每天凌晨两点半备份custom数据库到`/var/data/backup/db`下，并创建一个当前时间（例如 2021-09-08_212121）的文件夹，并将该文件夹打包为同时间命名的`tar.gz`包并删除原文件夹，同时检查是否有10天之前生成并删除
   ```shell
   # 备份数据库到sql文件中
   mysqldump -u$DB_USER -p$DB_PWD --host=$HOST -q -R --databases $DB_SCHEMA > $TARGET_DIR/$DATETIME/$DATETIME.sql
   
   # 切换到备份文件存放目录，并将当前备份文件打包
   cd $TARGET_DIR
   tar -zcvf $DATETIME.tar.gz $DATETIME
   
   # 删除原目录
   rm -rf $DATETIME
   
   # 查找10分钟之前生成的.tar.gz文档并删除
   find $TARGET_DIR -amin +10 -name "*.tar.gz" -exec rm -rf {} \;
   
   # 打印结果
   echo "$DATETIME备份结束~"
   
   ```

   ```shell
   # crondtab -e
   */1 * * * * /usr/sbin/mysql_dump_bak.sh
   ```

   

2. 分析`t.log`，将各个`ip`地址截取，并统计出现次数，按从大到小排序
   ```shell
   http://192.168.200.10/index1.html
   http://192.168.200.10/index2.html
   http://192.168.200.20/index1.html
   http://192.168.200.30/index1.html
   http://192.168.200.40/index1.html
   http://192.168.200.30/order.html
   http://192.168.200.10/order.html
   ```

   ```shell
   cat t.log | cut -d '/' -f 3 | sort -nr | uniq -c
   ```

3. 统计连接到服务器的各个`ip`情况，并按连接数从大到小排序
   ```shell
   netstat -an | grep "ESTABLISHED" | awk -F " " '{print $5}' | cut -d ":" -f 1 | sort -nr | uniq -c
   ```

4. 统计`ip`访问情况，找出访问页面数量排在前两位的`ip`
   ```shell
   192.168.130.21 aaa.html
   192.168.130.20 aaa.html
   192.168.130.20 aaa.html
   192.168.130.20 aaa.html
   192.168.130.23 aaa.html
   192.168.130.20 aaa.html
   192.168.130.25 aaa.html
   192.168.130.20 aaa.html
   192.168.130.20 aaa.html
   192.168.130.25 aaa.html
   192.168.130.20 aaa.html
   ```

   ```shell
   cat access.log | awk -F " " '{print $1}' | sort | uniq -c | sort -nr | head -2
   ```

5. 使用`tcpdump`监听本机，将来自宿主计算机ip，本机监听tcp端口为22的数据，保存输出到tcpdump.log文件中
   ```shell
   tcpdump -i ens33 host 192.168.248.1 and port 22 >> /var/tcpdumptest.log
   ```

6. 使用Linux计算`t2.txt`第二列的和并打印出来
   ```shell
   张三 40
   王五 50
   马六 60
   ```

   ```shell
   cat t2.txt | awk -F " " '{sum+=$2} END {print sum}'
   ```

7. 用shell脚本对`t3.txt`中无序数字队列进行排序输出，并打印总和
   ```shell
   9
   8
   7
   6
   5
   4
   3
   2
   10
   ```

   ```shell
   sort -nr t3.txt | awk '{sum+=$1; print $1} END {print "和="sum}'
   ```

8. 用指令查找`/home`目录下所有的文本文件内容中包含`cat`字符的文件名称
   ```shell
   grep -r "cat" /home | cut -d ":" -f 1
   ```

9. 写出统计`/home`目录下所有文件个数和所有文件总行数的指令
   ```she
   find /home -name "*.*" | wc -l
   find /home -name "*.*" | xargs wc -l
   ```

   

## 权限

1. 用户tom对目录`/home/test`有执行、读、写权限，`/home/test/hello.java`对于tom来说是只读文件，tom对`hello.java`文件可以读吗？可以修改吗？可以删除吗？
   ```shell
   可以读，不可以修改，可以删除
   ```

2. 用户tom对目录`/home/test`有读、写权限，`/home/test/hello.java`对于tom来说是只读文件，tom对`hello.java`文件可以读吗？可以修改吗？可以删除吗？
   ```shell
   不可以读、不可以修改、不可以删除
   ```

3. 用户tom对目录`/home/test`有执行权限，`/home/test/hello.java`对于tom来说是只读文件，tom对`hello.java`文件可以读吗？可以修改吗？可以删除吗？
   ```shell
   可以读、不可以修改、不可以删除
   ```

4. 用户tom对目录`/home/test`有执行、写权限，`/home/test/hello.java`对于tom来说是只读文件，tom对`hello.java`文件可以读吗？可以修改吗？可以删除吗？
   ```shell
   可以读、不可以修改、可以删除
   ```

   