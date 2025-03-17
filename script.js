// 获取DOM元素
const fileInput = document.getElementById('fileInput');
const dropArea = document.getElementById('dropArea');
const fileInfo = document.getElementById('fileInfo');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');
const maxWidthInput = document.getElementById('maxWidthInput');
const formatSelect = document.getElementById('formatSelect');
const compressBtn = document.getElementById('compressBtn');
const downloadBtn = document.getElementById('downloadBtn');
const originalImageContainer = document.getElementById('originalImageContainer');
const compressedImageContainer = document.getElementById('compressedImageContainer');
const originalInfo = document.getElementById('originalInfo');
const compressedInfo = document.getElementById('compressedInfo');

// 全局变量
let originalFile = null;
let originalImage = null;
let compressedImage = null;
let compressedBlob = null;

// 初始化事件监听
function initEventListeners() {
    // 文件选择事件
    fileInput.addEventListener('change', handleFileSelect);
    
    // 拖放区域事件
    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('active');
    });
    
    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('active');
    });
    
    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.classList.remove('active');
        
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });
    
    // 质量滑块事件
    qualitySlider.addEventListener('input', () => {
        qualityValue.textContent = `${qualitySlider.value}%`;
    });
    
    // 压缩按钮事件
    compressBtn.addEventListener('click', compressImage);
    
    // 下载按钮事件
    downloadBtn.addEventListener('click', downloadImage);
}

// 处理文件选择
function handleFileSelect(e) {
    if (e.target.files.length) {
        handleFile(e.target.files[0]);
    }
}

// 处理文件
function handleFile(file) {
    // 检查是否为图片文件
    if (!file.type.match('image.*')) {
        alert('请选择图片文件！');
        return;
    }
    
    originalFile = file;
    
    // 显示文件信息
    fileInfo.textContent = `文件名: ${file.name} | 大小: ${formatFileSize(file.size)}`;
    
    // 加载并显示原始图片
    const reader = new FileReader();
    reader.onload = (e) => {
        // 创建图片对象以获取尺寸信息
        originalImage = new Image();
        originalImage.onload = () => {
            // 显示原始图片
            displayOriginalImage();
            
            // 启用压缩按钮
            compressBtn.disabled = false;
        };
        originalImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// 显示原始图片
function displayOriginalImage() {
    // 清空容器
    originalImageContainer.innerHTML = '';
    
    // 创建并添加图片元素
    const imgElement = document.createElement('img');
    imgElement.src = originalImage.src;
    originalImageContainer.appendChild(imgElement);
    
    // 更新原始图片信息
    originalInfo.textContent = `尺寸: ${originalImage.width} × ${originalImage.height} | 大小: ${formatFileSize(originalFile.size)}`;
}

// 压缩图片
function compressImage() {
    if (!originalImage) return;
    
    // 获取设置参数
    const quality = parseInt(qualitySlider.value) / 100;
    const maxWidth = parseInt(maxWidthInput.value);
    const format = formatSelect.value;
    
    // 创建Canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 计算新尺寸，保持宽高比
    let newWidth = originalImage.width;
    let newHeight = originalImage.height;
    
    if (newWidth > maxWidth) {
        const ratio = maxWidth / newWidth;
        newWidth = maxWidth;
        newHeight = Math.round(newHeight * ratio);
    }
    
    // 设置Canvas尺寸
    canvas.width = newWidth;
    canvas.height = newHeight;
    
    // 绘制图片到Canvas
    ctx.drawImage(originalImage, 0, 0, newWidth, newHeight);
    
    // 转换为Blob
    canvas.toBlob((blob) => {
        if (!blob) {
            alert('压缩失败，请重试！');
            return;
        }
        
        compressedBlob = blob;
        
        // 转换为DataURL以显示
        const reader = new FileReader();
        reader.onload = (e) => {
            compressedImage = new Image();
            compressedImage.onload = () => {
                // 显示压缩后的图片
                displayCompressedImage();
                
                // 启用下载按钮
                downloadBtn.disabled = false;
            };
            compressedImage.src = e.target.result;
        };
        reader.readAsDataURL(blob);
    }, `image/${format}`, quality);
}

// 显示压缩后的图片
function displayCompressedImage() {
    // 清空容器
    compressedImageContainer.innerHTML = '';
    
    // 创建并添加图片元素
    const imgElement = document.createElement('img');
    imgElement.src = compressedImage.src;
    compressedImageContainer.appendChild(imgElement);
    
    // 更新压缩后图片信息
    const compressionRatio = ((1 - (compressedBlob.size / originalFile.size)) * 100).toFixed(1);
    compressedInfo.textContent = `尺寸: ${compressedImage.width} × ${compressedImage.height} | 大小: ${formatFileSize(compressedBlob.size)} | 压缩率: ${compressionRatio}%`;
}

// 下载压缩后的图片
function downloadImage() {
    if (!compressedBlob) return;
    
    const format = formatSelect.value;
    const url = URL.createObjectURL(compressedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_image.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 初始化应用
function init() {
    initEventListeners();
}

// 当页面加载完成后初始化应用
window.addEventListener('DOMContentLoaded', init);