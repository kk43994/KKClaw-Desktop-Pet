# 📎 文件上传功能说明

## 🎉 新功能

现在可以发送**任意文件**给KK了!不只是图片~

### ✅ 支持的文件类型

| 类型 | 扩展名 | 示例 |
|------|--------|------|
| **图片** | .png, .jpg, .jpeg, .gif, .bmp, .webp | 截图、照片 |
| **PDF** | .pdf | 文档、报告 |
| **Word** | .doc, .docx | 文档 |
| **Excel** | .xls, .xlsx | 表格、数据 |
| **PPT** | .ppt, .pptx | 演示文稿 |
| **其他** | 任意 | 代码、文本、压缩包等 |

---

## 🚀 使用方法

### 方法1: 通过message tool
```javascript
await message({
    action: 'send',
    channel: 'lark',
    target: 'KK',
    message: '这是Excel报表',
    filePath: 'C:\\Users\\zhouk\\Desktop\\report.xlsx'
});
```

### 方法2: 直接调用LarkUploader
```javascript
const LarkUploader = require('./lark-uploader');
const uploader = new LarkUploader();

// 上传文件
const result = await uploader.uploadToLark(
    'C:\\Users\\zhouk\\Desktop\\data.xlsx',
    '这是本月销售数据'
);

console.log('file_key:', result.key);
```

---

## 🎯 实际应用场景

### 场景1: 发送Excel报表
```javascript
// 生成Excel报表
const reportPath = await generateReport();

// 上传到飞书
const result = await uploader.uploadToLark(reportPath, '本月销售报表');

// 在回复中说明
message("KK,本月销售报表已生成并发送!");
```

### 场景2: 发送PDF文档
```javascript
// 转换为PDF
const pdfPath = await convertToPDF('document.md');

// 发送
await uploader.uploadToLark(pdfPath, '技术文档PDF版');
```

### 场景3: 发送代码文件
```javascript
// 发送源代码
await uploader.uploadToLark(
    'C:\\Users\\zhouk\\Desktop\\project\\main.js',
    '最新的main.js代码'
);
```

---

## 🔧 技术实现

### 智能文件类型检测
```javascript
detectFileType(filepath) {
    const ext = path.extname(filepath).toLowerCase();
    
    if (['.png', '.jpg', '.jpeg'].includes(ext)) return 'image';
    if (ext === '.pdf') return 'pdf';
    if (['.xls', '.xlsx'].includes(ext)) return 'xls';
    if (['.doc', '.docx'].includes(ext)) return 'doc';
    if (['.ppt', '.pptx'].includes(ext)) return 'ppt';
    
    return 'stream'; // 其他文件
}
```

### 自动选择上传方式
- **图片**: 使用 `/open-apis/im/v1/images` (返回image_key)
- **文件**: 使用 `/open-apis/im/v1/files` (返回file_key)

### 元数据保存
上传后会在 `openclaw-data/last_upload.json` 保存:
```json
{
  "filepath": "...",
  "filename": "report.xlsx",
  "fileType": "xls",
  "fileSize": 12345,
  "key": "file_xxx",
  "caption": "销售报表",
  "timestamp": 1234567890
}
```

---

## 📝 使用示例

### 示例1: 发送Excel
```javascript
await uploader.uploadToLark(
    'C:\\Users\\zhouk\\Desktop\\sales.xlsx',
    '2026年2月销售数据'
);
```

### 示例2: 发送PDF
```javascript
await uploader.uploadToLark(
    'C:\\Users\\zhouk\\Documents\\report.pdf',
    '项目总结报告'
);
```

### 示例3: 发送Word文档
```javascript
await uploader.uploadToLark(
    'C:\\Users\\zhouk\\Desktop\\contract.docx',
    '合同草稿'
);
```

---

## ⚠️ 注意事项

1. **文件大小限制**
   - 飞书文件上传限制: 通常<30MB
   - 图片限制: <10MB

2. **文件路径**
   - Windows: 使用 `\\` 或 `/`
   - 绝对路径: `C:\\Users\\...`
   - 相对路径: `./files/report.xlsx`

3. **文件权限**
   - 确保文件可读
   - 检查文件是否存在

---

## 🎉 现在我可以:

- ✅ 发送截图给KK
- ✅ 发送Excel表格给KK
- ✅ 发送PDF文档给KK
- ✅ 发送Word文档给KK
- ✅ 发送PPT给KK
- ✅ 发送任意文件给KK

**能力扩展成功!** ✨

Made with ❤️ by 小K
