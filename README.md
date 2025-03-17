# 部署指南

本文档将指导你如何将图片压缩工具部署到Linux服务器上。

## 前提条件

- 一台运行Linux的服务器（推荐Ubuntu 20.04或CentOS 8）
- 已安装Git（用于代码管理）
- 已安装Nginx（用于静态文件服务）
- 域名（可选）

## 部署步骤

### 1. 安装必要软件

```bash
# Ubuntu系统
sudo apt update
sudo apt install nginx git

# CentOS系统
sudo yum install epel-release
sudo yum install nginx git
```

### 2. 配置Nginx

1. 创建网站目录：
```bash
sudo mkdir -p /var/www/photo-compress
```

2. 配置Nginx虚拟主机：
```bash
sudo nano /etc/nginx/conf.d/photo-compress.conf
```

添加以下配置：
```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名或服务器IP

    root /var/www/photo-compress;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

3. 测试并重启Nginx：
```bash
sudo nginx -t
sudo systemctl restart nginx
```

### 3. 部署代码

1. 克隆代码到临时目录：
```bash
git clone <你的代码仓库URL> /tmp/photo-compress
```

2. 复制文件到网站目录：
```bash
sudo cp -r /tmp/photo-compress/* /var/www/photo-compress/
```

3. 设置适当的权限：
```bash
sudo chown -R nginx:nginx /var/www/photo-compress
sudo chmod -R 755 /var/www/photo-compress
```

### 4. 配置防火墙

```bash
# Ubuntu系统
sudo ufw allow 'Nginx Full'

# CentOS系统
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https  # 如果需要HTTPS
sudo firewall-cmd --reload
```

### 5. 配置HTTPS（推荐）

1. 安装Certbot：
```bash
# Ubuntu系统
sudo apt install certbot python3-certbot-nginx

# CentOS系统
sudo yum install certbot python3-certbot-nginx
```

2. 获取SSL证书：
```bash
sudo certbot --nginx -d your-domain.com
```

## 维护更新

当需要更新网站内容时，可以通过以下步骤：

1. 将更新后的代码推送到Git仓库
2. 在服务器上拉取最新代码：
```bash
cd /tmp/photo-compress
git pull
sudo cp -r * /var/www/photo-compress/
```

## 注意事项

1. 确保服务器有足够的内存和存储空间
2. 定期备份网站文件
3. 保持系统和Nginx的更新
4. 监控服务器负载和访问日志
5. 配置适当的安全措施（如防火墙规则、访问控制等）

## 故障排查

1. 查看Nginx错误日志：
```bash
sudo tail -f /var/log/nginx/error.log
```

2. 检查Nginx状态：
```bash
sudo systemctl status nginx
```

3. 检查防火墙规则：
```bash
sudo ufw status  # Ubuntu
sudo firewall-cmd --list-all  # CentOS
```

如果遇到问题，请参考以上日志和状态信息进行排查。
