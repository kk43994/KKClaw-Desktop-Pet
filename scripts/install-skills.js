// 技能安装脚本 - 带进度汇报
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const ProgressReporter = require('./progress-reporter');

const skills = [
    // 电商核心
    { name: 'product-description-generator', priority: 'high', category: '电商文案' },
    { name: 'review-summarizer', priority: 'high', category: '电商分析' },
    { name: 'price-tracker', priority: 'high', category: '电商监控' },
    
    // 增强功能
    { name: 'memory-setup', priority: 'high', category: '记忆增强' },
    { name: 'desktop-control', priority: 'medium', category: '桌面自动化' },
    { name: 'emotion-state', priority: 'medium', category: '情绪系统' },
    
    // 爬虫工具
    { name: 'firecrawler', priority: 'medium', category: '爬虫工具' },
    { name: 'deep-scraper', priority: 'medium', category: '爬虫工具' },
    
    // 额外工具
    { name: 'svg-draw', priority: 'low', category: '绘图工具' },
    { name: 'imap-idle', priority: 'low', category: '邮件监控' }
];

async function installSkills() {
    const reporter = new ProgressReporter();
    
    reporter.startTask('技能安装', skills.map(s => s.name));
    
    const results = {
        success: [],
        failed: [],
        skipped: []
    };
    
    for (let i = 0; i < skills.length; i++) {
        const skill = skills[i];
        const percent = Math.round(((i + 1) / skills.length) * 100);
        
        reporter.progress(`[${skill.category}] 安装 ${skill.name}...`, percent);
        
        try {
            const cmd = `npx clawhub@latest install ${skill.name}`;
            const { stdout, stderr } = await execAsync(cmd, { 
                timeout: 120000,
                cwd: __dirname
            });
            
            console.log(`✅ ${skill.name} 安装成功`);
            results.success.push(skill.name);
            
        } catch (err) {
            console.error(`❌ ${skill.name} 安装失败:`, err.message);
            results.failed.push({ name: skill.name, error: err.message });
            
            // 高优先级失败就停止
            if (skill.priority === 'high') {
                reporter.error(`高优先级技能 ${skill.name} 安装失败,停止安装`);
                break;
            }
        }
        
        // 延迟一下,避免API限流
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // 汇总报告
    const summary = `
安装完成!
✅ 成功: ${results.success.length}/${skills.length}
❌ 失败: ${results.failed.length}
⏭️ 跳过: ${results.skipped.length}

成功安装: ${results.success.join(', ')}
    `.trim();
    
    reporter.complete(summary);
    
    return results;
}

// 运行
installSkills().catch(err => {
    console.error('安装过程出错:', err);
    process.exit(1);
});
